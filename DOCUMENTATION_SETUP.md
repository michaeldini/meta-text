# Documentation Tools Setup Guide

This guide explains how to set up and use documentation tools for the Meta-Text project.

## 🚀 Quick Start Options

### Option 1: TypeDoc (API Documentation)

Generate beautiful API documentation from your JSDoc comments:

```bash
# Install TypeDoc
npm install -D typedoc typedoc-plugin-markdown

# Generate HTML docs
npx typedoc

# Generate Markdown docs
npx typedoc --plugin typedoc-plugin-markdown --out docs/api-md

# Add to package.json scripts
"docs:generate": "typedoc",
"docs:serve": "npx http-server docs/api -p 3002"
```

**Output:** `docs/api/index.html` - Browse your component documentation

### Option 2: Storybook (Component Documentation)

Interactive component documentation and playground:

```bash
# Install Storybook
npx storybook@latest init

# Start Storybook
npm run storybook

# Build static Storybook
npm run build-storybook
```

**Output:** Interactive component playground at `http://localhost:6006`

### Option 3: Docusaurus (Full Documentation Site)

Complete documentation website with guides, API docs, and more:

```bash
# Create docs site in docs/ folder
npx create-docusaurus@latest docs classic

# Start development server
cd docs && npm start

# Build for production
npm run build
```

## 📋 Recommended Setup for Meta-Text

### 1. Add Documentation Scripts to package.json

```json
{
  "scripts": {
    "docs:api": "typedoc",
    "docs:serve": "npx http-server docs/api -p 3002",
    "docs:watch": "typedoc --watch",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### 2. TypeDoc Configuration

A `typedoc.json` file has been created with optimal settings for your project.

### 3. Component Stories

Storybook stories help document component usage. Example created at:
`src/features/chunk-explanation/WordsExplanationTool.stories.tsx`

## 🔧 Usage Examples

### Generate API Documentation

```bash
npm run docs:api
npm run docs:serve
# Visit http://localhost:3002
```

### View Component Documentation

```bash
npm install -D @storybook/react @storybook/addon-docs
npm run storybook
# Visit http://localhost:6006
```

### Integration with CI/CD

Add to your build pipeline:

```yaml
# .github/workflows/docs.yml
- name: Generate Documentation
  run: |
    npm run docs:api
    npm run build-storybook
    
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./docs
```

## 📖 Documentation Best Practices

### 1. JSDoc Comments

- Use `@param` and `@returns` for functions
- Add `@example` sections for usage examples
- Include `@since` and `@deprecated` for versioning

### 2. Component Documentation

- Document all props with descriptions
- Include usage examples in JSDoc
- Add accessibility notes where relevant

### 3. Storybook Stories

- Create stories for different component states
- Include interactive controls for props
- Add documentation in the `parameters.docs` section

## 🌐 Publishing Options

### GitHub Pages

```bash
# Build docs
npm run docs:api
npm run build-storybook

# Deploy to gh-pages branch
npx gh-pages -d docs/api
```

### Netlify/Vercel

- Connect your repo to Netlify/Vercel
- Set build command: `npm run docs:api && npm run build-storybook`
- Set publish directory: `docs/`

### Internal Documentation Server

```bash
# Serve docs locally
npm run docs:serve

# Or use any static file server
npx serve docs/api
```

## 🎯 Benefits

- **Automatic**: Docs generate from your existing JSDoc comments
- **Interactive**: Storybook provides component playground
- **Searchable**: Full-text search in generated documentation
- **Versioned**: Track documentation changes with your code
- **Accessible**: Share documentation with team members easily

Choose the option that best fits your workflow and team needs!
