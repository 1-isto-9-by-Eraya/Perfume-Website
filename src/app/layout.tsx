// src/app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
