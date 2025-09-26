"use client";

import { useState, useEffect } from "react";

type Task = {
    ID: number;
    Title: string;
    Description: string | null;
    Status: string;
    Priority: string;
    DueDate: string | null;
    CreatedAt: string;
};

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // 載入任務列表
    async function fetchTasks() {
        const res = await fetch("/api/tasks");
        if (res.ok) {
            const data = await res.json();
            setTasks(data);
        }
    }

    // 提交表單
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
        });

        if (res.ok) {
            setTitle("");
            setDescription("");
            fetchTasks(); // 新增成功後重新載入
        } else {
            alert("Failed to create task");
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">任務管理</h1>

            {/* 新增任務表單 */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create Task
                </button>
            </form>

            {/* 任務列表 */}
            <ul className="space-y-2">
                {tasks.map((task) => (
                    <li key={task.ID} className="border p-3 rounded shadow-sm">
                        <h2 className="font-semibold">{task.Title}</h2>
                        <p className="text-sm text-gray-600">{task.Description}</p>
                        <p className="text-xs text-gray-400">
                            狀態: {task.Status} ｜ 優先度: {task.Priority}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
