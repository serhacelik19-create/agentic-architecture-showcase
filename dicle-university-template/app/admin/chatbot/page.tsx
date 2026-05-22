import { getChatIntents } from "@/app/actions/chatbot";
import { ChatbotForm } from "@/components/admin/ChatbotForm";
import ChatbotAdminClient from "./components/ChatbotAdminClient";

export const dynamic = "force-dynamic";

export default async function ChatbotPage() {
    const { data: intents } = await getChatIntents();

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Asistan / Chatbot Yönetimi</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Sanal asistanın sorulara vereceği cevapları buradan yönetebilirsiniz.
                </p>
            </div>

            <ChatbotAdminClient initialIntents={intents || []} />
        </div>
    );
}
