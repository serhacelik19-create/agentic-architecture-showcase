
'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Honeypot detection could be added here or in middleware
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    // Basic Honeypot Check
    const honeypot = formData.get('website_url'); // Hidden field
    if (honeypot) {
        // If a bot filled this, we return an error without processing
        console.warn(`[SECURITY] Honeypot triggered by IP. Request blocked.`);
        return 'Giriş başarısız. (Security Triggered)';
    }

    try {
        console.log('Attempting signIn...');
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/admin',
        });
        console.log('signIn returned (success expected if redirected)');
    } catch (error) {
        console.log('signIn threw an error:', error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Hatalı kullanıcı adı veya şifre.';
                default:
                    return 'Bir hata oluştu. Lütfen tekrar deneyin.';
            }
        }
        throw error;
    }
}
