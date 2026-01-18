# ThoughtsManager

A web-based, spatial-first thought mapping application designed to facilitate visual cognition and knowledge discovery through an interactive graph interface.

## 🎯 Vision

ThoughtsManager is designed for personal knowledge workers who prefer spatial organization over linear note-taking. It allows you to build an interactive, explorable network of knowledge, leveraging visual associations to improve memory retention and identify non-obvious connections between ideas.

## ✨ Key Features

### 🗺️ Infinite Spatial Canvas
- Interactive graph visualization powered by React Flow
- Fluid interaction for dragging nodes, zooming, and panning
- Hybrid auto-layout using D3-force for automatic organization
- Zone-based clustering for spatial grouping

### 💡 Rich Atomic Content
- **Markdown rendering** for formatted text
- **Code syntax highlighting** with Prism
- **Direct image pasting** (auto-converted to Base64)
- Double-click to edit, view mode for reading

### 🤖 Local AI Partnering
Integrates with **Ollama** for privacy-first AI insights:
- **Explain Connection**: Analyzes two thoughts to find non-obvious links
- **Summarize Clusters**: Synthesizes themes for selected groups of thoughts
- **Expand Thought**: Suggests next steps or related questions
- **Ask your Graph**: RAG-powered chat to query your knowledge base

### 🔍 Semantic Discovery
- Vector-based search using Orama
- Real-time "Related Thoughts" suggestions
- Fuzzy search across all notes
- Contextual insights panel

### 📦 Data Portability
- **Local-first design** using IndexedDB
- Full **JSON export/import** for complete data ownership
- **ZIP export** of nodes as Markdown files (Obsidian-compatible)
- No vendor lock-in

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- [Ollama](https://ollama.ai) (optional, for AI features)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd thoughts-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start using ThoughtsManager.

### AI Features Setup

To enable AI-powered features, ensure Ollama is running:

```bash
# Install Ollama (if not already installed)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (e.g., llama2 or mistral)
ollama pull llama2
```

The app will automatically connect to your local Ollama instance.

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run test       # Run tests in watch mode
npm run test:run   # Run tests once
npm test:coverage  # Run tests with coverage report
```

### Project Structure

```
thoughts-manager/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── Canvas.tsx           # Infinite spatial canvas
│   │   ├── ThoughtNode.tsx     # Custom node component
│   │   ├── Sidebar.tsx         # Navigation & actions
│   │   ├── AIChat.tsx           # "Ask your Graph" interface
│   │   ├── AIPartnerPanel.tsx   # Contextual AI actions
│   │   ├── SearchBar.tsx        # Global semantic search
│   │   └── InsightsPanel.tsx    # Related thoughts suggestions
│   ├── lib/             # Core utilities
│   │   ├── store.ts            # Zustand state management
│   │   ├── db.ts               # IndexedDB database
│   │   ├── aiServices.ts       # Ollama AI integration
│   │   ├── vectorStore.ts      # Orama vector search
│   │   ├── ollama.ts           # Ollama client
│   │   ├── dataPortability.ts  # Export/import logic
│   │   └── layout.ts           # Graph layout algorithms
│   └── test/            # Test files
├── conductor/          # Product & technical documentation
├── public/             # Static assets
└── vitest.config.ts    # Vitest configuration
```

## 🧪 Testing

The project uses **Vitest** for unit testing and **React Testing Library** for component testing.

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Categories

- **Component tests**: UI interactions and rendering
- **Logic tests**: State management, database operations
- **AI tests**: Ollama integration and semantic search
- **Data portability tests**: Export/import functionality

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling

### Graph & Visualization
- **React Flow (@xyflow/react)** - Interactive graph canvas
- **D3-force** - Force-directed layout algorithm

### State & Storage
- **Zustand** - Global state management
- **Dexie.js** - IndexedDB wrapper for local storage

### AI & Search
- **Ollama** - Local LLM integration
- **Orama** - Vector search engine
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code highlighting

### Utilities
- **JSZip** - ZIP file creation for Markdown export

### Testing
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing

## 📝 Usage

### Creating Thoughts
1. Click the **"Add Thought"** button in the sidebar
2. Enter your thought in Markdown format
3. Paste images directly into nodes (Ctrl/Cmd + V)
4. Click outside or press Enter to save

### Organizing Thoughts
- **Drag nodes** to reposition them on the canvas
- **Select multiple nodes** with Cmd/Ctrl + Click
- **Use auto-layout** to automatically organize your graph
- **Zoom** with scroll wheel, **pan** by dragging the canvas

### AI Features
- **Select 2 nodes** → Click "Explain Connection" in AI Partner panel
- **Select 3+ nodes** → Click "Summarize" to synthesize themes
- **Click a node** → Click "Expand" for suggestions
- **Type in search bar** → Get semantic search results
- **Open AI Chat** → Ask questions about your graph

### Data Export/Import
- **Export JSON**: Full data backup (File → Export JSON)
- **Export ZIP**: Markdown files for external editors (File → Export Markdown ZIP)
- **Import JSON**: Restore from backup (File → Import JSON)

## 🔐 Privacy

ThoughtsManager is designed with privacy in mind:
- **All data stored locally** in your browser's IndexedDB
- **AI processing runs locally** via Ollama (no data sent to external servers)
- **Full data ownership** through export functionality
- No cloud services or external dependencies required

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code patterns and conventions
- Write tests for new features
- Ensure TypeScript types are properly defined
- Run tests before committing (`npm run test:run`)
- Run linter before committing (`npm run lint`)

## 📄 License

ISC

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev) for the graph visualization library
- [Ollama](https://ollama.ai) for local LLM capabilities
- [Orama](https://orama.search) for the vector search engine
- [Dexie.js](https://dexie.org) for IndexedDB abstraction
