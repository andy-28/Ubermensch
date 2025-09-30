"use client";

import { useState, useEffect } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";

type Task = {
    ID: number;
    Title: string;
    Description: string | null;
    Status: string;
    Priority: string;
    DueDate: string | null;
    CreatedAt: string;
    IsInbox: boolean;
    Tags: string[] | null; // ✅ 支援標籤
};

const columns = {
    todo: "待辦",
    inprogress: "進行中",
    done: "完成",
};

const priorityOrder: Record<string, number> = {
    high: 1,
    normal: 2,
    low: 3,
};

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("normal");
    const [dueDate, setDueDate] = useState("");
    const [tags, setTags] = useState(""); // ✅ 新標籤輸入 (字串)
    const [selectedTags, setSelectedTags] = useState<string[]>([]); // ✅ 勾選現有標籤
    const [allTags, setAllTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("created");
    const [weeklyReport, setWeeklyReport] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // 載入任務
    async function fetchTasks() {
        const res = await fetch("/api/tasks");
        if (res.ok) {
            const data = await res.json();
            setTasks(data);
        }
    }

    // 載入標籤
    async function fetchTags() {
        const res = await fetch("/api/tags");
        if (res.ok) {
            const data = await res.json();
            setAllTags(data);
        }
    }

    // 建立任務
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const parsedTags = tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        const finalTags = [...new Set([...selectedTags, ...parsedTags])]; // 合併 + 去重

        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, priority, dueDate, tags: finalTags }),
        });

        if (res.ok) {
            setTitle("");
            setDescription("");
            setPriority("normal");
            setDueDate("");
            setTags("");
            setSelectedTags([]);
            fetchTasks();
            fetchTags(); // 更新全域標籤清單
        } else {
            alert("Failed to create task");
        }
    }

    // 更新任務狀態
    async function updateTaskStatus(id: number, status: string) {
        const res = await fetch("/api/tasks", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });

        if (res.ok) {
            fetchTasks();
        } else {
            alert("Failed to update task");
        }
    }

    // 移出 Inbox
    async function moveOutFromInbox(id: number) {
        const res = await fetch(`/api/tasks`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, isInbox: false, status: "todo" }),
        });

        if (res.ok) {
            fetchTasks();
        } else {
            alert("Failed to move task out of Inbox");
        }
    }

    // 拖拽結束
    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        const taskId = parseInt(draggableId);
        const newStatus = destination.droppableId;
        updateTaskStatus(taskId, newStatus);
    };

    // 取得週報
    async function fetchWeeklyReport() {
        const res = await fetch("/api/reports/weekly");
        if (res.ok) {
            const text = await res.text();
            setWeeklyReport(text);
        } else {
            alert("❌ 生成週報失敗");
        }
    }

    // 排序
    function sortTasks(tasks: Task[]): Task[] {
        return [...tasks].sort((a, b) => {
            if (sortBy === "dueDate") {
                if (!a.DueDate) return 1;
                if (!b.DueDate) return -1;
                return new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime();
            } else if (sortBy === "priority") {
                return priorityOrder[a.Priority] - priorityOrder[b.Priority];
            } else {
                return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
            }
        });
    }

    useEffect(() => {
        fetchTasks();
        fetchTags();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">任務管理 (Kanban + Tags)</h1>

            {/* 📥 Inbox */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Inbox</h2>
            <ul className="space-y-2">
                {tasks.filter(t => t.IsInbox).map((task) => (
                    <li key={task.ID} className="border p-3 rounded bg-yellow-50">
                        <h2 className="font-semibold">{task.Title}</h2>
                        <p className="text-sm text-gray-600">{task.Description}</p>
                        {task.Tags && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {task.Tags.map((tag, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => moveOutFromInbox(task.ID)}
                            className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                        >
                            移出 Inbox
                        </button>
                    </li>
                ))}
            </ul>

            {/* ➕ 新增任務 */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 mt-6">
                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full rounded"
                    required
                />
                <textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 w-full rounded"
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border p-2 w-full rounded"
                >
                    <option value="high">高</option>
                    <option value="normal">中</option>
                    <option value="low">低</option>
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                {/* 選取既有標籤 */}
                <label className="block text-sm font-semibold">標籤</label>
                <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                        <label key={tag} className="flex items-center gap-1 text-sm">
                            <input
                                type="checkbox"
                                checked={selectedTags.includes(tag)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedTags([...selectedTags, tag]);
                                    } else {
                                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                                    }
                                }}
                            />
                            {tag}
                        </label>
                    ))}
                </div>

                {/* 新增自訂標籤 */}
                <input
                    type="text"
                    placeholder="輸入新標籤，用逗號分隔 (例: EC, Bug)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create Task
                </button>
            </form>

            {/* 排序 & 週報 */}
            <div className="mb-4 flex gap-2">
                <label className="mr-2 text-sm font-semibold">排序方式：</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border p-2 rounded text-sm"
                >
                    <option value="created">建立時間</option>
                    <option value="dueDate">截止日期</option>
                    <option value="priority">優先順序</option>
                </select>

                <button
                    onClick={fetchWeeklyReport}
                    className="ml-4 bg-purple-500 text-white px-3 py-2 rounded text-sm"
                >
                    輸出週報
                </button>
            </div>

            {/* 📌 Kanban */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-3 gap-4">
                    {Object.entries(columns).map(([status, title]) => (
                        <Droppable droppableId={status} key={status}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-100 p-4 rounded min-h-[300px]"
                                >
                                    <h2 className="font-bold mb-3">{title}</h2>
                                    {sortTasks(tasks.filter((t) => t.Status === status && !t.IsInbox)).map(
                                        (task, index) => (
                                            <Draggable
                                                key={task.ID.toString()}
                                                draggableId={task.ID.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => setEditingTask(task)} // ✅ 點擊打開編輯彈窗
                                                        className="bg-white p-3 mb-2 rounded shadow cursor-pointer"
                                                    >
                                                        <h3 className="font-semibold">{task.Title}</h3>
                                                        <p className="text-sm text-gray-600">{task.Description}</p>
                                                        {task.Tags && (
                                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                                {task.Tags.map((tag, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    )}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {/* 📋 週報彈窗 */}
            {weeklyReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">📋 本週工作週報</h2>
                        <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded max-h-[400px] overflow-y-auto">
                            {weeklyReport}
                        </pre>
                        <button
                            onClick={() => setWeeklyReport(null)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            關閉
                        </button>
                    </div>
                </div>
            )}
            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">編輯任務</h2>

                        <input
                            type="text"
                            value={editingTask.Title}
                            onChange={(e) => setEditingTask({ ...editingTask, Title: e.target.value })}
                            className="border p-2 w-full mb-2 rounded"
                        />
                        <textarea
                            value={editingTask.Description || ""}
                            onChange={(e) => setEditingTask({ ...editingTask, Description: e.target.value })}
                            className="border p-2 w-full mb-2 rounded"
                        />

                        {/* 標籤編輯 */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {allTags.map((tag) => (
                                <label key={tag} className="flex items-center gap-1 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={editingTask.Tags?.includes(tag)}
                                        onChange={(e) => {
                                            let newTags = editingTask.Tags ? [...editingTask.Tags] : [];
                                            if (e.target.checked) {
                                                if (!newTags.includes(tag)) newTags.push(tag);
                                            } else {
                                                newTags = newTags.filter((t) => t !== tag);
                                            }
                                            setEditingTask({ ...editingTask, Tags: newTags });
                                        }}
                                    />
                                    {tag}
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingTask(null)}
                                className="px-4 py-2 rounded bg-gray-300"
                            >
                                取消
                            </button>
                            <button
                                onClick={async () => {
                                    await fetch("/api/tasks", {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            id: editingTask.ID,
                                            title: editingTask.Title,
                                            description: editingTask.Description,
                                            tags: editingTask.Tags,
                                        }),
                                    });
                                    setEditingTask(null);
                                    fetchTasks();
                                }}
                                className="px-4 py-2 rounded bg-blue-500 text-white"
                            >
                                儲存
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
