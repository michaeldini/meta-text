/**
 * ESLint rule: no-direct-heroicons
 * (Renamed usage) Disallow importing from specified icon vendor sources (default: react-icons/hi2) outside the central registry file.
 * Encourages semantic, centralized icon usage via a registry.
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow direct vendor icon imports (e.g. react-icons/hi2) outside the icon registry',
            recommended: false,
        },
        messages: {
            noDirect: 'Import icons via the central registry instead of "{{source}}".',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    registryPath: { type: 'string' },
                    allowInTests: { type: 'boolean' },
                    sources: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Module specifiers to forbid direct import from',
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options?.[0] || {};
        const registryPath = options.registryPath || 'src/components/icons/registry.ts';
        const allowInTests = options.allowInTests !== false; // default true
        const sources = (options.sources && options.sources.length ? options.sources : ['react-icons/hi2']);
        const filename = context.getFilename();

        const isRegistry = filename.endsWith(registryPath);
        const isTestFile = /[.-](test|spec)\.[jt]sx?$|__tests__/.test(filename);

        function checkSource(node, value) {
            if (!value || typeof value !== 'string') return;
            // Disallow if specifier exactly matches one of the configured sources
            if (!sources.includes(value)) return;
            if (isRegistry) return; // Allowed in registry
            if (allowInTests && isTestFile) return; // Allowed in tests optionally
            context.report({ node, messageId: 'noDirect', data: { source: value } });
        }

        return {
            ImportDeclaration(node) {
                checkSource(node.source, node.source.value);
            },
            CallExpression(node) {
                // dynamic import('...')
                if (node.callee.type === 'Import' && node.arguments.length === 1) {
                    const arg = node.arguments[0];
                    if (arg.type === 'Literal' && typeof arg.value === 'string') {
                        checkSource(arg, arg.value);
                    }
                }
            },
        };
    },
};
