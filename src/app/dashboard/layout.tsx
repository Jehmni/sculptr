import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <section className="flex min-h-screen flex-col items-center">
        {children}
      </section>
    </ProtectedRoute>
  );
}
