import React, { useContext, useState, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { deleteData, deleteMultipleData, fetchDataFromApi, postData } from '../../utils/api';
import { arrayToCSV, downloadCSV } from '../../utils/csvExport';
import { FaCheckDouble } from "react-icons/fa6";
import {
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineXMark,
  HiOutlineMapPin,
  HiOutlineBuildingStorefront,
  HiOutlineIdentification,
  HiOutlineBanknotes,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";
import { RiUserLine, RiStoreLine, RiShieldCheckLine } from "react-icons/ri";

const baseColumns = [
  { id: "user", label: "User" },
  { id: "wallet", label: "Wallet Balance" },
  { id: "userPh", label: "Phone" },
  { id: "verifyemail", label: "Email Status" },
  { id: "createdDate", label: "Joined" },
  { id: "live", label: "Live" },
  { id: "action", label: "" },
];

/* ── CSV export column definitions ──
   Kept separate per type since Users and Sellers carry different fields
   (Sellers add GST/PAN/Aadhaar/bank/pickup, Users don't). */
const yesNo = (v) => (v ? "Yes" : "No");
const dateOnly = (v) => (v ? String(v).split("T")[0] : "");

const USER_EXPORT_COLUMNS = [
  { key: "uid", label: "UID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Phone" },
  { key: "wallet.balance", label: "Wallet Balance", format: (v) => v ?? 0 },
  { key: "verify_email", label: "Email Verified", format: yesNo },
  { key: "status", label: "Status" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "isConfirmed", label: "Account Confirmed", format: yesNo },
  { key: "signUpWithGoogle", label: "Signed Up With Google", format: yesNo },
  { key: "createdAt", label: "Joined", format: dateOnly },
  { key: "last_login_date", label: "Last Login", format: dateOnly },
];

const SELLER_EXPORT_COLUMNS = [
  { key: "uid", label: "UID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Phone" },
  { key: "gst", label: "GST" },
  { key: "pan_number", label: "PAN" },
  { key: "aadhaar_number", label: "Aadhaar" },
  { key: "bank_account", label: "Bank Account" },
  { key: "ifsc", label: "IFSC" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pickup_location", label: "Pickup Location" },
  { key: "pin_number", label: "PIN Code" },
  { key: "status", label: "Status" },
  { key: "isLiveEnabled", label: "Live", format: yesNo },
  { key: "verify_email", label: "Email Verified", format: yesNo },
  { key: "isConfirmed", label: "Account Confirmed", format: yesNo },
  { key: "signUpWithGoogle", label: "Signed Up With Google", format: yesNo },
  { key: "wallet.balance", label: "Wallet Balance", format: (v) => v ?? 0 },
  { key: "createdAt", label: "Joined", format: dateOnly },
  { key: "last_login_date", label: "Last Login", format: dateOnly },
];

const EXPORT_PAGE_SIZE = 1000;

/* ── Confirm Dialog ── */
const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title, message, isMultiple }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-[fadeInScale_0.15s_ease-out]">
        <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-600" />

        <div className="px-6 pt-5 pb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-100 mx-auto mb-4">
            <HiOutlineTrash size={22} className="text-red-500" />
          </div>

          <h3 className="text-[15px] font-extrabold text-gray-800 text-center tracking-tight">
            {title || "Delete User?"}
          </h3>
          <p className="text-[12px] text-gray-400 text-center mt-1.5 leading-relaxed">
            {message || "This action cannot be undone. The user will be permanently removed."}
          </p>

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

/* ── Seller Details Modal ──
   Reads straight off the row's user object (already returned by the list
   API) — no extra fetch needed. Only shows fields an admin reviewing a
   seller would actually need: never password, tokens, or OTP fields.
   Aadhaar / bank account are masked by default with a per-field reveal. */
const SellerDetailsModal = ({ isOpen, onClose, user }) => {
  const [revealed, setRevealed] = useState({});
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    setRevealed({});
    setShowTransactions(false);
  }, [user?._id]);

  if (!isOpen || !user) return null;

  const toggleReveal = (key) => setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));

  const maskValue = (value) => {
    if (!value) return "";
    const str = String(value);
    return str.length <= 4 ? str : `•••• ${str.slice(-4)}`;
  };

  const kycComplete = Boolean(
    (user?.pan_number?.trim() || user?.aadhaar_number?.trim()) &&
    user?.gst?.trim() &&
    user?.bank_account?.trim() &&
    user?.ifsc?.trim()
  );

  const Field = ({ label, value, icon }) => (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 text-[12px] shrink-0">
        {icon}
        {label}
      </div>
      <span className="text-[12.5px] font-semibold text-gray-800 text-right break-words">
        {value || <span className="text-gray-300 font-normal">Not provided</span>}
      </span>
    </div>
  );

  const SensitiveField = ({ label, value, fieldKey, icon }) => (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 text-[12px] shrink-0">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[12.5px] font-semibold text-gray-800 font-mono">
          {value ? (revealed[fieldKey] ? value : maskValue(value)) : <span className="text-gray-300 font-normal font-sans">Not provided</span>}
        </span>
        {value && (
          <button onClick={() => toggleReveal(fieldKey)} className="text-gray-300 hover:text-gray-500 transition shrink-0">
            {revealed[fieldKey] ? <HiOutlineEyeSlash size={14} /> : <HiOutlineEye size={14} />}
          </button>
        )}
      </div>
    </div>
  );

  const recentTransactions = [...(user?.wallet?.transactions || [])].slice(-5).reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden max-h-[88vh] flex flex-col animate-[fadeInScale_0.15s_ease-out]">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-orange-600 shrink-0" />

        <div className="px-6 pt-5 pb-4 flex items-start gap-4 border-b border-gray-100 shrink-0">
          <img
            src={user?.avatar || "/user.jpg"}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
            onError={(e) => { e.target.src = "/user.jpg"; }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[16px] font-extrabold text-gray-800 truncate">{user?.name}</h3>
              {user?.verify_email && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-bold">
                  <FaCheckDouble size={9} /> Verified
                </span>
              )}
            </div>
            <p className="text-[11.5px] text-gray-400 mt-0.5">UID: {user?.uid || "—"}</p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${user?.status === "Active" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                {user?.status || "Unknown"}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${user?.isLiveEnabled ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                {user?.isLiveEnabled ? "● Live" : "○ Disabled"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${kycComplete ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-red-50 border-red-200 text-red-600"}`}>
                <RiShieldCheckLine size={11} />
                {kycComplete ? "KYC Complete" : "KYC Incomplete"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition shrink-0">
            <HiOutlineXMark size={18} />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1">

          <div className="bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-3 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700">
                <HiOutlineBanknotes size={16} />
                <span className="text-[12px] font-bold uppercase tracking-wide">Wallet Balance</span>
              </div>
              <span className="text-[16px] font-extrabold text-blue-700">₹{user?.wallet?.balance ?? 0}</span>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Contact</p>
            <div className="bg-gray-50/60 rounded-xl px-4">
              <Field icon={<MdOutlineMarkEmailRead size={14} />} label="Email" value={user?.email} />
              <Field icon={<MdLocalPhone size={14} />} label="Phone" value={user?.mobile} />
              <Field icon={<HiOutlineMapPin size={14} />} label="Address" value={user?.address} />
              <Field icon={<HiOutlineMapPin size={14} />} label="City / State" value={[user?.city, user?.state].filter(Boolean).join(", ")} />
              <Field icon={<HiOutlineMapPin size={14} />} label="Pickup Location" value={user?.pickup_location} />
              <Field icon={<HiOutlineMapPin size={14} />} label="PIN Code" value={user?.pin_number} />
            </div>
          </div>

          <div className="mb-5">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Business & KYC</p>
            <div className="bg-gray-50/60 rounded-xl px-4">
              <Field icon={<HiOutlineIdentification size={14} />} label="GST" value={user?.gst} />
              <Field icon={<HiOutlineIdentification size={14} />} label="PAN" value={user?.pan_number} />
              <SensitiveField icon={<HiOutlineIdentification size={14} />} label="Aadhaar" value={user?.aadhaar_number} fieldKey="aadhaar" />
              <SensitiveField icon={<HiOutlineBanknotes size={14} />} label="Bank Account" value={user?.bank_account} fieldKey="bank" />
              <Field icon={<HiOutlineBanknotes size={14} />} label="IFSC" value={user?.ifsc} />
            </div>
            {user?.kyc_img && (
              <a
                href={user.kyc_img}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center gap-2 text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                <img src={user.kyc_img} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                View KYC Document
              </a>
            )}
          </div>

          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-1.5">Account</p>
            <div className="bg-gray-50/60 rounded-xl px-4">
              <Field icon={<SlCalender size={13} />} label="Joined" value={user?.createdAt?.split("T")[0]} />
              <Field icon={<SlCalender size={13} />} label="Last Login" value={user?.last_login_date?.split("T")[0]} />
              <Field icon={<RiShieldCheckLine size={14} />} label="Account Confirmed" value={user?.isConfirmed ? "Yes" : "No"} />
              <Field icon={<RiShieldCheckLine size={14} />} label="Signed up with Google" value={user?.signUpWithGoogle ? "Yes" : "No"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Export Progress Overlay ──
   Shown while handleExportCSV is looping through pages. Progress is
   fetched-count / total (total only known after the first page returns). */
const ExportProgressOverlay = ({ state }) => {
  if (!state.loading) return null;
  const pct = state.total > 0 ? Math.min(100, Math.round((state.fetched / state.total) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs mx-4 px-6 py-6 text-center animate-[fadeInScale_0.15s_ease-out]">
        <div className="w-10 h-10 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[13px] font-bold text-gray-700">
          Exporting {state.type === "SELLER" ? "Sellers" : "Users"}…
        </p>
        <p className="text-[12px] text-gray-400 mt-1">
          {state.fetched.toLocaleString()}{state.total ? ` / ${state.total.toLocaleString()}` : ""} records
        </p>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/* ── Add Wallet Balance Modal ──
   Admin-only. Posts to /api/user/addWalletBalance, which credits the
   wallet and appends a transaction (FFTNX-prefixed id) server-side.
   onSuccess receives the returned wallet object so the parent can patch
   the row in place without a full refetch. */
const AddWalletModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const context = useContext(MyContext);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setReason("");
      setSubmitting(false);
    }
  }, [isOpen, user?._id]);

  if (!isOpen || !user) return null;

  const handleSubmit = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      context.alertBox("error", "Enter a valid amount greater than 0");
      return;
    }
    setSubmitting(true);
    try {
      const res = await postData(`/api/user/addWalletBalance`, {
        role : context?.userData?.role,
        userId: user._id,
        amount: numericAmount,
        reason: reason.trim() || undefined,
      });
      if (!res?.success) throw new Error(res?.message || "Failed to add wallet balance");
      context.alertBox("success", `₹${numericAmount} added to ${user.name}'s wallet`);
      onSuccess(user._id, res.wallet);
      onClose();
    } catch (err) {
      context.alertBox("error", err.message || "Failed to add wallet balance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!submitting ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden animate-[fadeInScale_0.15s_ease-out]">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
        <div className="px-6 pt-5 pb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 mx-auto mb-4">
            <HiOutlineBanknotes size={22} className="text-emerald-500" />
          </div>
          <h3 className="text-[15px] font-extrabold text-gray-800 text-center tracking-tight">
            Add Wallet Balance
          </h3>
          <p className="text-[12px] text-gray-400 text-center mt-1">
            {user.name} · Current balance ₹{user?.wallet?.balance ?? 0}
          </p>

          <div className="mt-4">
            <label className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Amount (₹)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              autoFocus
              disabled={submitting}
            />
          </div>

          <div className="mt-3">
            <label className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Reason (optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Promotional credit"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              disabled={submitting}
            />
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {submitting ? "Adding…" : "Add Amount"}
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
  const [detailsModal, setDetailsModal] = useState({ open: false, user: null });
  const [exportState, setExportState] = useState({ loading: false, type: null, fetched: 0, total: 0 });
  // Add-wallet-balance modal state — admin only.
  const [walletModal, setWalletModal] = useState({ open: false, user: null });

  const context = useContext(MyContext);
  const isSeller = type === "SELLER";
  const isAdmin = context?.userData?.role === "ADMIN";

  const columns = React.useMemo(() => {
    if (type === "USER") return baseColumns.filter(col => col.id !== "live");
    else return baseColumns.filter(col => col.id !== "wallet");
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

  const confirmDeleteUser = (id) => {
    if (context?.userData?.role !== "ADMIN") {
      context.alertBox("error", "Only admin can delete data");
      return;
    }
    setConfirmDialog({ open: true, userId: id, isMultiple: false });
  };

  const confirmDeleteMultiple = () => {
    if (context?.userData?.role !== "ADMIN") {
      context.alertBox("error", "Only admin can delete data");
      return;
    }
    if (sortedIds.length === 0) { context.alertBox('error', 'Please select items to delete.'); return; }
    setConfirmDialog({ open: true, userId: null, isMultiple: true });
  };

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

  const openSellerDetails = (user) => {
    setDetailsModal({ open: true, user });
  };

  const closeSellerDetails = () => {
    setDetailsModal({ open: false, user: null });
  };

  // Opens the add-wallet-balance modal — admin only.
  const openWalletModal = (user) => {
    if (!isAdmin) {
      context.alertBox("error", "Only admin can add wallet balance");
      return;
    }
    setWalletModal({ open: true, user });
  };

  const closeWalletModal = () => {
    setWalletModal({ open: false, user: null });
  };

  // Patches the row's wallet in both userData and userTotalData (the
  // latter backs the search filter) so the new balance shows immediately
  // without refetching the whole page.
  const handleWalletAddSuccess = (userId, wallet) => {
    setUserData((prev) => ({
      ...prev,
      users: prev?.users?.map((u) => (u._id === userId ? { ...u, wallet } : u)),
    }));
    setUserTotalData((prev) => ({
      ...prev,
      totalUsers: prev?.totalUsers?.map((u) => (u._id === userId ? { ...u, wallet } : u)),
    }));
  };

  const handleExportCSV = async (exportType) => {
    if (!isAdmin) {
      context.alertBox("error", "Only admin can export data");
      return;
    }
    if (exportState.loading) return;

    setExportState({ loading: true, type: exportType, fetched: 0, total: 0 });

    try {
      let allRows = [];
      let cursor = null;
      let total = 0;
      let hasMore = true;

      while (hasMore) {
        const qs = new URLSearchParams({
          role:context?.userData?.role,
          type: exportType,
          limit: EXPORT_PAGE_SIZE,
          ...(cursor ? { cursor } : {}),
        });

        const res = await fetchDataFromApi(`/api/user/exportUsers?${qs.toString()}`);

        if (!res?.success) {
          throw new Error(res?.message || "Export request failed");
        }

        allRows = allRows.concat(res.users || []);
        if (typeof res.total === "number") total = res.total;
        cursor = res.nextCursor;
        hasMore = Boolean(res.hasMore) && Boolean(cursor);

        setExportState({ loading: true, type: exportType, fetched: allRows.length, total });
      }

      const columns = exportType === "SELLER" ? SELLER_EXPORT_COLUMNS : USER_EXPORT_COLUMNS;
      const csv = arrayToCSV(allRows, columns);
      const dateStamp = new Date().toISOString().split("T")[0];
      downloadCSV(csv, `${exportType.toLowerCase()}-export-${dateStamp}.csv`);

      context.alertBox(
        "success",
        `Exported ${allRows.length} ${exportType.toLowerCase()}${allRows.length === 1 ? "" : "s"}`
      );
    } catch (err) {
      console.log(err);
      context.alertBox("error", "Export failed. Please try again.");
    } finally {
      setExportState({ loading: false, type: null, fetched: 0, total: 0 });
    }
  };

  const totalPages = userData?.totalPages || 1;
  const currentCount = userData?.users?.length || 0;

  return (
    <div className="min-h-screen">
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

      <SellerDetailsModal
        isOpen={detailsModal.open}
        onClose={closeSellerDetails}
        user={detailsModal.user}
      />

      <ExportProgressOverlay state={exportState} />

      <AddWalletModal
        isOpen={walletModal.open}
        onClose={closeWalletModal}
        user={walletModal.user}
        onSuccess={handleWalletAddSuccess}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

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

              {isAdmin && (
                <>
                  <button
                    onClick={() => handleExportCSV("USER")}
                    disabled={exportState.loading}
                    title="Download all users as CSV"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiOutlineArrowDownTray size={14} />
                    Export Users
                  </button>
                  <button
                    onClick={() => handleExportCSV("SELLER")}
                    disabled={exportState.loading}
                    title="Download all sellers as CSV"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold hover:bg-orange-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiOutlineArrowDownTray size={14} />
                    Export Sellers
                  </button>
                </>
              )}

              <div className="w-52">
                <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
            </div>
          </div>

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
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-600 cursor-pointer"
                        checked={!!user.checked}
                        onChange={(e) => handleCheckboxChange(e, user._id)}
                      />
                    </td>

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
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* wallet — balance + admin-only add button */}
                    {!isSeller && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-600">
                            ₹{user?.wallet?.balance ?? 0}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => openWalletModal(user)}
                              title="Add wallet balance"
                              className="p-1 rounded-md border border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                            >
                              <IoMdAdd size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}

                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-600">
                        <MdLocalPhone className="text-gray-400" size={14} />
                        {user?.mobile || <span className="text-gray-300 font-normal">N/A</span>}
                      </span>
                    </td>

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

                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                        <SlCalender size={12} className="text-gray-400" />
                        {user?.createdAt?.split("T")[0]}
                      </span>
                    </td>

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

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        {isSeller && (
                          <button
                            onClick={() => openSellerDetails(user)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
                            title="View seller details"
                          >
                            <HiOutlineEye size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => confirmDeleteUser(user._id)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Delete user"
                        >
                          <HiOutlineTrash size={15} />
                        </button>
                      </div>
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

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
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