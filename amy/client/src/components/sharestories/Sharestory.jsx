import "./Sharestory.scss";
import { Authcontext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { FcAddImage, FcVideoCall } from "react-icons/fc";
import { IoMdShareAlt } from "react-icons/io";
import { RiEmotionLaughLine } from "react-icons/ri";
import defaultUserPic from "../../img/defaultUserPic.jpg";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { makeRequest } from "../../axios";
import EmojiPicker from 'emoji-picker-react';

const Sharestories = () => {
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [postDesc, setDesc] = useState("");
  const { currentUser } = useContext(Authcontext);
  const queryClient = useQueryClient();
  const [showEmotions, setShowEmotions] = useState(false);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload/images", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const uploadVideo = async () => {
    try {
      const formData = new FormData();
      formData.append("file", video);
      const res = await makeRequest.post("/upload/videos", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDesc("");
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    let videoUrl = "";
  
    // Kiểm tra xem có file hình ảnh được chọn không
    if (file) {
      imgUrl = await upload();
    }
  
    // Kiểm tra xem có file video được chọn không
    if (video) {
      videoUrl = await uploadVideo();
    }
  
    // Gửi yêu cầu chỉ khi có mô tả bài viết
    if (postDesc || imgUrl || videoUrl) {
      mutation.mutate({ postDesc, img: imgUrl, video: videoUrl });
      setDesc(""); // Trả mô tả về trống sau khi post bài
      setFile(null); // Trả hình post về trống sau khi post bài
      setVideo(null); // Trả video về trống sau khi post bài
    } else {
      console.error("Không có nội dung để đăng.");
    }
  };
  

  const { data: sharestoriesUserData } = useQuery({
    queryKey: ["sharestories-user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + currentUser.id).then((res) => {
        return res.data;
      }),
  });

  const toggleEmotions = () => {
    setShowEmotions(!showEmotions);
  };

  const onEmojiClick = (emojiObject) => {
    setDesc(postDesc + emojiObject.emoji);
    setShowEmotions(false);
  };

  return (
    <div className="sharestories">
      <div className="container">
        <div className="top">
          <div className="left">
            {sharestoriesUserData && (
              <img src={sharestoriesUserData.profilePic ? "/upload/images/" + sharestoriesUserData.profilePic : defaultUserPic} alt="" />
            )}
            <input
              type="text"
              placeholder={`Bạn có muốn chia sẻ gì không?`}
              onChange={(e) => setDesc(e.target.value)}
              value={postDesc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
            {video && (
              <video className="file" controls src={URL.createObjectURL(video)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="file">
              <div className="item">
                <FcAddImage style={{ fontSize: '25px' }} />
                <span>Ảnh</span>
              </div>
            </label>
            <input type="file" id="video" accept="video/*" style={{ display: "none" }}
              onChange={(e) => setVideo(e.target.files[0])} />
            <label htmlFor="video">
              <div className="item">
                <FcVideoCall style={{ fontSize: "25px" }} />
                <span>Video</span>
              </div>
            </label>
            <div className="item" style={{ position: 'relative' }}>
            <div className="emotions" onClick={toggleEmotions} style={{ cursor: 'pointer' }}>
              <RiEmotionLaughLine style={{ fontSize: '25px', marginTop: '5px' }} />
            </div>
            <span onClick={toggleEmotions} style={{ cursor: 'pointer' }}>Cảm xúc</span>
            {showEmotions && (
              <div
                className="emotion-picker"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  zIndex: 1,
                  width: '350px', // Chỉnh chiều rộng bảng emotion
                  height: '350px', // Chỉnh chiều cao bảng emotion
                  overflow: 'auto', // Thêm thanh cuộn nếu cần thiết
                }}
              >
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>

          </div>
          <div className="right">
            <button type="submit" onClick={handleClick} disabled={!postDesc&& !file && !video}>
              <i className="icon"><IoMdShareAlt /></i>
              Chia sẻ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sharestories;
