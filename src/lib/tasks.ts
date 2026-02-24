import { prisma } from "@/lib/prisma";

export const TASK_STATUSES = ["todo", "inprogress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskListItem = {
  ID: number;
  Title: string;
  Status: string;
  Priority: string;
};

export async function listTasks(): Promise<TaskListItem[]> {
  return prisma.task.findMany({
    orderBy: { CreatedAt: "desc" },
    select: {
      ID: true,
      Title: true,
      Status: true,
      Priority: true,
    },
  });
}

export async function createTask(params: { title: string }) {
  return prisma.task.create({
    data: {
      Title: params.title,
      Status: "todo",
      Priority: "normal",
      IsInbox: true,
    },
  });
}

export async function updateTaskStatus(params: {
  taskId: number;
  status: TaskStatus;
}) {
  const completedAt = params.status === "done" ? new Date() : null;

  return prisma.task.update({
    where: { ID: params.taskId },
    data: {
      Status: params.status,
      CompletedAt: completedAt,
    },
  });
}
