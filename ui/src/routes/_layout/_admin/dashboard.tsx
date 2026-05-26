import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_admin/dashboard")({
  head: () => ({
    meta: [{ title: "Admin Dashboard" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground">Admin tools coming soon.</p>
    </div>
  );
}
