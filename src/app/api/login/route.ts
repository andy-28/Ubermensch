import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "缺少必要欄位" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ success: false, message: "使用者不存在" }, { status: 404 });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return NextResponse.json({ success: false, message: "密碼錯誤" }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ success: false, message: "帳號尚未驗證，請先完成驗證" }, { status: 403 });
        }

        // 先維持回傳使用者，之後會改成發 JWT + httpOnly cookie
        return NextResponse.json({
            success: true,
            message: "登入成功",
            user: { id: user.id, email: user.email },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "伺服器錯誤" }, { status: 500 });
    }
}
