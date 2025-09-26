import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "缺少必要欄位" }, { status: 400 });
        }

        // 注意：Email 是大寫 E
        const user = await prisma.user.findUnique({ where: { Email: email } });
        if (!user) {
            return NextResponse.json({ success: false, message: "使用者不存在" }, { status: 404 });
        }

        // Password 也是大寫 P
        const ok = await bcrypt.compare(password, user.Password);
        if (!ok) {
            return NextResponse.json({ success: false, message: "密碼錯誤" }, { status: 401 });
        }

        if (!user.IsVerified) {
            return NextResponse.json({ success: false, message: "帳號尚未驗證，請先完成驗證" }, { status: 403 });
        }

        // 先維持回傳使用者，之後可以換成發 JWT + httpOnly cookie
        return NextResponse.json({
            success: true,
            message: "登入成功",
            user: { id: user.ID, email: user.Email },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "伺服器錯誤" }, { status: 500 });
    }
}
