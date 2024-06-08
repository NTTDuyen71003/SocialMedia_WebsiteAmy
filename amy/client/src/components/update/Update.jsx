import "./Update.scss";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { FaIdCardAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaBookReader } from "react-icons/fa";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { RiTwitterXLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { useState} from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from "../../axios";

const Update = ({ setOpenUpdate, user }) => {
    const [background, setBackground] = useState(null);
    const [profile, setProfile] = useState(null);
    const queryClient = useQueryClient();
    const [err, setErr] = useState("");
    

    //dẫn đến noi lưu trữ
    const [texts, setTexts] = useState({
      name: user.name || "",
      location: user.location || "", 
      slogan: user.slogan || "",
      fb: user.fb || "",
      twitter: user.twitter || "",
      insta: user.insta || "",
      tiktok: user.tiktok || "",
      discord: user.discord || ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTexts((prev) => ({ ...prev, [name]: value }));
        setErr('');

        const urlPatterns = {
            fb: /^https:\/\/www\.facebook\.com\/[a-zA-Z0-9.-]+\/?$/,
            twitter: /^https:\/\/twitter\.com\/[a-zA-Z0-9_]{1,15}\/?$/,
            insta: /^https:\/\/www\.instagram\.com\/[a-zA-Z0-9._]+\/?$/,
            tiktok: /^https:\/\/www\.tiktok\.com\/@?[a-zA-Z0-9._]+\/?$/,
            discord: /^https:\/\/discord\.com\/users\/[a-zA-Z0-9]+\/?$/
        };

        if (urlPatterns[name]) {
            if (value && !urlPatterns[name].test(value)) {
                setErr(`Sai định dạng mạng xã hội cho ${name}`);
            } else {
                setErr('');
            }
        }
    };

    const upload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post("/upload/images", formData);
            return res.data
        } catch (err) {
            console.log(err);
        }
    }

    const mutation = useMutation({
        mutationFn: (user) => {
            return makeRequest.put("/users", user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            window.location.reload();
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        let bgUrl;
        let profileUrl;

        bgUrl = background ? await upload(background) : user.background;
        profileUrl = profile ? await upload(profile) : user.profilePic;

        if (texts.name === "") {
            setErr("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const urlPatterns = {
            fb: /^https:\/\/www\.facebook\.com\/[a-zA-Z0-9.-]+\/?$/,
            twitter: /^https:\/\/twitter\.com\/[a-zA-Z0-9_]{1,15}\/?$/,
            insta: /^https:\/\/www\.instagram\.com\/[a-zA-Z0-9._]+\/?$/,
            tiktok: /^https:\/\/www\.tiktok\.com\/@?[a-zA-Z0-9._]+\/?$/,
            discord: /^https:\/\/discord\.com\/users\/[a-zA-Z0-9]+\/?$/
        };

        for (let key in urlPatterns) {
            if (texts[key] && !urlPatterns[key].test(texts[key])) {
                setErr(`Sai định dạng mạng xã hội cho ${key}`);
                return;
            }
        }

        mutation.mutate({ ...texts, background: bgUrl, profilePic: profileUrl });
        setOpenUpdate(false);
    }

    const handleImageClick = (setter) => {
        document.getElementById("fileInput").click();
        document.getElementById("fileInput").onchange = (e) => {
            setter(e.target.files[0]);
        };
    }

    return (
        <div className="update">
            <button onClick={() => setOpenUpdate(false)} id="closeBtn">X</button>
            <h1>Cập nhật</h1> 
            <form>
                <span id="errSub">{err}</span>
                <div className="wrapper">
                    <div className="form-inputs">
                        <div className="input-boxImg">
                            <div className="input-field-Img" onClick={() => handleImageClick(setBackground)} value={texts.background}>
                                <span id="titleIn">Chọn ảnh bìa</span>
                                <img src={background ? URL.createObjectURL(background) : user.background} alt="Ảnh bìa" style={{ cursor: 'pointer', width: '100%', height: 'auto' }} />
                            </div>
                        </div>

                        <div className="input-boxImg">
                            <div className="input-field-Img" onClick={() => handleImageClick(setProfile)} value={texts.profilePic}>
                                <span id="titleIn">Chọn ảnh đại diện</span>
                                <img src={profile ? URL.createObjectURL(profile) : user.profilePic} alt="Ảnh đại diện" style={{ cursor: 'pointer', width: '100%', height: 'auto' }} />
                            </div>
                        </div>

                        <div className="input-box">
                            <input type="text" name="name" className="input-field" value={texts.name} onChange={handleChange} placeholder="Tên trang chủ" required />
                            <FaIdCardAlt className="icon" />
                        </div>

                        <div className="input-box">
                            <input type="text" name="location" className="input-field" value={texts.location} onChange={handleChange} placeholder="Nơi ở" />
                            <FaLocationDot className="icon" />
                        </div>

                        <div className="input-box">
                            <input type="text" name="slogan" className="input-field" value={texts.slogan} onChange={handleChange} placeholder="Châm ngôn" />
                            <FaBookReader className="icon" />
                        </div>

                        <div className="input-box">
                            <input type="text" name="fb" className="input-field" value={texts.fb} onChange={handleChange} placeholder="Đường dẫn Facebook" />
                            <FacebookRoundedIcon className="icon" style={{ color: 'blue' }} />
                        </div>

                        <div className="input-box">
                            <input type="text" name="twitter" className="input-field" value={texts.twitter} onChange={handleChange} placeholder="Đường dẫn Twitter" />
                            <RiTwitterXLine className="icon" style={{ color: '#02000c' }} />
                        </div>

                        <div className="input-box">
                            <input type="text" name="insta" className="input-field" value={texts.insta} onChange={handleChange} placeholder="Đường dẫn Instagram" />
                            <FaInstagram className="icon" style={{ color: 'azure', background: 'radial-gradient(circle at 33% 100%, #fed373 4%, #f15245 30%, #d92e7f 62%, #9b36b7 85%, #515ecf)', borderRadius: '30%' }} />
                        </div>

                        <div className="input-box">
                            <input type="text" name="tiktok" className="input-field" value={texts.tiktok} onChange={handleChange} placeholder="Đường dẫn TikTok" />
                            <FaTiktok className="icon" />
                        </div>

                        <div className="input-box">
                            <input type="text" name="discord" className="input-field" value={texts.discord} onChange={handleChange} placeholder="Đường dẫn Discord" />
                            <FaDiscord className="icon" style={{ color: '#5865F2' }} />
                        </div>

                        <div className="input-box">
                            <button className="input-submit" onClick={handleSubmit}>
                                <MdOutlineTipsAndUpdates />
                                <span>Cập nhật</span>
                            </button>
                        </div>
                    </div>
                </div>
                <input type="file" id="fileInput" style={{ display: 'none' }} />
            </form>
        </div>
    );
};

export default Update;
