"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (data.success) {
            localStorage.setItem("userEmail", data.user.email);
            alert("登入成功");
            router.push("/admin/users");
        } else {
            alert(data.message);
            if (res.status === 403) {
                // 尚未驗證 → 引導去驗證頁
                localStorage.setItem("pendingVerifyEmail", email);
                router.push("/verify");
            }
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="form-card w-full max-w-sm p-6 rounded-xl shadow-md bg-white dark:bg-neutral-900">
                <h1 className="text-xl font-bold mb-4">登入</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="input border px-3 py-2 rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="密碼"
                        className="input border px-3 py-2 rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn-primary py-2 rounded-md">
                        登入
                    </button>
                </form>
                <p className="text-sm mt-4 flex gap-2">
                    <button
                        className="text-blue-500 underline"
                        onClick={() => router.push("/register")}
                    >
                        註冊
                    </button>
                    <button
                        className="text-blue-500 underline"
                        onClick={() => router.push("/forgot-password")}
                    >
                        忘記密碼？
                    </button>
                </p>
            </div>
        </div>
    );
}
