// Storybook stories for WordsExplanationTool
// Note: This file requires @storybook/react to be installed
// Install with: npm install -D @storybook/react @storybook/addon-docs

/*
import type { Meta, StoryObj } from '@storybook/react';
import WordsExplanationTool from './WordsExplanationTool';
import { ChunkType, ExplanationResponse } from 'types';

// Mock chunk data for stories
const mockChunk: ChunkType = {
  id: 1,
  text: "Artificial intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving.",
  position: 1,
  notes: "",
  summary: "",
  comparison: "",
  explanation: "",
  meta_text_id: 1,
  ai_images: []
};

const meta: Meta<typeof WordsExplanationTool> = {
  title: 'Components/Tools/WordsExplanationTool',
  component: WordsExplanationTool,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# WordsExplanationTool

An interactive tool that provides AI-powered explanations for words or phrases within a document context. 

## Features
- Context-aware word/phrase explanations using AI
- Responsive side drawer UI with Material-UI components  
- Performance optimized with React.memo and memoized callbacks
- Full accessibility support with ARIA attributes
- Input validation and error handling
- Mobile-responsive design

## Usage
Click the question mark icon next to any word to get an AI-powered explanation that takes into account the surrounding context.
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    word: {
      description: 'The word or phrase to explain',
      control: 'text'
    },
    chunk: {
      description: 'The chunk containing context for the explanation',
      control: 'object'
    },
    onComplete: {
      description: 'Callback fired when explanation interaction completes',
      action: 'explanation completed'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    word: 'artificial intelligence',
    chunk: mockChunk,
    onComplete: (success: boolean, result?: ExplanationResponse) => {
      console.log('Explanation completed:', { success, result });
    }
  }
};

export const SingleWord: Story = {
  args: {
    word: 'machine',
    chunk: mockChunk,
    onComplete: (success: boolean, result?: ExplanationResponse) => {
      console.log('Explanation completed:', { success, result });
    }
  }
};

export const WithPunctuation: Story = {
  args: {
    word: 'intelligence,',
    chunk: mockChunk,
    onComplete: (success: boolean, result?: ExplanationResponse) => {
      console.log('Explanation completed:', { success, result });
    }
  }
};

export const ComplexPhrase: Story = {
  args: {
    word: 'machine learning algorithms',
    chunk: mockChunk,
    onComplete: (success: boolean, result?: ExplanationResponse) => {
      console.log('Explanation completed:', { success, result });
    }
  }
};
*/

// Placeholder export to prevent module errors
export default {};
