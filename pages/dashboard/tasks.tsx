// ! Next and React
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

// ! Library
import getServerAuth from "../../lib/auth/server";
import { db } from "../../config/firebase.client";
import { User, Task } from "../../lib/types";
import { newId } from "../../lib/utils";

// ! Components
import AppLayout from "../../components/layouts/app";

type taskComponentProps = {
  task: Task,
  setTasksLoading: Function,
  index: number
}

export default function TasksDashboard({ user }: { user: User }) {
  const [tasksLoading, setTasksLoading] = useState(true)
  const [currentUserTasks, setCurrentUserTasks] = useState<Task[]>([]);

  const [taskText, setTaskText] = useState("");

  const retrieveUserTasks = async () => {
    const tasksRef = db().collection("tasks");
    const userPhotos = tasksRef.where("user", "==", user.id);

    const photosResponse = await userPhotos.get();

    let photosData: Task[] = [];
    if (!(photosResponse.empty)) {
      photosResponse.forEach(photo => photosData.push(photo.data() as Task))
    }

    setCurrentUserTasks(photosData);
    setTasksLoading(false);
  }

  const addTask = async () => {
    const id = newId();
    const tasksRef = db().collection("tasks");
    await tasksRef.doc(id).set({
      message: taskText,
      user: user.id,
      id,
      completed: false
    });
    setTaskText("");
    setTasksLoading(true);
  }

  useEffect(() => {
    if (tasksLoading) retrieveUserTasks();
  }, [tasksLoading]);

  return (
    <AppLayout>
      <div className="flex flex-col flex-grow py-10 items-center">
        <div className="flex items-center justify-center">
          <h1 className="text-6xl text-white tracking-tighter mb-10">
            Tasks
          </h1>
        </div>
        <div className="flex justify-between items-center w-full mb-10">
          <Link href="/dashboard">
            <a className="button link">
              Back To Home
            </a>
          </Link>
        </div>
        {
          tasksLoading &&
            <div className="flex-grow flex items-center justify-center">
              <span className="text-lg text-white">Fetching Tasks... Please Wait</span>
            </div>
        }
        <div className="flex-grow w-full overflow-y-auto">
          <div className="w-full flex flex-col items-center">
            {
              (!tasksLoading) && (
                currentUserTasks.length != 0 ?
                  currentUserTasks.map((task, index) =>
                    <TaskComponent
                      task={task}
                      index={index}
                      setTasksLoading={setTasksLoading}
                      key={task.id}
                    />)
                  :
                  <span className="text-white">No Tasks Have Been Added</span>
              )
            }
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex-grow">
            <label htmlFor="message" className="sr-only">Message</label>
            <input
              className="input w-full"
              id="message"
              placeholder="Message"
              value={taskText}
              onChange={(event: ChangeEvent) => setTaskText((event.target as HTMLInputElement).value)}
            />
          </div>
          <button className="ml-3 button bg-secondary text-white" onClick={addTask}>Add Task</button>
        </div>
      </div>
    </AppLayout>
  )
}

const TaskComponent = ({ task, index, setTasksLoading }: taskComponentProps) => {
  const toggleTask = async () => {
    const taskReference = db().collection("tasks");
    await taskReference.doc(task.id).update({ completed: !task.completed});
    setTasksLoading(true);
  }

  const deleteTask = async () => {
    const taskReference = db().collection("tasks");
    await taskReference.doc(task.id).delete();
    setTasksLoading(true);
  }

  return (
    <div className="w-full p-2">
      <div className="flex rounded-md bg-white shadow w-full px-3 py-2 items-center">
        <div className="mr-3 h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">{ index }</span>
        </div>
        <div className="flex-grow">
          <span className="text-tertiary">{ task.message }</span>
        </div>
        <input className="ml-5 p-2 mr-5 h-6 w-6 rounded-full bg-tertiary" type="checkbox" checked={task.completed} onChange={toggleTask}/>
        <button className="button alternate" onClick={deleteTask}>Delete</button>
      </div>
    </div>
  )
}

const getServerSideProps = getServerAuth()

export { getServerSideProps, TaskComponent };
