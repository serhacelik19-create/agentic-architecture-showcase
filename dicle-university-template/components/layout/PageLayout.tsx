import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbItems?: BreadcrumbItem[];
}

export function PageHeader({ title, description, breadcrumbItems }: PageHeaderProps) {
    return (
        <div className="bg-[#002244] text-white pt-24 pb-8 relative overflow-hidden border-b border-slate-800">
            {/* Simple Pattern - Subtle Grid */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Glowing Accent */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--primary)]/20 blur-3xl rounded-full pointer-events-none"></div>

            <div className="container-custom relative z-10">
                {/* Breadcrumb */}
                {breadcrumbItems && (
                    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4 overflow-x-auto whitespace-nowrap pb-1">
                        {breadcrumbItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className="hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        {index === 0 && <Home className="w-3.5 h-3.5" />}
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className={item.active ? "text-white font-medium" : ""}>
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </nav>
                )}

                <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{title}</h1>
                {description && <p className="text-slate-400 text-lg max-w-2xl font-light">{description}</p>}
            </div>
        </div>
    );
}

export function PageLayout({
    children,
    title,
    description,
    breadcrumbItems
}: {
    children: React.ReactNode;
    title: string;
    description?: string;
    breadcrumbItems?: BreadcrumbItem[];
}) {
    return (
        <main className="min-h-screen bg-white pb-20">
            <PageHeader
                title={title}
                description={description}
                breadcrumbItems={breadcrumbItems}
            />
            <div className="container-custom py-12">
                {children}
            </div>
        </main>
    );
}

export default PageLayout;
