"use client";

import { PageHeader } from "@/components/layout/PageLayout";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Camera, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type TourScene = {
    id: number;
    title: string;
    description: string;
    image: string;
};

const scenes: TourScene[] = [
    {
        id: 1,
        title: "Kampüs Havadan Görünüm",
        description: "27.000 dönümlük geniş ve yeşil kampüsümüzün kuşbakışı görünümü. Dicle Nehri kıyısında eşsiz bir doğa.",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Rektörlük Binası",
        description: "Üniversitemizin idari merkezi. Modern mimarisi ve merkezi konumuyla kampüsün kalbi.",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Merkez Kütüphane",
        description: "Binlerce basılı ve dijital kaynağa erişim imkanı sunan, öğrencilerin 7/24 çalışabildiği modern kütüphane.",
        image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1920&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Tıp Fakültesi Hastanesi",
        description: "Bölgenin en büyük sağlık kompleksi. Eğitim ve araştırma hastanemiz modern teknolojilerle donatılmıştır.",
        image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1920&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Sosyal Yaşam Merkezi",
        description: "Öğrencilerin sosyalleşebileceği kafeler, yemek alanları ve dinlenme mekanları.",
        image: "https://images.unsplash.com/photo-1554135491-991556618303?q=80&w=1920&auto=format&fit=crop"
    }
];

export default function VirtualTourPage() {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const currentScene = scenes[currentSceneIndex];

    const nextScene = () => setCurrentSceneIndex((prev) => (prev + 1) % scenes.length);
    const prevScene = () => setCurrentSceneIndex((prev) => (prev - 1 + scenes.length) % scenes.length);

    return (
        <main className="min-h-screen bg-slate-950 pb-20">
            <div className="relative h-screen max-h-[800px] w-full overflow-hidden group">

                {/* Main 360 Simulation Image */}
                <div
                    key={currentScene.id}
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear scale-100 hover:scale-110"
                    style={{ backgroundImage: `url(${currentScene.image})` }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* UI Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 z-10">

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white max-w-lg animate-in slide-in-from-left duration-500">
                            <div className="flex items-center gap-2 text-[var(--accent)] mb-2 uppercase tracking-widest text-xs font-bold">
                                <Camera className="w-4 h-4" />
                                Sanal Kampüs Turu
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentScene.title}</h1>
                            <p className="text-slate-300 text-sm leading-relaxed">{currentScene.description}</p>
                        </div>

                        <div className="hidden md:flex flex-col gap-2">
                            {scenes.map((scene, idx) => (
                                <button
                                    key={scene.id}
                                    onClick={() => setCurrentSceneIndex(idx)}
                                    className={`w-3 h-3 rounded-full transition-all ${idx === currentSceneIndex ? "bg-[var(--accent)] w-6" : "bg-white/50 hover:bg-white"}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                            <Button onClick={prevScene} variant="outline" size="icon" className="h-12 w-12 rounded-full bg-black/50 border-white/20 text-white hover:bg-white hover:text-black hover:scale-110 transition-all">
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <Button onClick={nextScene} variant="outline" size="icon" className="h-12 w-12 rounded-full bg-black/50 border-white/20 text-white hover:bg-white hover:text-black hover:scale-110 transition-all">
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 text-white">
                            <MapPin className="w-5 h-5 text-[var(--accent)]" />
                            <span className="font-mono text-sm">37.9105° N, 40.2865° E</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-16">
                <h2 className="text-2xl font-bold mb-8 text-white text-center">Diğer Lokasyonları Keşfedin</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {scenes.map((scene, idx) => (
                        <div
                            key={scene.id}
                            onClick={() => setCurrentSceneIndex(idx)}
                            className={`cursor-pointer group relative h-40 rounded-lg overflow-hidden border-2 transition-all ${idx === currentSceneIndex ? "border-[var(--accent)] scale-105 shadow-xl shadow-[var(--accent)]/20" : "border-transparent opacity-60 hover:opacity-100"}`}
                        >
                            <img src={scene.image} alt={scene.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-3">
                                <span className="text-white text-xs font-bold truncate">{scene.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
