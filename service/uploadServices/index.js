const fs = require("fs");
const {
  uploadFile,
  deleteFile,
  getOptimizedImageUrl,
} = require("../../helpers/cloudinary");

exports.uploadImage = async (imagePath) => {
  const result = await uploadFile(imagePath, { resource_type: "image" });
  return getOptimizedImageUrl(result.public_id);
};

exports.uploadPDF = async (pdfPath, fileName) => {
  const result = await uploadFile(pdfPath, {
    resource_type: "auto",
    folder: "invoices",
    public_id: fileName.replace(".pdf", ""),
  });
  if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
  return result.secure_url;
};

exports.deleteCloudinaryFile = deleteFile;
