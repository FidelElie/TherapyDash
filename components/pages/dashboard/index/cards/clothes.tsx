// ! Next and React
import { useState, useEffect } from "react";

// ! Components
import DashboardCard from "../container";
import { Pie } from "react-chartjs-2";

const clothesTypes = [
  { name: "Sweater", color: "#1A9B3B" },
  { name: "Raincoat", color: "#3380FF" },
  { name: "Jacket", color: "#BA1F18" },
  { name: "Hoodie", color: "#B518BA" },
  { name: "Blazer", color: "#E7AE35"},
  { name: "Jumper", color: "#A135E7"}
]

type clothesPropsType = {
  title: string,
  value: number,
  color: string
}

type chartPropsType = {
  labels: string[],
  datasets: {
    data: number[],
    backgroundColor: string[],
    hoverOffset: number
  }[]
}

const ClothesCard = () => {
  const [loadingData, setLoadingData] = useState(true);
  const [clothesData, setChartData] = useState<chartPropsType | null>(null);

  const fetchClothesData = async () => {
    const data = await fetch("/api/resource/clothes", {
      method: "GET",
    })
    const json = await data.json();
    const entries = json.payload;
    const dataEntries: clothesPropsType[] = clothesTypes.map(
      type => ({
        title: type.name,
        value:
          entries.filter(
            (entry: any) => (type.name).toLowerCase() == (entry.clothe).toLowerCase()).length,
        color: type.color
      })
    );

    const chartEntry = {
      labels: dataEntries.map((data: clothesPropsType) => data.title),
      datasets: [{
        data: dataEntries.map((data: clothesPropsType) => data.value),
        backgroundColor: dataEntries.map((data: clothesPropsType) => data.color),
        hoverOffset: 4
      }]
    }

    setChartData(chartEntry);
    setLoadingData(false);
  }

  useEffect(() => { fetchClothesData(); }, []);

  useEffect(() => { if (loadingData) fetchClothesData(); }, [loadingData])

  return (
    <DashboardCard title="Clothes">
      <div className="flex flex-col items-center justify-center w-full h-full">
        {
          loadingData &&
            <span className="text-lg text-secondary">Fetching Clothes Data</span>
        }
        {
          clothesData &&
            <Pie
              data={clothesData as any}
              style={{ width: "80%", height: "100%"}}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  }
                }
              }}
            />
        }
      </div>
    </DashboardCard>
  )
}

export default ClothesCard;
