const express = require('express');
const path = require('path');
const fs = require('fs');
const { WebSocketServer } = require('ws');
const { marked } = require('marked');
const hljs = require('highlight.js');
const CalWatcher = require('./lib/watcher');
const CalSearch = require('./lib/search');

const app = express();
const PORT = process.env.PORT || 3000;

// Find cal/ folder - go up from viewer/ to cal/
const calPath = path.resolve(__dirname, '..');
const viewerPath = __dirname;

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (e) {}
    }
    return hljs.highlightAuto(code).value;
  },
  gfm: true,
  breaks: true
});

// Serve static files
app.use(express.static(path.join(viewerPath, 'public')));

// API: Get folder tree
app.get('/api/tree', async (req, res) => {
  try {
    const tree = await buildTree(calPath);
    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get file content (rendered markdown)
app.get('/api/file/*', async (req, res) => {
  try {
    const relativePath = req.params[0];
    const filePath = path.join(calPath, relativePath);

    // Security: ensure path is within calPath
    if (!filePath.startsWith(calPath)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const content = await fs.promises.readFile(filePath, 'utf-8');
    const html = marked(content);

    res.json({
      path: relativePath,
      raw: content,
      html: html
    });
  } catch (err) {
    res.status(404).json({ error: 'File not found' });
  }
});

// API: Search
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const search = new CalSearch(calPath);
    const results = await search.search(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Build folder tree recursively
async function buildTree(dirPath, relativeTo = calPath) {
  const name = path.basename(dirPath);
  const relativePath = path.relative(relativeTo, dirPath);

  const stats = await fs.promises.stat(dirPath);

  if (!stats.isDirectory()) {
    return {
      name,
      path: relativePath,
      type: 'file'
    };
  }

  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  const children = [];

  for (const entry of entries) {
    // Skip hidden files, viewer folder, node_modules
    if (entry.name.startsWith('.') || entry.name === 'viewer' || entry.name === 'node_modules') {
      continue;
    }

    // Only include markdown files and directories
    if (entry.isDirectory() || entry.name.endsWith('.md')) {
      const childPath = path.join(dirPath, entry.name);
      const child = await buildTree(childPath, relativeTo);
      children.push(child);
    }
  }

  // Sort: directories first, then files, alphabetically
  children.sort((a, b) => {
    if (a.type === 'directory' && b.type !== 'directory') return -1;
    if (a.type !== 'directory' && b.type === 'directory') return 1;
    return a.name.localeCompare(b.name);
  });

  return {
    name,
    path: relativePath || '.',
    type: 'directory',
    children
  };
}

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`\n🔍 Cal Viewer running at http://localhost:${PORT}\n`);
});

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// File watcher - broadcast changes to all clients
const watcher = new CalWatcher(calPath, (change) => {
  console.log(`File ${change.type}: ${change.path}`);

  const message = JSON.stringify({
    type: 'fileChange',
    data: change
  });

  clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
});

watcher.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  watcher.stop();
  server.close();
  process.exit(0);
});
