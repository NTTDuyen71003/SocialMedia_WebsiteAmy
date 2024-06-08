//Layout giữa

import Posts from "../../components/posts/Posts"
import Sharestories from "../../components/sharestories/Sharestory"
import "./Home.scss"

const Home=()=>
{
    return(
        <div className="home"> 
            <Sharestories/>
            <Posts/>
        </div>
    )
}

export default Home