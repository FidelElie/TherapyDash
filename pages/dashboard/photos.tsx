// ! Next and React
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

// ! Library
import getServerAuth from "../../lib/auth/server";
import { db, storage } from "../../config/firebase.client";
import { User, Photo } from "../../lib/types";
import { newId } from "../../lib/utils";
import { useLoader } from "../../lib/providers/loader";

// ! Components
import AppLayout from "../../components/layouts/app";

export default function PhotosDashboard({ user }: { user: User }) {
  const { openLoader, closeLoader } = useLoader();
  const [fileData, setFileData] = useState<FileList | null>(null)
  const [photosLoading, setPhotosLoading] = useState(true)
  const [currentUserPhotos, setCurrentUserPhotos] = useState<Photo[]>([]);

  const retrieveUserPhotos = async () => {
    const photosRef = db().collection("photos");
    const userPhotos = photosRef.where("user", "==", user.id);

    const photosResponse = await userPhotos.get();

    let photosData: Photo[] = [];
    if (!(photosResponse.empty)) {
      photosResponse.forEach(photo => photosData.push(photo.data() as Photo))
    }

    setCurrentUserPhotos(photosData);
    setPhotosLoading(false);
  }

  const uploadPhotos = async () => {
    openLoader();
    const photosRef = db().collection("photos");
    const batch = db().batch();

    await Promise.all(
      Array.from(fileData as FileList).map(async data => {
        const id = newId();

        const storageRef = storage().ref();
        const storagePath = storageRef.child(`photos/${user.id}/${id}.${data.type.split("/")[0]}`);
        await storagePath.put(data);
        const url = await storagePath.getDownloadURL();

        batch.set(photosRef.doc(id), {
          id,
          user: user.id,
          url
        });
      })
    );

    await batch.commit();
    setFileData(null);
    setPhotosLoading(true);
    closeLoader();
  }

  useEffect(() => {
    if (fileData) {
      uploadPhotos();
    }
  }, [fileData]);

  useEffect(() => {
    if (photosLoading) retrieveUserPhotos();
  }, [photosLoading])

  return (
    <AppLayout user>
      <div className="flex flex-col flex-grow py-10 items-center">
        <div className="flex items-center justify-center">
          <h1 className="text-6xl text-white tracking-tighter mb-10">
            Photos
          </h1>
        </div>
        <div className="flex justify-between items-center w-full mb-10">
          <Link href="/dashboard">
            <a className="button link">
                Back To Home
            </a>
          </Link>
          <label htmlFor="picture" className="cursor-pointer button flex items-center justify-center">
            Upload Images
            <input
              id="picture"
              name="picture"
              type="file"
              className="sr-only"
              onChange={(event: ChangeEvent) => {
                const files = (event.target as HTMLInputElement).files;
                if (files) setFileData(files);
              }}
              multiple
            />
          </label>
        </div>
        {
          photosLoading &&
          <div className="flex-grow flex items-center justify-center">
            <span className="text-lg text-white">Fetching Photos... Please Wait</span>
          </div>

        }
        <div className="flex w-full flex-wrap">
            {
              (currentUserPhotos.length != 0 && !photosLoading) ?
                currentUserPhotos.map(photo =>
                  <PhotoCard url={photo.url} key={photo.id}/>)
                  :
                  <span className="text-white">No Photos Have Been Added</span>
            }
        </div>
      </div>
    </AppLayout>
  )
}

const PhotoCard = ({ url }: { url: string }) => (
  <div className="p-5 h-80 w-1/4">
    <img src={url} className="w-full h-full shadow-lg rounded-md"/>
  </div>
)

const getServerSideProps = getServerAuth()

export { getServerSideProps };
