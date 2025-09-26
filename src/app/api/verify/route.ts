import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json(
                { success: false, message: "缺少必要欄位" },
                { status: 400 }
            );
        }

        // Email → 大寫 E
        const user = await prisma.user.findUnique({ where: { Email: email } });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "使用者不存在" },
                { status: 404 }
            );
        }

        // IsVerified → 大寫 I
        if (user.IsVerified) {
            return NextResponse.json({
                success: true,
                message: "已驗證過，請直接登入",
            });
        }

        // 驗證碼檢查
        const now = new Date();
        if (!user.VerifyCode || user.VerifyCode !== code) {
            return NextResponse.json(
                { success: false, message: "驗證碼錯誤" },
                { status: 400 }
            );
        }
        if (!user.VerifyCodeExpires || user.VerifyCodeExpires < now) {
            return NextResponse.json(
                { success: false, message: "驗證碼已過期" },
                { status: 400 }
            );
        }

        // 更新驗證狀態
        await prisma.user.update({
            where: { ID: user.ID }, // ID → 大寫 I
            data: {
                IsVerified: true,
                VerifyCode: null,
                VerifyCodeExpires: null,
            },
        });

        return NextResponse.json({ success: true, message: "驗證成功" });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "伺服器錯誤" },
            { status: 500 }
        );
    }
}
