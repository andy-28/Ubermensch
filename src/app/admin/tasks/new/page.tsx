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
};

const columns = {
    todo: "待辦",
    inprogress: "進行中",
    done: "完成",
};

// 優先順序的排序權重
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
    const [sortBy, setSortBy] = useState("created"); // 預設排序

    // 載入任務
    async function fetchTasks() {
        const res = await fetch("/api/tasks");
        if (res.ok) {
            const data = await res.json();
            setTasks(data);
        }
    }

    // 建立任務
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, priority, dueDate }),
        });

        if (res.ok) {
            setTitle("");
            setDescription("");
            setPriority("normal");
            setDueDate("");
            fetchTasks();
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

    // 排序函數
    function sortTasks(tasks: Task[]): Task[] {
        return [...tasks].sort((a, b) => {
            if (sortBy === "dueDate") {
                // 沒有截止日期的排後面
                if (!a.DueDate) return 1;
                if (!b.DueDate) return -1;
                return new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime();
            } else if (sortBy === "priority") {
                return priorityOrder[a.Priority] - priorityOrder[b.Priority];
            } else {
                // 預設用建立時間排序 (最新在前)
                return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
            }
        });
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">任務管理 (Kanban)</h1>

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
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create Task
                </button>
            </form>

            {/* 排序選單 */}
            <div className="mb-4">
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
            </div>

            {/* Kanban 看板 */}
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
                                    {sortTasks(tasks.filter((t) => t.Status === status)).map(
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
                                                        className="bg-white p-3 mb-2 rounded shadow"
                                                    >
                                                        <h3 className="font-semibold">
                                                            {task.Title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {task.Description}
                                                        </p>
                                                        <p className="text-xs">
                                                            優先度:{" "}
                                                            <span
                                                                className={
                                                                    task.Priority === "high"
                                                                        ? "text-red-500"
                                                                        : task.Priority === "low"
                                                                            ? "text-green-500"
                                                                            : "text-gray-700"
                                                                }
                                                            >
                                                                {task.Priority}
                                                            </span>
                                                        </p>
                                                        {task.DueDate && (
                                                            <p className="text-xs text-gray-500">
                                                                截止日期:{" "}
                                                                {new Date(
                                                                    task.DueDate
                                                                ).toLocaleDateString()}
                                                            </p>
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
        </div>
    );
}
