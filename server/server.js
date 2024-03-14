const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/merge-pdf', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;
        const mergedPdf = await mergePDFs(files);
        res.setHeader('Content-Disposition', 'attachment; filename=merged_pdf.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(mergedPdf);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function mergePDFs(pdfFiles) {
    const pdfDoc = await PDFDocument.create();
    for (const file of pdfFiles) {
        const pdfBytes = await fs.readFile(file.path);
        const externalPdfDoc = await PDFDocument.load(pdfBytes);
        const pages = await pdfDoc.copyPages(externalPdfDoc, externalPdfDoc.getPageIndices());
        for (const page of pages) {
            pdfDoc.addPage(page);
        }
    }
    return await pdfDoc.save();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
