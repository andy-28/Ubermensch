import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // 取本週完成的任務（Status = done）
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // 星期天當週起始
        startOfWeek.setHours(0, 0, 0, 0);

        const tasks = await prisma.task.findMany({
            where: {
                Status: "done",
                CompletedAt: { gte: startOfWeek },
            },
            orderBy: { CompletedAt: "asc" },
        });

        // 依標籤分組
        const grouped: Record<string, typeof tasks> = {};
        tasks.forEach((task) => {
            const tags = (task.Tags as string[]) || ["未分類"];
            tags.forEach((tag) => {
                if (!grouped[tag]) grouped[tag] = [];
                grouped[tag].push(task);
            });
        });

        // 輸出 Markdown
        let md = `# 本週工作週報 (${startOfWeek.toLocaleDateString()} ~ ${new Date().toLocaleDateString()})\n\n`;

        for (const [tag, tks] of Object.entries(grouped)) {
            md += `## ${tag}\n`;
            tks.forEach((t) => {
                const date = t.CompletedAt
                    ? new Date(t.CompletedAt).toLocaleDateString()
                    : "";
                md += `- ${t.Title} (${date})\n`;
            });
            md += `\n`;
        }

        return new NextResponse(md, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    }
}
