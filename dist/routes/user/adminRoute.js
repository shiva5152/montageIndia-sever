"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_js_1 = require("../../controller/userController/admin.js");
const adminRouter = express_1.default.Router();
adminRouter.route("/login").post(admin_js_1.loginAdmin);
adminRouter.route("/logout").get(admin_js_1.logoutAdmin);
// adminRouter.route("/changePassword").patch(ChangePassword);
adminRouter.route("/getAllUser").get(admin_js_1.getAllAdmin);
adminRouter.route("/signup").post(admin_js_1.signupAdmin);
adminRouter.route("/updateRole").patch(admin_js_1.updateAdminRole);
adminRouter.route("/updateCategory").patch(admin_js_1.updateAdminCategory);
adminRouter.route("/:id").delete(admin_js_1.deleteAdmin);
adminRouter.route("/getCurrUser").get(admin_js_1.getCurrentAdmin);
exports.default = adminRouter;
