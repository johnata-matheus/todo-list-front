import type { ITask } from "@/interfaces/Itask";
import axios from "axios";

export const fetchAllTasks = async () => {
  const { data } = await axios.get('http://localhost:8000/tasks');
  return data;
}

export const createTask = async (taskData: ITask) => {
  const { data } = await axios.post('http://localhost:8000/tasks', taskData);
  return data;
}