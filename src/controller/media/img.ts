import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import { resizeToOriginal, resizeForThumbnail, resizeToMedium, resizeToSmall, resizeForProductPage } from "../../utils/resizeImage"
import { uploadImage } from "../../utils/uploadToS3";
import Product from "../../model/Product";
import sharp from 'sharp'
// import {Multer} from 'multer'

// export const reduceImage = catchAsyncError(async (req, res, next) => {

//     if (!req.file) {
//         return next(new ErrorHandler("File not Found", 404))
//     }
//     console.log(req.file);
//     // return res.json({ msd: "called" });

//     const filename = req.file.originalname
//     const category = JSON.parse(req.body.category);
//     const description = JSON.parse(req.body.description);
//     console.log(category, description, req.file)
//     // console.log(req);

//     // return res.json({ msg: "called" });
//     const input = `img/${req.file.originalname}`
//     console.log(req?.file.originalname, "--break--", input)
//     // return res.json({ m sg: "called" })
//     const imgName = req.file.originalname
//     const original = `output/Original-${imgName}`

//     try {

//         await resizeToOriginal(input, imgName);

//         await resizeToMedium(original, imgName);
//         await resizeToSmall(original, imgName);
//         await resizeForProductPage(original, imgName)
//         await resizeForThumbnail(original, imgName)
//     } catch (error) {
//         console.log("error while resizing", error)
//         next(new ErrorHandler("bad request", 400))
//     }

//     // return res.json({ msg: "Called" })
//     const images = [
//         { folder: 'Images/Original', filename: `Original-${imgName}` },
//         { folder: 'Images/Medium', filename: `Medium-${imgName}` },
//         { folder: 'Images/Small', filename: `Small-${imgName}` },
//         { folder: 'Images/ProductPage', filename: `ProductPage-${imgName}` },
//         { folder: 'Images/Thumbnail', filename: `Thumbnail-${imgName}` },
//     ];

//     for (const image of images) {
//         try {
//             await uploadImage(image);
//         } catch (error) {
//             console.log(error);
//             next(new ErrorHandler(`Error uploading image`, 400))
//         }
//     }

//     const product = await Product.create({ name: filename, category, description })

//     const { width, height } = await sharp(original, { limitInputPixels: 8585550069 }).metadata();






//     res.json({ msg: `image ${imgName} uploaded successfully `, width, height })
// })
export const reduceImage = catchAsyncError(async (req, res, next) => {
    console.log("before")
    const files = req.files as Express.Multer.File[];
    console.log("after")

    if (!files || files.length === 0) {
        return next(new ErrorHandler("Files not found", 404));
    }
    console.log(files);
    // return;

    // Process each image in parallel
    const processingPromises = files.map(async (file) => {
        const filename = file.originalname;
        // const category = JSON.parse(req.body.category);
        // const description = JSON.parse(req.body.description);
        const input = `img/${filename}`;
        const imgName = filename;
        const original = `output/Original-${imgName}`;

        try {
            await resizeToOriginal(input, imgName);
            await resizeToMedium(original, imgName);
            await resizeToSmall(original, imgName);
            await resizeForProductPage(original, imgName);
            await resizeForThumbnail(original, imgName);
        } catch (error) {
            console.log("Error while resizing", error);
            next(new ErrorHandler("Bad request", 400));
        }

        // Upload the processed images
        const images = [
            { folder: 'Images/Original', filename: `Original-${imgName}` },
            { folder: 'Images/Medium', filename: `Medium-${imgName}` },
            { folder: 'Images/Small', filename: `Small-${imgName}` },
            { folder: 'Images/ProductPage', filename: `ProductPage-${imgName}` },
            { folder: 'Images/Thumbnail', filename: `Thumbnail-${imgName}` },
        ];

        for (const image of images) {
            try {
                await uploadImage(image);
            } catch (error) {
                console.log(error);
                next(new ErrorHandler(`Error uploading image`, 400));
            }
        }

        // Create a product entry for each image
        // const product = await Product.create({ name: filename, category, description });

        const { width, height } = await sharp(original, { limitInputPixels: 8585550069 }).metadata();

        return { msg: `Image ${imgName} uploaded successfully`, width, height };
    });

    try {
        const results = await Promise.all(processingPromises);
        res.json({ results });
    } catch (error) {
        console.error("Error processing images:", error);
        next(new ErrorHandler("Internal server error", 500));
    }
});





