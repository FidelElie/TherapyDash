// ! Next and React
import { useState, useEffect } from "react";

// ! Assets
import sportsJSONData from "../../../../../assets/data/sports/data.json";

// ! Components
import DashboardCard from "../container";

type teamEntry = {
  goals: number | null,
}

const SportsCard = () => {
  const selectedTeam = "Juventus"
  const [teamData, setTeamData] = useState<teamEntry | null>(null);

  useEffect(() => {
    const juventusGames = sportsJSONData.filter(
      data => data.HomeTeam == "Juventus" || data.AwayTeam == "Juventus");

    const juventusGoalsStrings = juventusGames.map(
      result => "Juventus" == result.HomeTeam ? result.FTHG: result.FTAG);

    const juventusGoals = juventusGoalsStrings.map(string => parseInt(string, 10));

    const totalJuventusGoals = juventusGoals.reduce((a, b) => a + b);

    const juventusResults: teamEntry = { goals: totalJuventusGoals };

    setTeamData(juventusResults);
  }, []);

  return (
    <DashboardCard title="Sports" href="/dashboard/sports">
      <div className="flex flex-col items-center justify-center">
        <span className="text-lg mb-3">{ selectedTeam }</span>
        {
          teamData && (
            <span className="text-tertiary">Scored {teamData.goals} goals over the season</span>
          )
        }
      </div>
    </DashboardCard>
  )
}

export default SportsCard;
