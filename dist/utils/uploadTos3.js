"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = exports.uploadImage = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new s3_1.default({
    region,
    accessKeyId,
    secretAccessKey
});
async function uploadImage(image) {
    const fileStream = fs_1.default.createReadStream(`output/${image.filename}`);
    const uploadParams = {
        Bucket: bucketName,
        Key: `${image.folder}/${image.filename}`,
        Body: fileStream,
        ContentType: 'image/jpeg',
    };
    s3.putObject(uploadParams, (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log('Image uploaded to S3:', data);
        }
    });
}
exports.uploadImage = uploadImage;
const getUrl = (fileName) => {
    const params = {
        Bucket: bucketName,
        Key: `temp/${fileName}`,
        ContentType: 'video/mp4',
    };
    const signedUrl = s3.getSignedUrl('putObject', params);
    console.log(signedUrl);
    return signedUrl;
};
exports.getUrl = getUrl;
