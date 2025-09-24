"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (data.success) {
            // 存待驗證 email，供 verify 頁面帶入
            localStorage.setItem("pendingVerifyEmail", email);

            // 開發期：提示驗證碼（正式上線請移除）
            if (data.devHintCode) {
                alert(`【開發用】驗證碼：${data.devHintCode}`);
            }

            alert("註冊成功，請輸入驗證碼");
            router.push("/verify");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="form-card w-full max-w-sm p-6 rounded-xl shadow-md bg-white dark:bg-neutral-900">
                <h1 className="text-xl font-bold mb-4">註冊</h1>
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
                        註冊
                    </button>
                </form>
                <p className="text-sm mt-4">
                    已經有帳號？{" "}
                    <button className="text-blue-500 underline" onClick={() => router.push("/login")}>
                        登入
                    </button>
                </p>
            </div>
        </div>
    );
}
