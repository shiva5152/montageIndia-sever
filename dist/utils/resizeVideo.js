"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranscodeProgress = exports.handleVideoWithWaterMark = exports.handleReduceVideos = void 0;
const aws_sdk_1 = require("aws-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const mediaconvert = new aws_sdk_1.MediaConvert({
    region,
    endpoint: 'https://xnlmxec5a.mediaconvert.eu-north-1.amazonaws.com',
    accessKeyId,
    secretAccessKey
});
const handleReduceVideos = (name) => {
    return new Promise((resolve, reject) => {
        const params = {
            Queue: "arn:aws:mediaconvert:eu-north-1:097137673320:queues/Default",
            UserMetadata: {},
            Role: "arn:aws:iam::097137673320:role/service-role/MediaConvert_Default_Role_byShiva",
            Settings: {
                TimecodeConfig: {
                    Source: "ZEROBASED"
                },
                OutputGroups: [
                    {
                        Name: "File Group",
                        "Outputs": [
                            {
                                "Preset": "System-Generic_Uhd_Mp4_Hevc_Aac_16x9_3840x2160p_24Hz_8Mbps",
                                "Extension": ".mp4",
                                "NameModifier": "-Original"
                            },
                        ],
                        OutputGroupSettings: {
                            Type: "FILE_GROUP_SETTINGS",
                            FileGroupSettings: {
                                Destination: "s3://shivatemp1/Video/Original/"
                            }
                        }
                    },
                    {
                        Name: "File Group",
                        "Outputs": [
                            {
                                "Preset": "System-Generic_Hd_Mp4_Av1_Aac_16x9_1920x1080p_30Hz_5Mbps_Qvbr_Vq7",
                                "Extension": ".mp4",
                                "NameModifier": "-Medium"
                            },
                        ],
                        OutputGroupSettings: {
                            Type: "FILE_GROUP_SETTINGS",
                            FileGroupSettings: {
                                Destination: "s3://shivatemp1/Video/Medium/"
                            }
                        }
                    },
                    {
                        Name: "File Group",
                        "Outputs": [
                            {
                                "Preset": "System-Generic_Hd_Mp4_Av1_Aac_16x9_1280x720p_25Hz_2Mbps_Qvbr_Vq7",
                                "Extension": ".mp4",
                                "NameModifier": "-Small"
                            },
                        ],
                        OutputGroupSettings: {
                            Type: "FILE_GROUP_SETTINGS",
                            FileGroupSettings: {
                                Destination: "s3://shivatemp1/Video/Small/"
                            }
                        }
                    },
                    {
                        Name: "File Group",
                        "Outputs": [
                            {
                                "Preset": "System-Generic_Sd_Mp4_Avc_Aac_4x3_640x480p_24Hz_1.5Mbps",
                                "Extension": ".webm",
                                "NameModifier": "-Thumbnail"
                            },
                        ],
                        OutputGroupSettings: {
                            Type: "FILE_GROUP_SETTINGS",
                            FileGroupSettings: {
                                Destination: "s3://shivatemp1/Video/Thumbnail/"
                            }
                        }
                    }
                ],
                Inputs: [
                    {
                        AudioSelectors: {
                            "Audio Selector 1": {
                                "DefaultSelection": "DEFAULT"
                            }
                        },
                        VideoSelector: {},
                        TimecodeSource: "ZEROBASED",
                        FileInput: `s3://shivatemp1/temp/${name}`
                    }
                ]
            },
            AccelerationSettings: {
                Mode: "DISABLED"
            },
            StatusUpdateInterval: "SECONDS_60",
            Priority: 0
        };
        mediaconvert.createJob(params, (err, data) => {
            if (err) {
                console.error('Error submitting MediaConvert job:', err);
                reject(err); // Reject the Promise in case of an error
            }
            else {
                console.log('MediaConvert job submitted successfully:', data);
                resolve(data); // Resolve the Promise with the response data
            }
        });
    });
};
exports.handleReduceVideos = handleReduceVideos;
const handleVideoWithWaterMark = (name) => {
    const params = {
        Queue: "arn:aws:mediaconvert:eu-north-1:097137673320:queues/Default",
        UserMetadata: {},
        Role: "arn:aws:iam::097137673320:role/service-role/MediaConvert_Default_Role_byShiva",
        Settings: {
            TimecodeConfig: {
                Source: "ZEROBASED"
            },
            OutputGroups: [
                {
                    Name: "File Group",
                    "Outputs": [
                        {
                            "Preset": "System-Generic_Hd_Mp4_Av1_Aac_16x9_1280x720p_25Hz_2Mbps_Qvbr_Vq7",
                            "Extension": ".webm",
                            "NameModifier": "-ProductPage",
                        },
                    ],
                    OutputGroupSettings: {
                        Type: "FILE_GROUP_SETTINGS",
                        FileGroupSettings: {
                            Destination: "s3://shivatemp1/Video/ProductPage/"
                        }
                    }
                }
            ],
            Inputs: [
                {
                    AudioSelectors: {
                        "Audio Selector 1": {
                            "DefaultSelection": "DEFAULT"
                        }
                    },
                    VideoSelector: {},
                    TimecodeSource: "ZEROBASED",
                    ImageInserter: {
                        InsertableImages: [
                            {
                                "ImageX": 320,
                                "ImageY": 240,
                                "Layer": 1,
                                "ImageInserterInput": "s3://shivatemp1/MI_Logo_Final.png",
                                "Opacity": 50
                            }
                        ]
                    },
                    FileInput: `s3://shivatemp1/temp/${name}`
                }
            ]
        },
        AccelerationSettings: {
            Mode: "DISABLED"
        },
        StatusUpdateInterval: "SECONDS_60",
        Priority: 1
    };
    mediaconvert.createJob(params, (err, data) => {
        if (err) {
            console.error('Error submitting MediaConvert job:', err);
        }
        else {
            console.log('MediaConvert job submitted successfully:', data);
        }
    });
};
exports.handleVideoWithWaterMark = handleVideoWithWaterMark;
const getTranscodeProgress = (JobId) => {
    return new Promise((resolve, reject) => {
        mediaconvert.getJob({ Id: JobId }, (err, data) => {
            if (err) {
                console.error("Error while getting the job", err);
                reject(err); // Reject the Promise in case of an error
            }
            else {
                const jobStatus = data?.Job?.Status;
                const jobProgress = data?.Job?.JobPercentComplete || -1;
                console.log({ jobStatus, jobProgress });
                if (jobStatus) {
                    resolve({ jobStatus, jobProgress }); // Resolve the Promise with the result
                }
                else {
                    reject(new Error("Job status or progress not available."));
                }
            }
        });
    });
};
exports.getTranscodeProgress = getTranscodeProgress;
