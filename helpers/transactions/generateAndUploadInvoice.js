const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { PAYMENT_STATUS } = require("../../constants");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dbrkf1j5w",
  api_key: "795633858137547",
  api_secret: "u2aK09fu1bQ9Isv25Zt1S85M6-c",
});

exports.generateAndUploadInvoice = async (invoiceData) => {
  return new Promise((resolve, reject) => {
    const status =
      invoiceData.status === PAYMENT_STATUS.CAPTURED
        ? "Successfully"
        : invoiceData.status;
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `invoice_${invoiceData.id}.pdf`;
    const filePath = path.join(__dirname, "..", "tmp", fileName);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Invoice", { align: "center" }).moveDown(2);
    doc.fontSize(12).text(`Invoice No: ${invoiceData.invoiceId}`);
    doc.text(`Transaction: ${invoiceData.transaction}`);
    doc.text(`Date: ${invoiceData.date}`);
    doc.text(`Plan: ${invoiceData.planName}`);
    doc.text(`Price: ₹${invoiceData.price}`);
    doc.text(`Plan End: ${invoiceData.planEnd}`);
    doc.text(`Status: ${status}`);
    doc.text(`Payment Method: ${invoiceData.paymentMethod}`);

    doc.end();

    doc.on("end", async () => {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: "raw",
          folder: "invoices",
          public_id: fileName.replace(".pdf", ""),
        });
        fs.unlinkSync(filePath); // clean up
        resolve(result.secure_url);
      } catch (err) {
        reject(err);
      }
    });
  });
};
