const chokidar = require('chokidar');
const path = require('path');

class CalWatcher {
  constructor(calPath, onChange) {
    this.calPath = calPath;
    this.onChange = onChange;
    this.watcher = null;
  }

  start() {
    this.watcher = chokidar.watch(this.calPath, {
      ignored: [
        /(^|[\/\\])\../,  // Ignore dotfiles
        /node_modules/,
        /viewer\//        // Don't watch ourselves
      ],
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('add', filePath => this.handleChange('add', filePath))
      .on('change', filePath => this.handleChange('change', filePath))
      .on('unlink', filePath => this.handleChange('unlink', filePath));

    console.log(`Watching ${this.calPath} for changes...`);
  }

  handleChange(type, filePath) {
    // Only care about markdown files
    if (!filePath.endsWith('.md')) return;

    const relativePath = path.relative(this.calPath, filePath);
    this.onChange({
      type,
      path: relativePath,
      fullPath: filePath,
      timestamp: Date.now()
    });
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

module.exports = CalWatcher;
