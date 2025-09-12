// // server.js
// const express = require('express');
// const multer = require('multer');
// const XLSX = require('xlsx');
// const js2xmlparser = require('js2xmlparser');
// const fs = require('fs');
// const path = require('path');
// const os = require('os');

// const app = express();
// // store uploads in OS temp directory (ephemeral, safe for cloud)
// const upload = multer({ dest: os.tmpdir() });

// // serve index.html and assets from project root
// app.use(express.static(path.join(__dirname)));

// // sanitize headers -> valid XML tag names (remove dots, spaces, odd chars)
// function sanitizeTagName(name) {
//   if (!name && name !== 0) return 'field';
//   let tag = String(name).trim();
//   tag = tag.replace(/\s+/g, '_');            // spaces -> underscores
//   tag = tag.replace(/[^A-Za-z0-9_\-]/g, ''); // remove anything except letters/numbers/_/-
//   if (!tag) tag = 'field';
//   if (/^[0-9]/.test(tag)) tag = '_' + tag;   // can't start with digit
//   return tag;
// }

// app.post('/convert', upload.single('file'), (req, res) => {
//   if (!req.file) return res.status(400).send('No file uploaded');

//   try {
//     // Read Excel
//     const wb = XLSX.readFile(req.file.path, { cellDates: true });
//     const sheetNames = wb.SheetNames;
//     const ws = wb.Sheets[sheetNames[0]]; // first sheet
//     const json = XLSX.utils.sheet_to_json(ws, {
//       defval: null,
//       raw: false,
//       blankrows: false,
//       range: 0
//     });

//     // Normalize keys and dates
//     const normalized = json.map(row => {
//       const obj = {};
//       for (const [k, v] of Object.entries(row)) {
//         const key = sanitizeTagName(k);
//         obj[key] = v instanceof Date ? v.toISOString().split('T')[0] : v;
//       }
//       return obj;
//     });

//     // Build XML
//     const xml = js2xmlparser.parse('Workbook', {
//       Sheet: {
//         '@': { name: sheetNames[0] },
//         Record: normalized
//       }
//     });

//     // Write temp XML next to uploaded file in OS temp dir
//     const outPath = path.join(os.tmpdir(), req.file.filename + '.xml');
//     fs.writeFileSync(outPath, xml, 'utf8');

//     // Send as download then cleanup
//     res.download(outPath, 'output.xml', err => {
//       try { fs.unlinkSync(req.file.path); } catch (e) {}
//       try { fs.unlinkSync(outPath); } catch (e) {}
//       if (err) console.error('Download error:', err);
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Conversion failed: ' + err.message);
//   }
// });

// // IMPORTANT for Render: use provided PORT
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });


// //npm install express multer xlsx js2xmlparser




const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const js2xmlparser = require('js2xmlparser');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const upload = multer({ dest: os.tmpdir() });

// Serve the loading page immediately at "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'loading.html'));
});

// Serve static assets for other routes if needed
app.use(express.static(path.join(__dirname)));

// sanitize headers -> valid XML tag names (remove dots, spaces, odd chars)
function sanitizeTagName(name) {
  if (!name && name !== 0) return 'field';
  let tag = String(name).trim();
  tag = tag.replace(/\s+/g, '_');
  tag = tag.replace(/[^A-Za-z0-9_\-]/g, '');
  if (!tag) tag = 'field';
  if (/^[0-9]/.test(tag)) tag = '_' + tag;
  return tag;
}

app.post('/convert', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  try {
    const wb = XLSX.readFile(req.file.path, { cellDates: true });
    const sheetNames = wb.SheetNames;
    const ws = wb.Sheets[sheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, {
      defval: null,
      raw: false,
      blankrows: false,
      range: 0
    });

    const normalized = json.map(row => {
      const obj = {};
      for (const [k, v] of Object.entries(row)) {
        const key = sanitizeTagName(k);
        obj[key] = v instanceof Date ? v.toISOString().split('T')[0] : v;
      }
      return obj;
    });

    const xml = js2xmlparser.parse('Workbook', {
      Sheet: {
        '@': { name: sheetNames[0] },
        Record: normalized
      }
    });

    const outPath = path.join(os.tmpdir(), req.file.filename + '.xml');
    fs.writeFileSync(outPath, xml, 'utf8');

    res.download(outPath, 'output.xml', err => {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
      try { fs.unlinkSync(outPath); } catch (e) {}
      if (err) console.error('Download error:', err);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Conversion failed: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
