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

  useEffect(() => {
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
    if (photosLoading) retrieveUserPhotos();
  }, [photosLoading, user.id])

  return (
    <DashboardCard title="Photos" href="/dashboard/photos" hrefMessage="To Gallery">
      <div className="flex flex-col items-center">
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
                  <PhotoCard photo={photo} url={photo.url} key={photo.id} />)
              )
              :
              <span className="text-tertiary">No Photos Have Been Added</span>
            )
          }
        </div>
      </div>
    </DashboardCard>
  )
}

const PhotoCard = ({ photo, url }: { photo: Photo, url: string }) => (
  <div className="p-2 h-24 w-1/3">
    <img src={url} className="w-full h-full shadow-lg rounded-md" alt={`gallery-${photo.id}`} />
  </div>
)

export default PhotosCard;
