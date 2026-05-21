const AdminSidebar = ({ active, setActive }) => {
  const itemClass = (name) =>
    `w-full text-left px-4 py-3 rounded-lg transition
     ${active === name
       ? "bg-primary/10 text-primary"
       : "hover:bg-muted text-muted-foreground"}`;

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4">
        Admin Panel
      </h2>

      <button className={itemClass("pyq")} onClick={() => setActive("pyq")}>
        PYQ Management
      </button>

      <button className={itemClass("notes")} onClick={() => setActive("notes")}>
        Notes Management
      </button>
    </div>
  );
};

export default AdminSidebar;
