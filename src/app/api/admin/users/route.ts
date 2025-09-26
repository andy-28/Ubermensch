import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 取得所有會員
export async function GET() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, isVerified: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
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
                email,
                password, // ⚠️ demo 先存明文，之後要改 bcrypt

            },
        });

        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
    }
}
