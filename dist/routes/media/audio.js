"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const audio_1 = require("../../controller/media/audio");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'audio/'); // The directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const audioRouter = express_1.default.Router();
audioRouter.route("/reduceAudio").post(upload.single('audio'), audio_1.reduceAudio);
exports.default = audioRouter;
