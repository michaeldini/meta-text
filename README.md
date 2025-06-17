# Meta-Text App

coming soon

## Features

###

#### User Accounts

- Create a User account with hashed password.

#### Upload A Source Document

- Upload a text file and a title for the document.
- Get a list of uploaded documents.
- Read an uploaded document.
- Delete an uploaded document
- search for a document by title.
- Generate a summary of the document using an Ai.

#### Create a Meta-Text

- Create a Meta-Text from an uploaded document.
- Get a list of Meta-Texts.
- Read a Meta-Text.
- Delete a Meta-Text.
- Search for a Meta-Text by title.

#### Manipulate Meta-Texts

- Meta-texts are a source document split into chunks.
- Get a list of chunks for a Meta-Text.
- Read a chunk of a Meta-Text.
- Split the text of a chunk to create a new chunk.
- Combine two chunks into one chunk.
- Create an image from a prompt and add it to a chunk.

#### Manipulate Chunks

- Add a summary to a chunk.
- Add a note to a chunk.
- Ask an Ai to compare your note and summary to the chunk text to see "what you missed".

#### Clickable Words

- Click on a word to crete a new chunk at that word.
- Click on a word to have an Ai define the word and explain it in the context of the chunk.

a **meta-text** is *derived from* a **source document**.

a **chunk** is a *user defined piece* of a **meta-text**.

a **chunk** has **tools** (summary, notes, image, etc).

a **chunk** *contains* **words**. (the meta-text text)

**words** have **tools** (split chunk, fetch definition, etc).

## Structure

```plaintext
src
  ├── assets
├── components
├── features
│   └── chunks
│       ├── components
│       ├── hooks
│       └── styles
  ├── hooks
  ├── pages
  └── styles
```
