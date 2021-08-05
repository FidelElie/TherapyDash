// ! Next and React
import { useState, useEffect } from "react";

// ! Components
import DashboardCard from "../container";

const conditionMap: { [key: string]: string } = {
  clouds: "https://firebasestorage.googleapis.com/v0/b/therapydash---development.appspot.com/o/website%2Fclouds.png?alt=media&token=9f83816c-0949-4515-aa11-8699b190ae00",
  rain: "https://firebasestorage.googleapis.com/v0/b/therapydash---development.appspot.com/o/website%2Frain.png?alt=media&token=3dfb996c-d290-4891-be61-0dc1d09b804f",
  sun: "https://firebasestorage.googleapis.com/v0/b/therapydash---development.appspot.com/o/website%2Fsun.png?alt=media&token=9aec6e82-481c-45ad-b2a9-e5402ff77427"
}

const WeatherCard = () => {
  const [geolocationActive, setGeoLocationActive] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);

  const fetchWeatherData = async (
    { latitude, longitude }: { latitude: number, longitude: number }) => {

    const data = await fetch("/api/resource/weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude, longitude })
    });


    const response = await data.json();
    console.log(response)
    setWeatherData(response)
  }

  useEffect(() => {
    const getGeoLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => fetchWeatherData(position.coords));
      } else {
        setGeoLocationActive(false);
      }
    }

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
                className="w-12 h-auto"
                src={conditionMap[(weatherData.weather[0].main).toLowerCase()]}
                alt={weatherData.weather[0].main}
              />
            </>
          )
        }
        <span className="text-sm text-tertiary text-center mt-3">
          Any Problems With Geolocation Re-enable by clicking
          <span className="ml-1 text-secondary cursor-pointer" onClick={() => setGeoLocationActive(true)}>
            here
          </span>.
        </span>
      </div>
    </DashboardCard>
  )
}

export default WeatherCard;
