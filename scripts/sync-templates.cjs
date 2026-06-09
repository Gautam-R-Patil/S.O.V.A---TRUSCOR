#!/usr/bin/env node
/**
 * sync-templates.js
 * 
 * Scans all real source files and updates their .template counterparts
 * with current metadata: function count, line count, export names,
 * class names, and last-modified timestamp.
 * 
 * Usage: node sync-templates.js
 * 
 * This lets you commit template updates to the public repo
 * showing real activity without leaking implementation code.
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const ELECTRON_DIR = path.join(__dirname, '..', 'SOVA-Electron');

function extractMetadata(filePath, ext) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const meta = {
    totalLines: lines.length,
    functions: [],
    classes: [],
    exports: [],
    imports: [],
  };

  for (const line of lines) {
    // Extract function/method names (not implementation)
    const fnMatch = line.match(/(?:async\s+)?(?:function\s+|(?:public|private|protected)\s+(?:async\s+)?)?(\w+)\s*\(/);
    if (fnMatch && !['if', 'for', 'while', 'switch', 'catch', 'require', 'console'].includes(fnMatch[1])) {
      meta.functions.push(fnMatch[1]);
    }
    
    // Extract class names
    const classMatch = line.match(/class\s+(\w+)/);
    if (classMatch) meta.classes.push(classMatch[1]);
    
    // Extract exports
    const exportMatch = line.match(/export\s+(?:default\s+)?(?:class|function|const|async)\s+(\w+)/);
    if (exportMatch) meta.exports.push(exportMatch[1]);
    
    // Count imports
    const importMatch = line.match(/^import\s+/);
    if (importMatch) meta.imports.push(line.trim());
  }
  
  // Deduplicate
  meta.functions = [...new Set(meta.functions)];
  
  return meta;
}

function generateTemplateContent(filePath, meta, ext) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  const timestamp = new Date().toISOString().split('T')[0];
  const lang = ext === '.ts' ? 'TypeScript' : 'JavaScript';
  
  let content = `/**\n`;
  content += ` * ${path.basename(filePath)}\n`;
  content += ` * S.O.V.A Engine — ${lang}\n`;
  content += ` *\n`;
  content += ` * Module: ${relativePath}\n`;
  content += ` * Last synced: ${timestamp}\n`;
  content += ` *\n`;
  content += ` * Complexity: ${meta.totalLines} lines · ${meta.functions.length} functions`;
  if (meta.classes.length > 0) content += ` · ${meta.classes.length} classes`;
  content += `\n`;
  content += ` *\n`;
  
  if (meta.classes.length > 0) {
    content += ` * Classes:\n`;
    for (const cls of meta.classes) {
      content += ` *   - ${cls}\n`;
    }
    content += ` *\n`;
  }
  
  if (meta.functions.length > 0) {
    content += ` * Functions:\n`;
    for (const fn of meta.functions.slice(0, 30)) { // Cap at 30
      content += ` *   - ${fn}()\n`;
    }
    if (meta.functions.length > 30) {
      content += ` *   ... and ${meta.functions.length - 30} more\n`;
    }
    content += ` *\n`;
  }
  
  if (meta.exports.length > 0) {
    content += ` * Exports:\n`;
    for (const exp of meta.exports) {
      content += ` *   - ${exp}\n`;
    }
    content += ` *\n`;
  }
  
  content += ` * @proprietary Core implementation omitted from public repository.\n`;
  content += ` * @see README.md for architecture overview.\n`;
  content += ` */\n`;
  content += `\n`;
  content += `// This file is a public template. Implementation is proprietary.\n`;
  content += `// See the project README for architecture documentation.\n`;
  
  return content;
}

function syncDir(dir, ext) {
  if (!fs.existsSync(dir)) return 0;
  
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  // Directories to never enter
  const SKIP = ['node_modules', '.git', 'dist', 'pw-browsers', 'data', 'reports', 'assets'];
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (SKIP.includes(entry.name)) continue;
      count += syncDir(fullPath, ext);
      continue;
    }
    
    // Only process real source files (not templates)
    if (!entry.name.endsWith(ext) || entry.name.includes('.template.')) continue;
    
    const templateName = entry.name.replace(ext, `.template${ext}`);
    const templatePath = path.join(dir, templateName);
    
    try {
      const meta = extractMetadata(fullPath, ext);
      const templateContent = generateTemplateContent(fullPath, meta, ext);
      
      // Check if template needs updating
      let needsUpdate = true;
      if (fs.existsSync(templatePath)) {
        const existing = fs.readFileSync(templatePath, 'utf-8');
        // Compare line counts and function counts (ignore timestamp)
        const existingLines = existing.match(/(\d+) lines/);
        const existingFns = existing.match(/(\d+) functions/);
        if (existingLines && existingFns) {
          const sameCounts = parseInt(existingLines[1]) === meta.totalLines 
            && parseInt(existingFns[1]) === meta.functions.length;
          if (sameCounts) needsUpdate = false;
        }
      }
      
      if (needsUpdate) {
        fs.writeFileSync(templatePath, templateContent);
        console.log(`  ✓ ${path.relative(path.join(__dirname, '..'), templatePath)}`);
        count++;
      }
    } catch (e) {
      // Skip files that can't be parsed
    }
  }
  
  return count;
}

console.log('\n🔄 Syncing template files...\n');

let total = 0;
total += syncDir(SRC_DIR, '.ts');
total += syncDir(path.join(ELECTRON_DIR, 'engine'), '.js');
total += syncDir(ELECTRON_DIR, '.js');

if (total === 0) {
  console.log('  All templates up to date.\n');
} else {
  console.log(`\n  ${total} template(s) updated.\n`);
  console.log('  Run: git add -A && git commit -m "update: sync template metadata" && git push');
}
