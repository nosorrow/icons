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

// Списък на категориите
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

// Списък на иконите
app.get('/api/icons/:category', async (req, res) => {
  const categoryPath = path.join(ICONS_DIR, req.params.category);
  try {
    const subdirs = await fs.readdir(categoryPath, { withFileTypes: true });
    const icons = [];

    for (const subdir of subdirs) {
      if (subdir.isDirectory()) {
        const subdirPath = path.join(categoryPath, subdir.name);
        const files = await fs.readdir(subdirPath);

        for (const file of files) {
          if (file.endsWith('.svg')) {
            const fullPath = path.join(subdirPath, file);
            const content = await fs.readFile(fullPath, 'utf8');
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

// ТУК премахваме app.get('*') засега!

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
