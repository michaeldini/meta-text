# Features in order of interest

• ~~Bookmarking~~

• Full-text search & filtering  
  Instantly locate words, phrases, or tags across chunks or documents.

• Document outline / table of contents  
  Auto-generate a sidebar index of chunk headings or key terms for quick jumping.

• In-line annotations & comments  
  Let users attach notes or comments to individual words or chunks, then view/export them.

• Export & sharing  
  Offer PDF/Markdown/JSON export of annotations or the entire Metatext, plus shareable links.

• Keyboard navigation & shortcuts  
  Arrow-key or keystroke support to move between chunks/words, trigger merge/split, open toolbars, etc.

• Version history & undo/redo  
  Keep a change timeline so users can revert edits or compare different drafts.

• Custom themes & dark mode  
  Respect system-level theme or let users pick high-contrast, low-light, large-text modes.

• Autosave & draft recovery  
  Persist in-progress work so nothing is lost if they navigate away or the browser crashes.

• Collaborative editing  
  Real-time cursors, comments, and presence indicators so multiple users can work together.

- ai generated background (or music) that enhances the reading experience. (i.e. greek harp and parthenon columns for ancient texts, or a subtle modern synth for tech docs)
Pick the ones that best fit your workflow and audience—each can add depth and make the tool more polished.



## Search feature outline

Here’s one way you might surface full-text search in the app and show results inline and in a sidebar:

1. Search Bar & Filters (top bar)  
   • A persistent MUI `<TextField>` with a search icon placeholder (“Search…”).  
   • Tag-filter chips below it (e.g. “#chapter”, “#comment”, “#TODO”) that you can toggle on/off.  
   • A clear (×) button to reset both text query and tag filters in one click.

2. Live Results Sidebar (left pane)  
   • As you type, a scrollable panel opens (or pushes the document view right).  
   • Grouped by document or chunk header, each group shows:  
     – A header like “Section 2: Introduction (3 matches)”  
     – A list of up to 5 context snippets, e.g.:  
       “…the quick brown **fox** jumped…”  
       “…over the lazy **dog**…”  
   • Hover or click on a snippet to preview it in-place, click to navigate there.

3. Inline Highlights in Main Content  
   • All matching words/phrases in the document body are wrapped in a yellow highlight.  
   • Smooth scroll animation brings the first match into view upon search.  
   • Next/Prev arrows in the top bar cycle through matches, jumping the scroll and focusing each highlight.

4. Empty & No-Results States  
   • Empty query: sidebar hides, highlights cleared.  
   • No matches: sidebar shows “No results for “foobar”” and suggests “Try another keyword or toggle off filters.”

Mockup in Markdown:

```
+------------------------------------------------------------------------------+
| 🔍 Search… [fox]     [#chapter] [#comment] [#TODO]    ✕                         |
+--------------------------------+---------------------------------------------+
| Section 1: Prologue (2 matches)|  | …                Document Viewer         |
|  • “…brown **fox**…”           |  |   # Chapter 1                              |
|  • “…red **fox**…”             |  |   Lorem ipsum dolor sit amet…             |
| ↑ Prev 1/2 • Next ↓            |  |   …the quick brown [highlighted] fox…     |
|                                |  |   …                                    …  |
+--------------------------------+---------------------------------------------+
```

Interaction flow:

1. User clicks search bar (or presses ⌘ K), begins typing.  
2. Sidebar animates in with live matches.  
3. First match in document view is scrolled into view and highlighted.  
4. User clicks a snippet or uses Next/Prev arrows to move through hits.  
5. Toggling tag chips refines which chunks/documents appear.  

This gives instant visual feedback, context snippets for quick scanning, and smooth navigation to each occurrence.