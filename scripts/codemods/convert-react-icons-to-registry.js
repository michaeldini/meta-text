/**
 * Codemod: convert-react-icons-to-registry
 *
 * Replaces direct `react-icons/hi2` imports & usages with centralized registry usage.
 * - JSX <HiX /> -> <Icon name="Semantic" />
 * - Identifier usages (e.g., icon: HiX) -> getIconComponent('Semantic')
 * - Adds import { Icon, getIconComponent } from '@components/icons/registry'; (merge if exists)
 * - Removes now-unused `react-icons/hi2` imports
 *
 * Run:
 *   npx jscodeshift -t scripts/codemods/convert-react-icons-to-registry.js src
 *
 * Safe to re-run (idempotent for already transformed identifiers).
 */

const ICON_SOURCE = 'react-icons/hi2';
const REGISTRY_IMPORT = '@components/icons/registry'; // adjust if your path differs

// Mapping from vendor component name -> registry semantic name
const iconMap = {
    HiAcademicCap: 'Academic',
    HiArrowLeft: 'Back',
    HiChevronLeft: 'PagePrev',
    HiChevronRight: 'PageNext',
    HiOutlineSparkles: 'AISparkle',
    HiArrowDownTray: 'Download',
    HiCheck: 'Confirm',
    HiOutlinePencil: 'EditOutline',
    HiXMark: 'Close',
    HiQuestionMarkCircle: 'Help',
    HiBookmark: 'BookmarkFilled',
    HiOutlineBookmark: 'Bookmark',
    HiArrowUturnLeft: 'Undo',
    HiMagnifyingGlass: 'Search',
    HiScissors: 'Split',
    HiPencilSquare: 'EditSquare',
    HiStar: 'FavoriteFilled',
    HiOutlineStar: 'Favorite',
    HiPhoto: 'Image',
    HiDocumentText: 'Document',
    HiArrowRightOnRectangle: 'Login',
    HiArrowLeftOnRectangle: 'Logout',
    HiPlus: 'Add',
    HiOutlineTrash: 'DeleteOutline',
    HiHashtag: 'Positions',
    HiBars3: 'Menu',
};

module.exports = function transformer(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);

    // Find import from react-icons/hi2
    const importDecl = root.find(j.ImportDeclaration, { source: { value: ICON_SOURCE } });
    if (importDecl.size() === 0) {
        return file.source; // nothing to do
    }

    // Track which specifiers are mapped & used
    const toReplace = new Map(); // localName -> semantic

    importDecl.forEach(path => {
        path.value.specifiers.forEach(spec => {
            if (spec.type === 'ImportSpecifier') {
                const imported = spec.imported.name;
                const local = spec.local ? spec.local.name : imported;
                const semantic = iconMap[imported];
                if (semantic) {
                    toReplace.set(local, semantic);
                }
            }
        });
    });

    if (toReplace.size === 0) {
        return file.source; // no relevant icons
    }

    let needsIconImport = false;
    let needsGetIconComponentImport = false;

    // Helper: ensure registry import specifiers present
    function ensureRegistryImport(specName) {
        const existing = root.find(j.ImportDeclaration, { source: { value: REGISTRY_IMPORT } });
        if (existing.size() > 0) {
            existing.forEach(p => {
                const has = p.value.specifiers.some(s => s.type === 'ImportSpecifier' && s.imported.name === specName);
                if (!has) {
                    p.value.specifiers.push(j.importSpecifier(j.identifier(specName)));
                }
            });
        } else {
            root.get().node.program.body.unshift(
                j.importDeclaration([j.importSpecifier(j.identifier(specName))], j.literal(REGISTRY_IMPORT))
            );
        }
    }

    // Replace JSX usages <Local ...> with <Icon name="Semantic" ...>
    root.find(j.JSXIdentifier).forEach(p => {
        const name = p.value.name;
        if (!toReplace.has(name)) return;
        // Only transform component names (opening/closing tag identifiers)
        if (p.parent.value.type === 'JSXOpeningElement' || p.parent.value.type === 'JSXClosingElement') {
            const parentEl = p.parent.value;
            if (parentEl.type === 'JSXOpeningElement') {
                // Convert <Name prop /> to <Icon name="Semantic" prop />
                parentEl.name = j.jsxIdentifier('Icon');
                // Add / replace name prop
                const semantic = toReplace.get(name);
                const existingNameAttr = parentEl.attributes.find(a => a.type === 'JSXAttribute' && a.name.name === 'name');
                if (existingNameAttr) {
                    existingNameAttr.value = j.stringLiteral(semantic);
                } else {
                    parentEl.attributes.unshift(
                        j.jsxAttribute(j.jsxIdentifier('name'), j.stringLiteral(semantic))
                    );
                }
                needsIconImport = true;
            } else if (p.parent.value.type === 'JSXClosingElement') {
                p.parent.value.name = j.jsxIdentifier('Icon');
            }
        }
    });

    // Non-JSX identifier usages: replace identifier with getIconComponent('Semantic')
    root.find(j.Identifier).forEach(p => {
        const name = p.value.name;
        if (!toReplace.has(name)) return;
        // Skip if already handled as JSX (parent types handled above) or part of import specifier
        const parentType = p.parent.value.type;
        if (parentType === 'ImportSpecifier' || parentType === 'JSXOpeningElement' || parentType === 'JSXClosingElement') return;
        // Avoid replacing key in object property shorthand differently—expand if necessary
        if (parentType === 'Property' && p.parent.value.key === p.value && !p.parent.value.shorthand) return; // key reference, not value
        if (parentType === 'Property' && p.parent.value.key === p.value && p.parent.value.shorthand) {
            // Expand shorthand { IconComp } to { IconComp: getIconComponent('Name') }
            const semantic = toReplace.get(name);
            p.parent.value.shorthand = false;
            p.parent.value.value = j.callExpression(j.identifier('getIconComponent'), [j.stringLiteral(semantic)]);
            needsGetIconComponentImport = true;
            return;
        }
        // General replacement
        const semantic = toReplace.get(name);
        const callExpr = j.callExpression(j.identifier('getIconComponent'), [j.stringLiteral(semantic)]);
        j(p).replaceWith(callExpr);
        needsGetIconComponentImport = true;
    });

    // Update / remove original import
    importDecl.forEach(path => {
        path.value.specifiers = path.value.specifiers.filter(spec => {
            if (spec.type !== 'ImportSpecifier') return true; // preserve non-typical specifiers
            const local = spec.local ? spec.local.name : spec.imported.name;
            return !toReplace.has(local); // drop converted icons
        });
        if (path.value.specifiers.length === 0) {
            j(path).remove();
        }
    });

    if (needsIconImport) ensureRegistryImport('Icon');
    if (needsGetIconComponentImport) ensureRegistryImport('getIconComponent');

    return root.toSource({ quote: 'single', reuseWhitespace: false });
};
