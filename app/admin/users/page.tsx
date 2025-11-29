// app/admin/users/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AppUserSummary,
  adminCreateUser,
  adminDeleteUser,
  adminUpdateUser,
  getUsers,
  updateUserRole,
} from "@/src/libs/api";

type UsersTab = "admins" | "all";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRoleId, setSavingRoleId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // فرم ساخت کاربر جدید
  const [newUserName, setNewUserName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // تب‌ها: فقط مدیرها / همه کاربران
  const [activeTab, setActiveTab] = useState<UsersTab>("admins");

  // فرم ویرایش کاربر
  const [editId, setEditId] = useState<number | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);

    getUsers()
      .then((u) => setUsers(u))
      .catch((err: any) => {
        console.error(err);
        setError("گرفتن لیست کاربران با خطا مواجه شد.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRole = async (user: AppUserSummary) => {
    setSavingRoleId(user.id);
    setError(null);
    try {
      await updateUserRole(user.id, !user.isAdmin);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u
        )
      );
    } catch (err: any) {
      console.error(err);
      setError("تغییر نقش کاربر با خطا مواجه شد.");
    } finally {
      setSavingRoleId(null);
    }
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreateSuccess(null);
    setCreating(true);

    try {
      const user = await adminCreateUser({
        userName: newUserName,
        email: newEmail,
        password: newPassword,
        isAdmin: newIsAdmin,
      });

      setUsers((prev) => [user, ...prev]);
      setCreateSuccess(`کاربر «${user.userName}» با موفقیت ایجاد شد.`);

      setNewUserName("");
      setNewEmail("");
      setNewPassword("");
      setNewIsAdmin(false);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "ایجاد کاربر جدید با خطا مواجه شد."
      );
    } finally {
      setCreating(false);
    }
  };

  const admins = users.filter((u) => u.isAdmin);
  const listToShow =
    activeTab === "admins" ? admins : users;

  const startEdit = (user: AppUserSummary) => {
    setEditId(user.id);
    setEditUserName(user.userName);
    setEditEmail(user.email);
    setEditIsAdmin(user.isAdmin);
    setEditMessage(null);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editId == null) return;

    setSavingEdit(true);
    setError(null);
    setEditMessage(null);

    try {
      const updated = await adminUpdateUser(editId, {
        userName: editUserName,
        email: editEmail,
        isAdmin: editIsAdmin,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
      setEditMessage("تغییرات کاربر با موفقیت ذخیره شد.");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "ویرایش کاربر با خطا مواجه شد."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteUser = async (user: AppUserSummary) => {
    if (!confirm(`کاربر «${user.userName}» حذف شود؟`)) return;

    setDeletingId(user.id);
    setError(null);
    setEditMessage(null);

    try {
      await adminDeleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (editId === user.id) {
        setEditId(null);
        setEditUserName("");
        setEditEmail("");
        setEditIsAdmin(false);
      }
    } catch (err: any) {
      console.error(err);
      setError("حذف کاربر با خطا مواجه شد.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-3xl bg-slate-900/85 border border-slate-800 rounded-3xl p-6 space-y-5">
        {/* عنوان + تب‌ها */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold">
            مدیریت کاربران
          </h2>

          <div className="inline-flex rounded-full bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("admins")}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition
              ${
                activeTab === "admins"
                  ? "bg-emerald-400 text-slate-900"
                  : "text-slate-200"
              }`}
            >
              کاربران مدیر
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition
              ${
                activeTab === "all"
                  ? "bg-sky-500 text-slate-900"
                  : "text-slate-200"
              }`}
            >
              لیست همه کاربران
            </button>
          </div>
        </div>

        {/* فرم ساخت کاربر جدید */}
        <form
          onSubmit={handleCreateUser}
          className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-4"
        >
          <h3 className="text-lg font-bold mb-1">
            افزودن کاربر جدید
          </h3>

          {createSuccess && (
            <div className="rounded-lg border border-emerald-400/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
              {createSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                نام کاربری
              </label>
              <input
                type="text"
                required
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                ایمیل
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                رمز عبور
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                id="newIsAdmin"
                type="checkbox"
                checked={newIsAdmin}
                onChange={(e) => setNewIsAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-400 focus:ring-emerald-400"
              />
              <label
                htmlFor="newIsAdmin"
                className="text-sm font-semibold text-slate-300"
              >
                این کاربر ادمین باشد
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-sm font-extrabold text-slate-900 transition disabled:opacity-60"
            >
              {creating ? "در حال ایجاد..." : "افزودن کاربر"}
            </button>
          </div>
        </form>

        {/* خطا */}
        {error && (
          <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-2 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* لیست کاربران */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          {loading ? (
            <p className="text-sm text-slate-300 text-center">
              در حال بارگذاری کاربران...
            </p>
          ) : listToShow.length === 0 ? (
            <p className="text-sm text-slate-300 text-center">
              {activeTab === "admins"
                ? "هنوز هیچ کاربر مدیری ثبت نشده است."
                : "هنوز کاربری ثبت نشده است."}
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {listToShow.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {user.userName}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {user.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.isAdmin
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50"
                          : "bg-slate-700/40 text-slate-200 border border-slate-500/60"
                      }`}
                    >
                      {user.isAdmin ? "ادمین" : "کاربر عادی"}
                    </span>

                    <button
                      type="button"
                      disabled={savingRoleId === user.id}
                      onClick={() => toggleRole(user)}
                      className="px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold text-xs transition disabled:opacity-60"
                    >
                      {savingRoleId === user.id
                        ? "ذخیره..."
                        : user.isAdmin
                        ? "تبدیل به عادی"
                        : "تبدیل به ادمین"}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(user)}
                      className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs"
                    >
                      ویرایش
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === user.id}
                      onClick={() => handleDeleteUser(user)}
                      className="px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-400 text-slate-50 font-bold text-xs disabled:opacity-60"
                    >
                      {deletingId === user.id ? "حذف..." : "حذف"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* فرم ویرایش کاربر انتخاب‌شده */}
        {editId != null && (
          <form
            onSubmit={handleEditSubmit}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                ویرایش کاربر انتخاب‌شده
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setEditUserName("");
                  setEditEmail("");
                  setEditIsAdmin(false);
                  setEditMessage(null);
                }}
                className="text-xs font-bold text-slate-300 hover:text-red-400"
              >
                بستن
              </button>
            </div>

            {editMessage && (
              <div className="rounded-lg border border-emerald-400/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                {editMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  نام کاربری
                </label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  ایمیل
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="editIsAdmin"
                type="checkbox"
                checked={editIsAdmin}
                onChange={(e) => setEditIsAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-400 focus:ring-emerald-400"
              />
              <label
                htmlFor="editIsAdmin"
                className="text-sm font-semibold text-slate-300"
              >
                این کاربر ادمین باشد
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingEdit}
                className="px-6 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-sm font-extrabold text-slate-900 transition disabled:opacity-60"
              >
                {savingEdit ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
