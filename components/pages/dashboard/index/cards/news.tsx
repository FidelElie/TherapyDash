// ! Next and React
import { useState, useEffect } from "react";

// ! Components
import DashboardCard from "../container";

type newsEntry = {
  title: string,
  href: string,
  description: string,
}

const NewsCard = () => {
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsData, setNewsData] = useState<newsEntry[] | []>([]);

  const fetchNewsData = async () => {
    const data = await fetch("/api/resource/news", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const response = await data.json();
    setNewsData(response.results);
    setNewsLoading(false);
  }

  useEffect(() => {
    fetchNewsData();
  }, []);

  return (
    <DashboardCard title="News" hrefMessage="All Tasks">
      {
        newsLoading &&
          <span className="text-lg text-secondary">Fetching News Data</span>
      }
      {
        (newsData.length != 0 && !newsLoading) ? (
          <div className="flex flex-col items-center justify-center">
            <span className="mb-2 text-lg text-secondary text-center">
              { newsData[0].title }
            </span>
            <span className="text-sm text-center">
              { newsData[0].description }
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span className="text-tertiary">Sorry An Error Occurred When Trying To Fetch The News</span>
          </div>
        )
      }
    </DashboardCard>
  )
}

export default NewsCard;
