"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobProgress = exports.uploadVideo = exports.reduceVideo = void 0;
const catchAsyncError_1 = __importDefault(require("../../middleware/catchAsyncError"));
const resizeVideo_1 = require("../../utils/resizeVideo");
const uploadToS3_1 = require("../../utils/uploadToS3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
exports.reduceVideo = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { name } = req.body;
    const data = await (0, resizeVideo_1.handleReduceVideos)(name);
    // handleVideoWithWaterMark(name);
    res.json({ msg: "uploaded successfully", jobId: data.Job?.Id });
});
exports.uploadVideo = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { name } = req?.body;
    const url = (0, uploadToS3_1.getUrl)(name);
    res.json({ success: true, url });
});
exports.getJobProgress = (0, catchAsyncError_1.default)(async (req, res, next) => {
    const { jobId } = req.params;
    const data = await (0, resizeVideo_1.getTranscodeProgress)(jobId);
    res.json({ success: true, data });
});
// export const reduceVideo = catchAsyncError(async (req, res, next) => {
//     const mediaconvert = new MediaConvert({
//         region,
//         endpoint: 'https://xnlmxec5a.mediaconvert.eu-north-1.amazonaws.com',
//         accessKeyId,
//         secretAccessKey
//     });
//     const params = {
//         Queue: "arn:aws:mediaconvert:eu-north-1:097137673320:queues/Default",
//         UserMetadata: {},
//         Role: "arn:aws:iam::097137673320:role/service-role/MediaConvert_Default_Role_byShiva",
//         Settings: {
//             TimecodeConfig: {
//                 Source: "ZEROBASED"
//             },
//             OutputGroups: [
//                 {
//                     Name: "File Group",
//                     "Outputs": [
//                         {
//                             "Preset": "System-Generic_Uhd_Mp4_Hevc_Aac_16x9_3840x2160p_24Hz_8Mbps",
//                             "Extension": ".mp4",
//                             "NameModifier": "-Original"
//                         },
//                         {
//                             "Preset": "System-Generic_Hd_Mp4_Av1_Aac_16x9_1920x1080p_30Hz_5Mbps_Qvbr_Vq7",
//                             "Extension": ".mp4",
//                             "NameModifier": "-Medium"
//                         },
//                         {
//                             "Preset": "System-Generic_Hd_Mp4_Av1_Aac_16x9_1280x720p_25Hz_2Mbps_Qvbr_Vq7",
//                             "Extension": ".mp4",
//                             "NameModifier": "-Small"
//                         },
//                         {
//                             "Preset": "System-Generic_Hd_Mp4_Av1_Aac_16x9_1280x720p_25Hz_2Mbps_Qvbr_Vq7",
//                             "Extension": ".webm",
//                             "NameModifier": "-ProductPage",
//                         },
//                         // {
//                         //     "Preset": "System-Generic_Sd_Mp4_Avc_Aac_4x3_640x480p_24Hz_1.5Mbps",
//                         //     "Extension": ".webm",
//                         //     "NameModifier": "-Thumbnail"
//                         // },
//                     ],
//                     OutputGroupSettings: {
//                         Type: "FILE_GROUP_SETTINGS",
//                         FileGroupSettings: {
//                             Destination: "s3://shivatemp1/"
//                         }
//                     }
//                 }
//             ],
//             Inputs: [
//                 {
//                     AudioSelectors: {
//                         "Audio Selector 1": {
//                             "DefaultSelection": "DEFAULT"
//                         }
//                     },
//                     VideoSelector: {},
//                     TimecodeSource: "ZEROBASED",
//                     FileInput: 's3://shivatemp1/MI-Clip-007.mp4'
//                 }
//             ]
//         },
//         AccelerationSettings: {
//             Mode: "DISABLED"
//         },
//         StatusUpdateInterval: "SECONDS_60",
//         Priority: 0
//     }
//     mediaconvert.createJob(params, (err, data) => {
//         if (err) {
//             console.error('Error submitting MediaConvert job:', err);
//         } else {
//             console.log('MediaConvert job submitted successfully:', data);
//         }
//     })
//     res.json({ msg: ` uploaded successfully ` })
// })
