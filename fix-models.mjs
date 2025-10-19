import fs from "fs";
import path from "path";

const dir = "./src/models";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));

for (const file of files) {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, "utf8");

  // Reemplaza require('sequelize') por import { DataTypes } from 'sequelize';
  if (content.includes("require('sequelize')")) {
    content = content
      .replace(/const Sequelize\s*=\s*require\(['"]sequelize['"]\);?/, "import { DataTypes } from 'sequelize';")
      .replace(/module\.exports\s*=\s*/, "export default ");
    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`✅ Convertido a ESM: ${file}`);
  } else {
    console.log(`⏩ Ya era ESM: ${file}`);
  }
}

console.log("🎯 Conversión completa. Todos los modelos ahora son ESM.");
