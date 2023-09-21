import express from 'express';
import { reduceAudio } from '../../controller/media/audio';
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'audio/'); // The directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    },
});
const upload = multer({ storage: storage });
const audioRouter = express.Router()

audioRouter.route("/reduceAudio").post(upload.single('audio'), reduceAudio);



export default audioRouter;
