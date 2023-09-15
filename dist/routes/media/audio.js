"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const audio_1 = require("../../controller/media/audio");
const audioRouter = express_1.default.Router();
audioRouter.route("/reduceAudio").post(audio_1.reduceAudio);
exports.default = audioRouter;
