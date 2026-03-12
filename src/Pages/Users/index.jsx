import React, { useContext, useState, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { deleteData, deleteMultipleData, fetchDataFromApi, postData } from '../../utils/api';
import { FaCheckDouble } from "react-icons/fa6";
import { HiOutlineTrash } from "react-icons/hi2";
import { RiUserLine, RiStoreLine, RiShieldCheckLine } from "react-icons/ri";

const baseColumns = [
  { id: "user", label: "User" },
  { id: "userPh", label: "Phone" },
  { id: "verifyemail", label: "Email Status" },
  { id: "createdDate", label: "Joined" },
  { id: "live", label: "Live" },
  { id: "action", label: "" },
];

/* ── Confirm Dialog ── */
const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title, message, isMultiple }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-[fadeInScale_0.15s_ease-out]">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-600" />

        <div className="px-6 pt-5 pb-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-100 mx-auto mb-4">
            <HiOutlineTrash size={22} className="text-red-500" />
          </div>

          {/* Text */}
          <h3 className="text-[15px] font-extrabold text-gray-800 text-center tracking-tight">
            {title || "Delete User?"}
          </h3>
          <p className="text-[12px] text-gray-400 text-center mt-1.5 leading-relaxed">
            {message || "This action cannot be undone. The user will be permanently removed."}
          </p>

          {/* Buttons */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={onCancel}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition shadow-sm"
            >
              {isMultiple ? "Delete All" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Users = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [userData, setUserData] = useState([]);
  const [userTotalData, setUserTotalData] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState("USER");
  const [sortedIds, setSortedIds] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null, isMultiple: false });

  const context = useContext(MyContext);
  const isSeller = type === "SELLER";

  const columns = React.useMemo(() => {
    if (type === "USER") return baseColumns.filter(col => col.id !== "live");
    return baseColumns;
  }, [type]);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  useEffect(() => {
    getUsers(page, rowsPerPage, type);
  }, [type, page, rowsPerPage]);

  const getUsers = (page, limit, type) => {
    setIsloading(true);
    setPage(page);
    fetchDataFromApi(`/api/user/getAllUsers?page=${page + 1}&limit=${limit}&type=${type}`).then((res) => {
      setUserData(res);
      setUserTotalData(res);
      setIsloading(false);
    });
  };

  useEffect(() => {
    if (searchQuery !== "") {
      const filteredItems = userTotalData?.totalUsers?.filter((user) =>
        user._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.createdAt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUserData({
        error: false, success: true,
        users: filteredItems, total: filteredItems?.length,
        page: parseInt(page),
        totalPages: Math.ceil(filteredItems?.length / rowsPerPage),
        totalUsersCount: userData?.totalUsersCount
      });
    } else {
      getUsers(page, rowsPerPage, type);
    }
  }, [searchQuery]);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const updatedItems = userData?.users?.map((item) => ({ ...item, checked: isChecked }));
    setUserData({ ...userData, users: updatedItems });
    setSortedIds(isChecked ? updatedItems.map((i) => i._id).sort() : []);
  };

  const handleCheckboxChange = (e, id) => {
    const updatedItems = userData?.users?.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item
    );
    setUserData({ ...userData, users: updatedItems });
    setSortedIds(updatedItems.filter((i) => i.checked).map((i) => i._id).sort());
  };

  const toggleUserLive = async (userId) => {
    try {
      await postData(`/api/user/toggleUserLive`, { userId });
      getUsers(page, rowsPerPage, type);
    } catch (err) { console.log(err); }
  };

  // Open confirm for single delete
  const confirmDeleteUser = (id) => {
    if (context?.userData?.role !== "ADMIN") {
      context.alertBox("error", "Only admin can delete data");
      return;
    }
    setConfirmDialog({ open: true, userId: id, isMultiple: false });
  };

  // Open confirm for bulk delete
  const confirmDeleteMultiple = () => {
    if (context?.userData?.role !== "ADMIN") {
      context.alertBox("error", "Only admin can delete data");
      return;
    }
    if (sortedIds.length === 0) { context.alertBox('error', 'Please select items to delete.'); return; }
    setConfirmDialog({ open: true, userId: null, isMultiple: true });
  };

  // Actual delete after confirmation
  const handleConfirmDelete = () => {
    if (confirmDialog.isMultiple) {
      deleteMultipleData(`/api/user/deleteMultiple`, { data: { ids: sortedIds } }).then(() => {
        getUsers(page, rowsPerPage, type);
        context.alertBox("success", "Users deleted");
        setSortedIds([]);
      });
    } else {
      deleteData(`/api/user/deleteUser/${confirmDialog.userId}`).then(() => getUsers(page, rowsPerPage, type));
    }
    setConfirmDialog({ open: false, userId: null, isMultiple: false });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, userId: null, isMultiple: false });
  };

  const totalPages = userData?.totalPages || 1;
  const currentCount = userData?.users?.length || 0;

  return (
    <div className="min-h-screen">
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isMultiple={confirmDialog.isMultiple}
        title={confirmDialog.isMultiple ? `Delete ${sortedIds.length} Users?` : "Delete User?"}
        message={
          confirmDialog.isMultiple
            ? `${sortedIds.length} users will be permanently removed. This cannot be undone.`
            : "This user will be permanently removed. This action cannot be undone."
        }
      />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            {/* Title + Stats */}
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSeller ? 'bg-orange-100' : 'bg-blue-100'}`}>
                {isSeller
                  ? <RiStoreLine size={20} className="text-orange-600" />
                  : <RiUserLine size={20} className="text-blue-600" />}
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-gray-800 tracking-tight">
                  {isSeller ? "Sellers" : "Users"} List
                </h2>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {userData?.totalUsersCount ?? 0} total &nbsp;·&nbsp; page {page + 1} of {totalPages}
                </p>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {sortedIds.length > 0 && (
                <button
                  onClick={confirmDeleteMultiple}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                >
                  <HiOutlineTrash size={14} />
                  Delete {sortedIds.length} selected
                </button>
              )}
              <div className="w-52">
                <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
            </div>
          </div>

          {/* Type toggle */}
          <div className="flex gap-2 mt-4">
            {["USER", "SELLER"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all duration-150
                  ${type === t
                    ? t === "SELLER"
                      ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                      : "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
              >
                {t === "USER" ? "Users" : "Sellers"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-600 cursor-pointer"
                    onChange={handleSelectAll}
                    checked={userData?.users?.length > 0 && userData?.users?.every((i) => i.checked)}
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-widest text-gray-400"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                      <span className="text-xs text-gray-400 font-medium">Loading users…</span>
                    </div>
                  </td>
                </tr>
              ) : userData?.users?.length > 0 ? (
                userData.users.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b border-gray-50 transition-colors duration-100
                      ${user.checked ? 'bg-blue-50/70' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}
                      hover:bg-blue-50/50`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-600 cursor-pointer"
                        checked={!!user.checked}
                        onChange={(e) => handleCheckboxChange(e, user._id)}
                      />
                    </td>

                    {/* User Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={user?.avatar || "/user.jpg"}
                            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={(e) => { e.target.src = "/user.jpg"; }}
                          />
                          {user?.verify_email && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-[13px] leading-tight">{user?.name}</p>
                          <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <MdOutlineMarkEmailRead size={12} />
                            {user?.email?.slice(0, 5)}***{user?.email?.split('@')[1] ? `@${user.email.split('@')[1]}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-600">
                        <MdLocalPhone className="text-gray-400" size={14} />
                        {user?.mobile || <span className="text-gray-300 font-normal">N/A</span>}
                      </span>
                    </td>

                    {/* Email Verify */}
                    <td className="px-4 py-3">
                      {user?.verify_email ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                          <FaCheckDouble size={10} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold">
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                        <SlCalender size={12} className="text-gray-400" />
                        {user?.createdAt?.split("T")[0]}
                      </span>
                    </td>

                    {/* Live toggle — sellers only */}
                    {isSeller && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleUserLive(user._id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all
                            ${user?.isLiveEnabled
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}
                        >
                          {user?.isLiveEnabled ? "● Live" : "○ Disabled"}
                        </button>
                      </td>
                    )}

                    {/* Delete */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => confirmDeleteUser(user._id)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Delete user"
                      >
                        <HiOutlineTrash size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <RiUserLine size={22} className="text-gray-300" />
                      </div>
                      <p className="text-sm font-semibold text-gray-400">No users found</p>
                      <p className="text-xs text-gray-300">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          {/* Rows per page */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {[25, 50, 100, 150, 200].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Page info + nav */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-2">
              Page <span className="text-gray-700 font-bold">{page + 1}</span> of <span className="text-gray-700 font-bold">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs font-bold"
            >
              ‹
            </button>
            {/* Page number pills */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-bold transition
                    ${p === page
                      ? isSeller
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300'}`}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs font-bold"
            >
              ›
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Users;
