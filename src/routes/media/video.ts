import express from 'express';
import { reduceVideo, uploadVideo, getJobProgress } from '../../controller/media/video';
import multer from 'multer'


const videoRouter = express.Router();

videoRouter.route("/reduceVideo").post(reduceVideo);
videoRouter.route('/getUrl').post(uploadVideo);
videoRouter.route('/getProgress/:jobId').get(getJobProgress);


export default videoRouter;
