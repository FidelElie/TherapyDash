interface User {
    id: string,
    username: string,
    email: string,
    picture: string,
    tasks: string[]
}

interface Photo {
  id: string,
  user: string,
  url: string
}

interface Task {
  id: string,
  user: string,
  message: string,
  completed: boolean,
}

export type { User, Photo, Task };

