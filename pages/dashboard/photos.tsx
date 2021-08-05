// ! Next and React
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

// ! Library
import getServerAuth from "../../lib/auth/server";
import { db, storage } from "../../config/firebase.client";
import { User, Photo } from "../../lib/types";
import { newId } from "../../lib/utils";
import { useLoader } from "../../lib/providers/loader";
import { resizeImage } from 'simple-image-resize';

// ! Components
import AppLayout from "../../components/layouts/app";

const supportedFileTypes = ["png", "jpeg", "jpg"];
const initialErrors = {
  "file/invalid-format": false,
}

export default function PhotosDashboard({ user }: { user: User }) {
  const { openLoader, closeLoader } = useLoader();
  const [currentUserPhotos, setCurrentUserPhotos] = useState<Photo[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true)
  const [errors, setErrors] = useState(initialErrors);

  const toggleFormError = (key: string, bool: boolean = true) => setErrors({
    ...errors, ... { [key]: bool }
  });
  const resetFormErrors = () => setErrors(initialErrors);

  const uploadPhotos = async (fileData: FileList | null) => {
    resetFormErrors();
    if (fileData) {
      if (fileData.length != 0) {
        openLoader();
        const photosRef = db().collection("photos");
        const batch = db().batch();

        const fileArray = Array.from(fileData as FileList);
        const fileTypeCheck = fileArray.map(file => {
          const singularFile = file;
          const splitPath = singularFile.name.split(".");
          const extension = splitPath[splitPath.length - 1];

          return supportedFileTypes.includes(extension);
        });

        if (fileTypeCheck.includes(false)) {
          toggleFormError("file/invalid-format");
          closeLoader();
          return;
        }

        await Promise.all(
          fileArray.map(async data => {
            const id = newId();

            const storageRef = storage().ref();
            const resizedData = await resizeImage(data, {
              maxHeight: 280,
              maxWidth: 280
            })
            const reference = `photos/${user.id}/${id}.${data.type.split("/")[0]}`
            const storagePath = storageRef.child(reference);
            await storagePath.put(resizedData);
            const url = await storagePath.getDownloadURL();

            batch.set(photosRef.doc(id), { id, user: user.id, url, ref: reference });
          })
        );

        await batch.commit();
        setPhotosLoading(true);
        closeLoader();
      }
    }
  }

  useEffect(() => {
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

    if (photosLoading) retrieveUserPhotos();
  }, [photosLoading, user.id]);

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
              accept={supportedFileTypes.map(type => `image/${type}`).join(", ")}
              onChange={(event: ChangeEvent) => {
                const files = (event.target as HTMLInputElement).files;
                uploadPhotos(files);
              }}
              multiple
            />
          </label>
        </div>
        {
          errors["file/invalid-format"] && (
            <div className="w-full text-center px-5 py-2 box-border rounded-md bg-white">
              <span className="text-tertiary mr-1">
                We only support uploading JPEGs and PNGs, please upload your image again.
              </span>
              <span className="text-secondary cursor-pointer" onClick={resetFormErrors}>
                Clear
              </span>
            </div>
          )
        }
        {
          photosLoading &&
          <div className="flex-grow flex items-center justify-center">
            <span className="text-lg text-white">Fetching Photos... Please Wait</span>
          </div>

        }
        <div className="flex w-full flex-wrap">
            {
              !photosLoading && (
                (currentUserPhotos.length != 0 && !photosLoading) ?
                  currentUserPhotos.map(photo =>
                    <PhotoCard
                      photo={photo}
                      setPhotosLoading={setPhotosLoading}
                      key={photo.id}
                    />
                  ) : (
                    <span className="text-white">No Photos Have Been Added</span>
                  )
              )
            }
        </div>
      </div>
    </AppLayout>
  )
}

type photoCardProps = {
  photo: Photo,
  setPhotosLoading: Function
}

const PhotoCard = ({ photo, setPhotosLoading }: photoCardProps) => {
  const deletePhoto = async () => {
    const photosRef = db().collection("photos");

    const storageRef = storage().ref();
    const storagePath = storageRef.child(photo.ref);

    await storagePath.delete();

    await photosRef.doc(photo.id).delete();

    setPhotosLoading(true);
  }

  return (
    <div className="p-5 h-80 w-1/4 relative">
      <img src={photo.url} className="w-full h-full shadow-lg rounded-md" alt={`gallery-${photo.id}`}/>
      <button className="button link absolute bottom-10 right-10" onClick={deletePhoto}>Delete</button>
    </div>
  )
}

const getServerSideProps = getServerAuth()

export { getServerSideProps };
