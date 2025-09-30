import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 取得所有任務
export async function GET() {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { CreatedAt: "desc" },
        });
        return NextResponse.json(tasks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

// 📌 建立新任務（預設進 Inbox）
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, priority, dueDate, tags } = body;

        const task = await prisma.task.create({
            data: {
                Title: title,
                Description: description || null,
                Priority: priority || "normal",
                DueDate: dueDate ? new Date(dueDate) : null,
                Status: "todo",
                IsInbox: true, // ✅ 預設先進 Inbox
                Tags: tags && Array.isArray(tags) ? tags : [], // ✅ 存 JSON 陣列
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

// 📌 更新任務（狀態、Inbox、標籤、其他欄位）
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status, isInbox, priority, dueDate, tags } = body;

        if (!id) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
        }

        const data: any = {};

        if (status) {
            data.Status = status;

            // ✅ 當任務被標記為完成 → 設定 CompletedAt
            if (status === "done") {
                data.CompletedAt = new Date();
            }
        }

        if (priority) data.Priority = priority;
        if (dueDate) data.DueDate = new Date(dueDate);
        if (typeof isInbox === "boolean") data.IsInbox = isInbox;
        if (tags && Array.isArray(tags)) data.Tags = tags;

        const updatedTask = await prisma.task.update({
            where: { ID: Number(id) },
            data,
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

