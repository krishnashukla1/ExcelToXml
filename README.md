# Excel to XML Converter

This is a simple Node.js application that allows users to upload an Excel file (`.xls` or `.xlsx`) and convert it into an XML file.  
The converted file is automatically downloaded after processing.

---

## 🚀 Features
- Upload an Excel file from browser.
- Automatically converts the first worksheet into XML format.
- Cleans and normalizes column headers for valid XML tags.
- Handles dates and special characters properly.
- Temporary files are cleaned up after download.
- Works on **Render**, **Heroku**, or any Node.js hosting.

---

## 🛠️ Tech Stack
- **[Express](https://expressjs.com/)** → Web framework  
- **[Multer](https://github.com/expressjs/multer)** → File upload middleware  
- **[xlsx](https://github.com/SheetJS/sheetjs)** → Read Excel files  
- **[js2xmlparser](https://github.com/michaelkourlas/node-js2xmlparser)** → Convert JSON to XML  
- **fs, path, os** (built-in Node.js modules)  

---

## 📦 Installation

1. Clone the repository:
  
   git clone https://github.com/krishnashukla1/ExcelToXml.git
   cd ExcelToXml


2. Install dependencies:

npm install express multer xlsx js2xmlparser

3. Start the server:

node server.js

4. Open in browser:

http://localhost:3000

5. Upload xlsx file and click to 'convert and downlaod button'