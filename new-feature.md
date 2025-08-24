# new feature

## Proposal

Let the user generate a paragraph sized response from an Aichatbot and then let them easily explore the text more deeply.

Basic Flow:
1. User prompts Ai to generate a brief explanation of a topic they want to learn.
2. Users can click on any word or phrase in text to generate an explanation of the word or phrase.
3. word and phrase explanations are displayed on the right side of the screen in a panel so the user can reference them again. 

## Spec
1. input prompt
2. clickable displayed generated response
3. explanation panel displaying definitions

Backend:
1. API endpoint to receive user prompt and return generated response
2. Text analysis tool to identify words and phrases for explanation
3. Database or knowledge base to store and retrieve definitions
4. API endpoint to receive word or phrase and return explanation

## Flow

1. User inputs a prompt "Comprehensively explain what an atom is in 1000 words or less"
2. prompt is sent to backend
3. backend processes prompt and generates response
4. response is sent back to frontend
5. frontend displays response to user
6. user clicks on a word/phrase for explanation
7. frontend sends request to backend for explanation
8. backend retrieves explanation and sends it to frontend
9. frontend displays explanation in panel
