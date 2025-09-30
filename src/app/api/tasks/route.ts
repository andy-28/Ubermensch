import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 取得任務列表
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

// 建立任務
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, status, priority, dueDate, userId } = body;

        const task = await prisma.task.create({
            data: {
                Title: title,
                Description: description || null,
                Status: status || "todo",
                Priority: priority || "normal",
                DueDate: dueDate ? new Date(dueDate) : null,
                UserID: userId || null,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

// 更新任務狀態 or 屬性
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status, priority, dueDate } = body;

        const updatedTask = await prisma.task.update({
            where: { ID: id },
            data: {
                ...(status && { Status: status }),
                ...(priority && { Priority: priority }),
                ...(dueDate && { DueDate: new Date(dueDate) }),
            },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}
