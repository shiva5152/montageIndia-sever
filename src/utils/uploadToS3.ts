import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME as string
const region = process.env.AWS_BUCKET_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY as string;
const secretAccessKey = process.env.AWS_SECRET_KEY as string;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})


async function uploadImage(image: { folder: string, filename: string }) {



    const fileStream = fs.createReadStream(`output/${image.filename}`);

    const uploadParams = {
        Bucket: bucketName,
        Key: `${image.folder}/${image.filename}`,
        Body: fileStream,
        ContentType: 'image/jpeg',
    };

    s3.putObject(uploadParams, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Image uploaded to S3:', data);
        }
    });
}
const getUrl = (fileName: string) => {
    const params = {
        Bucket: bucketName,
        Key: `temp/${fileName}`, // The key (file path) for the object in the bucket
        ContentType: 'video/mp4',
    };
    const signedUrl = s3.getSignedUrl('putObject', params);
    console.log(signedUrl);
    return signedUrl;
}
export { uploadImage, getUrl }