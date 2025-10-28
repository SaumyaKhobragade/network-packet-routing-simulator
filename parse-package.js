const fs=require('fs'); try{ const s=fs.readFileSync('package.json','utf8'); console.log('NAME:', JSON.parse(s).name);}catch(e){console.error('PARSE ERROR', e.message); process.exit(1);}
