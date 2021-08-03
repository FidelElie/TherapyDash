// ! Next and React
import { useState, useEffect } from "react";

// ! Library
import { db } from "../../../../../config/firebase.client";
import { User, Photo } from "../../../../../lib/types";

// ! Components
import DashboardCard from "../container";

const PhotosCard = ({ user }: {user: User }) => {
  const [photosLoading, setPhotosLoading] = useState(true)
  const [currentUserPhotos, setCurrentUserPhotos] = useState<Photo[]>([]);

  const retrieveUserPhotos = async () => {
    const photosRef = db().collection("photos");
    const userPhotos = photosRef.where("user", "==", user.id).limit(3);

    const photosResponse = await userPhotos.get();

    let photosData: Photo[] = [];
    if (!(photosResponse.empty)) {
      photosResponse.forEach(photo => photosData.push(photo.data() as Photo))
    }

    setCurrentUserPhotos(photosData);
    setPhotosLoading(false);
  }

  useEffect(() => {
    if (photosLoading) retrieveUserPhotos();
  }, [photosLoading])

  return (
    <DashboardCard title="Photos" href="/dashboard/photos">
      {
        photosLoading &&
          <div className="text-center w-full">
            <span className="text-lg text-secondary">Fetching Photos... Please Wait</span>
          </div>
      }
      <div className="flex w-full flex-wrap">
        {
          (!photosLoading) && (
            currentUserPhotos.length != 0 ? (
              currentUserPhotos.map(photo =>
                <PhotoCard url={photo.url} key={photo.id} />)
            )
            :
            <span className="text-tertiary">No Photos Have Been Added</span>
          )
        }
      </div>
    </DashboardCard>
  )
}

const PhotoCard = ({ url }: { url: string }) => (
  <div className="p-2 h-24 w-1/3">
    <img src={url} className="w-full h-full shadow-lg rounded-md" />
  </div>
)

export default PhotosCard;
