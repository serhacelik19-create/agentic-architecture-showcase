import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function RecentSales({ data }: { data?: any[] }) {
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3">
                    <Avatar className="h-10 w-10 opacity-20" />
                </div>
                <p className="text-sm font-medium text-zinc-500">Henüz son işlem bulunmuyor.</p>
            </div>
        );
    }

    const formatRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Az önce';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} sa önce`;
        return date.toLocaleDateString('tr-TR');
    };

    return (
        <div className="space-y-4">
            {data.map((item, idx) => (
                <div
                    key={idx}
                    className="group flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300"
                >
                    <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-700 shadow-md">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 font-extrabold text-indigo-600 dark:text-indigo-400">
                                {item.name?.substring(0, 2).toUpperCase() || 'CV'}
                            </AvatarFallback>
                        </Avatar>
                        {item.is_pro && (
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-900 shadow-sm">
                                <div className={cn(
                                    "h-2.5 w-2.5 rounded-full",
                                    item.subscription_tier === 'premium' ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]' :
                                        item.subscription_tier === 'pro' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' :
                                            'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                )} />
                            </span>
                        )}
                    </div>
                    <div className="ml-5 flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                            <p className="text-[15px] font-extrabold text-slate-900 dark:text-white leading-tight truncate px-0.5">
                                {item.name}
                            </p>
                            {item.subscription_tier && item.subscription_tier !== 'free' && (
                                <span className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest w-fit",
                                    item.subscription_tier === 'premium' ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" :
                                        item.subscription_tier === 'pro' ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
                                            "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                )}>
                                    {item.subscription_tier}
                                </span>
                            )}
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {item.email}
                        </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                            {formatRelativeTime(item.created_at)}
                        </p>
                        {item.amount ? (
                            <p className="text-[15px] font-extrabold text-indigo-600 dark:text-indigo-400">
                                +₺{item.amount}
                            </p>
                        ) : (
                            <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 italic">Ücretsiz</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
