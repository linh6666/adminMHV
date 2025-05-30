import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value

  // Kiểm tra nếu đang truy cập vào trang admin mà không có token
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Áp dụng middleware cho các đường dẫn bắt đầu bằng /admin
export const config = {
  matcher: ['/admin/:path*'],
}
