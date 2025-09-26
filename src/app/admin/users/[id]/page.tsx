"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    // 載入會員資料
    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/admin/users/${id}`);
            if (res.ok) {
                const data = await res.json();
                setEmail(data.email);
                setIsVerified(data.isVerified);
            }
            setLoading(false);
        }
        fetchUser();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await fetch(`/api/admin/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, isVerified }),
        });
        router.push("/admin/users");
    }

    async function handleDelete() {
        if (confirm("確定要刪除這個會員嗎？")) {
            await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            router.push("/admin/users");
        }
    }

    if (loading) return <p className="p-6">載入中...</p>;

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">編輯會員</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="border border-gray-300 p-2 w-full rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isVerified}
                        onChange={(e) => setIsVerified(e.target.checked)}
                    />
                    已驗證
                </label>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        儲存
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        刪除
                    </button>
                </div>
            </form>
        </div>
    );
}
