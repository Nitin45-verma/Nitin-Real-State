const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  if (content.includes("`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`")) {
    content = content.replace(/`\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}\/api\/auth\/register`/g, "'/api/auth/register'");
    hasChanges = true;
  }
  
  if (content.includes("`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`")) {
    content = content.replace(/`\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}\/api\/auth\/login`/g, "'/api/auth/login'");
    hasChanges = true;
  }

  // Global replacement for specific fixed URLs
  const toReplaceRegex = /http:\/\/localhost:5000/g;
  if (toReplaceRegex.test(content)) {
    content = content.replace(toReplaceRegex, "");
    hasChanges = true;
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
};

const traverseDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
};

traverseDirectory(directory);
console.log("Replacement complete.");
