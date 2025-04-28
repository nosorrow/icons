// server/index.js
import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import history from 'connect-history-api-fallback';

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, 'icons');

app.use(cors());

// API за категориите
app.get('/api/categories', async (req, res) => {
  try {
    const entries = await fs.readdir(ICONS_DIR, { withFileTypes: true });

    const categoriesPromises = entries
      .filter((dirent) => dirent.isDirectory())
      .map(async (dirent) => {
        const categoryPath = path.join(ICONS_DIR, dirent.name);
        const categoryEntries = await fs.readdir(categoryPath, { withFileTypes: true });

        let svgCount = 0;

        for (const entry of categoryEntries) {
          const entryPath = path.join(categoryPath, entry.name);

          if (entry.isFile() && entry.name.endsWith('.svg')) {
            svgCount++;
          } else if (entry.isDirectory()) {
            const files = await fs.readdir(entryPath);
            svgCount += files.filter((f) => f.endsWith('.svg')).length;
          }
        }

        return {
          name: dirent.name,
          count: svgCount
        };
      });

    const categories = await Promise.all(categoriesPromises);

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

    const iconsPromises = entries.map(async (entry) => {
      const entryPath = path.join(categoryPath, entry.name);

      if (entry.isFile() && entry.name.endsWith('.svg')) {
        const content = await fs.readFile(entryPath, 'utf8');
        return [{ name: entry.name, svg: content }];
      }

      if (entry.isDirectory()) {
        const files = await fs.readdir(entryPath);
        const svgFiles = files
          .filter((file) => file.endsWith('.svg'))
          .map(async (file) => {
            const filePath = path.join(entryPath, file);
            const content = await fs.readFile(filePath, 'utf8');
            return { name: file, svg: content };
          });

        return Promise.all(svgFiles);
      }

      return []; // Ако не е файл/директория — празен списък
    });

    const iconsArrays = await Promise.all(iconsPromises);
    const icons = iconsArrays.flat();

    res.json(icons);
  } catch (error) {
    res.status(500).json({ error: 'Cannot read category directory' });
  }
});

// // Статични файлове (React build)
// app.use(express.static(path.join(__dirname, '../client/dist')));

// // Catch-all route (последен)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

app.use(history());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
