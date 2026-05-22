"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop",
        title: "Geleceğe Dicle'den Bakın",
        subtitle: "50 yıllık akademik birikim ile bilim, kültür ve sanatın merkezinde yerinizi alın.",
        cta: "Aday Öğrenci Platformu"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop",
        title: "Köklü Geçmiş, Güçlü Gelecek",
        subtitle: "Modern yönetim anlayışı, geniş yeşil alanları ve tarihi dokusuyla eğitimin kalbi.",
        cta: "Üniversitemizi Tanıyın"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1920&auto=format&fit=crop",
        title: "Bilgiye Sınırsız Erişim",
        subtitle: "7/24 açık modern kütüphanemiz, binlerce basılı ve dijital kaynakla araştırmalarınızda yanınızda.",
        cta: "Kütüphane Hizmetleri"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1920&auto=format&fit=crop",
        title: "Bölgenin Sağlık Üssü",
        subtitle: "Teknolojik altyapısı ve uzman kadrosuyla Dicle Üniversitesi Hastanesi şifa dağıtıyor.",
        cta: "Hastane Randevu"
    }
    // Removed 5th slide as requested
];

import { useLanguage } from "@/components/providers/LanguageProvider";

export function HeroSection() {
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop",
            title: t("hero.title"),
            subtitle: t("hero.subtitle"),
            cta: t("hero.cta")
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop",
            title: t("nav.university"),
            subtitle: t("hero.universityDesc"),
            cta: t("hero.cta")
        }
    ];

    if (!isMounted) return <section className="relative h-[85vh] w-full bg-slate-100" />;

    return (
        <section className="relative h-[85vh] w-full overflow-hidden bg-slate-900 text-white group">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className} active-bullet"></span>`;
                    },
                }}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-full w-full flex items-center justify-center">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out hover:scale-105"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                            <div className="relative z-10 container-custom w-full flex flex-col justify-center h-full pt-10 px-4 md:px-0">
                                <div className="max-w-2xl animate-fade-in">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold tracking-wide uppercase text-blue-200 mb-6">
                                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                        Dicle Üniversitesi
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight drop-shadow-lg">
                                        {slide.title}
                                    </h1>
                                    <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg leading-relaxed drop-shadow-md">
                                        {slide.subtitle}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link href="/sanal-tur">
                                            <Button size="lg" className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 text-md px-8 rounded-full shadow-lg shadow-blue-900/20 group">
                                                <PlayCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                                                {slide.cta}
                                            </Button>
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <style jsx global>{`
                .swiper-pagination-bullet {
                    width: 32px;
                    height: 4px;
                    border-radius: 2px;
                    background: rgba(255, 255, 255, 0.4);
                    transition: all 0.3s ease;
                }
                .swiper-pagination-bullet-active {
                    background: var(--primary) !important;
                    width: 48px;
                }
            `}</style>
        </section>
    );
}
