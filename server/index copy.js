// server/index.js
import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, 'icons');

app.use(cors());

// API за категориите
app.get('/api/categories', async (req, res) => {
  try {
    const files = await fs.readdir(ICONS_DIR, { withFileTypes: true });
    const categories = files
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Cannot read icons directory' });
  }
});

// API за иконите в категория
app.get('/api/icons/:category', async (req, res) => {
  const categoryPath = path.join(ICONS_DIR, req.params.category);
  try {
    const entries = await fs.readdir(categoryPath, { withFileTypes: true });
    const icons = [];

    for (const entry of entries) {
      const entryPath = path.join(categoryPath, entry.name);

      if (entry.isFile() && entry.name.endsWith('.svg')) {
        // SVG директно в категорията
        const content = await fs.readFile(entryPath, 'utf8');
        icons.push({ name: entry.name, svg: content });
      } else if (entry.isDirectory()) {
        // SVG в поддиректория
        const files = await fs.readdir(entryPath);
        for (const file of files) {
          if (file.endsWith('.svg')) {
            const filePath = path.join(entryPath, file);
            const content = await fs.readFile(filePath, 'utf8');
            icons.push({ name: file, svg: content });
          }
        }
      }
    }

    res.json(icons);
  } catch (error) {
    res.status(500).json({ error: 'Cannot read category directory' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
