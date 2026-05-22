"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartPulse, Megaphone } from "lucide-react";
import PolyclinicsClient from "./PolyclinicsClient";
import HospitalAnnouncementsClient from "./HospitalAnnouncementsClient";
import { HospitalPolyclinic, HospitalAnnouncement } from "@prisma/client";

export default function HospitalTabs({ polyclinics, announcements }: { polyclinics: HospitalPolyclinic[], announcements: HospitalAnnouncement[] }) {
    return (
        <Tabs defaultValue="polyclinics" className="space-y-6">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                <TabsTrigger value="polyclinics" className="gap-2">
                    <HeartPulse size={16} /> Poliklinikler
                </TabsTrigger>
                <TabsTrigger value="announcements" className="gap-2">
                    <Megaphone size={16} /> Duyurular
                </TabsTrigger>
            </TabsList>

            <TabsContent value="polyclinics" className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg text-sm text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30">
                    Hastane sayfasında listelenen poliklinikleri buradan yönetebilirsiniz.
                </div>
                <PolyclinicsClient items={polyclinics} />
            </TabsContent>

            <TabsContent value="announcements" className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg text-sm text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/30">
                    Hastane ile ilgili güncel duyuruları buradan yayınlayabilirsiniz.
                </div>
                <HospitalAnnouncementsClient items={announcements} />
            </TabsContent>
        </Tabs>
    );
}
