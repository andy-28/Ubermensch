import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { email } = body;

    // 假設 email 存在
    if (email === "test@test.com") {
        return NextResponse.json({ success: true, message: "重設密碼信件已寄出" });
    }

    return NextResponse.json({ success: false, message: "Email 不存在" }, { status: 404 });
}
