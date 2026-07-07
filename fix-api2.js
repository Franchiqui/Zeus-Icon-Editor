const fs = require('fs');
let content = fs.readFileSync('components/api/ApiDashboard.tsx', 'utf8');
const lines = content.split('\n');
const newLines = lines.map(line => {
  if (line.includes('await fetch(`http://localhost:3001/')) {
    // Find the last single quote before ', { method:' and change it to backtick
    const idx = line.indexOf("', { method:");
    if (idx !== -1) {
      return line.substring(0, idx) + "`, { method:" + line.substring(idx + ", { method:".length);
    }
  }
  return line;
});
fs.writeFileSync('components/api/ApiDashboard.tsx', newLines.join('\n'));
console.log('done');
