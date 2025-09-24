"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        // 嘗試從 localStorage 拿登入使用者
        const email = localStorage.getItem("userEmail");
        if (!email) {
            // 如果沒有登入紀錄 → 跳回 login
            router.push("/login");
        } else {
            setUser(email);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        router.push("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="form-card w-full max-w-md p-6 rounded-xl shadow-md bg-white dark:bg-neutral-900 text-center">
                <h1 className="text-2xl font-bold mb-4">會員首頁</h1>
                {user ? (
                    <>
                        <p className="mb-6">歡迎回來，{user} 🎉</p>
                        <button
                            onClick={handleLogout}
                            className="btn-primary py-2 px-4 rounded-md"
                        >
                            登出
                        </button>
                    </>
                ) : (
                    <p>載入中...</p>
                )}
            </div>
        </div>
    );
}
