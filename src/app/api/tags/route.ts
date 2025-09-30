import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📌 取得所有標籤
export async function GET() {
    const tasks = await prisma.task.findMany({ select: { Tags: true } });
    const allTags = new Set<string>();

    tasks.forEach((t) => {
        if (t.Tags && Array.isArray(t.Tags)) {
            (t.Tags as string[]).forEach((tag) => allTags.add(tag));
        }
    });

    return NextResponse.json(Array.from(allTags));
}
