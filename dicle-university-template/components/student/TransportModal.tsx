"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as Icons from "lucide-react";

export function TransportModal({ title, icon, color, bg, desc, content }: any) {
    const Icon = (Icons as any)[icon] || Icons.Bus;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full cursor-pointer text-left">
                    <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm flex-1">{desc}</p>
                    <Button variant="outline" className="w-full pointer-events-none group-hover:bg-slate-50 dark:group-hover:bg-slate-800">
                        Saatleri İncele
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon className={`w-6 h-6 ${color}`} />
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div
                    className="prose dark:prose-invert prose-sm max-w-none mt-4"
                    dangerouslySetInnerHTML={{ __html: content || "<p>Bilgi bulunamadı.</p>" }}
                />
            </DialogContent>
        </Dialog>
    );
}
