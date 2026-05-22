import { useLanguage } from "@/components/providers/LanguageProvider";

export function SearchBar() {
    const { t } = useLanguage();
    return (
        <div
            className="w-full max-w-2xl relative cursor-pointer"
            onClick={() => {
                const event = new KeyboardEvent("keydown", {
                    key: "k",
                    ctrlKey: true,
                    bubbles: true,
                    metaKey: true,
                });
                window.dispatchEvent(event);
            }}
        >
            <input
                type="text"
                placeholder={t("search.placeholder")}
                readOnly
                className="w-full h-14 pl-6 pr-14 rounded-full border border-slate-200 shadow-inner bg-slate-50 focus:outline-none cursor-pointer text-slate-400"
            />
            <button className="absolute right-2 top-2 h-10 w-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white pointer-events-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </button>
        </div>
    );
}
