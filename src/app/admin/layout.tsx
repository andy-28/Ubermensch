"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"

const menuItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "會員管理" },
    { href: "/admin/posts", label: "文章管理" },
    { href: "/admin/settings", label: "系統設定" },
    { href: "/tasks/new", label: "建立任務" }, // 🔥 新增這一行
]

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold">後台系統</h1>
                </div>
                <nav className="flex-1 flex flex-col p-4 gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded px-3 py-2 text-sm font-medium transition ${pathname.startsWith(item.href)
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Button
                        variant="default"
                        className="w-full bg-black text-white hover:bg-neutral-800"
                    >
                        登出
                    </Button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-14 border-b bg-white flex items-center justify-between px-6">
                    <h2 className="text-lg font-semibold">管理後台</h2>
                </header>

                {/* Content */}
                <div className="flex-1 p-6">{children}</div>
            </main>
        </div>
    )
}
