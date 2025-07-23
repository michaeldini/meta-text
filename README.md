# Meta-Text App

## Authentication / Users

The app uses a simple hashed password authentication system. The user can register, login, and logout. The user is given a JWT token upon successful login, which is used for subsequent requests to protected routes.

## Source Documents

A source document is a source of "truth" for the app. It could be a book, poem, tutorial, textbook etc. It is used to generate metatexts (explained later). A source documents is a .txt file, which are easily acquired from the Gutenberg Project.

The app allows users to upload and edit source documents. Source documents are owned by the user who uploaded them. Users can view, edit, and delete their own documents. (FUTURE: Users can also share source documents with other users, but this is not implemented yet.)

## Metatexts

A metatext is a container for chunks (explained later) of text from a source document. It is a way to organize the text into meaningful sections and provide extra content related to the text.

The app allows users to create metatexts from source documents. Users can add, edit, and delete metatexts. Metatexts are owned by the user who created them. Users can view, edit, and delete their own metatexts.

## Chunks

A chunk is a piece of text from a source document. The purpose of a chunk is for the user to chunk/chop/cut the text into smaller, meaningful sections.

When a metatext is created, it is automatically chunked. Chunks are stored in a separate database table from metatexts or source documents.

Once a metatext is created, they can split or merge chunks. Chunk splits/merges are immediately saved without the user needing to save the metatext.

A user cannot delete a chunk because it would destroy the integrity of the source document. One of the purposes of the app is to **extract** meaning from the text, not to **modify** the text.

### Clickable / Selectable Words

Every word in a chunk is clickable. When a user clicks on a word, a toolbar appears with options that will act on the word.

The words in a chunk are also selectable. When a user selects multiple words, the toolbar will appear with options that will act on the selected words.

#### Words Toolbar Options

If a word is clicked:

- Split at word
- Define word

If multiple words are selected:

- Explain selected words

## Explanations

1. Explain a word
2. Explain a phrase
3. Explain a chunk

## Definitions and Explanations

When a user uses either the "Define word" or "Explain selected words" or "Explain a chunk", the /explain endpoint will be called. Depending on the request params, the appropriate response will be generated. The endpoint will query the OpenAI API to get a definition or explanation of the word(s). The response will include the definition or explanation, an explanation of the word(s) in context, and the text used to generate the definition or explanation (Because chunks may change their text after the definition, it is included in the response to preserve the chunk text).

A chunk explanation is saved in the Chunk table.

Words Explanations are saved in

Definitions and Explanations are stored in the database and can be viewed later. They are associated with metatexts and not chunks because chunks can change over time.

The user can also use the chunk toolbar to have the entire chunk explained. The chunk explanation is associated with the chunk and can go stale (fix?).

## Chunk Toolbar & Chunk Tools

The chunk toolbar is a floating toolbar that appears whenever a chunk is displayed. It shows/hides chunk tools.

The chunk tools act on chunks and are as follows:

### Summary & Note

The user can summarize or take a note on a chunk.

### Evaluation

    find src -type f \( -name "*.ts" -o -name "*.tsx" \) | xargs wc -l
4811 backend
11752 frontend
