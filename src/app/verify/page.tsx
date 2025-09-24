"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");

    useEffect(() => {
        const e = localStorage.getItem("pendingVerifyEmail");
        if (e) setEmail(e);
    }, []);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
        });

        const data = await res.json();
        if (data.success) {
            localStorage.removeItem("pendingVerifyEmail");
            alert("驗證成功，請登入");
            router.push("/login");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="form-card w-full max-w-sm p-6 rounded-xl shadow-md bg-white dark:bg-neutral-900">
                <h1 className="text-xl font-bold mb-4">輸入驗證碼</h1>
                <form onSubmit={handleVerify} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="input border px-3 py-2 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        maxLength={6}
                        placeholder="6 位數驗證碼"
                        className="input border px-3 py-2 rounded-md text-center tracking-[0.5em]"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button type="submit" className="btn-primary py-2 rounded-md">
                        確認
                    </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                    沒收到驗證碼？先確認垃圾信件匣；開發中可查看註冊成功彈窗顯示的代碼。
                </p>
            </div>
        </div>
    );
}
