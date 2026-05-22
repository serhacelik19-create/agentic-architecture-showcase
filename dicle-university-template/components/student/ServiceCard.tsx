import { StudentService } from "@prisma/client";
import * as Icons from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FoodMenuCard } from "./FoodMenuCard";
import { CalendarCard } from "./CalendarCard";
import { TransportModal } from "./TransportModal";

interface ServiceCardProps {
    service: StudentService;
}

export function ServiceCard({ service }: ServiceCardProps) {
    const Icon = (Icons as any)[service.icon] || Icons.HelpCircle;

    // Color mapping helper
    // In a real app, you might want to store color in DB or map based on type
    const getColor = (type: string) => {
        switch (type) {
            case 'MENU': return { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' };
            case 'CALENDAR': return { color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' };
            case 'MODAL': return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
            default: return { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' };
        }
    };

    const { color, bg } = getColor(service.type);

    // Factory Logic
    if (service.type === 'MENU') {
        return <FoodMenuCard title={service.title} icon={Icon} color={color} bg={bg} />;
    }

    if (service.type === 'CALENDAR') {
        return <CalendarCard title={service.title} icon={Icon} color={color} bg={bg} />;
    }

    if (service.type === 'MODAL') {
        return <TransportModal
            title={service.title}
            icon={service.icon}
            color={color}
            bg={bg}
            desc={service.description}
            content={service.content}
        />;
    }

    // Default: LINK
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
            <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm flex-1">{service.description}</p>
            <Button variant="outline" className="w-full" asChild>
                <Link href={service.url || "#"}>Giriş Yap</Link>
            </Button>
        </div>
    );
}
