import express from 'express';
import {
    loginAdmin,
    signupAdmin,
    deleteAdmin,
    updateAdminRole,
    logoutAdmin,
    getAllAdmin,
    getCurrentAdmin,
    updateAdminCategory
} from '../../controller/userController/admin.js';

const adminRouter = express.Router();

adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").get(logoutAdmin)
// adminRouter.route("/changePassword").patch(ChangePassword);

adminRouter.route("/getAllUser").get(getAllAdmin);
adminRouter.route("/signup").post(signupAdmin);
adminRouter.route("/updateRole").patch(updateAdminRole);
adminRouter.route("/updateCategory").patch(updateAdminCategory);
adminRouter.route("/:id").delete(deleteAdmin);
adminRouter.route("/getCurrUser").get(getCurrentAdmin);

export default adminRouter;
