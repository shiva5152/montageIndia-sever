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
exports.resizeForThumbnail = exports.resizeForProductPage = exports.resizeToSmall = exports.resizeToMedium = exports.resizeToOriginal = void 0;
const sharp_1 = __importDefault(require("sharp"));
const resizeToOriginal = (input, imgName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { density, width, height } = yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        if (density && height && width && density > 300) {
            if (height > 6000 && width > 6000) {
                yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize(width > height ? { width: 6000 } : { height: 6000 }).withMetadata({ density: 300 }).toFile(`output/Original-${imgName}`);
            }
            else if (height > 6000) {
                yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ height: 6000 }).withMetadata({ density: 300 }).toFile(`output/Original-${imgName}`);
            }
            else if (width > 6000) {
                yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: 6000 }).withMetadata({ density: 300 }).toFile(`output/Original-${imgName}`);
            }
            else {
                yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).withMetadata({ density: 300 }).toFile(`output/Original-${imgName}`);
            }
        }
        else if (density && height && width && density <= 300) {
            if (height > 6000 && width > 6000) {
                yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize(width > height ? { width: 6000 } : { height: 6000 }).withMetadata({ density: density }).toFile(`output/Original-${imgName}`);
            }
            else if (height > 6000) {
                yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ height: 6000 }).withMetadata({ density: density }).toFile(`output/Original-${imgName}`);
            }
            else if (width > 6000) {
                yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: 6000 }).withMetadata({ density: density }).toFile(`output/Original-${imgName}`);
            }
            else {
                yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: width, height: height }).withMetadata({ density: density }).toFile(`output/Original-${imgName}`);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.resizeToOriginal = resizeToOriginal;
const resizeToMedium = (input, imgName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { density, width, height } = yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density)
            yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: Math.floor(width / 2), height: Math.floor(height / 2) }).withMetadata({ density: density }).toFile(`output/Medium-${imgName}`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.resizeToMedium = resizeToMedium;
const resizeToSmall = (input, imgName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { density, width, height } = yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density)
            yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: Math.floor(width / 4), height: Math.floor(height / 4) }).withMetadata({ density: density }).toFile(`output/Small-${imgName}`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.resizeToSmall = resizeToSmall;
const resizeForProductPage = (input, imgName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { density, width, height } = yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        const { width: logoWidth, height: logoHeight } = yield (0, sharp_1.default)('assets/logo.png', { limitInputPixels: 8585550069 }).metadata();
        console.log(logoHeight, height, width, logoWidth);
        // return console.log("from composite");
        if (logoHeight && height && width && logoWidth) {
            yield (0, sharp_1.default)('assets/logo.png', { limitInputPixels: 8585550069 }).resize((logoHeight >= (height / 8) || (logoWidth >= width / 8)) ? { width: Math.floor(logoWidth / 2), height: Math.floor(logoHeight / 2) } : { width: logoWidth, height: logoHeight, }).toFile(`assets/recused-logo.png`);
        }
        if (width && height)
            yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: Math.floor(width / 8), height: Math.floor(height / 8) }).composite([{ input: 'assets/recused-logo.png', gravity: "center", }]).withMetadata({ density: 72 }).toFile(`output/ProductPage-${imgName}`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.resizeForProductPage = resizeForProductPage;
const resizeForThumbnail = (input, imgName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { density, width, height } = yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density)
            yield (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: 150 }).withMetadata({ density: 72 }).toFile(`output/Thumbnail-${imgName}`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.resizeForThumbnail = resizeForThumbnail;
