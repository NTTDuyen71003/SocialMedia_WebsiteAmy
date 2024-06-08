import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import commentsRoutes from "./routes/comments.js";
import likesRoutes from "./routes/likes.js";
import relationshipsRoutes from "./routes/relationships.js";
import followsRoutes from "./routes/follows.js";
import multer from "multer";


const app = express();


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

//Post ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage })

app.post("/api/upload/images",upload.single("file"),(req,res)=>{
  const file = req.file;
  res.status(200).json(file.filename);
})


// Storage cho video
const videoFileFilter = (req, file, cb) => {
  // Kiểm tra định dạng của file
  if (!file.originalname.match(/\.(mp4|avi|mov|mkv)$/)) {
      return cb(new Error('Chỉ cho phép tải lên các file video.'));
  }
  cb(null, true);
};
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload/videos');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB
});
app.post("/api/upload/videos", uploadVideo.single("file", { limits: { fileSize: 1024 * 1024 * 1024 } }), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});


app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/relationships", relationshipsRoutes);
app.use("/api/follows", followsRoutes);

app.listen(8800, () => {
  console.log("API đang hoạt động...");
});