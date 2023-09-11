"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const video_1 = require("../../controller/media/video");
const videoRouter = express_1.default.Router();
videoRouter.route("/reduceVideo").post(video_1.reduceVideo);
videoRouter.route('/getUrl').post(video_1.uploadVideo);
videoRouter.route('/getProgress/:jobId').get(video_1.getJobProgress);
exports.default = videoRouter;
