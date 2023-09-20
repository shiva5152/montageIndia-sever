import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
});
export const auth = app.auth()
