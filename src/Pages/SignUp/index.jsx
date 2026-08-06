import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import CircularProgress from '@mui/material/CircularProgress';
import { fetchDataFromApi, postData } from '../../utils/api.js';
import { MyContext } from "../../App.jsx";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { ShoppingCart, UserPlus, ShieldCheck, TrendingUp, Store, Rocket, BadgeIndianRupee, Star, PackageCheck, ArrowLeft, ShieldQuestion } from "lucide-react";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const BG_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=85&fit=crop";

const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=seller4&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=seller5&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=seller6&backgroundColor=c0aede",
];

const RESEND_SECONDS = 60;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("details"); // "details" | "otp"
  const [formFields, setFormFields] = useState({ name: "", email: "", mobile: "" });
  const [otp, setOtp] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    fetchDataFromApi("/api/logo").then((res) => {
      localStorage.setItem('logo', res?.logo[0]?.logo);
    });
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [resendTimer]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const valideValue = formFields.name && formFields.email && formFields.mobile?.length === 10;

  // ── Step 1: submit details, get OTP sent to mobile ──
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.name)                  { context.alertBox("error", "Please enter full name"); setIsLoading(false); return; }
    if (!formFields.email)                 { context.alertBox("error", "Please enter email id"); setIsLoading(false); return; }
    if (formFields.mobile?.length !== 10)  { context.alertBox("error", "Please enter a valid 10-digit mobile number"); setIsLoading(false); return; }

    const payload = { ...formFields, role: "SELLER" };

    postData("/api/user/sellerRegister", payload).then((res) => {
      setIsLoading(false);
      if (res?.error !== true) {
        context.alertBox("success", res?.message || "OTP sent to your mobile number");
        setSessionToken(res?.data?.sessionToken || "");
        setMaskedMobile(res?.data?.mobile || "");
        setStep("otp");
        setResendTimer(RESEND_SECONDS);
      } else {
        context.alertBox("error", res?.message);
      }
    }).catch(() => {
      setIsLoading(false);
      context.alertBox("error", "Something went wrong, please try again");
    });
  };

  // ── Step 2: verify OTP ──
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) { context.alertBox("error", "Please enter the 6-digit OTP"); return; }

    setIsLoading(true);
    postData("/api/user/verifyRegisterOtp", { sessionToken, otp }).then((res) => {
      setIsLoading(false);
      if (res?.error !== true) {
        context.alertBox("success", res?.message || "Registration verified successfully");
        history("/login");
      } else {
        if (res?.sessionExpired) {
          context.alertBox("error", "Session expired, please start again");
          setStep("details");
          setOtp("");
        } else {
          context.alertBox("error", res?.message);
        }
      }
    }).catch(() => {
      setIsLoading(false);
      context.alertBox("error", "Something went wrong, please try again");
    });
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    postData("/api/user/resendRegisterOtp", { sessionToken }).then((res) => {
      setIsLoading(false);
      if (res?.error !== true) {
        context.alertBox("success", "OTP resent");
        setSessionToken(res?.data?.sessionToken || sessionToken);
        setMaskedMobile(res?.data?.mobile || maskedMobile);
        setResendTimer(RESEND_SECONDS);
      } else {
        context.alertBox("error", res?.message);
        if (res?.message?.toLowerCase().includes("expired")) {
          setStep("details");
          setOtp("");
        }
      }
    }).catch(() => {
      setIsLoading(false);
      context.alertBox("error", "Something went wrong, please try again");
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .ss-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #080810;
          position: relative;
          overflow: hidden;
          color: #fff;
        }

        .ss-bg-img { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .ss-bg-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
          opacity: 0;
          transition: opacity 1.4s ease;
        }
        .ss-bg-img img.ss-loaded { opacity: 1; }
        .ss-bg-img::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(160deg,
            rgba(8,8,16,0.94) 0%,
            rgba(8,8,16,0.76) 45%,
            rgba(8,8,16,0.88) 100%);
        }

        .ss-orb { position:fixed;border-radius:50%;filter:blur(100px);opacity:0.22;pointer-events:none;animation:ssOrb 14s ease-in-out infinite alternate;z-index:1; }
        .ss-orb-1 { width:700px;height:700px;background:radial-gradient(circle,#f59e0b 0%,transparent 65%);top:-250px;left:-180px;animation-duration:16s; }
        .ss-orb-2 { width:550px;height:550px;background:radial-gradient(circle,#7c3aed 0%,transparent 65%);bottom:-150px;right:-100px;animation-duration:11s;animation-delay:-5s; }
        .ss-orb-3 { width:380px;height:380px;background:radial-gradient(circle,#fb923c 0%,transparent 65%);top:60%;left:52%;transform:translate(-50%,-50%);opacity:0.14;animation-duration:20s;animation-delay:-11s; }
        .ss-orb-4 { width:250px;height:250px;background:radial-gradient(circle,#06b6d4 0%,transparent 65%);top:30%;right:15%;opacity:0.1;animation-duration:9s;animation-delay:-3s; }
        @keyframes ssOrb {
          0%   { transform:translate(0,0) scale(1); }
          100% { transform:translate(40px,30px) scale(1.08); }
        }

        .ss-grid {
          position:fixed;inset:0;z-index:1;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
          background-size:64px 64px;
          pointer-events:none;
          mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 85%);
        }

        .ss-noise {
          position:fixed;inset:0;pointer-events:none;opacity:0.035;z-index:1;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .ss-header {
          position:fixed;top:0;left:0;right:0;
          padding:16px 40px;
          display:flex;align-items:center;justify-content:space-between;
          backdrop-filter:blur(24px);
          background:rgba(8,8,16,0.5);
          border-bottom:1px solid rgba(255,255,255,0.06);
          z-index:100;
        }
        .ss-logo-mark { display:flex;align-items:center;gap:12px;text-decoration:none; }
        .ss-logo-icon {
          width:38px;height:38px;
          background:linear-gradient(135deg,#f59e0b,#f97316);
          border-radius:10px;display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 22px rgba(245,158,11,0.45);
        }
        .ss-logo-text { font-family:'DM Serif Display',serif;font-size:22px;background:linear-gradient(135deg,#fcd34d,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1; }
        .ss-logo-sub  { font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.28);text-transform:uppercase;margin-top:2px; }
        .ss-seller-chip {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.28);
          border-radius:100px;padding:5px 14px;
          font-size:11px;font-weight:600;letter-spacing:1px;
          color:#fcd34d;text-transform:uppercase;
        }
        .ss-nav-btn { display:flex;align-items:center;gap:6px;padding:8px 20px;border-radius:100px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.55);background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);transition:all 0.25s;text-decoration:none;cursor:pointer; }
        .ss-nav-btn:hover { background:rgba(245,158,11,0.18);border-color:rgba(245,158,11,0.45);color:#fff; }
        .ss-nav-btns { display:flex;gap:10px;align-items:center; }
        @media(max-width:640px){ .ss-nav-btns{display:none;} }

        .ss-main {
          min-height:100vh;
          display:flex;align-items:center;justify-content:center;
          padding:100px 20px 60px;
          position:relative;z-index:10;
        }
        .ss-wrap {
          width:100%;max-width:960px;
          display:grid;grid-template-columns:1fr 1.15fr;gap:0;
          border-radius:28px;overflow:hidden;
          box-shadow:
            0 50px 100px rgba(0,0,0,0.75),
            0 0 0 1px rgba(245,158,11,0.12),
            inset 0 1px 0 rgba(255,255,255,0.06);
          opacity:0;transform:translateY(36px);
          animation:ssReveal 0.75s cubic-bezier(0.22,1,0.36,1) forwards 0.15s;
        }
        @keyframes ssReveal { to{opacity:1;transform:translateY(0);} }
        @media(max-width:740px){
          .ss-wrap{grid-template-columns:1fr;max-width:480px;}
          .ss-banner{display:none;}
        }

        .ss-banner {
          background:linear-gradient(165deg,rgba(19,13,0,0.96) 0%,rgba(13,13,10,0.94) 45%,rgba(18,9,0,0.96) 100%);
          border-right:1px solid rgba(245,158,11,0.1);
          padding:44px 36px 36px;
          display:flex;flex-direction:column;justify-content:space-between;
          position:relative;overflow:hidden;
          backdrop-filter:blur(2px);
        }
        .ss-banner::before {
          content:'';position:absolute;inset:0;
          background:
            radial-gradient(ellipse at 10% 10%,rgba(245,158,11,0.22) 0%,transparent 55%),
            radial-gradient(ellipse at 85% 85%,rgba(249,115,22,0.16) 0%,transparent 55%),
            radial-gradient(ellipse at 60% 30%,rgba(124,58,237,0.08) 0%,transparent 50%);
          pointer-events:none;
        }

        .ss-sparkle {
          position:absolute;width:3px;height:3px;border-radius:50%;
          background:#fcd34d;opacity:0;
          animation:ssSparkle 4s ease-in-out infinite;
        }
        .ss-sparkle:nth-child(1){top:18%;left:12%;animation-delay:0s;}
        .ss-sparkle:nth-child(2){top:45%;left:85%;animation-delay:1.4s;}
        .ss-sparkle:nth-child(3){top:72%;left:30%;animation-delay:2.8s;}
        .ss-sparkle:nth-child(4){top:85%;left:68%;animation-delay:0.7s;background:#fb923c;}
        @keyframes ssSparkle {
          0%,100%{opacity:0;transform:scale(0);}
          50%{opacity:0.8;transform:scale(1);}
        }

        .ss-rocket-deco {
          position:absolute;bottom:110px;right:20px;
          width:150px;height:80px;
          opacity:0.22;pointer-events:none;
        }

        .ss-banner-top { position:relative;z-index:1; }
        .ss-banner-badge {
          display:inline-flex;align-items:center;gap:6px;
          background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(249,115,22,0.1));
          border:1px solid rgba(245,158,11,0.35);
          border-radius:100px;padding:5px 14px;
          font-size:11px;font-weight:600;letter-spacing:1.5px;
          color:#fcd34d;text-transform:uppercase;margin-bottom:24px;
          box-shadow:0 0 20px rgba(245,158,11,0.15);
        }
        .ss-banner-heading {
          font-family:'DM Serif Display',serif;
          font-size:33px;line-height:1.15;color:#fff;margin-bottom:12px;
        }
        .ss-banner-heading em {
          font-style:italic;
          background:linear-gradient(135deg,#fcd34d,#fb923c);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .ss-banner-desc { font-size:13.5px;color:rgba(255,255,255,0.38);line-height:1.75;margin-bottom:26px; }

        .ss-stats { display:flex;gap:8px;margin-bottom:22px;flex-wrap:wrap; }
        .ss-stat {
          background:rgba(245,158,11,0.07);
          border:1px solid rgba(245,158,11,0.16);
          border-radius:10px;padding:10px 12px;flex:1;min-width:72px;
          transition:background 0.2s;
        }
        .ss-stat:hover { background:rgba(245,158,11,0.13); }
        .ss-stat-num { font-family:'DM Serif Display',serif;font-size:20px;color:#fcd34d;line-height:1; }
        .ss-stat-label { font-size:10px;color:rgba(255,255,255,0.3);margin-top:3px; }

        .ss-perks { display:flex;flex-direction:column;gap:8px; }
        .ss-perk {
          display:flex;align-items:center;gap:12px;
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:12px;padding:11px 13px;
          transition:all 0.25s;
        }
        .ss-perk:hover { background:rgba(245,158,11,0.07);border-color:rgba(245,158,11,0.2); }
        .ss-perk-icon { width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .ss-perk-text h5 { font-size:13px;font-weight:600;color:#fff;margin:0 0 2px; }
        .ss-perk-text p  { font-size:11px;color:rgba(255,255,255,0.28);margin:0; }

        .ss-social-proof {
          position:relative;z-index:1;margin-top:24px;
          padding-top:18px;border-top:1px solid rgba(255,255,255,0.06);
          display:flex;align-items:center;gap:12px;
        }
        .ss-avatars { display:flex; }
        .ss-avatar {
          width:28px;height:28px;border-radius:50%;
          border:2px solid rgba(13,13,10,0.9);
          overflow:hidden;margin-left:-8px;background:#1a1a2e;
        }
        .ss-avatar:first-child { margin-left:0; }
        .ss-avatar img { width:100%;height:100%;object-fit:cover;display:block; }
        .ss-proof-text { font-size:11px;color:rgba(255,255,255,0.28);line-height:1.5; }
        .ss-proof-text strong { color:rgba(255,255,255,0.55);font-weight:600; }
        .ss-stars { display:flex;gap:2px;margin-bottom:2px; }

        .ss-form-side {
          background:rgba(12,12,20,0.82);
          backdrop-filter:blur(28px);
          padding:40px 42px;
          display:flex;flex-direction:column;justify-content:center;
          border-left:1px solid rgba(255,255,255,0.06);
          position:relative;
        }
        .ss-form-side::before {
          content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.5),transparent);
        }
        @media(max-width:520px){ .ss-form-side{padding:32px 24px;} }

        .ss-form-head { margin-bottom:20px; }
        .ss-back-btn {
          display:inline-flex;align-items:center;gap:5px;
          background:none;border:none;cursor:pointer;
          font-size:12px;color:rgba(255,255,255,0.4);
          padding:0;margin-bottom:14px;font-family:'DM Sans',sans-serif;
          transition:color 0.2s;
        }
        .ss-back-btn:hover { color:#fcd34d; }
        .ss-form-eyebrow { font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.28);font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px; }
        .ss-form-eyebrow::before { content:'';display:block;width:18px;height:1px;background:rgba(245,158,11,0.5); }
        .ss-form-title { font-family:'DM Serif Display',serif;font-size:27px;color:#fff;margin-bottom:6px;line-height:1.2; }
        .ss-form-title em { font-style:italic;background:linear-gradient(135deg,#fcd34d,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .ss-form-sub { font-size:13px;color:rgba(255,255,255,0.32); }
        .ss-form-sub strong { color:rgba(255,255,255,0.6); }

        .ss-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent);margin-bottom:18px; }

        .ss-field { margin-bottom:13px; }
        .ss-label { font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:7px;display:block; }
        .ss-input-wrap { position:relative; }
        .ss-input {
          width:100%;height:48px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;color:#fff;
          font-size:14px;font-family:'DM Sans',sans-serif;
          padding:0 16px;transition:all 0.25s;outline:none;
          box-sizing:border-box;
        }
        .ss-input::placeholder { color:rgba(255,255,255,0.18); }
        .ss-input:focus {
          border-color:rgba(245,158,11,0.65);
          background:rgba(245,158,11,0.06);
          box-shadow:0 0 0 3px rgba(245,158,11,0.1),0 2px 20px rgba(245,158,11,0.08);
        }
        .ss-input:disabled { opacity:0.45;cursor:not-allowed; }
        .ss-otp-input {
          letter-spacing:8px;font-size:20px;font-weight:600;text-align:center;
        }

        .ss-phone-row { display:flex; }
        .ss-country-code {
          height:48px;min-width:56px;
          display:flex;align-items:center;justify-content:center;
          background:rgba(245,158,11,0.1);
          border:1px solid rgba(255,255,255,0.1);
          border-right:none;border-radius:12px 0 0 12px;
          font-size:14px;font-weight:600;color:rgba(255,255,255,0.5);
          padding:0 12px;white-space:nowrap;
        }
        .ss-phone-input {
          flex:1;height:48px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:0 12px 12px 0;
          color:#fff;font-size:14px;
          font-family:'DM Sans',sans-serif;
          padding:0 16px;transition:all 0.25s;outline:none;
          box-sizing:border-box;
        }
        .ss-phone-input::placeholder { color:rgba(255,255,255,0.18); }
        .ss-phone-input:focus { border-color:rgba(245,158,11,0.65);background:rgba(245,158,11,0.06);box-shadow:0 0 0 3px rgba(245,158,11,0.1); }
        .ss-phone-input:disabled { opacity:0.45;cursor:not-allowed; }
        .ss-mobile-err { font-size:11px;color:#f87171;margin-top:5px; }

        .ss-otp-hint {
          display:flex;align-items:center;gap:8px;
          background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);
          border-radius:10px;padding:10px 12px;margin-bottom:16px;
          font-size:12.5px;color:rgba(255,255,255,0.55);
        }

        .ss-resend-row { display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;font-size:12.5px;color:rgba(255,255,255,0.32); }
        .ss-resend-btn { background:none;border:none;color:#fcd34d;font-weight:600;font-size:12.5px;cursor:pointer;font-family:'DM Sans',sans-serif;padding:0; }
        .ss-resend-btn:disabled { color:rgba(255,255,255,0.25);cursor:not-allowed; }

        .ss-terms {
          display:flex;align-items:flex-start;gap:9px;
          font-size:13px;color:rgba(255,255,255,0.35);
          margin-bottom:12px;
        }
        .ss-terms input[type=checkbox] { width:15px;height:15px;accent-color:#f59e0b;cursor:pointer;margin-top:2px;flex-shrink:0; }
        .ss-terms a { color:#fcd34d;font-weight:600;text-decoration:none;transition:color 0.2s; }
        .ss-terms a:hover { color:#fb923c;text-decoration:underline; }

        .ss-login-row { display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;font-size:13px;color:rgba(255,255,255,0.32); }
        .ss-login-link { color:#fcd34d;font-weight:600;text-decoration:none;transition:color 0.2s; }
        .ss-login-link:hover { color:#fb923c; }

        .ss-submit {
          width:100%;height:52px;
          background:linear-gradient(135deg,#f59e0b 0%,#f97316 100%);
          border:none;border-radius:12px;
          color:#0a0a0f;font-size:15px;font-weight:700;
          font-family:'DM Sans',sans-serif;cursor:pointer;
          position:relative;overflow:hidden;
          transition:all 0.3s;margin-bottom:14px;
          display:flex;align-items:center;justify-content:center;gap:8px;
          box-shadow:0 4px 24px rgba(245,158,11,0.28);
        }
        .ss-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 14px 44px rgba(245,158,11,0.48); }
        .ss-submit:active:not(:disabled) { transform:translateY(0); }
        .ss-submit:disabled { opacity:0.38;cursor:not-allowed; }
        .ss-submit::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.22),transparent);opacity:0;transition:opacity 0.3s; }
        .ss-submit:hover:not(:disabled)::before { opacity:1; }
        .ss-submit::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent); }
        .ss-submit:hover:not(:disabled)::after { animation:ssShimmer 0.5s ease forwards; }
        @keyframes ssShimmer { to{left:140%;} }

        .ss-trust {
          display:flex;align-items:center;justify-content:center;gap:18px;
          padding:11px;
          background:rgba(255,255,255,0.02);
          border:1px solid rgba(255,255,255,0.05);
          border-radius:10px;
        }
        .ss-trust-item { display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(255,255,255,0.28); }
        .ss-trust-sep { width:1px;height:14px;background:rgba(255,255,255,0.1); }
      `}</style>

      <div className="ss-root">

        <div className="ss-bg-img">
          <img
            src={BG_IMAGE}
            alt=""
            aria-hidden="true"
            onLoad={e => e.target.classList.add('ss-loaded')}
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1920&q=85&fit=crop';
              e.target.classList.add('ss-loaded');
            }}
          />
        </div>

        <div className="ss-orb ss-orb-1" />
        <div className="ss-orb ss-orb-2" />
        <div className="ss-orb ss-orb-3" />
        <div className="ss-orb ss-orb-4" />
        <div className="ss-grid" />
        <div className="ss-noise" />

        <header className="ss-header">
          <Link to="/" className="ss-logo-mark">
            <div className="ss-logo-icon"><ShoppingCart size={18} color="#0a0a0f" /></div>
            <div>
              <div className="ss-logo-text">Fizzy Fuzz</div>
              <div className="ss-logo-sub">Seller Dashboard</div>
            </div>
          </Link>
          <nav className="ss-nav-btns">
            <div className="ss-seller-chip"><Store size={11} /> Seller Portal</div>
            <NavLink to="/login" style={{ textDecoration: 'none' }}>
              <div className="ss-nav-btn"><FaRegUser size={13} /> Sign In</div>
            </NavLink>
          </nav>
        </header>

        <main className="ss-main">
          <div className="ss-wrap">

            <div className="ss-banner">
              <span className="ss-sparkle" />
              <span className="ss-sparkle" />
              <span className="ss-sparkle" />
              <span className="ss-sparkle" />

              <svg className="ss-rocket-deco" viewBox="0 0 150 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10,70 Q40,60 60,40 Q90,10 140,5"
                  stroke="url(#rocketGrad)" strokeWidth="1.5" strokeDasharray="5 4"
                  strokeLinecap="round" fill="none"/>
                <circle cx="140" cy="5" r="4" fill="#fcd34d"/>
                <circle cx="140" cy="5" r="8" fill="rgba(252,211,77,0.2)"/>
                <defs>
                  <linearGradient id="rocketGrad" x1="10" y1="70" x2="140" y2="5">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#fcd34d"/>
                  </linearGradient>
                </defs>
              </svg>

              <div className="ss-banner-top">
                <div className="ss-banner-badge">
                  <Rocket size={10} /> Start selling today
                </div>
                <h2 className="ss-banner-heading">
                  Launch your<br />store <em>today.</em>
                </h2>
                <p className="ss-banner-desc">
                  Register as a seller and tap into lakhs of active buyers. It takes less than 2 minutes to get started.
                </p>

                <div className="ss-stats">
                  <div className="ss-stat">
                    <div className="ss-stat-num">20+</div>
                    <div className="ss-stat-label">Active sellers</div>
                  </div>
                  <div className="ss-stat">
                    <div className="ss-stat-num">₹0</div>
                    <div className="ss-stat-label">Setup cost</div>
                  </div>
                  <div className="ss-stat">
                    <div className="ss-stat-num">7 days</div>
                    <div className="ss-stat-label">First payout</div>
                  </div>
                </div>

                <div className="ss-perks">
                  <div className="ss-perk">
                    <div className="ss-perk-icon" style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.3),rgba(249,115,22,0.3))' }}>
                      <TrendingUp size={14} color="#fcd34d" />
                    </div>
                    <div className="ss-perk-text">
                      <h5>Instant Visibility</h5>
                      <p>Your products go live within minutes</p>
                    </div>
                  </div>
                  <div className="ss-perk">
                    <div className="ss-perk-icon" style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(168,85,247,0.3))' }}>
                      <BadgeIndianRupee size={14} color="#a5b4fc" />
                    </div>
                    <div className="ss-perk-text">
                      <h5>Weekly Settlements</h5>
                      <p>Get paid directly to your bank account</p>
                    </div>
                  </div>
                  <div className="ss-perk">
                    <div className="ss-perk-icon" style={{ background:'linear-gradient(135deg,rgba(52,211,153,0.25),rgba(99,102,241,0.25))' }}>
                      <ShieldCheck size={14} color="#34d399" />
                    </div>
                    <div className="ss-perk-text">
                      <h5>Seller Protection</h5>
                      <p>Dispute resolution &amp; fraud safeguards</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ss-social-proof">
                <div className="ss-avatars">
                  {AVATARS.map((src, i) => (
                    <div className="ss-avatar" key={i}>
                      <img
                        src={src}
                        alt={`seller ${i+1}`}
                        onError={e => { e.target.src = `https://placehold.co/28x28/1a1200/fcd34d?text=${i+1}`; }}
                      />
                    </div>
                  ))}
                </div>
                <div className="ss-proof-text">
                  <div className="ss-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <strong>5,000+ sellers</strong> already on board
                </div>
              </div>
            </div>

            {/* ══ RIGHT FORM ══ */}
            <div className="ss-form-side">

              {step === "details" ? (
                <>
                  <div className="ss-form-head">
                    <p className="ss-form-eyebrow">Seller registration</p>
                    <h1 className="ss-form-title">Open your <em>store</em></h1>
                    <p className="ss-form-sub">Create your seller account to start listing products</p>
                  </div>

                  <div className="ss-divider" />

                  <form onSubmit={handleSubmit}>
                    <div className="ss-field">
                      <label className="ss-label">Full Name</label>
                      <input
                        type="text"
                        className="ss-input"
                        name="name"
                        value={formFields.name}
                        disabled={isLoading}
                        onChange={onChangeInput}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="ss-field">
                      <label className="ss-label">Business Email</label>
                      <input
                        type="email"
                        className="ss-input"
                        name="email"
                        value={formFields.email}
                        disabled={isLoading}
                        onChange={onChangeInput}
                        placeholder="seller@yourbusiness.com"
                      />
                    </div>

                    <div className="ss-field">
                      <label className="ss-label">Mobile Number</label>
                      <div className="ss-phone-row">
                        <div className="ss-country-code">+91</div>
                        <input
                          type="text"
                          className="ss-phone-input"
                          name="mobile"
                          value={formFields.mobile}
                          disabled={isLoading}
                          maxLength={10}
                          inputMode="numeric"
                          placeholder="10-digit number"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) onChangeInput({ target: { name: "mobile", value } });
                          }}
                        />
                      </div>
                      {formFields.mobile && formFields.mobile.length !== 10 && (
                        <p className="ss-mobile-err">Mobile number must be 10 digits</p>
                      )}
                    </div>

                    <div className="ss-terms">
                      <input type="checkbox" required />
                      <span>
                        I agree to the{" "}
                        <Link to="https://fizzyfuzz.in" target="_blank">Seller Terms</Link>
                        {" "}and{" "}
                        <Link to="https://fizzyfuzz.in" target="_blank">Privacy Policy</Link>
                      </span>
                    </div>

                    <div className="ss-login-row">
                      <span>Already a seller?</span>
                      <Link to="/login" className="ss-login-link">Sign In →</Link>
                    </div>

                    <button type="submit" className="ss-submit" disabled={!valideValue || isLoading}>
                      {isLoading
                        ? <CircularProgress color="inherit" size={22} />
                        : <><UserPlus size={16} /> Send OTP &amp; Continue</>
                      }
                    </button>

                    <div className="ss-trust">
                      <div className="ss-trust-item">
                        <ShieldCheck size={12} color="#34d399" />
                        SSL Secured
                      </div>
                      <div className="ss-trust-sep" />
                      <div className="ss-trust-item">
                        <PackageCheck size={12} color="#a5b4fc" />
                        256-bit Encrypted
                      </div>
                      <div className="ss-trust-sep" />
                      <div className="ss-trust-item">
                        <Star size={12} color="#f59e0b" />
                        4.9 / 5 Rating
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <button type="button" className="ss-back-btn" onClick={() => { setStep("details"); setOtp(""); }}>
                    <ArrowLeft size={13} /> Back
                  </button>

                  <div className="ss-form-head">
                    <p className="ss-form-eyebrow">Verify mobile</p>
                    <h1 className="ss-form-title">Enter <em>OTP</em></h1>
                    <p className="ss-form-sub">
                      Sent a 6-digit code to <strong>+91 {maskedMobile}</strong>
                    </p>
                  </div>

                  <div className="ss-divider" />

                  <div className="ss-otp-hint">
                    <ShieldQuestion size={16} color="#fcd34d" />
                    Didn't receive it? Check the number or use resend below.
                  </div>

                  <form onSubmit={handleVerifyOtp}>
                    <div className="ss-field">
                      <label className="ss-label">6-Digit OTP</label>
                      <input
                        type="text"
                        className="ss-input ss-otp-input"
                        name="otp"
                        value={otp}
                        disabled={isLoading}
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="••••••"
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        autoFocus
                      />
                    </div>

                    <div className="ss-resend-row">
                      <span>{resendTimer > 0 ? `Resend available in ${resendTimer}s` : "Didn't get the code?"}</span>
                      <button
                        type="button"
                        className="ss-resend-btn"
                        disabled={resendTimer > 0 || isLoading}
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </button>
                    </div>

                    <button type="submit" className="ss-submit" disabled={otp.length !== 6 || isLoading}>
                      {isLoading
                        ? <CircularProgress color="inherit" size={22} />
                        : <><ShieldCheck size={16} /> Verify &amp; Create Account</>
                      }
                    </button>

                    <div className="ss-trust">
                      <div className="ss-trust-item">
                        <ShieldCheck size={12} color="#34d399" />
                        SSL Secured
                      </div>
                      <div className="ss-trust-sep" />
                      <div className="ss-trust-item">
                        <PackageCheck size={12} color="#a5b4fc" />
                        256-bit Encrypted
                      </div>
                      <div className="ss-trust-sep" />
                      <div className="ss-trust-item">
                        <Star size={12} color="#f59e0b" />
                        4.9 / 5 Rating
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default SignUp;