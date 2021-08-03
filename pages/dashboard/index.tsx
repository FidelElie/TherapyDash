// ! Library
import getServerAuth from "../../lib/auth/server";
import { User } from "../../lib/types";

// ! Components
import AppLayout from "../../components/layouts/app";
import WeatherCard from "../../components/pages/dashboard/index/cards/weather";
import NewsCard from "../../components/pages/dashboard/index/cards/news";
import SportsCard from "../../components/pages/dashboard/index/cards/sports";
import PhotosCard from "../../components/pages/dashboard/index/cards/photos";
import TasksCard from "../../components/pages/dashboard/index/cards/tasks";
import ClothesCard from "../../components/pages/dashboard/index/cards/clothes";

export default function Dashboard({ user }: { user: User }) {
  return (
    <AppLayout center>
      <div className="flex-grow flex flex-col py-10 items-center">
        <h1 className="text-6xl text-white tracking-tighter mb-10">
          Good Day { user.username }
        </h1>
        <div className="flex flex-wrap w-full flex-grow">
          <WeatherCard/>
          <NewsCard/>
          <SportsCard/>
          <PhotosCard user={user}/>
          <TasksCard user={user}/>
          <ClothesCard/>
        </div>
      </div>
    </AppLayout>
  )
}

const getServerSideProps = getServerAuth()

export { getServerSideProps };
