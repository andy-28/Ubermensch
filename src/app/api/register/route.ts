import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function gen6Code() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "缺少必要欄位" }, { status: 400 });
        }

        const exist = await prisma.user.findUnique({ where: { email } });
        if (exist) {
            return NextResponse.json({ success: false, message: "Email 已被註冊" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10);
        const code = gen6Code();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 分鐘

        await prisma.user.create({
            data: {
                email,
                password: hashed,
                isVerified: false,
                verifyCode: code,
                verifyCodeExpires: expires,
            },
        });

        // 方便本地測試：把驗證碼也回傳（或用 console.log）
        return NextResponse.json({
            success: true,
            message: "註冊成功，請查收驗證碼",
            devHintCode: process.env.NODE_ENV !== "production" ? code : undefined,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "伺服器錯誤" }, { status: 500 });
    }
}
