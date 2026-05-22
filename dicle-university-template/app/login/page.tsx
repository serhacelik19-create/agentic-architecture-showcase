
'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User as UserIcon, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="w-full max-w-sm space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-900/20">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Yönetici Girişi</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Güvenli panele erişmek için kimliğinizi doğrulayın.
                    </p>
                </div>
                <form action={formAction} className="space-y-4">
                    {/* Honeypot Field - Hidden */}
                    <div className="hidden" aria-hidden="true">
                        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input
                                id="username"
                                name="username"
                                placeholder="Admin kullanıcısı"
                                required
                                className="pl-10 h-10 bg-slate-50 dark:bg-slate-950"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="pl-10 h-10 bg-slate-50 dark:bg-slate-950"
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="text-sm text-red-500 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded-lg text-center animate-in fade-in slide-in-from-top-1">
                            {errorMessage}
                        </div>
                    )}

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10 gap-2" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Giriş Yap"}
                    </Button>
                </form>
                <div className="text-center text-xs text-slate-400 mt-4">
                    <p>Bu alan 256-bit SSL şifreleme ile korunmaktadır.</p>
                    <p className="mt-1">© 2024 Dicle Üniversitesi Bilgi İşlem</p>
                </div>
            </div>
        </div>
    );
}
