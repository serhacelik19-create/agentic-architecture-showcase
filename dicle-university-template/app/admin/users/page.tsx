
import { getAdminUsers } from "@/app/actions/admin-users";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export default async function AdminUsersPage() {
    const users = await getAdminUsers();

    return (
        <div className="container mx-auto max-w-5xl">
            <AdminUsersClient initialUsers={users} />
        </div>
    );
}
