import express, { Express } from 'express';
import dotenv from 'dotenv';
import adminRouter from './routes/user/adminRoute.js';
import imageRouter from './routes/media/img.js';
import connectDB from './utils/connectDb.js';
import cors from 'cors'
import videoRouter from './routes/media/video.js';
import audioRouter from './routes/media/audio.js';
import status from 'express-status-monitor'

dotenv.config();
// add a router

console.log("hello")
const app: Express = express();
app.use(status());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//tyr to remove it

app.use("/api/v1/auth/admin", adminRouter);
app.use("/api/v1/media/img", imageRouter);
app.use("/api/v1/media/video", videoRouter)
app.use("/api/v1/media/audio", audioRouter)




// console.log(process.env.MONGO_URL)
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    if (process.env.MONGO_URL) {
      await connectDB(process.env.MONGO_URL);
      app.listen(port, () =>
        console.log(
          `⚡️[server]: Server iS running at http://localhost:${port} as well as connected with database`
        )
      );
    }

  } catch (error) {
    console.log(error);
  }
};
start();
