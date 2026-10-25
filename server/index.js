// server/index.js
import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import history from "connect-history-api-fallback";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, "icons");

app.use(cors());

// API Р·Р° РєР°С‚РµРіРѕСЂРёРёС‚Рµ
app.get("/api/categories", async (req, res) => {
  try {
    const entries = await fs.readdir(ICONS_DIR, { withFileTypes: true });

    console.log(ICONS_DIR);

    const categoriesPromises = entries
      .filter((dirent) => dirent.isDirectory())
      .map(async (dirent) => {
        const categoryPath = path.join(ICONS_DIR, dirent.name);
        const categoryEntries = await fs.readdir(categoryPath, {
          withFileTypes: true,
        });

        let svgCount = 0;

        for (const entry of categoryEntries) {
          const entryPath = path.join(categoryPath, entry.name);

          if (entry.isFile() && entry.name.endsWith(".svg")) {
            svgCount++;
          } else if (entry.isDirectory()) {
            const files = await fs.readdir(entryPath);
            svgCount += files.filter((f) => f.endsWith(".svg")).length;
          }
        }

        return {
          name: dirent.name,
          count: svgCount,
        };
      });

    const categories = await Promise.all(categoriesPromises);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Cannot read icons directory" });
  }
});

// API Р·Р° РёРєРѕРЅРёС‚Рµ РІ РєР°С‚РµРіРѕСЂРёСЏ
app.get("/api/icons/:category", async (req, res) => {
  const categoryPath = path.join(ICONS_DIR, req.params.category);

  try {
    const entries = await fs.readdir(categoryPath, { withFileTypes: true });
    const iconFiles = [];

    for (const entry of entries) {
      const entryPath = path.join(categoryPath, entry.name);

      if (entry.isFile() && entry.name.endsWith(".svg")) {
        iconFiles.push({ filePath: entryPath, fileName: entry.name, style: "" });
      } else if (entry.isDirectory()) {
        const files = await fs.readdir(entryPath, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith(".svg")) {
            iconFiles.push({
              filePath: path.join(entryPath, file.name),
              fileName: file.name,
              style: entry.name,
            });
          }
        }
      }
    }

    // Bound concurrent reads so large collections do not exhaust file descriptors.
    const icons = [];
    const concurrency = 64;
    for (let i = 0; i < iconFiles.length; i += concurrency) {
      const batch = iconFiles.slice(i, i + concurrency);
      const batchIcons = await Promise.all(batch.map(async ({ filePath, fileName, style }) => {
        const content = await fs.readFile(filePath, "utf8");
        const cleanedName = fileName.replace(/^icons8-/, "").replace(/\.svg$/, "");
        const key = style ? `${style}-${cleanedName}` : cleanedName;
        return { name: cleanedName, fileName, svg: content, key };
      }));
      icons.push(...batchIcons);
    }

    res.json(icons);
  } catch (error) {
    console.error(`Failed to read icons for category "${req.params.category}":`, error);
    res.status(500).json({ error: "Cannot read category directory" });
  }
});
// // РЎС‚Р°С‚РёС‡РЅРё С„Р°Р№Р»РѕРІРµ (React build)
// app.use(express.static(path.join(__dirname, '../client/dist')));

// // Catch-all route (РїРѕСЃР»РµРґРµРЅ)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

app.use(history());
app.use(express.static(path.join(__dirname, "../client/dist")));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
