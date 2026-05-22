"use client";

import { useActionState, useEffect } from "react";
import { upsertChatIntent } from "@/app/actions/chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquarePlus, Loader2 } from "lucide-react";

interface ChatbotFormProps {
    initialData?: {
        id: number;
        intentId: string;
        patterns: string[];
        response: string;
        isActive: boolean;
    } | null;
    onSuccess?: () => void;
}

export function ChatbotForm({ initialData, onSuccess }: ChatbotFormProps) {
    const [state, formAction, isPending] = useActionState(upsertChatIntent, null);

    useEffect(() => {
        if (state?.success) {
            if (onSuccess) onSuccess();
        }
    }, [state?.success, onSuccess]);

    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-fit">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquarePlus className="w-5 h-5 text-[var(--primary)]" />
                    {initialData ? "Bilgiyi Düzenle" : "Yeni Bilgi Ekle"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    {initialData && <input type="hidden" name="id" value={initialData.id} />}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Kimlik (ID)</label>
                        <Input
                            name="intentId"
                            placeholder="ornegin_kutuphane_saatleri"
                            defaultValue={initialData?.intentId}
                            required
                            className="bg-slate-50 dark:bg-slate-900"
                        />
                        <p className="text-xs text-slate-400">Benzersiz bir tanımlayıcı (boşluksuz, küçük harf).</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Anahtar Kelimeler</label>
                        <Textarea
                            name="keywords"
                            placeholder="kütüphane, saatler, çalışma saatleri, ne zaman kapanıyor"
                            defaultValue={initialData?.patterns.join(", ")}
                            required
                            className="bg-slate-50 dark:bg-slate-900"
                        />
                        <p className="text-xs text-slate-400">Virgülle ayırarak yazınız.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cevap</label>
                        <Textarea
                            name="response"
                            placeholder="Kütüphanemiz hafta içi 08:00 - 17:00 saatleri arasında hizmet vermektedir."
                            defaultValue={initialData?.response}
                            required
                            className="bg-slate-50 dark:bg-slate-900 min-h-[100px]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            defaultChecked={initialData?.isActive ?? true}
                            className="rounded border-slate-300"
                        />
                        <label htmlFor="isActive" className="text-sm">Aktif</label>
                    </div>

                    {state?.message && (
                        <div className={`p-3 rounded text-sm ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {state.message}
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white" disabled={isPending}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (initialData ? "Güncelle" : "Bilgiyi Kaydet")}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
