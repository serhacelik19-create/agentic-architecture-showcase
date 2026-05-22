import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                Genel Bakış
            </Link>
            <Link
                href="/users"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Kullanıcılar
            </Link>
            <Link
                href="/content"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                İçerik
            </Link>
            <Link
                href="/analytics"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Analitik
            </Link>
            <Link
                href="/settings"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Ayarlar
            </Link>
        </nav>
    )
}
