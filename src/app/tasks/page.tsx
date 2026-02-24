import {
  createTaskAction,
  updateTaskStatusAction,
} from "@/app/tasks/actions";
import { TASK_STATUSES, listTasks } from "@/lib/tasks";

const STATUS_LABEL: Record<string, string> = {
  todo: "todo",
  inprogress: "inprogress",
  done: "done",
};

export default async function TasksPage() {
  const tasks = await listTasks();

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <form action={createTaskAction} className="flex gap-2">
          <input
            type="text"
            name="title"
            placeholder="Task title"
            required
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Add
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Task List</h2>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.ID}
              className="flex items-center justify-between gap-3 rounded border p-3"
            >
              <div>
                <p className="font-medium">{task.Title}</p>
                <p className="text-sm text-gray-600">
                  status: {task.Status} | priority: {task.Priority}
                </p>
              </div>
              <form action={updateTaskStatusAction}>
                <input type="hidden" name="taskId" value={task.ID} />
                <select
                  name="status"
                  defaultValue={task.Status}
                  className="rounded border px-2 py-1"
                >
                  {TASK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="ml-2 rounded border px-3 py-1 text-sm"
                >
                  Update
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
