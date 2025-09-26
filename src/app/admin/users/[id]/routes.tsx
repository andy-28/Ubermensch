import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({ where: { id: Number(params.id) } });
    if (!user) return NextResponse.json({ message: "找不到會員" }, { status: 404 });
    return NextResponse.json(user);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { role, isVerified } = await req.json();
    const updated = await prisma.user.update({
        where: { id: Number(params.id) },
        data: { isVerified },
    });
    return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await prisma.user.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
}
