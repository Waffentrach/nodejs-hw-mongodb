import createHttpError from 'http-errors';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(createHttpError(400, 'Only images are allowed (jpeg, jpg, png)'));
  },
}).single('image');

export const uploadImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) return next(createHttpError(400, 'No file uploaded'));
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
  });
};
