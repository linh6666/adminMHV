// app/login/layout.tsx
import React from 'react';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div >
      {/* Có thể thêm logo, banner ở đây */}
      {children}
    </div>
  );
}