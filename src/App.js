import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { CITIES } from "./helpers/constants.js";
import { range, addOffSet } from "./helpers/helperFunctions.js";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";

import "./App.scss";

function App() {
  const cities = CITIES;
  const [citySelected, setCitySelected] = useState({
    name: "London",
    lat: 51.5072,
    lng: 0.1276,
  });
  const today = new Date(Date.now());
  const [dailyData, setDailyData] = useState({});
  const [hourlyData, setHourlyData] = useState({});
  const [currentData, setCurrentData] = useState({});
  const [loader, setloader] = useState(true);
  const url = "https://api.open-meteo.com/v1/forecast";

  useEffect(() => {
    setloader(true);
    const params = {
      latitude: citySelected.lat,
      longitude: citySelected.lng,
      hourly: "temperature_2m",
      daily: ["temperature_2m_max", "sunrise", "sunset", "temperature_2m_min"],
      current: ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"],
      timezone: "America/Toronto",
    };
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        setHourlyData(res.data.hourly);
        setDailyData(res.data.daily);
        setCurrentData({
          ...res.data.current,
          timeOffset: res.data.utc_offset_seconds,
        });
        setloader(false);
      });
  }, [citySelected]);

  return (
    <div>
      {loader ? (
        <div className="loaderContainer">
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#fff"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="App">
          <div className="cityNav">
            {cities.map((e, index) => {
              return (
                <div
                  className="cityName"
                  key={index}
                  onClick={() => {
                    console.log(e);
                    setCitySelected(e);
                  }}
                >
                  {e.name}
                </div>
              );
            })}
          </div>
          <div className="searchDiv">
            <input type="text" placeholder="Search for city" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40"
              height="40"
              viewBox="0,0,256,256"
            >
              <g
                fill="#ffffff"
                fillRule="nonzero"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                strokeDasharray=""
                strokeDashoffset="0"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
              >
                <g transform="scale(5.33333,5.33333)">
                  <path d="M20.5,6c-7.99037,0 -14.5,6.50964 -14.5,14.5c0,7.99036 6.50963,14.5 14.5,14.5c3.45636,0 6.63371,-1.22096 9.12891,-3.25l9.81055,9.81055c0.37623,0.39185 0.9349,0.54969 1.46055,0.41265c0.52565,-0.13704 0.93616,-0.54754 1.07319,-1.07319c0.13704,-0.52565 -0.0208,-1.08432 -0.41265,-1.46055l-9.81055,-9.81055c2.02904,-2.4952 3.25,-5.67255 3.25,-9.12891c0,-7.99036 -6.50963,-14.5 -14.5,-14.5zM20.5,9c6.36905,0 11.5,5.13096 11.5,11.5c0,3.10261 -1.2238,5.90572 -3.20898,7.9707c-0.12237,0.08994 -0.23037,0.19794 -0.32031,0.32031c-2.06499,1.98518 -4.86809,3.20898 -7.9707,3.20898c-6.36905,0 -11.5,-5.13096 -11.5,-11.5c0,-6.36904 5.13095,-11.5 11.5,-11.5z"></path>
                </g>
              </g>
            </svg>
          </div>
          <div className="dateTime">
            {today.toDateString()} | Local Time:{" "}
            {today.toLocaleTimeString("en-US", { hour12: true })}
          </div>
          <div className="cityNameSelected">{citySelected.name}</div>
          <div className="mainTempratureContainer">
            <div className="tempDiv">{currentData.temperature_2m}&deg;C</div>
            <div className="extraInfoDiv">
              <div>
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/hygrometer.png"
                  alt="hygrometer"
                />
                <span>Humidity: {currentData.relative_humidity_2m}%</span>
              </div>
              <div>
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/wind--v1.png"
                  alt="wind--v1"
                />
                Wind: {currentData.wind_speed_10m} km/h
              </div>
            </div>
          </div>
          <div className="highSunContainer">
            <div>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/sunrise--v1.png" />
              Rise:
              {addOffSet(
                new Date(dailyData.sunrise[0]).getTime(),
                parseInt(currentData.timeOffset)
              )}
            </div>
            <div>
              <img src="https://img.icons8.com/ios-filled/50/FFFFFF/sunset--v1.png" />
              Set:
              {addOffSet(
                new Date(dailyData.sunset[0]).getTime(),
                parseInt(currentData.timeOffset)
              )}
            </div>
            <div>
              <img src="https://img.icons8.com/ios/50/FFFFFF/sun--v1.png" />
              High: {dailyData.temperature_2m_max[0]}&deg;C
            </div>
            <div>
              <img src="https://img.icons8.com/ios/50/FFFFFF/sun--v1.png" />
              Low: {dailyData.temperature_2m_min[0]}&deg;C
            </div>
          </div>
          <div className="hourlyDivContainer">
            <div className="title">HOURLY FORECAST</div>
            <div className="hourlyTempDiv">
              {hourlyData.time
                .filter(
                  (time) =>
                    new Date().toDateString() === new Date(time).toDateString()
                )
                .filter(
                  (time) => new Date(time).getHours() >= new Date().getHours()
                )
                .map((e, index) => {
                  return (
                    <div className="hourlyTemp" key={index}>
                      <div>
                        {new Date(e).toLocaleTimeString("en-US", {
                          hour12: true,
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div>{hourlyData.temperature_2m[index]}&deg;C</div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="dailyDivContainer">
            <div className="title">DAILY FORECAST</div>
            <div className="dailyTempContainer">
              {dailyData.temperature_2m_max.map((e, index) => {
                return (
                  <div className="dailyTempDiv" key={index}>
                    <div>
                      {new Date(dailyData.time[index]).toDateString("en-us")}
                    </div>
                    <div>{e}&deg;C</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
