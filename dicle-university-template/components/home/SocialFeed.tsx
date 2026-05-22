"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageLayout";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Twitter, Youtube, ExternalLink, Heart, MessageCircle, Share2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const SOCIAL_POSTS = [
    {
        id: 1,
        platform: "instagram",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
        caption: "Kampüsümüzde bahar havası! 🌸 #DicleÜniversitesi #KampüsYaşamı",
        likes: "1.2K",
        comments: "45",
        date: "2 saat önce"
    },
    {
        id: 2,
        platform: "twitter",
        image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=600&auto=format&fit=crop",
        caption: "Akademik başarılarımıza bir yenisini daha ekledik! Mühendislik Fakültesi öğrencilerimiz TEKNOFEST'te finale kaldı. 🚀 #Teknoloji #Başarı",
        likes: "850",
        comments: "12",
        date: "5 saat önce"
    },
    {
        id: 3,
        platform: "youtube",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
        caption: "Dicle Üniversitesi 2024 Tanıtım Filmi Yayında! 🎥 Hemen izlemek için profildeki linke tıkla.",
        likes: "3.4K",
        comments: "156",
        date: "1 gün önce"
    }
];

export function SocialFeed() {
    const { t } = useLanguage();
    return (
        <section className="py-20 bg-slate-50">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {t("home.social").split(" ")[0]} <span className="text-[var(--primary)]">{t("home.social").split(" ")[1]}</span>
                        </h2>
                        <p className="text-slate-500">Bizi takip edin, kampüsteki anlık gelişmelerden haberdar olun.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-3 rounded-xl bg-white text-pink-600 shadow-sm hover:scale-110 transition-transform">
                            <Instagram className="w-6 h-6" />
                        </button>
                        <button className="p-3 rounded-xl bg-white text-blue-400 shadow-sm hover:scale-110 transition-transform">
                            <Twitter className="w-6 h-6" />
                        </button>
                        <button className="p-3 rounded-xl bg-white text-red-600 shadow-sm hover:scale-110 transition-transform">
                            <Youtube className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SOCIAL_POSTS.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt="Social post"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                                    <span className="flex items-center gap-1"><Heart className="w-5 h-5 fill-current" /> {post.likes}</span>
                                    <span className="flex items-center gap-1"><MessageCircle className="w-5 h-5 fill-current" /> {post.comments}</span>
                                </div>
                                <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-lg text-white z-10">
                                    {post.platform === "instagram" && <Instagram className="w-4 h-4" />}
                                    {post.platform === "twitter" && <Twitter className="w-4 h-4" />}
                                    {post.platform === "youtube" && <Youtube className="w-4 h-4" />}
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-slate-600 line-clamp-2">
                                    {post.caption}
                                </p>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.date}</span>
                                    <button className="text-[var(--primary)] text-xs font-bold flex items-center gap-1 hover:underline">
                                        {t("footer.press")} <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
