const fs = require('fs');
const path = require('path');

class CalSearch {
  constructor(calPath) {
    this.calPath = calPath;
  }

  async search(query) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const results = [];
    const searchTerm = query.toLowerCase();
    await this.searchDirectory(this.calPath, searchTerm, results);
    return results;
  }

  async searchDirectory(dirPath, searchTerm, results) {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(this.calPath, fullPath);

      // Skip viewer folder and hidden files
      if (entry.name.startsWith('.') || entry.name === 'viewer' || entry.name === 'node_modules') {
        continue;
      }

      if (entry.isDirectory()) {
        await this.searchDirectory(fullPath, searchTerm, results);
      } else if (entry.name.endsWith('.md')) {
        try {
          const content = await fs.promises.readFile(fullPath, 'utf-8');
          if (content.toLowerCase().includes(searchTerm)) {
            // Find matching lines for snippets
            const lines = content.split('\n');
            const matchingLines = [];

            lines.forEach((line, index) => {
              if (line.toLowerCase().includes(searchTerm)) {
                matchingLines.push({
                  lineNumber: index + 1,
                  text: line.trim().substring(0, 150)
                });
              }
            });

            results.push({
              path: relativePath,
              matches: matchingLines.slice(0, 3) // Limit to 3 snippets per file
            });
          }
        } catch (err) {
          // Skip files we can't read
        }
      }
    }
  }
}

module.exports = CalSearch;
