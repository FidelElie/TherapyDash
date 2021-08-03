// ! Next and React
import { useState, useEffect, useRef } from "react";

// ! Components
import DashboardCard from "../container";

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

const ClothesCard = () => {
  const [loadingData, setLoadingData] = useState(true);
  const [clothesData, setClothesData] = useState<any>(null);

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

    setClothesData(dataEntries);
    setLoadingData(false);
  }

  useEffect(() => {
    fetchClothesData();
  }, []);

  useEffect(() => {
    if (loadingData) fetchClothesData();
  }, [loadingData])

  return (
    <DashboardCard title="Clothes">
      <div className="flex flex-col items-center">
        {
          loadingData &&
            <span className="text-lg text-secondary">Fetching Clothes Data</span>
        }
        {
          clothesData && (
            <>
              <span className="text-secondary text-lg mb-4">
                Out Of A Total Of {
                  clothesData.map((data: clothesPropsType) => data.value).reduce((a: number, b: number) => a + b)
                }
              </span>
              <div className="flex flex-wrap justify-center">
                {
                  clothesData.map((data: clothesPropsType) => (
                    <div className="pb-1 px-2" key={data.title}>
                      <span className="text-tertiary">{ data.title }s : { data.value }</span>
                    </div>
                  ))
                }
              </div>
            </>
          )
        }
      </div>
    </DashboardCard>
  )
}

export default ClothesCard;
