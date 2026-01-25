import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin">
      <Sidebar />
      <div className="content">
        <Header />
        <main className="page">{children}</main>
      </div>
    </div>
  );
}



