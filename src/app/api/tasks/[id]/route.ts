import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 取得任務
export async function GET() {
    const tasks = await prisma.task.findMany({
        orderBy: { CreatedAt: "desc" },
    });
    return NextResponse.json(tasks);
}

// 📌 建立任務
export async function POST(req: Request) {
    const body = await req.json();
    const { title, description, priority, dueDate, tags } = body;

    const task = await prisma.task.create({
        data: {
            Title: title,
            Description: description || null,
            Priority: priority || "normal",
            DueDate: dueDate ? new Date(dueDate) : null,
            Status: "todo",
            IsInbox: true,
            Tags: tags && Array.isArray(tags) ? tags : [],
        },
    });

    return NextResponse.json(task, { status: 201 });
}

// 📌 更新任務
export async function PATCH(req: Request) {
    const body = await req.json();
    const { id, title, description, status, isInbox, priority, dueDate, tags } = body;

    if (!id) {
        return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const data: any = {};
    if (title) data.Title = title;
    if (description !== undefined) data.Description = description;
    if (status) {
        data.Status = status;
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
}
