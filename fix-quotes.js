const fs = require('fs');
let content = fs.readFileSync('components/api/ApiDashboard.tsx', 'utf8');
const lines = content.split('\n');
const newLines = lines.map(line => {
  if (line.includes('await fetch(`http://localhost:3001/') && line.endsWith("\', { method:")) {
    return line.slice(0, -"\', { method:".length) + "`, { method:";
  }
  return line;
});
fs.writeFileSync('components/api/ApiDashboard.tsx', newLines.join('\n'));
console.log('done');
