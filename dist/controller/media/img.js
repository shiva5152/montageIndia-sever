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
exports.reduceImage = void 0;
const catchAsyncError_1 = __importDefault(require("../../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const resizeImage_1 = require("../../utils/resizeImage");
const uploadToS3_1 = require("../utils/uploadToS3");
const Product_1 = __importDefault(require("../../model/Product"));
const sharp_1 = __importDefault(require("sharp"));
exports.reduceImage = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return next(new errorHandler_1.default("File not Found", 404));
    }
    const filename = req.file.originalname;
    const category = JSON.parse(req.body.category);
    const description = JSON.parse(req.body.description);
    console.log(category, description, req.file);
    // console.log(req);
    // return res.json({ msg: "called" });
    const input = `img/${req.file.originalname}`;
    console.log(req === null || req === void 0 ? void 0 : req.file.originalname, "--break--", input);
    // return res.json({ m sg: "called" })
    const imgName = req.file.originalname;
    const original = `output/Original-${imgName}`;
    try {
        yield (0, resizeImage_1.resizeToOriginal)(input, imgName);
        yield (0, resizeImage_1.resizeToMedium)(original, imgName);
        yield (0, resizeImage_1.resizeToSmall)(original, imgName);
        yield (0, resizeImage_1.resizeForProductPage)(original, imgName);
        yield (0, resizeImage_1.resizeForThumbnail)(original, imgName);
    }
    catch (error) {
        console.log("error while resizing", error);
        next(new errorHandler_1.default("bad request", 400));
    }
    // return res.json({ msg: "Called" })
    const images = [
        { folder: 'Images/Original', filename: `Original-${imgName}` },
        { folder: 'Images/Medium', filename: `Medium-${imgName}` },
        { folder: 'Images/Small', filename: `Small-${imgName}` },
        { folder: 'Images/ProductPage', filename: `ProductPage-${imgName}` },
        { folder: 'Images/Thumbnail', filename: `Thumbnail-${imgName}` },
    ];
    for (const image of images) {
        try {
            yield (0, uploadToS3_1.uploadImage)(image);
        }
        catch (error) {
            console.log(error);
            next(new errorHandler_1.default(`Error uploading image`, 400));
        }
    }
    const product = yield Product_1.default.create({ name: filename, category, description });
    const { width, height } = yield (0, sharp_1.default)(original, { limitInputPixels: 8585550069 }).metadata();
    res.json({ msg: `image ${imgName} uploaded successfully `, width, height });
}));
