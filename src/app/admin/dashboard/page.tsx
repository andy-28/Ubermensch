import { GlassPanel } from "@/components/ui/glass-panel"

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10">
            <div className="grid grid-cols-2 gap-6">
                <GlassPanel>
                    <h2 className="text-lg font-bold text-white">會員數量</h2>
                    <p className="text-gray-100">目前 1234 位</p>
                </GlassPanel>

                <GlassPanel>
                    <h2 className="text-lg font-bold text-white">訂閱方案</h2>
                    <p className="text-gray-100">Pro 用戶 300 位</p>
                </GlassPanel>
            </div>
        </div>
    )
}
