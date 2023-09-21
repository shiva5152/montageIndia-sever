"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceAudio = void 0;
const catchAsyncError_1 = __importDefault(require("../../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const uploadToS3_1 = require("../../utils/uploadToS3");
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
function addAudioWatermark(mainAudio, watermarkAudio, output) {
    return new Promise((resolve, reject) => {
        const ffmpegProcess = (0, fluent_ffmpeg_1.default)()
            .input(mainAudio)
            .input(watermarkAudio)
            .complexFilter([
            { filter: 'amovie', options: { filename: watermarkAudio, loop: 0 }, outputs: 'beep' },
            { filter: 'asetpts', options: { expr: 'N/SR/TB' }, inputs: 'beep', outputs: 'pts' },
            { filter: 'amix', options: { inputs: 2, duration: 'shortest' }, inputs: ['0:a', 'pts'], outputs: 'mix' },
            { filter: 'volume', options: { volume: 1 }, inputs: 'mix', outputs: 'volume' }
        ])
            .outputOptions('-map', '[volume]')
            .save(output)
            .on('error', function (err) {
            console.log('An error occurred: ' + err.message);
            reject(err); // Reject the Promise in case of an error
        })
            .on('progress', function (progress) {
            console.log('Processing: ' + progress.percent + '% done');
        })
            .on('end', function () {
            console.log('Processing finished!');
            resolve(); // Resolve the Promise when processing is finished
        });
    });
}
exports.reduceAudio = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // console.log(req.file);
    if (!req.file) {
        next(new errorHandler_1.default(`Can not get file`, 400));
    }
    console.log(req.file);
    const filename = (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname.split('.')[0];
    const fileExtension = (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname.split('.')[1];
    const originalAudioPath = `audio/${filename}.${fileExtension}`;
    const watermarkAudioPath = 'audio/watermark.wav';
    const outputAudioPath = `output/${filename}-watermarked.${fileExtension}`;
    try {
        yield addAudioWatermark(originalAudioPath, watermarkAudioPath, outputAudioPath);
        console.log('Audio watermarking sussesfully:');
    }
    catch (error) {
        console.error('Audio watermarking failed:', error);
    }
    // return res.json({ msg: "uploaded successfully" })
    const images = [
        { folder: `audio`, filename: `${filename}.${fileExtension}` },
        { folder: `output`, filename: `${filename}-watermarked.${fileExtension}` },
    ];
    for (const image of images) {
        try {
            yield (0, uploadToS3_1.uploadAudio)(image, filename);
        }
        catch (error) {
            console.log(error);
            next(new errorHandler_1.default(`Error uploading image`, 400));
        }
    }
    res.json({ msg: "uploaded successfully" });
}));
