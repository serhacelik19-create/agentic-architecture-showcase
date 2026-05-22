"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutTemplate, Grid, Info, Settings2 } from "lucide-react";
import StudentInfoForm from "./StudentInfoForm";
import StudentServicesClient from "./StudentServicesClient";
import { StudentService } from "@prisma/client";

interface StudentManagementTabsProps {
    studentInfoData: any;
    servicesData: StudentService[];
}

export default function StudentManagementTabs({ studentInfoData, servicesData }: StudentManagementTabsProps) {
    return (
        <Tabs defaultValue="homepage" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <TabsList className="grid w-full md:w-auto grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <TabsTrigger value="homepage" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                        <LayoutTemplate size={16} />
                        Ana Sayfa Kartı
                    </TabsTrigger>
                    <TabsTrigger value="services" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                        <Grid size={16} />
                        Öğrenci Merkezi
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="homepage" className="space-y-4 animate-in fade-in-50 slide-in-from-left-2 duration-300">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-800 text-sm mb-6">
                    <Info size={18} className="shrink-0" />
                    <p>Buradaki ayarlar, ana sayfanızdaki "Hızlı Erişim" bölümünde yer alan geniş "Öğrenci" kartını düzenlemenizi sağlar.</p>
                </div>
                <StudentInfoForm initialData={studentInfoData} />
            </TabsContent>

            <TabsContent value="services" className="space-y-4 animate-in fade-in-50 slide-in-from-right-2 duration-300">
                <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-100 dark:border-indigo-800 text-sm mb-6">
                    <Settings2 size={18} className="shrink-0" />
                    <p>Burada ekleyeceğiniz kartlar, <strong>/ogrenci</strong> sayfasında listelenir. Menü ve Takvim gibi özel kart tiplerini seçerek dinamik içerik gösterebilirsiniz.</p>
                </div>
                <StudentServicesClient initialServices={servicesData} />
            </TabsContent>
        </Tabs>
    );
}
