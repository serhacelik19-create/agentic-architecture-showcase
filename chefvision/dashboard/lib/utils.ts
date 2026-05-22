import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getErrorMessage(error: any): string {
    if (!error) return "Bilinmeyen bir hata oluştu"

    // Handle Axios errors
    if (error.response?.data?.detail) {
        const detail = error.response.data.detail

        // If detail is a string, return it
        if (typeof detail === "string") return detail

        // If detail is an array (Pydantic validation errors), join messages
        if (Array.isArray(detail)) {
            return detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
        }

        // If detail is an object, try to stringify or return generic message
        if (typeof detail === "object") {
            return JSON.stringify(detail)
        }
    }

    // Handle generic Error objects
    if (error.message) return error.message

    return "İşlem sırasında bir hata oluştu"
}
