import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 取得單一會員
export async function GET(_: Request, { params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { ID: Number(params.id) }, // ✅ 用 ID
    });
    if (!user) return NextResponse.json({ message: "找不到會員" }, { status: 404 });
    return NextResponse.json(user);
}

// 更新會員
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { email, isVerified } = await req.json();

    const updated = await prisma.user.update({
        where: { ID: Number(params.id) }, // ✅ 用 ID
        data: {
            Email: email,            // ✅ 大寫 E
            IsVerified: isVerified,  // ✅ 大寫 I
        },
    });
    return NextResponse.json(updated);
}

// 刪除會員
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await prisma.user.delete({
        where: { ID: Number(params.id) }, // ✅ 用 ID
    });
    return NextResponse.json({ success: true });
}
