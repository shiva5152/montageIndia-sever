import express from 'express';
import { reduceImage } from '../../controller/media/img';
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img/'); // The directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    },
});
const upload = multer({ storage: storage });
const imageRouter = express.Router();

imageRouter.route("/reduceImg").post(upload.single('image'), reduceImage);


export default imageRouter;
