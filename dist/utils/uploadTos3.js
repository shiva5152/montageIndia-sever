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
exports.uploadAudio = exports.getUrl = exports.uploadImage = void 0;
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
function uploadImage(image) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.uploadImage = uploadImage;
function uploadAudio(image, subFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileStream = fs_1.default.createReadStream(`${image.folder}/${image.filename}`);
        const uploadParams = {
            Bucket: bucketName,
            Key: `audio/${subFolder}/${image.filename}`,
            Body: fileStream,
            ContentType: 'audio/mpeg',
        };
        s3.putObject(uploadParams, (err, data) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log('Image uploaded to S3:', data);
            }
        });
    });
}
exports.uploadAudio = uploadAudio;
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
