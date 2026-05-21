import Header from "../ui/Header";

const AdminLayout = ({ sidebar, children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Header />

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card">
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
