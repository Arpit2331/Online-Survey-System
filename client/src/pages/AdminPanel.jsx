import { useState } from "react";
import { Button, Card, Badge, Modal, Input, Toast, Avatar } from "../components/common";
import { Sidebar, Navbar, PageWrapper } from "../components/layout";
import { users } from "../data/dummyData";

export default function AdminPanel({ onNavigate }) {
  const [userList, setUserList] = useState(users);
  const [deleteModal, setDeleteModal] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = () => {
    setUserList(userList.filter((u) => u.id !== deleteModal.id));
    setDeleteModal(null);
    showToast(`${deleteModal.name} has been removed`, "info");
  };

  const handleReset = () => {
    setResetModal(null);
    showToast(`Password reset email sent to ${resetModal.email}`, "success");
  };

  const filtered = userList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const roleColor = {
    Admin: "bg-purple-50 text-purple-700 border border-purple-200",
    Moderator: "bg-blue-50 text-blue-700 border border-blue-200",
    User: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activePage="admin" onNavigate={onNavigate} />
      <Navbar title="Admin Panel" onNavigate={onNavigate} />

      <PageWrapper>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {userList.length} users registered on the platform
            </p>
          </div>
          <Button icon="+" onClick={() => showToast("Invite flow coming soon", "info")}>
            Invite User
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: users.length, color: "text-slate-800" },
            {
              label: "Active",
              value: users.filter((u) => u.status === "active").length,
              color: "text-emerald-600",
            },
            {
              label: "Inactive",
              value: users.filter((u) => u.status === "inactive").length,
              color: "text-amber-600",
            },
            {
              label: "Suspended",
              value: users.filter((u) => u.status === "suspended").length,
              color: "text-red-500",
            },
          ].map((s) => (
            <Card key={s.label} className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Filters + Search */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-all w-full sm:max-w-64">
              <span className="text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              {["all", "active", "inactive", "suspended"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["User", "Role", "Surveys", "Status", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={user.name.split(" ").map((n) => n[0]).join("")}
                          size="sm"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          roleColor[user.role] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{user.surveys}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400">{user.joined}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setResetModal(user)}
                        >
                          Reset PWD
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteModal(user)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <span>Showing {filtered.length} of {userList.length} users</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
                ←
              </button>
              <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium">1</span>
              <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">
                →
              </button>
            </div>
          </div>
        </Card>
      </PageWrapper>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete User"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-700">
              You're about to permanently delete{" "}
              <strong>{deleteModal?.name}</strong>. This action cannot be undone and will remove all
              their surveys and data.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => setDeleteModal(null)}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1 justify-center bg-red-500 text-white hover:bg-red-600" onClick={handleDelete}>
              Delete User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={!!resetModal}
        onClose={() => setResetModal(null)}
        title="Reset Password"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            A password reset link will be sent to <strong>{resetModal?.email}</strong>. They will
            need to click the link to set a new password.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => setResetModal(null)}>
              Cancel
            </Button>
            <Button className="flex-1 justify-center" onClick={handleReset}>
              Send Reset Link
            </Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
