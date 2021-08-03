import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const weatherApiKey = process.env.OPEN_WEATHER_API_KEY;
    const weatherLat = req.body.latitude;
    const weatherLong = req.body.longitude;

    const queryString = `?lat=${weatherLat}&lon=${weatherLong}&appid=${weatherApiKey}&units=metric`;


    const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather${queryString}`);
    const weatherResponse = await weatherData.json();


    res.status(200).json(weatherResponse);
}
