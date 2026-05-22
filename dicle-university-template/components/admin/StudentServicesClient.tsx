"use client";

import { useState } from "react";
import { StudentService } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, GripVertical, CheckCircle, XCircle } from "lucide-react";
import StudentServiceModal from "./StudentServiceModal";
import { deleteStudentService } from "@/app/actions/student-services";

// Icon mapping helper (basic set)
import * as Icons from "lucide-react";

export default function StudentServicesClient({ initialServices }: { initialServices: StudentService[] }) {
    const [services, setServices] = useState(initialServices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<StudentService | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm("Bu hizmeti silmek istediğinize emin misiniz?")) {
            await deleteStudentService(id);
            // Optimistic update could be done here, but usually revalidatePath handles it
        }
    };

    const openEdit = (service: StudentService) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Hizmet Kartları</h2>
                <Button onClick={() => { setEditingService(null); setIsModalOpen(true); }} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus size={16} /> Yeni Hizmet Ekle
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialServices.map((service) => {
                    // Dynamic Icon
                    const IconComponent = (Icons as any)[service.icon] || Icons.HelpCircle;

                    return (
                        <Card key={service.id} className="p-4 flex items-center gap-4 group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                            <div className="p-2 cursor-grab active:cursor-grabbing text-slate-400">
                                <GripVertical size={20} />
                            </div>

                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300`}>
                                <IconComponent size={20} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-slate-900 dark:text-white truncate">{service.title}</h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${service.type === 'MENU' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                            service.type === 'CALENDAR' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                                service.type === 'MODAL' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                    'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}>
                                        {service.type}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{service.description}</p>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => openEdit(service)}>
                                    <Edit size={16} className="text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                                    <Trash2 size={16} className="text-red-600" />
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {isModalOpen && (
                <StudentServiceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    service={editingService}
                />
            )}
        </div>
    );
}
