import React, { useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from '../../App';
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { editData, fetchDataFromApi, postData, uploadImage } from "../../utils/api";
import { useNavigate } from 'react-router-dom';
import { Collapse } from "react-collapse";
import {
  User, Mail, Phone, Building2, CreditCard, IdCard, MapPin,
  Warehouse, Hash, KeyRound, ShieldCheck, Save, ChevronDown,
  ChevronUp, Camera, Lock, FileCheck, BadgeIndianRupee, Store
} from "lucide-react";

const Profile = () => {
  const [avatarPreview, setAvatarPreview]             = useState([]);
  const [uploading, setUploading]                     = useState(false);
  const [isKYCLoading, setIsKYCLoading]               = useState(false);
  const [isLoading, setIsLoading]                     = useState(false);
  const [isLoading2, setIsLoading2]                   = useState(false);
  const [userId, setUserId]                           = useState("");
  const [isChangePasswordFormShow, setisChangePasswordFormShow] = useState(false);
  const [phone, setPhone]                             = useState('');
  const [pwShow, setPwShow]                           = useState({ old: false, new: false, confirm: false });
  const fileInputRef = useRef(null);

  const [formFields, setFormsFields] = useState({
    name: '', email: '', mobile: '', gst: '', business: '',
    ifsc: '', bankAccount: '', upi: '',
    aadhaarNumber: '', panNumber: '', kycDocument: '',
    address: '', city: '', state: '', country: 'INDIA',
    pickup_location: '', pinCode: ''
  });

  const [changePassword, setChangePassword] = useState({
    email: '', oldPassword: '', newPassword: '', confirmPassword: ''
  });

  const context  = useContext(MyContext);
  const history  = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) history("/login");
  }, [context?.isLogin]);

  useEffect(() => {
    setUserId(context?.userData?._id);
    setFormsFields({
      name: context?.userData?.name,
      email: context?.userData?.email,
      mobile: context?.userData?.mobile,
      gst: context?.userData?.gst,
      business: context?.userData?.business,
      address: context?.userData?.address,
      kycDocument: context?.userData?.kyc_img,
      bankAccount: context?.userData?.bank_account,
      ifsc: context?.userData?.ifsc,
      kycNumber: context?.userData?.kyc_number,
      aadhaarNumber: context?.userData?.aadhaar_number,
      panNumber: context?.userData?.pan_number,
      city: context?.userData?.city,
      state: context?.userData?.state,
      country: context?.userData?.country || 'INDIA',
      pickup_location: context?.userData?.pickup_location,
      pinCode: context?.userData?.pin_number,
    });
    setPhone(`${context?.userData?.mobile || ''}`);
    setChangePassword({ email: context?.userData?.email });
  }, [context?.userData?._id]);

  useEffect(() => {
    if (context?.userData?.avatar) setAvatarPreview([context.userData.avatar]);
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields(prev => ({ ...prev, [name]: value }));
    setChangePassword(prev => ({ ...prev, [name]: value }));
  };

  const valideValue  = formFields.name && phone?.length === 10;
  const valideValue2 = changePassword.oldPassword && changePassword.newPassword && changePassword.confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formFields.ifsc)              { context.alertBox("error", "IFSC is required"); setIsLoading(false); return; }
    if (!formFields.bankAccount)       { context.alertBox("error", "Bank Account is required"); setIsLoading(false); return; }
    if (!formFields.name)              { context.alertBox("error", "Please enter full name"); setIsLoading(false); return; }
    if (!formFields.email)             { context.alertBox("error", "Please enter email id"); setIsLoading(false); return; }
    if (!/\d+/.test(formFields.address)) { context.alertBox("error", "Address must include house, flat, or road number"); setIsLoading(false); return; }
    if (!formFields.city)              { context.alertBox("error", "City is required"); setIsLoading(false); return; }
    if (!formFields.state)             { context.alertBox("error", "State is required"); setIsLoading(false); return; }
    if (!formFields.country)           { context.alertBox("error", "Country is required"); setIsLoading(false); return; }
    if (!formFields.pickup_location)   { context.alertBox("error", "Warehouse name is required"); setIsLoading(false); return; }
    if (!formFields.pinCode || formFields.pinCode.length !== 6) { context.alertBox("error", "Valid PIN Code is required"); setIsLoading(false); return; }
    if (!formFields.kycDocument)       { context.alertBox("error", "KYC document is required"); setIsLoading(false); return; }
    if (!formFields.mobile || formFields.mobile?.length < 10) { context.alertBox("error", "Please enter mobile number"); setIsLoading(false); return; }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!formFields.panNumber && !formFields.aadhaarNumber) { context.alertBox("error", "Please enter Aadhaar or PAN number"); setIsLoading(false); return; }
    else if (formFields.panNumber && !panRegex.test(formFields.panNumber)) { context.alertBox("error", "Invalid PAN number"); setIsLoading(false); return; }
    else if (formFields.aadhaarNumber && formFields.aadhaarNumber.length !== 12) { context.alertBox("error", "Aadhaar must be 12 digits"); setIsLoading(false); return; }
    formFields.role = "SELLER";
    editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then((res) => {
      if (res?.error !== true) { setIsLoading(false); context.alertBox("success", res?.data?.message); location.reload(); }
      else { context.alertBox("error", res?.data?.message); setIsLoading(false); }
    });
  };

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);
    if (!changePassword.oldPassword)     { context.alertBox("error", "Please enter old password");     setIsLoading2(false); return; }
    if (!changePassword.newPassword)     { context.alertBox("error", "Please enter new password");     setIsLoading2(false); return; }
    if (!changePassword.confirmPassword) { context.alertBox("error", "Please enter confirm password"); setIsLoading2(false); return; }
    if (changePassword.confirmPassword !== changePassword.newPassword) { context.alertBox("error", "Password and confirm password do not match"); setIsLoading2(false); return; }
    postData(`/api/user/reset-password`, changePassword, { withCredentials: true }).then((res) => {
      if (res?.error !== true) {
        setIsLoading2(false); context.alertBox("success", res?.message);
        setisChangePasswordFormShow(false);
        setChangePassword(s => ({ ...s, oldPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        context.alertBox("error", res?.message); setIsLoading2(false);
        setisChangePasswordFormShow(false);
        setChangePassword(s => ({ ...s, oldPassword: '', newPassword: '', confirmPassword: '' }));
      }
    });
  };

  const onChangeAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { context.alertBox("error", "Invalid image format"); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    uploadImage("/api/user/user-avatar", formData).then((res) => {
      setUploading(false);
      if (res?.data?.avtar) { setAvatarPreview([res.data.avtar]); setFormsFields(prev => ({ ...prev, avatar: res.data.avtar })); }
    });
  };

  const onChangeKyc = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { context.alertBox("error", "Invalid document format"); return; }
    setIsKYCLoading(true);
    const formData = new FormData();
    formData.append("kycDocument", file);
    uploadImage("/api/user/upload-kyc", formData).then((res) => {
      setIsKYCLoading(false);
      if (res.kycDocument) { setFormsFields(prev => ({ ...prev, kycDocument: res.kycDocument })); }
    });
  };

  const isSeller = context?.userData?.role === "SELLER";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .pf-root { font-family:'DM Sans',sans-serif; color:#fff; }

        /* ── Section Cards ── */
        .pf-card {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:20px;
          padding:28px 28px 32px;
          margin-bottom:20px;
          position:relative;
          overflow:hidden;
          transition:border-color 0.3s;
        }
        .pf-card:hover { border-color:rgba(245,158,11,0.2); }
        .pf-card::before {
          content:'';position:absolute;top:0;left:8%;right:8%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.35),transparent);
        }

        .pf-section-title {
          display:flex;align-items:center;gap:10px;
          font-size:13px;font-weight:700;letter-spacing:1.5px;
          text-transform:uppercase;color:rgba(255,255,255,0.45);
          margin-bottom:20px;padding-bottom:14px;
          border-bottom:1px solid rgba(255,255,255,0.07);
        }
        .pf-section-icon {
          width:28px;height:28px;border-radius:8px;
          display:flex;align-items:center;justify-content:center;
          background:linear-gradient(135deg,rgba(245,158,11,0.25),rgba(249,115,22,0.15));
          flex-shrink:0;
        }

        /* ── Profile Header Row ── */
        .pf-header-row {
          display:flex;align-items:flex-start;gap:20px;margin-bottom:28px;flex-wrap:wrap;
        }
        .pf-avatar-wrap {
          width:96px;height:96px;border-radius:50%;
          border:2px solid rgba(245,158,11,0.35);
          overflow:hidden;position:relative;flex-shrink:0;
          box-shadow:0 0 24px rgba(245,158,11,0.2);
          cursor:pointer;
          background:rgba(255,255,255,0.06);
          display:flex;align-items:center;justify-content:center;
        }
        .pf-avatar-wrap img { width:100%;height:100%;object-fit:cover;display:block; }
        .pf-avatar-overlay {
          position:absolute;inset:0;
          background:rgba(0,0,0,0.6);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
          opacity:0;transition:opacity 0.25s;
          border-radius:50%;
        }
        .pf-avatar-wrap:hover .pf-avatar-overlay { opacity:1; }
        .pf-avatar-overlay span { font-size:10px;font-weight:600;color:#fff;letter-spacing:0.5px; }
        .pf-header-meta { flex:1;min-width:0; }
        .pf-header-name { font-family:'DM Serif Display',serif;font-size:26px;color:#fff;margin-bottom:4px;line-height:1.2; }
        .pf-header-email { font-size:13px;color:rgba(255,255,255,0.35);margin-bottom:8px; }
        .pf-uid-badge {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(245,158,11,0.08);
          border:1px solid rgba(245,158,11,0.2);
          border-radius:100px;padding:3px 12px;
          font-size:11px;color:rgba(255,255,255,0.4);font-weight:500;
        }
        .pf-header-actions { margin-left:auto;display:flex;gap:10px;align-items:flex-start; }
        .pf-pw-toggle {
          display:flex;align-items:center;gap:7px;
          padding:9px 16px;border-radius:10px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.1);
          font-size:13px;font-weight:600;color:rgba(255,255,255,0.55);
          cursor:pointer;transition:all 0.25s;white-space:nowrap;
        }
        .pf-pw-toggle:hover { background:rgba(245,158,11,0.12);border-color:rgba(245,158,11,0.4);color:#fcd34d; }

        /* ── Grid layout ── */
        .pf-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
        @media(max-width:640px){ .pf-grid { grid-template-columns:1fr; } }
        .pf-col-full { grid-column:1/-1; }

        /* ── Field ── */
        .pf-field { display:flex;flex-direction:column;gap:6px; }
        .pf-label {
          font-size:11px;font-weight:600;letter-spacing:1px;
          text-transform:uppercase;color:rgba(255,255,255,0.35);
          display:flex;align-items:center;gap:5px;
        }
        .pf-input {
          width:100%;height:46px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:10px;color:#fff;
          font-size:14px;font-family:'DM Sans',sans-serif;
          padding:0 14px;transition:all 0.25s;outline:none;
          box-sizing:border-box;
        }
        .pf-input::placeholder { color:rgba(255,255,255,0.18); }
        .pf-input:focus { border-color:rgba(245,158,11,0.65);background:rgba(245,158,11,0.06);box-shadow:0 0 0 3px rgba(245,158,11,0.1); }
        .pf-input:disabled { opacity:0.4;cursor:not-allowed;color:#fff;-webkit-text-fill-color:rgba(255,255,255,0.4); }
        .pf-input.pf-locked {
  background: #2f2f2f !important;
  border-color: rgba(255,255,255,0.2) !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  cursor: default !important;
  opacity: 1 !important;
}
  input.pf-input.pf-locked {
  background-color: #2f2f2f !important;   /* dark grey */
  border: 1px solid rgba(255,255,255,0.15) !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  cursor: not-allowed;
  opacity: 1 !important;
}
        .pf-input.pf-basic { background:#1c1c2e !important; border-color:rgba(255,255,255,0.15) !important; }
        .pf-hint { font-size:11px;color:rgba(255,255,255,0.25); }

        /* phone row */
        .pf-phone-row { display:flex; }
        .pf-phone-code {
          height:46px;padding:0 12px;
          display:flex;align-items:center;
          background:#1c1c2e;
          border:1px solid rgba(255,255,255,0.1);
          border-right:none;border-radius:10px 0 0 10px;
          font-size:14px;font-weight:600;color:rgba(255,255,255,0.5);
          white-space:nowrap;
        }
        .pf-phone-input {
          flex:1;height:46px;
          background:#1c1c2e;
          border:1px solid rgba(255,255,255,0.1);
          border-radius:0 10px 10px 0;
          color:#fff;font-size:14px;font-family:'DM Sans',sans-serif;
          padding:0 14px;transition:all 0.25s;outline:none;box-sizing:border-box;
        }
        .pf-phone-input::placeholder { color:rgba(255,255,255,0.18); }
        .pf-phone-input:focus { border-color:rgba(245,158,11,0.65);background:rgba(245,158,11,0.06);box-shadow:0 0 0 3px rgba(245,158,11,0.1); }
        .pf-phone-input:disabled { opacity:0.4;cursor:not-allowed;color:#fff;-webkit-text-fill-color:rgba(255,255,255,0.4); }

        /* eye button */
        .pf-input-wrap { position:relative; }
        .pf-input-wrap .pf-input { padding-right:46px; }
        .pf-eye { position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.28);padding:4px;display:flex;align-items:center;transition:color 0.2s; }
        .pf-eye:hover { color:rgba(255,255,255,0.65); }

        /* ── KYC upload box ── */
        .pf-kyc-box {
          width:100%;border-radius:10px;
          border:1px dashed rgba(255,255,255,0.15);
          overflow:hidden;position:relative;
          background:rgba(255,255,255,0.03);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:border-color 0.25s;
        }
        .pf-kyc-box:hover { border-color:rgba(245,158,11,0.4); }
        .pf-kyc-box.has-img { height:140px; }
        .pf-kyc-box.no-img  { height:56px; }
        .pf-kyc-box img { width:100%;height:100%;object-fit:cover;display:block; }
        .pf-kyc-overlay {
          position:absolute;inset:0;
          background:rgba(0,0,0,0.55);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
          opacity:0;transition:opacity 0.25s;
        }
        .pf-kyc-box:hover .pf-kyc-overlay { opacity:1; }
        .pf-kyc-overlay span { font-size:11px;font-weight:600;color:#fff; }
        .pf-kyc-empty { display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.3);font-size:13px; }

        /* ── Divider ── */
        .pf-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.25),transparent);margin:24px 0; }

        /* ── Submit button ── */
        .pf-submit {
          height:50px;padding:0 28px;
          background:linear-gradient(135deg,#f59e0b 0%,#f97316 100%);
          border:none;border-radius:12px;
          color:#0a0a0f;font-size:14px;font-weight:700;
          font-family:'DM Sans',sans-serif;cursor:pointer;
          position:relative;overflow:hidden;
          transition:all 0.3s;
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          box-shadow:0 4px 20px rgba(245,158,11,0.28);
          min-width:160px;
        }
        .pf-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 12px 36px rgba(245,158,11,0.45); }
        .pf-submit:active:not(:disabled) { transform:translateY(0); }
        .pf-submit:disabled { opacity:0.38;cursor:not-allowed; }
        .pf-submit::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.2),transparent);opacity:0;transition:opacity 0.3s; }
        .pf-submit:hover:not(:disabled)::before { opacity:1; }
        .pf-submit::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent); }
        .pf-submit:hover:not(:disabled)::after { animation:pfShimmer 0.5s ease forwards; }
        @keyframes pfShimmer { to{left:140%;} }

        /* ── Change PW section ── */
        .pf-cpw-card {
          background:rgba(12,8,0,0.6);
          border:1px solid rgba(245,158,11,0.15);
          border-radius:20px;padding:28px;margin-bottom:20px;
          position:relative;overflow:hidden;
        }
        .pf-cpw-card::before {
          content:'';position:absolute;top:0;left:8%;right:8%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent);
        }

        /* match */
        .pf-match { font-size:11px;margin-top:4px;display:flex;align-items:center;gap:4px; }
        .pf-match.ok  { color:#34d399; }
        .pf-match.err { color:#f87171; }

        /* ── Status chip ── */
        .pf-status-chip {
          display:inline-flex;align-items:center;gap:5px;
          background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.25);
          border-radius:100px;padding:3px 10px;
          font-size:11px;color:#34d399;font-weight:600;
        }
      `}</style>

      <div className="pf-root">

        {/* ══ Profile Header Card ══ */}
        <div className="pf-card">
          <div className="pf-header-row">

            {/* Avatar */}
            <div className="pf-avatar-wrap" onClick={() => document.getElementById('pf-avatar-input').click()}>
              {uploading
                ? <CircularProgress size={28} sx={{ color: '#f59e0b' }} />
                : <img src={avatarPreview[0] || '/user.jpg'} alt="avatar" />
              }
              <div className="pf-avatar-overlay">
                <Camera size={18} color="#fff" />
                <span>Change</span>
              </div>
              <input id="pf-avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={onChangeAvatar} />
            </div>

            {/* Meta */}
            <div className="pf-header-meta">
              <h2 className="pf-header-name">{formFields.name || 'Seller Account'}</h2>
              <p className="pf-header-email">{formFields.email}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="pf-uid-badge">
                  <Hash size={10} /> {context?.userData?.uid || '—'}
                </div>
                {isSeller && (
                  <div className="pf-status-chip">
                    <Store size={10} /> Verified Seller
                  </div>
                )}
              </div>
            </div>

            {/* Change Password Toggle */}
            <div className="pf-header-actions">
              <button
                type="button"
                className="pf-pw-toggle"
                onClick={() => setisChangePasswordFormShow(!isChangePasswordFormShow)}
              >
                <KeyRound size={14} />
                Change Password
                {isChangePasswordFormShow ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* ══ Change Password Collapse ══ */}
        <Collapse isOpened={isChangePasswordFormShow}>
          <div className="pf-cpw-card">
            <div className="pf-section-title">
              <div className="pf-section-icon"><KeyRound size={14} color="#fcd34d" /></div>
              Update Password
            </div>

            <form onSubmit={handleSubmitChangePassword}>
              <div className="pf-grid">

                <div className="pf-field">
                  <label className="pf-label"><Lock size={11} /> Old Password</label>
                  <div className="pf-input-wrap">
                    <input type={pwShow.old ? 'text' : 'password'} className="pf-input" name="oldPassword"
                      value={changePassword.oldPassword} disabled={isLoading2} onChange={onChangeInput} placeholder="Current password" />
                    <button type="button" className="pf-eye" onClick={() => setPwShow(s => ({ ...s, old: !s.old }))}>
                      {pwShow.old ? <FaEyeSlash size={14} /> : <FaRegEye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="pf-field">
                  <label className="pf-label"><Lock size={11} /> New Password</label>
                  <div className="pf-input-wrap">
                    <input type={pwShow.new ? 'text' : 'password'} className="pf-input" name="newPassword"
                      value={changePassword.newPassword} disabled={isLoading2} onChange={onChangeInput} placeholder="New password" />
                    <button type="button" className="pf-eye" onClick={() => setPwShow(s => ({ ...s, new: !s.new }))}>
                      {pwShow.new ? <FaEyeSlash size={14} /> : <FaRegEye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="pf-field">
                  <label className="pf-label"><Lock size={11} /> Confirm Password</label>
                  <div className="pf-input-wrap">
                    <input type={pwShow.confirm ? 'text' : 'password'} className="pf-input" name="confirmPassword"
                      value={changePassword.confirmPassword} disabled={isLoading2} onChange={onChangeInput} placeholder="Re-enter new password" />
                    <button type="button" className="pf-eye" onClick={() => setPwShow(s => ({ ...s, confirm: !s.confirm }))}>
                      {pwShow.confirm ? <FaEyeSlash size={14} /> : <FaRegEye size={14} />}
                    </button>
                  </div>
                  {changePassword.confirmPassword?.length > 0 && (
                    changePassword.newPassword === changePassword.confirmPassword
                      ? <p className="pf-match ok">✓ Passwords match</p>
                      : <p className="pf-match err">✗ Passwords do not match</p>
                  )}
                </div>

              </div>

              <div className="pf-divider" />

              <button type="submit" className="pf-submit" disabled={!valideValue2 || isLoading2}>
                {isLoading2 ? <CircularProgress color="inherit" size={20} /> : <><ShieldCheck size={15} /> Update Password</>}
              </button>
            </form>
          </div>
        </Collapse>

        {/* ══ Profile Form Card ══ */}
        <form onSubmit={handleSubmit}>

          {/* ── Basic Info ── */}
          <div className="pf-card">
            <div className="pf-section-title">
              <div className="pf-section-icon"><User size={14} color="#fcd34d" /></div>
              Basic Information
            </div>
            <div className="pf-grid">

              <div className="pf-field">
                <label className="pf-label"><User size={11} /> Full Name</label>
                <input type="text" className="pf-input pf-basic" name="name"
                  value={formFields.name || ''} disabled={isLoading} onChange={onChangeInput} placeholder="Your full name" />
              </div>

              <div className="pf-field">
                <label className="pf-label"><Mail size={11} /> Email</label>
                <input type="email" className="pf-input pf-basic pf-locked" name="email"
                  value={formFields.email || ''} disabled placeholder="Email address" />
              </div>

              <div className="pf-field">
                <label className="pf-label"><Phone size={11} /> Mobile</label>
                <div className="pf-phone-row">
                  <div className="pf-phone-code">+91</div>
                  <input type="text" className="pf-phone-input" name="mobile"
                    value={phone} disabled={isLoading} maxLength={10} inputMode="numeric"
                    placeholder="10-digit number"
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      setPhone(v);
                      setFormsFields(prev => ({ ...prev, mobile: v }));
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

          {isSeller && <>

            {/* ── Banking ── */}
            <div className="pf-card">
              <div className="pf-section-title">
                <div className="pf-section-icon"><BadgeIndianRupee size={14} color="#fcd34d" /></div>
                Banking & Payouts
              </div>
              <div className="pf-grid">

                <div className="pf-field">
                  <label className="pf-label"><CreditCard size={11} /> IFSC Code</label>
                  <input type="text" className="pf-input" name="ifsc"
                    value={formFields.ifsc || ''} disabled={isLoading} onChange={onChangeInput} placeholder="e.g. HDFC0001234" />
                </div>

                <div className="pf-field">
                  <label className="pf-label"><CreditCard size={11} /> Bank Account Number</label>
                  <input type="text" className="pf-input" name="bankAccount"
                    value={formFields.bankAccount || ''} disabled={isLoading} placeholder="Account number"
                    onChange={(e) => setFormsFields(s => ({ ...s, bankAccount: e.target.value.replace(/\D/g, '') }))}
                  />
                </div>

                <div className="pf-field">
                  <label className="pf-label"><Building2 size={11} /> GST Number <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>(optional)</span></label>
                  <input type="text" className="pf-input" name="gst"
                    value={formFields.gst || ''} disabled={isLoading} onChange={onChangeInput} placeholder="Enter GST number" />
                </div>

              </div>
            </div>

            {/* ── KYC ── */}
            <div className="pf-card">
              <div className="pf-section-title">
                <div className="pf-section-icon"><IdCard size={14} color="#fcd34d" /></div>
                KYC & Identity
              </div>
              <div className="pf-grid">

                <div className="pf-field">
                  <label className="pf-label"><IdCard size={11} /> PAN Number</label>
                  <input type="text" className="pf-input" name="panNumber"
                    value={formFields.panNumber || ''} disabled={isLoading} maxLength={10}
                    placeholder="ABCDE1234F"
                    onChange={(e) => setFormsFields(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                  />
                  <span className="pf-hint">Format: ABCDE1234F</span>
                </div>

                <div className="pf-field">
                  <label className="pf-label"><IdCard size={11} /> Aadhaar Number</label>
                  <input type="text" className="pf-input" name="aadhaarNumber"
                    value={formFields.aadhaarNumber || ''} disabled={isLoading} maxLength={12}
                    placeholder="12-digit Aadhaar"
                    onChange={(e) => setFormsFields(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, '') }))}
                  />
                  <span className="pf-hint">Must be 12 digits</span>
                </div>

                <div className="pf-field pf-col-full">
                  <label className="pf-label"><FileCheck size={11} /> KYC Document</label>
                  <div
                    className={`pf-kyc-box ${formFields.kycDocument ? 'has-img' : 'no-img'}`}
                    onClick={() => fileInputRef.current.click()}
                  >
                    {isKYCLoading
                      ? <CircularProgress size={22} sx={{ color: '#f59e0b' }} />
                      : formFields.kycDocument
                        ? <>
                            <img src={formFields.kycDocument} alt="KYC" />
                            <div className="pf-kyc-overlay">
                              <FaCloudUploadAlt size={20} color="#fff" />
                              <span>Change Document</span>
                            </div>
                          </>
                        : <div className="pf-kyc-empty">
                            <FaCloudUploadAlt size={18} />
                            <span>Click to upload KYC document</span>
                          </div>
                    }
                    <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={onChangeKyc} />
                  </div>
                </div>

              </div>
            </div>

            {/* ── Address ── */}
            <div className="pf-card">
              <div className="pf-section-title">
                <div className="pf-section-icon"><MapPin size={14} color="#fcd34d" /></div>
                Pickup Address
              </div>
              <div className="pf-grid">

                <div className="pf-field pf-col-full">
                  <label className="pf-label"><MapPin size={11} /> Address Line</label>
                  <input type="text" className="pf-input" name="address"
                    value={formFields.address || ''} onChange={onChangeInput} placeholder="House/flat no., street, locality" />
                  <span className="pf-hint">Must include house, flat, or road number</span>
                </div>

                <div className="pf-field">
                  <label className="pf-label">City</label>
                  <input type="text" className="pf-input" name="city"
                    value={formFields.city || ''} onChange={onChangeInput} placeholder="City" />
                </div>

                <div className="pf-field">
                  <label className="pf-label">State</label>
                  <input type="text" className="pf-input" name="state"
                    value={formFields.state || ''} onChange={onChangeInput} placeholder="State" />
                </div>

                <div className="pf-field">
                  <label className="pf-label">Country</label>
                  <input type="text" className="!text-black pf-input pf-locked" name="country" value="INDIA" disabled />
                </div>

                <div className="pf-field">
                  <label className="pf-label"><Hash size={11} /> PIN Code</label>
                  <input type="text" className="pf-input" name="pinCode"
                    value={formFields.pinCode || ''} maxLength={6} placeholder="6-digit PIN"
                    onChange={(e) => setFormsFields(prev => ({ ...prev, pinCode: e.target.value.replace(/\D/g, '') }))}
                  />
                </div>

                <div className="pf-field">
                  <label className="pf-label"><Warehouse size={11} /> Warehouse Name</label>
                  <input type="text" className="pf-input" name="pickup_location"
                    value={formFields.pickup_location || ''} onChange={onChangeInput} placeholder="Warehouse / pickup label" />
                </div>

              </div>
            </div>

          </>}

          {/* ── Save ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 24 }}>
            <button type="submit" className="pf-submit" disabled={!valideValue || isLoading}>
              {isLoading ? <CircularProgress color="inherit" size={20} /> : <><Save size={15} /> Save Profile</>}
            </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default Profile;
