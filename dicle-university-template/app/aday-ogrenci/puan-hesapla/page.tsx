"use client";

import { PageHeader } from "@/components/layout/PageLayout";
import { useState } from "react";
import { Calculator, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ScoreResult = {
    tyt: number;
    sayisal: number;
    sozel: number;
    esitAgirlik: number;
};

export default function ScoreCalculatorPage() {
    const [nets, setNets] = useState({
        tytTurkce: 0,
        tytSosyal: 0,
        tytMat: 0,
        tytFen: 0,
        aytMat: 0,
        aytFizik: 0,
        aytKimya: 0,
        aytBiyo: 0,
        aytEdebiyat: 0,
        aytTarih1: 0,
        aytCografya1: 0,
    });

    const [result, setResult] = useState<ScoreResult | null>(null);

    const calculateScore = () => {
        // Basic coefficients (Approximate)
        // TYT Base: 100, AYT Base: 100

        // TYT
        const tytScore = 100 + (nets.tytTurkce * 3.3) + (nets.tytSosyal * 3.4) + (nets.tytMat * 3.3) + (nets.tytFen * 3.4);

        // SAY - (TYT %40 + AYT %60)
        const sayScore = tytScore * 0.4 + (100 + (nets.aytMat * 3) + (nets.aytFizik * 2.85) + (nets.aytKimya * 3.07) + (nets.aytBiyo * 3.07)) * 0.6 + 60; // +60 OBP approx

        // EA
        const eaScore = tytScore * 0.4 + (100 + (nets.aytMat * 3) + (nets.aytEdebiyat * 3) + (nets.aytTarih1 * 2.8) + (nets.aytCografya1 * 3.33)) * 0.6 + 60;

        // SOZ
        const sozScore = tytScore * 0.4 + (100 + (nets.aytEdebiyat * 3) + (nets.aytTarih1 * 2.8) + (nets.aytCografya1 * 3.33) + (nets.tytSosyal * 2)) * 0.6 + 60; // logic slightly off for SOZ but rough estimate

        setResult({
            tyt: Math.min(560, Math.floor(tytScore)),
            sayisal: Math.min(560, Math.floor(sayScore)),
            esitAgirlik: Math.min(560, Math.floor(eaScore)),
            sozel: Math.min(560, Math.floor(sozScore)),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNets({ ...nets, [e.target.name]: Number(e.target.value) });
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <PageHeader
                title="YKS Puan Hesaplama Robotu"
                description="Netlerinizi girin, tahmini puanınızı ve Dicle Üniversitesi'nde kazanabileceğiniz bölümleri öğrenin."
            />

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Input Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader className="bg-[var(--primary)] text-white rounded-t-xl">
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="w-5 h-5" />
                                    TYT Netleri (Temel Yeterlilik)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                                <div className="space-y-2">
                                    <Label>Türkçe (40)</Label>
                                    <Input type="number" name="tytTurkce" onChange={handleChange} min="0" max="40" placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sosyal (20)</Label>
                                    <Input type="number" name="tytSosyal" onChange={handleChange} min="0" max="20" placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Matematik (40)</Label>
                                    <Input type="number" name="tytMat" onChange={handleChange} min="0" max="40" placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Fen (20)</Label>
                                    <Input type="number" name="tytFen" onChange={handleChange} min="0" max="20" placeholder="0" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="bg-[var(--secondary)] text-white rounded-t-xl">
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="w-5 h-5" />
                                    AYT Netleri (Alan Yeterlilik)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div>
                                    <h4 className="font-semibold mb-3 border-b pb-2">Matematik & Fen (SAY)</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label>Matematik (40)</Label>
                                            <Input type="number" name="aytMat" onChange={handleChange} min="0" max="40" placeholder="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Fizik (14)</Label>
                                            <Input type="number" name="aytFizik" onChange={handleChange} min="0" max="14" placeholder="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Kimya (13)</Label>
                                            <Input type="number" name="aytKimya" onChange={handleChange} min="0" max="13" placeholder="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Biyoloji (13)</Label>
                                            <Input type="number" name="aytBiyo" onChange={handleChange} min="0" max="13" placeholder="0" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3 border-b pb-2">Türk Dili & Sosyal (EA/SÖZ)</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Edebiyat (24)</Label>
                                            <Input type="number" name="aytEdebiyat" onChange={handleChange} min="0" max="24" placeholder="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tarih-1 (10)</Label>
                                            <Input type="number" name="aytTarih1" onChange={handleChange} min="0" max="10" placeholder="0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Coğrafya-1 (6)</Label>
                                            <Input type="number" name="aytCografya1" onChange={handleChange} min="0" max="6" placeholder="0" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button onClick={calculateScore} size="lg" className="w-full text-lg font-bold shadow-xl bg-[var(--primary)] hover:bg-blue-800 transition-all hover:scale-[1.01]">
                            PUANIMI HESAPLA &rarr;
                        </Button>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {result ? (
                                <Card className="border-2 border-[var(--primary)] shadow-2xl animate-in fade-in slide-in-from-right duration-500">
                                    <CardHeader className="bg-slate-50 dark:bg-slate-800 border-b">
                                        <CardTitle className="text-center text-[var(--primary)] text-2xl font-black">TAHMİNİ PUANLAR</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="text-center">
                                            <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-1">TYT Puanı</div>
                                            <div className="text-4xl font-black text-slate-800 dark:text-white">{result.tyt}</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 border-t border-b py-6 border-slate-100 dark:border-slate-700">
                                            <div className="text-center">
                                                <div className="text-xs text-slate-500 font-bold mb-1">SAYISAL</div>
                                                <div className="text-3xl font-bold text-[var(--secondary)]">{result.sayisal}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs text-slate-500 font-bold mb-1">EŞİT AĞIRLIK</div>
                                                <div className="text-3xl font-bold text-blue-600">{result.esitAgirlik}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-center mb-4 flex items-center justify-center gap-2">
                                                <GraduationCap className="w-5 h-5" />
                                                Kazanabileceğiniz Bölümler
                                            </h4>
                                            <ul className="text-sm space-y-2">
                                                {result.sayisal > 480 && <li className="text-green-600 font-bold">✓ Tıp Fakültesi (SAY)</li>}
                                                {result.sayisal > 400 && <li className="text-green-600 font-bold">✓ Diş Hekimliği (SAY)</li>}
                                                {result.esitAgirlik > 350 && <li className="text-blue-600 font-bold">✓ Hukuk Fakültesi (EA)</li>}
                                                {result.sayisal > 300 && <li className="text-slate-600 dark:text-slate-300">✓ Mühendislik Fakültesi</li>}
                                                {result.tyt > 250 && <li className="text-slate-600 dark:text-slate-300">✓ Meslek Yüksekokulları</li>}
                                                {result.tyt < 250 && <li className="text-red-500">Puanınız henüz çoğu bölüm için yeterli görünmüyor.</li>}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 h-full flex flex-col items-center justify-center min-h-[400px]">
                                    <Calculator className="w-16 h-16 text-slate-300 mb-4" />
                                    <p className="text-slate-500 font-medium">Netlerinizi girip hesapla butonuna bastığınızda sonuçlarınız burada görünecektir.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
