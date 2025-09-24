import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ success: false, message: "缺少必要欄位" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ success: false, message: "使用者不存在" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ success: true, message: "已驗證過，請直接登入" });
        }

        // 驗證碼檢查
        const now = new Date();
        if (!user.verifyCode || user.verifyCode !== code) {
            return NextResponse.json({ success: false, message: "驗證碼錯誤" }, { status: 400 });
        }
        if (!user.verifyCodeExpires || user.verifyCodeExpires < now) {
            return NextResponse.json({ success: false, message: "驗證碼已過期" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verifyCode: null,
                verifyCodeExpires: null,
            },
        });

        return NextResponse.json({ success: true, message: "驗證成功" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "伺服器錯誤" }, { status: 500 });
    }
}
