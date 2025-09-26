// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
