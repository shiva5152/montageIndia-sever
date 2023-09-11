import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import { MediaConvert } from "aws-sdk";
import { handleReduceVideos, handleVideoWithWaterMark, getTranscodeProgress } from "../../utils/resizeVideo";
import { getUrl } from "../../utils/uploadToS3"
import dotenv from 'dotenv'
dotenv.config();

const region = process.env.AWS_BUCKET_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY as string
const secretAccessKey = process.env.AWS_SECRET_KEY as string


export const reduceVideo = catchAsyncError(async (req, res, next) => {
    const { name } = req.body;

    const data = await handleReduceVideos(name);
    // handleVideoWithWaterMark(name);
    res.json({ msg: "uploaded successfully", jobId: data.Job?.Id })
})


export const uploadVideo = catchAsyncError(async (req, res, next) => {
    const { name } = req?.body;

    const url = getUrl(name)
    res.json({ success: true, url })
})

export const getJobProgress = catchAsyncError(async (req, res, next) => {
    const { jobId } = req.params;

    const data = await getTranscodeProgress(jobId)

    res.json({ success: true, data })


})
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


