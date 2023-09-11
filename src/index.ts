import express, { Express } from 'express';
import dotenv from 'dotenv';
import adminRouter from './routes/user/adminRoute.js';
import imageRouter from './routes/media/img.js';
import connectDB from './utils/connectDb.js';
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import cors from 'cors'
import videoRouter from './routes/media/video.js';
dotenv.config();
// add a router

console.log("hello")
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//tyr to remove it

app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/media/img", imageRouter);
app.use("/api/v1/media/video", videoRouter)

// temp
const secret = speakeasy.generateSecret({ length: 20 });
app.get('/qrcode', (req, res) => {

  console.log(secret);
  qrcode.toDataURL(secret.otpauth_url as string, (err, data) => {

    res.json({ src: data })

  })

});
app.post('/verify', (req, res) => {
  const { code } = req.body;
  const verified = speakeasy.totp.verify({
    secret: secret.ascii,
    encoding: "ascii",
    token: code, // Allow a 2-step window for code validation
  });

  res.json({ msg: verified })

});


const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL as string);
    app.listen(port, () =>
      console.log(
        `⚡️[server]: Server iS running at http://localhost:${port} as well as connected with database`
      )
    );
  } catch (error) {
    console.log(error);
  }
};
start();
