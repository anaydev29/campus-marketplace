const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImage = /jpeg|jpg|png|gif|webp/;
  const allowedVideo = /mp4|webm|mov|avi/;
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");

  if (allowedImage.test(ext) || allowedVideo.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image (jpg, png, webp) and video (mp4, webm, mov) files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max per file
});

module.exports = upload;
