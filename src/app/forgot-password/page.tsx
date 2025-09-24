"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (data.success) {
            alert("重設連結已寄到信箱，請查收");
            router.push("/login");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="form-card w-full max-w-sm p-6 rounded-xl shadow-md bg-white dark:bg-neutral-900">
                <h1 className="text-xl font-bold mb-4">忘記密碼</h1>
                <form onSubmit={handleReset} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="輸入註冊 Email"
                        className="input border px-3 py-2 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="btn-primary py-2 rounded-md">
                        發送重設連結
                    </button>
                </form>
                <p className="text-sm mt-4">
                    <button
                        className="text-blue-500 underline"
                        onClick={() => router.push("/login")}
                    >
                        返回登入
                    </button>
                </p>
            </div>
        </div>
    );
}
