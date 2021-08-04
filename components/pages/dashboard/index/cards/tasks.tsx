// ! Next and React
import { useState, useEffect } from "react";

// ! Library
import { db } from "../../../../../config/firebase.client";
import { User, Task } from "../../../../../lib/types";

// ! Components
import DashboardCard from "../container";
import { TaskComponent } from "../../../../../pages/dashboard/tasks";

const TasksCard = ({ user }: { user: User }) => {
  const [tasksLoading, setTasksLoading] = useState(true)
  const [currentUserTasks, setCurrentUserTasks] = useState<Task[]>([]);

  const retrieveRecentTasks = async () => {
    const tasksRef = db().collection("tasks");
    const userTasks = tasksRef.where("user", "==", user.id).limit(2);

    const tasksResponse = await userTasks.get();

    let tasksData: Task[] = [];
    if (!(tasksResponse.empty)) {
      tasksResponse.forEach(photo => tasksData.push(photo.data() as Task))
    }

    setCurrentUserTasks(tasksData);
    setTasksLoading(false);
  }


  useEffect(() => {
    if (tasksLoading) retrieveRecentTasks();
  }, [tasksLoading])


  return (
    <DashboardCard title="Tasks" href="/dashboard/tasks">
      <div className="flex flex-col items-center">
        {
          tasksLoading &&
          <div className="text-center w-full">
            <span className="text-lg text-secondary">Fetching Tasks... Please Wait</span>
          </div>
        }
        <div className="flex-grow flex flex-col w-full items-center">
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
    </DashboardCard>
  )
}

export default TasksCard;
