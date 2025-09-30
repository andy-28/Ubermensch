import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 取得所有會員
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                ID: true,
                Email: true,
                IsVerified: true,
                CreatedAt: true,
            },
            orderBy: { CreatedAt: "desc" },
        });
        return NextResponse.json(users, { status: 200 });
    } catch (err) {
        console.error("GET /api/admin/users error:", err);
        return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
    }
}

// 新增會員
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "缺少必要欄位" }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                Email: email,
                Password: password, // ⚠️ 目前明文，之後要用 bcrypt hash
                Role: "user",       // 有 default 但寫上更清楚
                IsVerified: false,  // 有 default 但可明確指定
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (err) {
        console.error("POST /api/admin/users error:", err);
        return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
    }
}
