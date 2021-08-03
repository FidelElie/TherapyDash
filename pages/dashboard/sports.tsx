// ! Next and React
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

// ! Assets
import sportsJSONData from "../../assets/data/sports/data.json";

// ! Library
import getServerAuth from "../../lib/auth/server";

// ! Components
import AppLayout from "../../components/layouts/app";

export default function SportsDashboard() {
  const [selectedTeam, setSelectedTeam] = useState("Juventus");
  const [beatenTeams, setBeatenTeams] = useState<string[] | null>(null);
  const [teamInput, setTeamInput] = useState("");

  const determineBeatenTeams = () => {
    const team = selectedTeam.toLowerCase();

    if (
      Array.from(new Set(sportsJSONData.map(game => game.HomeTeam))).includes(selectedTeam)) {
      setBeatenTeams(null);
      return;
    }

    const juventusGames = sportsJSONData.filter(
      data => (
        (data.HomeTeam).toLowerCase() == team || (data.AwayTeam).toLowerCase() == team)
    );

    const teamsBeaten = juventusGames.filter(game => {
      const teamIsHome = selectedTeam == game.HomeTeam;

      return teamIsHome ? game.FTHG > game.FTAG : game.FTAG > game.FTHG;
    })
    .map(game => game.HomeTeam == selectedTeam ? game.AwayTeam : game.HomeTeam);

    const teamsBeatenUnique  = Array.from(new Set(teamsBeaten));
    setBeatenTeams(teamsBeatenUnique);

  }

  useEffect(() => { determineBeatenTeams(); }, [selectedTeam])

  return (
    <AppLayout user>
      <div className="flex flex-col flex-grow py-10 items-center">
        <div className="flex items-center justify-center">
          <h1 className="text-6xl text-white tracking-tighter mb-10">
            Data For {selectedTeam}
          </h1>
        </div>
        <div className="flex justify-between items-center w-full mb-10">
          <Link href="/dashboard">
            <a className="button link">
              Back To Home
            </a>
          </Link>
        </div>
        <div className="flex-grow w-full overflow-y-auto">
          <div className="w-full flex flex-col items-center">
            {
              beatenTeams && (
                beatenTeams.length != 0 ? (
                  beatenTeams.map(team =>
                    <span className="mb-2 text-white" key={team}>
                      { team }
                    </span>
                    )
                ) : (
                  <span className="text-primary">No Data Found For This Team</span>
                )
              )
            }
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex-grow">
            <label htmlFor="message" className="sr-only">Message</label>
            <input
              className="input w-full"
              id="team"
              placeholder="Team"
              value={teamInput}
              onChange={(event: ChangeEvent) => setTeamInput((event.target as HTMLInputElement).value)}
            />
          </div>
          <button className="ml-3 button bg-secondary text-white" onClick={() => {
            setSelectedTeam(teamInput);
            setTeamInput("");
          }}>Search For Team</button>
        </div>
      </div>
    </AppLayout>
  )
}

const getServerSideProps = getServerAuth()

export { getServerSideProps };
