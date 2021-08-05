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
  const [newsError, setNewsError] = useState(false);

  const fetchNewsData = async () => {
    try {
      const data = await fetch("http://feeds.bbci.co.uk/news/rss.xml", {
        method: "GET",
        headers: {
          "Content-Type": "text/xml",
        }
      });

      const response = await data.json();
      setNewsData(response.results);
      setNewsError(false);
    } catch (error) {
      setNewsError(true);
    }
    setNewsLoading(false);
  }

  useEffect(() => {
    fetchNewsData();
  }, []);

  return (
    <DashboardCard title="News" hrefMessage="More">
      {
        newsLoading &&
          <span className="text-lg text-secondary">Fetching News Data</span>
      }
      {
        (newsData.length != 0 && !newsLoading && !newsError) && (
          <div className="flex flex-col items-center justify-center">
            <span className="mb-2 text-lg text-secondary text-center">
              { newsData[0].title }
            </span>
            <span className="text-sm text-center">
              { newsData[0].description }
            </span>
          </div>
        )
      }
      {
        (newsError && !newsLoading) && (
        <div className="flex flex-col items-center justify-center">
          <span className="text-tertiary text-center">Sorry An Error Occurred When Trying To Fetch The News</span>
        </div>
        )
      }
    </DashboardCard>
  )
}

export default NewsCard;
