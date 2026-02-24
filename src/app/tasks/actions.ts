"use server";

import { revalidatePath } from "next/cache";
import {
  TASK_STATUSES,
  createTask,
  updateTaskStatus,
  type TaskStatus,
} from "@/lib/tasks";

export async function createTaskAction(formData: FormData) {
  const rawTitle = formData.get("title");
  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";

  if (!title) {
    return;
  }

  await createTask({ title });
  revalidatePath("/tasks");
}

export async function updateTaskStatusAction(formData: FormData) {
  const rawTaskId = formData.get("taskId");
  const rawStatus = formData.get("status");

  const taskId = Number(rawTaskId);
  const status = typeof rawStatus === "string" ? rawStatus : "";
  const isValidStatus = TASK_STATUSES.includes(status as TaskStatus);

  if (!Number.isInteger(taskId) || taskId <= 0 || !isValidStatus) {
    return;
  }

  await updateTaskStatus({
    taskId,
    status: status as TaskStatus,
  });
  revalidatePath("/tasks");
}
