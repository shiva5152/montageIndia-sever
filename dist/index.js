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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRoute_js_1 = __importDefault(require("./routes/user/adminRoute.js"));
const img_js_1 = __importDefault(require("./routes/media/img.js"));
const connectDb_js_1 = __importDefault(require("./utils/connectDb.js"));
const cors_1 = __importDefault(require("cors"));
const video_js_1 = __importDefault(require("./routes/media/video.js"));
const audio_js_1 = __importDefault(require("./routes/media/audio.js"));
const express_status_monitor_1 = __importDefault(require("express-status-monitor"));
dotenv_1.default.config();
// add a router
console.log("hello");
const app = (0, express_1.default)();
app.use((0, express_status_monitor_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); //tyr to remove it
app.use("/api/v1/auth/admin", adminRoute_js_1.default);
app.use("/api/v1/media/img", img_js_1.default);
app.use("/api/v1/media/video", video_js_1.default);
app.use("/api/v1/media/audio", audio_js_1.default);
// console.log(process.env.MONGO_URL)
const port = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.MONGO_URL) {
            yield (0, connectDb_js_1.default)(process.env.MONGO_URL);
            app.listen(port, () => console.log(`⚡️[server]: Server iS running at http://localhost:${port} as well as connected with database`));
        }
    }
    catch (error) {
        console.log(error);
    }
});
start();
