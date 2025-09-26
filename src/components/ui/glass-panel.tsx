import { cn } from "@/lib/utils"

interface GlassPanelProps {
    className?: string
    children: React.ReactNode
}

export function GlassPanel({ className, children }: GlassPanelProps) {
    return (
        <div
            className={cn(
                // 基本玻璃感
                "relative rounded-2xl p-6",
                // 半透明背景 + 背景模糊
                "bg-white/10 backdrop-blur-2xl",
                // 邊框帶一點亮感
                "border border-white/20",
                // 內外陰影 + 淡藍光暈
                "shadow-lg shadow-black/20",
                "before:absolute before:inset-0 before:rounded-2xl",
                "before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-30",
                "before:pointer-events-none",
                className
            )}
        >
            <div className="relative z-10">{children}</div>
        </div>
    )
}
