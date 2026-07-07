const fs = require('fs');
let content = fs.readFileSync('components/api/ApiDashboard.tsx', 'utf8');
content = content.replace(/await fetch\('http:\/\//g, 'await fetch(`http://');
content = content.replace(/\|\| ''\)\}', \{ method:/g, "|| '')}', { method:");
fs.writeFileSync('components/api/ApiDashboard.tsx', content);
console.log('done');
