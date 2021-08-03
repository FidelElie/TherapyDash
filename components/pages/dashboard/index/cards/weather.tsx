// ! Next and React
import { useState, useEffect } from "react";

// ! Components
import DashboardCard from "../container";

const WeatherCard = () => {
  const [geolocationActive, setGeoLocationActive] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);

  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => fetchWeatherData(position.coords));
    } else {
      setGeoLocationActive(false);
    }
  }

  const fetchWeatherData = async (
    { latitude, longitude }: { latitude: number, longitude: number }) => {

    const data = await fetch("/api/resource/weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude,
        longitude
      })
    });

    const response = await data.json();
    setWeatherData(response)
  }

  useEffect(() => {
    getGeoLocation();
  }, []);

  useEffect(() => {
    if (geolocationActive) getGeoLocation()
  }, [geolocationActive]);

  return (
    <DashboardCard title="Weather">
      <div className="flex flex-col items-center">
        {!geolocationActive && (
          <>
            <span className="mb-5">Geo Location Not Active</span>
            <button className="button alternate" onClick={() => setGeoLocationActive(true)}>
              Activate
            </button>
          </>
        )}
        {
          (!weatherData && geolocationActive) &&
          <span className="text-lg text-secondary">Fetching Weather Data</span>
        }
        {
          (weatherData && geolocationActive) && (
            <>
              <span className="mb-2 tracking-tighter text-lg">
                {weatherData.name}
              </span>
              <span className="text-tertiary mb-4">
                {weatherData.main.temp} Degrees Celcius - {weatherData.weather[0].main}
              </span>
              <img
                className="w-24 h-auto"
                src={`./images/${(weatherData.weather[0].main).toLowerCase()}.png`}
              />
            </>
          )
        }
      </div>
    </DashboardCard>
  )
}

export default WeatherCard;
