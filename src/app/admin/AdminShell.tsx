import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from './layout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/login'); // redirect sẽ "dừng" ở đây, không chạy phần dưới
  }

  return <AdminShell>{children}</AdminShell>;
}
