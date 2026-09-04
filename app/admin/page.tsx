import { isAdminRequestAuthenticated } from '@/lib/adminAuth';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const authenticated = isAdminRequestAuthenticated();

  return (
    <section className="min-h-screen bg-void px-5 sm:px-8 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl mb-2">Административная панель</h1>
        <p className="text-pearl/60 text-sm mb-8">Форум-Фестиваль «Преображение»</p>
        {authenticated ? <AdminDashboard /> : <AdminLogin />}
      </div>
    </section>
  );
}
