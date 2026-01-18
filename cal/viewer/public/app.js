// Cal Viewer - Client-side JavaScript

class CalViewer {
  constructor() {
    this.tree = null;
    this.currentFile = null;
    this.currentFolder = null;
    this.searchQuery = '';
    this.ws = null;
    this.searchTimeout = null;

    this.init();
  }

  async init() {
    // Load initial tree
    await this.loadTree();

    // Set up WebSocket for real-time updates
    this.connectWebSocket();

    // Set up event listeners
    this.setupEventListeners();
  }

  async loadTree() {
    try {
      const response = await fetch('/api/tree');
      this.tree = await response.json();
      this.renderTree();
    } catch (err) {
      console.error('Failed to load tree:', err);
      document.getElementById('tree').innerHTML =
        '<div class="loading">Failed to load. Is the cal/ folder accessible?</div>';
    }
  }

  renderTree(searchMatches = null) {
    const container = document.getElementById('tree');

    if (!this.tree || !this.tree.children || this.tree.children.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No Cal files yet.</p>
          <p>Run <code>/cal:onboard</code> to get started.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    this.renderTreeNode(this.tree, container, searchMatches, true);
  }

  renderTreeNode(node, container, searchMatches, isRoot = false) {
    if (isRoot && node.type === 'directory') {
      // Render children directly for root
      node.children?.forEach(child => {
        this.renderTreeNode(child, container, searchMatches);
      });
      return;
    }

    const item = document.createElement('div');
    item.className = `tree-item ${node.type === 'directory' ? 'folder' : 'file'}`;

    // Check if this node matches search
    if (searchMatches && searchMatches.has(node.path)) {
      item.classList.add('match');
    }

    item.innerHTML = `
      <span class="icon"></span>
      <span class="name">${node.name}</span>
    `;

    item.dataset.path = node.path;
    item.dataset.type = node.type;

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleTreeClick(node, item);
    });

    container.appendChild(item);

    // Render children for directories
    if (node.type === 'directory' && node.children?.length > 0) {
      const childContainer = document.createElement('div');
      childContainer.className = 'tree-children collapsed';

      node.children.forEach(child => {
        // If searching, only show matching branches
        if (searchMatches) {
          if (this.nodeMatchesSearch(child, searchMatches)) {
            this.renderTreeNode(child, childContainer, searchMatches);
          }
        } else {
          this.renderTreeNode(child, childContainer, searchMatches);
        }
      });

      container.appendChild(childContainer);
    }
  }

  nodeMatchesSearch(node, searchMatches) {
    if (searchMatches.has(node.path)) return true;
    if (node.type === 'directory' && node.children) {
      return node.children.some(child => this.nodeMatchesSearch(child, searchMatches));
    }
    return false;
  }

  handleTreeClick(node, element) {
    if (node.type === 'directory') {
      // Toggle folder expansion
      element.classList.toggle('expanded');
      const children = element.nextElementSibling;
      if (children && children.classList.contains('tree-children')) {
        children.classList.toggle('collapsed');
      }

      // Check if this is a meeting folder (has participant-*.md files)
      if (node.children && node.children.some(c => c.name.startsWith('participant-'))) {
        this.currentFolder = node;
        this.showMeetingTabs(node);
      }
    } else {
      // Select file
      this.selectFile(node.path, element);
    }
  }

  async selectFile(filePath, element = null) {
    // Update selection in tree
    document.querySelectorAll('.tree-item.selected').forEach(el => {
      el.classList.remove('selected');
    });
    if (element) {
      element.classList.add('selected');
    }

    // Load file content
    try {
      const response = await fetch(`/api/file/${filePath}`);
      const data = await response.json();

      this.currentFile = filePath;
      this.renderContent(data);
    } catch (err) {
      console.error('Failed to load file:', err);
      this.showToast('Failed to load file');
    }
  }

  renderContent(data) {
    // Update breadcrumb
    document.getElementById('breadcrumb').textContent = data.path;

    // Render HTML content
    let html = data.html;

    // Apply search highlighting if there's a search query
    if (this.searchQuery) {
      html = this.highlightSearchTerms(html, this.searchQuery);
    }

    document.getElementById('content').innerHTML = html;
  }

  highlightSearchTerms(html, query) {
    if (!query) return html;

    // Simple case-insensitive highlight (avoid highlighting inside tags)
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');

    // Only highlight text content, not HTML tags
    return html.replace(/>([^<]+)</g, (match, text) => {
      return '>' + text.replace(regex, '<span class="highlight">$1</span>') + '<';
    });
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  showMeetingTabs(folder) {
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = '';
    tabsContainer.classList.remove('hidden');

    // Get all relevant files in the meeting folder
    const files = folder.children.filter(c => c.name.endsWith('.md'));

    // Sort: notes first, then participants, then guests, then minutes
    const sortOrder = (name) => {
      if (name === 'notes.md') return 0;
      if (name.startsWith('participant-')) return 1;
      if (name.startsWith('guest-')) return 2;
      if (name === 'minutes.md') return 3;
      return 4;
    };

    files.sort((a, b) => sortOrder(a.name) - sortOrder(b.name));

    files.forEach(file => {
      const tab = document.createElement('button');
      tab.className = 'tab';

      // Extract display name
      let displayName = file.name.replace('.md', '');
      if (displayName.startsWith('participant-')) {
        displayName = displayName.replace('participant-', '');
      } else if (displayName.startsWith('guest-')) {
        displayName = '🎤 ' + displayName.replace('guest-', '');
      }

      tab.textContent = displayName;
      tab.dataset.path = file.path;

      tab.addEventListener('click', () => {
        // Update active tab
        tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Load file
        this.selectFile(file.path);
      });

      tabsContainer.appendChild(tab);
    });

    // Auto-select first tab
    if (files.length > 0) {
      tabsContainer.querySelector('.tab').click();
    }
  }

  hideTabs() {
    document.getElementById('tabs').classList.add('hidden');
  }

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search');
    const clearButton = document.getElementById('clear-search');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      this.searchQuery = query;

      // Debounce search
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.performSearch(query);
      }, 300);

      // Show/hide clear button
      clearButton.classList.toggle('hidden', !query);
    });

    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      this.searchQuery = '';
      clearButton.classList.add('hidden');
      this.renderTree();

      // Re-render current content without highlights
      if (this.currentFile) {
        this.selectFile(this.currentFile);
      }
    });
  }

  async performSearch(query) {
    if (!query) {
      this.renderTree();
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await response.json();

      // Build set of matching paths
      const matchingPaths = new Set(results.map(r => r.path));

      // Re-render tree with matches highlighted
      this.renderTree(matchingPaths);

      // Expand all matching folders
      this.expandMatchingFolders(matchingPaths);

    } catch (err) {
      console.error('Search failed:', err);
    }
  }

  expandMatchingFolders(matchingPaths) {
    matchingPaths.forEach(path => {
      // Get parent folder paths
      const parts = path.split('/');
      let currentPath = '';

      parts.slice(0, -1).forEach(part => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const folderItem = document.querySelector(`.tree-item[data-path="${currentPath}"]`);
        if (folderItem && !folderItem.classList.contains('expanded')) {
          folderItem.classList.add('expanded');
          const children = folderItem.nextElementSibling;
          if (children) {
            children.classList.remove('collapsed');
          }
        }
      });
    });
  }

  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'fileChange') {
        this.handleFileChange(message.data);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      setTimeout(() => this.connectWebSocket(), 2000);
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  handleFileChange(change) {
    console.log('File changed:', change);

    // Reload tree to reflect changes
    this.loadTree();

    // If the changed file is currently displayed, reload it
    if (this.currentFile === change.path) {
      this.selectFile(this.currentFile);
    }

    // Show toast notification
    const action = change.type === 'add' ? 'created' :
                   change.type === 'unlink' ? 'deleted' : 'updated';
    this.showToast(`${change.path} ${action}`);
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  window.calViewer = new CalViewer();
});
