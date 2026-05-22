import { getFoodMenus } from "@/app/actions/food-menu";
import FoodMenuForm from "./components/FoodMenuForm";
import FoodMenuList from "./components/FoodMenuList";

export const dynamic = 'force-dynamic';

export default async function FoodMenuPage() {
    const { data: menus } = await getFoodMenus();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Yemek Menüsü Yönetimi</h1>
                <FoodMenuForm />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Gelecek Menüler</h3>
                <FoodMenuList menus={menus || []} />
            </div>
        </div>
    );
}
