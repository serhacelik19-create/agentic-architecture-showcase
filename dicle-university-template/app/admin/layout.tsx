import Sidebar from "@/components/admin/Sidebar";
import { ChevronRight, Search, Bell } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans">
            <Sidebar />

            {/* Main Content Wrapper */}
            <main className="flex-1 ml-72 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center text-sm text-slate-500">
                        <span className="font-medium text-slate-900 dark:text-slate-100">Yönetim Paneli</span>
                        <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
                        <span className="text-slate-500">Genel Bakış</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Ara..."
                                className="h-9 pl-9 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all"
                            />
                        </div>
                        <button className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
                        </button>
                    </div>
                </header>

                <div className="p-8 animate-in fade-in-50 duration-500 slide-in-from-bottom-2">
                    {children}
                </div>
            </main>
        </div>
    );
}
