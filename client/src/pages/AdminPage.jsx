import React, { useState } from "react";
import { Button, Card, Badge, Avatar, Modal, Input, Toast, SearchInput, StatCard } from "../components/common";
import { users } from "../data/mockData";

export const AdminPage = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [userList, setUserList] = useState(users);
  const [modal, setModal] = useState(null); // { type, user }
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = userList.filter(u =>
    (u.name + u.email).toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter ? u.role === roleFilter : true)
  );

  const deleteUser = (id) => {
    setUserList(prev => prev.filter(u => u.id !== id));
    setModal(null);
    showToast("User removed successfully", "error");
  };

  const resetPassword = (user) => {
    setModal(null);
    showToast(`Password reset email sent to ${user.email}`);
  };

  const toggleStatus = (id) => {
    setUserList(prev => prev.map(u => u.id === id ? {
      ...u, status: u.status === "active" ? "suspended" : "active"
    } : u));
    showToast("User status updated");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
          <p className="text-slate-500 text-sm mt-1">Manage users and system settings</p>
        </div>
        <Button icon="+" onClick={() => setModal({ type: "invite" })}>Invite User</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={userList.length} icon="👥" />
        <StatCard label="Active Users" value={userList.filter(u => u.status === "active").length} icon="🟢" />
        <StatCard label="Admins" value={userList.filter(u => u.role === "Admin").length} icon="🛡️" />
        <StatCard label="Suspended" value={userList.filter(u => u.status === "suspended").length} icon="🔴" />
      </div>

      {/* User Table */}
      <Card className="overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-5 border-b border-slate-100">
          <SearchInput placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex items-center gap-2 flex-shrink-0">
            {["", "Admin", "Editor", "Viewer"].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  roleFilter === r ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r || "All Roles"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["User", "Role", "Surveys", "Status", "Joined", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={u.name.split(" ").map(n => n[0]).join("")} size="sm" color={u.role === "Admin" ? "purple" : u.role === "Editor" ? "blue" : "green"} />
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><Badge>{u.role}</Badge></td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{u.surveys}</td>
                  <td className="px-5 py-4"><Badge>{u.status}</Badge></td>
                  <td className="px-5 py-4 text-slate-400 text-xs">{u.joined}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setModal({ type: "reset", user: u })}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Reset password"
                      >
                        Reset pwd
                      </button>
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          u.status === "active"
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </button>
                      <button
                        onClick={() => setModal({ type: "delete", user: u })}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination stub */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">Showing {filtered.length} of {userList.length} users</p>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{p}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modal?.type === "delete"}
        onClose={() => setModal(null)}
        title="Delete User"
        actions={
          <>
            <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteUser(modal.user.id)}>Delete User</Button>
          </>
        }
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🗑️</span>
          </div>
          <p className="text-slate-700 mb-2">Are you sure you want to delete <strong>{modal?.user?.name}</strong>?</p>
          <p className="text-slate-400 text-sm">This action cannot be undone. All their surveys and data will be permanently removed.</p>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={modal?.type === "reset"}
        onClose={() => setModal(null)}
        title="Reset Password"
        actions={
          <>
            <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={() => resetPassword(modal.user)}>Send Reset Email</Button>
          </>
        }
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <p className="text-slate-700 mb-2">Send a password reset link to <strong>{modal?.user?.email}</strong>?</p>
          <p className="text-slate-400 text-sm">The user will receive an email with instructions to reset their password.</p>
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal
        isOpen={modal?.type === "invite"}
        onClose={() => setModal(null)}
        title="Invite New User"
        actions={
          <>
            <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={() => { setModal(null); showToast("Invitation sent!"); }}>Send Invite</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Email Address" type="email" placeholder="user@example.com" required />
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {["Admin", "Editor", "Viewer"].map(role => (
                <label key={role} className="flex items-center justify-center gap-1.5 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 text-sm font-medium text-slate-700 text-center">
                  <input type="radio" name="role" defaultChecked={role === "Editor"} /> {role}
                </label>
              ))}
            </div>
          </div>
          <Input label="Personal Message (optional)" placeholder="Welcome to our team!" />
        </div>
      </Modal>
    </div>
  );
};
