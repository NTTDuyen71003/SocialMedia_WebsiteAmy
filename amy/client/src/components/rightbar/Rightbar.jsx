import "./Rightbar.scss"
import Quangcao from "../../img/Quangcao.jpg"
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
// import { Authcontext } from "../../context/AuthContext.js";
// import { useQuery} from "@tanstack/react-query";
// import { makeRequest } from "../../axios.js";
// import axios from 'axios';






const Rightbar=()=>
{   
    const location = useLocation();
    
    useEffect(() => {
        const weatherDescriptionTranslations = {
          'clear sky': 'Trời quang',
          'few clouds': 'Có vài đám mây',
          'scattered clouds': 'Mây thưa thớt',
          'broken clouds': 'Mây nhiều',
          'overcast clouds': 'Mây che phủ',
          'light rain': 'Mưa nhẹ',
          'moderate rain': 'Mưa vừa',
          'heavy rain': 'Mưa to',
          'light snow': 'Tuyết nhẹ',
          'heavy snow': 'Tuyết rơi nhiều',
          'thunderstorm': 'Giông bão',
          'drizzle': 'Mưa phùn',
          'mist': 'Sương mù'
        };
      
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=Vietnam&units=metric&appid=690c8ab66984dee43bacf9df1d1324a5')
        .then(response => response.json())
        .then(data => {
            // Lấy dữ liệu hiện tại từ response
            const currentWeather = data.list[0];
            const iconCode = currentWeather.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
            const currentDate = new Date(currentWeather.dt * 1000);
            const weekdays = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
            const currentWeekday = weekdays[currentDate.getDay()];
            const weatherDescription = currentWeather.weather[0].description.toLowerCase();
            const translatedWeatherDescription = weatherDescriptionTranslations[weatherDescription] || weatherDescription;

            document.getElementById('weather-description').textContent = translatedWeatherDescription;
            document.getElementById('temperature').textContent = currentWeather.main.temp;
            document.getElementById('humidity').textContent = currentWeather.main.humidity;
            document.getElementById('weather-icon').src = iconUrl;
            document.getElementById('date').textContent = `${currentWeekday}, ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

            // Lấy dữ liệu cho ba ngày tiếp theo
            const nextDays = [8, 16, 24]; // Lấy mẫu thời gian thứ 8, 16 và 24 cho ba ngày tiếp theo
            nextDays.forEach((value, index) => {
            const nextWeather = data.list[value]; // mỗi ngày có 8 khoảng thời gian (3 giờ một lần), lấy mẫu thời gian thứ 8 của mỗi ngày
            const nextDate = new Date(nextWeather.dt * 1000);
            const nextWeekday = weekdays[nextDate.getDay()];
            const nextIconCode = nextWeather.weather[0].icon;
            const nextIconUrl = `http://openweathermap.org/img/w/${nextIconCode}.png`;

            document.getElementById(`day${index + 1}-date`).textContent = `${nextWeekday}`;
            document.getElementById(`day${index + 1}-icon`).src = nextIconUrl;
            });
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin thời tiết:', error);
        });
    }, []);


    return(
        <>
        {!location.pathname.startsWith('/profile/') && (
        <div className='rightbar'>
            <div className="container">
                <div className="item">
                    <h2>DỰ BÁO THỜI TIẾT</h2>
                    <p id="date"></p>
                    <div className="weather-container">
                    <div className="weather-info">
                        <p id="weather-description"></p>
                        <p>Độ ẩm: <span id="humidity"></span>%</p>
                    </div>
                    <img id="weather-icon" alt="Biểu tượng thời tiết" />   
                    </div>
                    <div id="temp">
                        <p>Nhiệt độ: <span id="temperature"></span>°C</p> 
                    </div>        
                    <div id="weather">
                    {[1, 2, 3].map(day => (
                        <div key={day}>          
                            <img id={`day${day}-icon`} alt="Biểu tượng thời tiết" />
                            <p id={`day${day}-date`}></p>
                        </div>  
                    ))} 
                    </div>           
                </div>

                <div id="commercial">
                <a href="https://www.hutech.edu.vn/" target="_blank" rel="noreferrer">
                    <img id="imgCom"src={Quangcao} alt="Quangcao" />
                </a>
                </div>   
           </div>
        </div>
        )}
        </>     
    );
};

export default Rightbar