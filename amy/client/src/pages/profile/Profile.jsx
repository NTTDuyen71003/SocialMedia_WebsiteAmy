import "./Profile.scss"
// import Nhao from "../../img/NhaoNhao.jpg"
// import Nhaoback from "../../img/BackgroundNhao.jpg"
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import TryOutlinedIcon from '@mui/icons-material/TryOutlined';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { RiTwitterXLine } from "react-icons/ri";
import { CiInstagram } from "react-icons/ci";
import { FaTiktok } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { SlUserFollowing } from "react-icons/sl";
import { SlUserFollow } from "react-icons/sl";
import defaultUserPic from "../../img/defaultUserPic.jpg";
import defaultUserBack from "../../img/defaultUserBack.jpg";
import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update"
import { useQuery,useQueryClient,useMutation} from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { Authcontext } from "../../context/AuthContext.js";



const Profile=()=>
{

    const userID=parseInt(useLocation().pathname.split("/")[2]);
    const {currentUser}=useContext(Authcontext);
    const queryClient = useQueryClient();
    const [openUpdate,setOpenUpdate]=useState(false);
    
    
    const { isPending,data } = useQuery({
        queryKey: ['user'],
        queryFn: () =>
           makeRequest.get("/users/find/"+userID).then((res)=>{
            return res.data;
        })
    });


    const { isPending:rIsPending,data:relationshipData } = useQuery({
        queryKey: ['relationship'],
        queryFn: () =>
           makeRequest.get("/relationships?followedUserID="+userID).then((res)=>{
            return res.data;
        })
    });


    const mutation = useMutation({
        mutationFn: (following) => {
            if(following)return makeRequest.delete("/relationships?userID="+ userID); // Sử dụng hàm mutationFn của bạn
            return makeRequest.post("/relationships", {userID});
        },
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['relationship'] }); // Sử dụng key query của bạn
        },
    });


    const handleFollow=()=>
    {
        mutation.mutate(relationshipData.includes(currentUser.id));
    }


    //Sự kiện không hiển thị điều gì nếu người dùng chưa update link cho các mxh khác(nghĩa là link rỗng sẽ ko bấm dc)
    const handleClick = (event,fieldName) => {
        if (!data?.[fieldName]) {
          event.preventDefault();
        }
    };


    return(
        <div className="profile">
            {isPending?(
            "Đang tải...")
            :(
            <>
            <div className="images">
                <img src={data?.background ? "/upload/images/" + data?.background : defaultUserBack} alt="" className="background"/>
                <img src={data?.profilePic ? "/upload/images/" + data?.profilePic : defaultUserPic} alt="" className="profilePic"/>
            </div>
            <div className="profileContainer">
                <div className="uInfo">
                    <div className="left">
                        <a href={data?.fb} onClick={(event) => handleClick(event, "fb")} style={{cursor: data?.fb ? 'pointer' : 'default'}}>
                            <FacebookRoundedIcon fontSize="large" style={{ color: 'blue' }}/>
                        </a>

                        <a className="Twitter"href={data?.twitter} onClick={(event) => handleClick(event, "twitter")} style={{cursor: data?.twitter ? 'pointer' : 'default'}}>
                            <RiTwitterXLine style={{ fontSize: '32px'}}/>
                        </a>

                        <a className="Insta" href={data?.insta} onClick={(event) => handleClick(event, "insta")} style={{cursor: data?.insta ? 'pointer' : 'default'}}>
                            <CiInstagram style={{ fontSize: '32px'}}/>
                        </a>

                        <a className="Tiktok" href={data?.tiktok} onClick={(event) => handleClick(event, "tiktok")} style={{cursor: data?.tiktok ? 'pointer' : 'default'}}>
                            <FaTiktok style={{ fontSize: '32px' }} />
                        </a>

                        <a className="Dis" href={data?.discord} onClick={(event) => handleClick(event, "discord")} style={{cursor: data?.discord ? 'pointer' : 'default'}}>
                            <FaDiscord style={{ fontSize: '32px' }} />
                        </a>
                    </div>

                    <div className="center">
                        <span className="Name">{data?.name}</span>
                        <div className="info">
                            <div className="item">
                                <LocationOnRoundedIcon style={{ color:'#a5554a'}}/>
                                <span>{data?.location}</span>
                            </div>
                            <div className="item">
                                <span>{data?.slogan}</span>
                            </div>
                        </div>

                        {rIsPending?(
                        "Đang tải...")
                        : userID === currentUser.id ? (
                        <button onClick={()=>setOpenUpdate(true)}>
                                <MdOutlineTipsAndUpdates id="icon"/>
                            Cập nhật
                        </button>
                        ) : (
                            <button type="submit" onClick={handleFollow}>
                            {relationshipData && relationshipData.includes(currentUser.id) ? (
                              <>
                                <SlUserFollowing id="icons"/>
                                Đang theo dõi
                              </>
                            ) : (
                              <>
                                <SlUserFollow id="icons"/>
                                Theo dõi  
                              </>
                            )}
                          </button>
                        )}
                    </div>
                    
                    <div className="right">
                        <TryOutlinedIcon/>
                        <ExpandMoreRoundedIcon/>
                    </div>
                </div>
                <Posts userID={userID}/>
            </div>
            </>
            )}
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/> }        
        </div>
    )
}

export default Profile