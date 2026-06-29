const fs = require("fs");
const path = require("path");

const srcDir = path.join(process.cwd(), "src");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && /\.(jsx|js)$/.test(entry.name)) {
      files.push(full);
    }
  }

  return files;
}

function fixReactImport(content) {
  if (
    /import\s+React\b/.test(content) ||
    /import\s+\*\s+as\s+React\s+from\s+["']react["']/.test(content)
  ) {
    return content;
  }

  const namedReactImportRegex =
    /^import\s+\{\s*([^}]+?)\s*\}\s+from\s+["']react["'];?\s*$/m;

  const match = content.match(namedReactImportRegex);

  if (match) {
    const originalLine = match[0];
    const hooks = match[1].trim();
    const replacement = `import React, { ${hooks} } from "react";`;
    return content.replace(originalLine, replacement);
  }

  return `import React from "react";\n${content}`;
}

if (!fs.existsSync(srcDir)) {
  console.error("Erro: pasta src não encontrada. Rode este script na raiz do projeto.");
  process.exit(1);
}

const files = walk(srcDir);
let changed = 0;

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = fixReactImport(before);

  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    console.log("Corrigido:", path.relative(process.cwd(), file));
    changed += 1;
  }
}

console.log(`\nFinalizado. Arquivos corrigidos: ${changed}`);
