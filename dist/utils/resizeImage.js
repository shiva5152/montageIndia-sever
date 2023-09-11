"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeForThumbnail = exports.resizeForProductPage = exports.resizeToSmall = exports.resizeToMedium = exports.resizeToOriginal = void 0;
const sharp_1 = __importDefault(require("sharp"));
const resizeToOriginal = async (input, imgName) => {
    try {
        const { density, width, height } = await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        if (density && height && width && density > 300) {
            if (height > 6000 && width > 6000) {
                await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize(width > height ? { width: 6000 } : { height: 6000 }).withMetadata({ density: 300 }).toFile(`output/Original-${imgName}`);
            }
            else if (height > 6000) {
                await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ height: 6000 }).withMetadata({ density: 300 }).toFile(`output/Original-${imgName}`);
            }
            else if (width > 6000) {
                await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: 6000 }).withMetadata({ density: 300 }).toFile(`output/Original-${imgName}`);
            }
            else {
                await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).withMetadata({ density: 300 }).toFile(`output/Original-${imgName}`);
            }
        }
        else if (density && height && width && density <= 300) {
            if (height > 6000 && width > 6000) {
                await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize(width > height ? { width: 6000 } : { height: 6000 }).withMetadata({ density: density }).toFile(`output/Original-${imgName}`);
            }
            else if (height > 6000) {
                await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ height: 6000 }).withMetadata({ density: density }).toFile(`output/Original-${imgName}`);
            }
            else if (width > 6000) {
                await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: 6000 }).withMetadata({ density: density }).toFile(`output/Original-${imgName}`);
            }
            else {
                await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: width, height: height }).withMetadata({ density: density }).toFile(`output/Original-${imgName}`);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.resizeToOriginal = resizeToOriginal;
const resizeToMedium = async (input, imgName) => {
    try {
        const { density, width, height } = await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density)
            await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: Math.floor(width / 2), height: Math.floor(height / 2) }).withMetadata({ density: density }).toFile(`output/Medium-${imgName}`);
    }
    catch (error) {
        console.log(error);
    }
};
exports.resizeToMedium = resizeToMedium;
const resizeToSmall = async (input, imgName) => {
    try {
        const { density, width, height } = await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density)
            await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: Math.floor(width / 4), height: Math.floor(height / 4) }).withMetadata({ density: density }).toFile(`output/Small-${imgName}`);
    }
    catch (error) {
        console.log(error);
    }
};
exports.resizeToSmall = resizeToSmall;
const resizeForProductPage = async (input, imgName) => {
    try {
        const { density, width, height } = await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density)
            await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: Math.floor(width / 8), height: Math.floor(height / 8) }).composite([{ input: 'assets/logo.png', gravity: "center", }]).withMetadata({ density: 72 }).toFile(`output/ProductPage-${imgName}`);
    }
    catch (error) {
        console.log(error);
    }
};
exports.resizeForProductPage = resizeForProductPage;
const resizeForThumbnail = async (input, imgName) => {
    try {
        const { density, width, height } = await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density)
            await (0, sharp_1.default)(input, { limitInputPixels: 8585550069 }).resize({ width: 150 }).withMetadata({ density: 72 }).toFile(`output/Thumbnail-${imgName}`);
    }
    catch (error) {
        console.log(error);
    }
    exports.resizeForProductPage;
};
exports.resizeForThumbnail = resizeForThumbnail;
