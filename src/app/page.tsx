import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = await cookies(); // 🔥 Bắt buộc phải có await ở đây!
  const token = cookieStore.get('access_token'); // Bây giờ .get() không còn báo lỗi nữa

  if (!token) {
    redirect('/login');
  } else {
    redirect('/admin');
  }
}

