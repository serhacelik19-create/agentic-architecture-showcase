"use client";

import { icons } from "lucide-react";

interface IconRendererProps {
    name: string;
    size?: number;
    className?: string;
}

export default function IconRenderer({ name, size = 24, className }: IconRendererProps) {
    // @ts-ignore
    const LucideIcon = icons[name];

    if (!LucideIcon) {
        // Fallback icon if name is invalid
        const FallbackIcon = icons.Activity;
        return <FallbackIcon size={size} className={className} />;
    }

    return <LucideIcon size={size} className={className} />;
}
