import express from 'express';
import { reduceAudio } from '../../controller/media/audio';
import multer from 'multer'


const audioRouter = express.Router();

audioRouter.route("/reduceAudio").post(reduceAudio);



export default audioRouter;
