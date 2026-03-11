import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App.jsx";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { ShoppingCart, LogIn, ShieldCheck, TrendingUp, BarChart2, PackageCheck, Store, Star, ArrowRight } from "lucide-react";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Full-page background — dark luxury shopping mall
const BG_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=85&fit=crop";

// Placeholder seller avatars via DiceBear
const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=seller1&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=seller2&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=seller3&backgroundColor=c0aede",
];

// Unsplash product placeholder images
const PRODUCT_IMGS = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop&q=80",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=120&h=120&fit=crop&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=120&h=120&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=120&h=120&fit=crop&q=80",
];

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setisPasswordShow] = useState(false);
  const [formFields, setFormsFields] = useState({ email: '', password: '' });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    fetchDataFromApi("/api/logo").then((res) => {
      localStorage.setItem('logo', res?.logo[0]?.logo);
    });
  }, []);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormsFields(prev => ({ ...prev, [name]: value }));
  };

  const valideValue = Object.values(formFields).every(el => el);

  const forgotPassword = () => {
    if (!formFields.email) {
      context.alertBox("error", "Please enter your email first");
      return;
    }
    context.alertBox("success", `OTP sent to ${formFields.email}`);
    localStorage.setItem("userEmail", formFields.email);
    localStorage.setItem("actionType", 'forgot-password');
    postData("/api/user/forgot-password", { email: formFields.email }).then((res) => {
      if (res?.error === false) {
        context.alertBox("success", res?.message);
        history("/verify-account");
      } else {
        context.alertBox("error", res?.message);
      }
    }).catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formFields.email)    { context.alertBox("error", "Please enter email");    setIsLoading(false); return; }
    if (!formFields.password) { context.alertBox("error", "Please enter password"); setIsLoading(false); return; }

    const payload = { ...formFields, role: import.meta.env.VITE_FRONTEND || "SELLER" };

    try {
      const res = await postData("/api/user/login", payload);
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox("success", res?.message);
        setFormsFields({ email: "", password: "" });
        localStorage.setItem("accessToken", res?.data?.accesstoken);
        localStorage.setItem("refreshToken", res?.data?.refreshToken);
        context.setIsLogin(true);
        history("/");
      } else {
        context.alertBox("error", res?.message);
        setIsLoading(false);
      }
    } catch (error) {
      context.alertBox("error", error?.response?.data?.message || "Please try again later");
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .sl-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #080810;
          position: relative;
          overflow: hidden;
          color: #fff;
        }

        /* ── Full-page background image ── */
        .sl-bg-img {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .sl-bg-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
          opacity: 0;
          transition: opacity 1.4s ease;
        }
        .sl-bg-img img.sl-loaded { opacity: 1; }
        .sl-bg-img::after {
          content: '';
          position: absolute; inset: 0;
          background:
            linear-gradient(160deg,
              rgba(8,8,16,0.94) 0%,
              rgba(8,8,16,0.76) 45%,
              rgba(8,8,16,0.88) 100%);
        }

        /* ── Atmospheric orbs (sit on top of background) ── */
        .sl-orb { position:fixed;border-radius:50%;filter:blur(100px);opacity:0.22;pointer-events:none;animation:slOrb 14s ease-in-out infinite alternate; z-index:1; }
        .sl-orb-1 { width:700px;height:700px;background:radial-gradient(circle,#f59e0b 0%,transparent 65%);top:-250px;left:-180px;animation-duration:16s; }
        .sl-orb-2 { width:550px;height:550px;background:radial-gradient(circle,#7c3aed 0%,transparent 65%);bottom:-150px;right:-100px;animation-duration:11s;animation-delay:-5s; }
        .sl-orb-3 { width:380px;height:380px;background:radial-gradient(circle,#fb923c 0%,transparent 65%);top:60%;left:52%;transform:translate(-50%,-50%);opacity:0.14;animation-duration:20s;animation-delay:-11s; }
        .sl-orb-4 { width:250px;height:250px;background:radial-gradient(circle,#06b6d4 0%,transparent 65%);top:30%;right:15%;opacity:0.1;animation-duration:9s;animation-delay:-3s; }

        @keyframes slOrb {
          0%   { transform:translate(0,0) scale(1); }
          100% { transform:translate(40px,30px) scale(1.08); }
        }

        .sl-grid {
          position:fixed;inset:0;z-index:1;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
          background-size:64px 64px;
          pointer-events:none;
          mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 85%);
        }

        .sl-noise {
          position:fixed;inset:0;pointer-events:none;opacity:0.035;z-index:1;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ── Header ── */
        .sl-header {
          position:fixed;top:0;left:0;right:0;
          padding:16px 40px;
          display:flex;align-items:center;justify-content:space-between;
          backdrop-filter:blur(24px);
          background:rgba(8,8,16,0.5);
          border-bottom:1px solid rgba(255,255,255,0.06);
          z-index:100;
        }
        .sl-logo-mark { display:flex;align-items:center;gap:12px;text-decoration:none; }
        .sl-logo-icon {
          width:38px;height:38px;
          background:linear-gradient(135deg,#f59e0b,#f97316);
          border-radius:10px;display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 22px rgba(245,158,11,0.45);
        }
        .sl-logo-text { font-family:'DM Serif Display',serif;font-size:22px;background:linear-gradient(135deg,#fcd34d,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1; }
        .sl-logo-sub  { font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.28);text-transform:uppercase;margin-top:2px; }
        .sl-seller-chip {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(245,158,11,0.1);
          border:1px solid rgba(245,158,11,0.28);
          border-radius:100px;padding:5px 14px;
          font-size:11px;font-weight:600;letter-spacing:1px;
          color:#fcd34d;text-transform:uppercase;
        }
        .sl-nav-btn { display:flex;align-items:center;gap:6px;padding:8px 20px;border-radius:100px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.55);background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);transition:all 0.25s;text-decoration:none;cursor:pointer; }
        .sl-nav-btn:hover { background:rgba(245,158,11,0.18);border-color:rgba(245,158,11,0.45);color:#fff; }
        .sl-nav-btns { display:flex;gap:10px;align-items:center; }
        @media(max-width:640px){ .sl-nav-btns{display:none;} }

        /* ── Main Layout ── */
        .sl-main {
          min-height:100vh;
          display:flex;align-items:center;justify-content:center;
          padding:100px 20px 60px;
          position:relative;z-index:10;
        }
        .sl-wrap {
          width:100%;max-width:940px;
          display:grid;grid-template-columns:1.05fr 1fr;gap:0;
          border-radius:28px;overflow:hidden;
          box-shadow:
            0 50px 100px rgba(0,0,0,0.75),
            0 0 0 1px rgba(245,158,11,0.12),
            inset 0 1px 0 rgba(255,255,255,0.06);
          opacity:0;transform:translateY(36px);
          animation:slReveal 0.75s cubic-bezier(0.22,1,0.36,1) forwards 0.15s;
        }
        @keyframes slReveal { to{opacity:1;transform:translateY(0);} }
        @media(max-width:720px){
          .sl-wrap{grid-template-columns:1fr;max-width:480px;}
          .sl-banner{display:none;}
        }

        /* ════════════════════════════════
           LEFT BANNER
        ════════════════════════════════ */
        .sl-banner {
          background:linear-gradient(165deg,rgba(19,13,0,0.96) 0%,rgba(13,13,10,0.94) 45%,rgba(18,9,0,0.96) 100%);
          border-right:1px solid rgba(245,158,11,0.1);
          padding:44px 36px 36px;
          display:flex;flex-direction:column;justify-content:space-between;
          position:relative;overflow:hidden;
          backdrop-filter: blur(2px);
        }
        .sl-banner::before {
          content:'';position:absolute;inset:0;
          background:
            radial-gradient(ellipse at 10% 10%,rgba(245,158,11,0.22) 0%,transparent 55%),
            radial-gradient(ellipse at 85% 85%,rgba(249,115,22,0.16) 0%,transparent 55%),
            radial-gradient(ellipse at 60% 30%,rgba(124,58,237,0.08) 0%,transparent 50%);
          pointer-events:none;
        }

        .sl-sparkle {
          position:absolute;width:3px;height:3px;border-radius:50%;
          background:#fcd34d;opacity:0;
          animation:slSparkle 4s ease-in-out infinite;
        }
        .sl-sparkle:nth-child(1){top:18%;left:12%;animation-delay:0s;}
        .sl-sparkle:nth-child(2){top:45%;left:85%;animation-delay:1.4s;}
        .sl-sparkle:nth-child(3){top:72%;left:30%;animation-delay:2.8s;}
        .sl-sparkle:nth-child(4){top:85%;left:68%;animation-delay:0.7s;background:#fb923c;}
        @keyframes slSparkle {
          0%,100%{opacity:0;transform:scale(0);}
          50%{opacity:0.8;transform:scale(1);}
        }

        .sl-chart-deco {
          position:absolute;bottom:100px;right:24px;
          width:160px;height:70px;
          opacity:0.25;pointer-events:none;
        }

        .sl-banner-top { position:relative;z-index:1; }
        .sl-banner-badge {
          display:inline-flex;align-items:center;gap:6px;
          background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(249,115,22,0.1));
          border:1px solid rgba(245,158,11,0.35);
          border-radius:100px;padding:5px 14px;
          font-size:11px;font-weight:600;letter-spacing:1.5px;
          color:#fcd34d;text-transform:uppercase;margin-bottom:24px;
          box-shadow:0 0 20px rgba(245,158,11,0.15);
        }
        .sl-banner-heading {
          font-family:'DM Serif Display',serif;
          font-size:33px;line-height:1.15;color:#fff;margin-bottom:12px;
        }
        .sl-banner-heading em {
          font-style:italic;
          background:linear-gradient(135deg,#fcd34d,#fb923c);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .sl-banner-desc { font-size:13.5px;color:rgba(255,255,255,0.38);line-height:1.75;margin-bottom:26px; }

        .sl-products {
          display:flex;gap:8px;margin-bottom:24px;overflow:hidden;
        }
        .sl-product-card {
          flex:1;min-width:0;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:12px;overflow:hidden;
          transition:transform 0.3s,border-color 0.3s;
          cursor:pointer;
        }
        .sl-product-card:hover { transform:translateY(-3px);border-color:rgba(245,158,11,0.3); }
        .sl-product-img { width:100%;aspect-ratio:1;object-fit:cover;display:block; }
        .sl-product-label { font-size:10px;font-weight:600;color:rgba(255,255,255,0.35);padding:5px 7px;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }

        .sl-stats { display:flex;gap:8px;margin-bottom:22px;flex-wrap:wrap; }
        .sl-stat {
          background:rgba(245,158,11,0.07);
          border:1px solid rgba(245,158,11,0.16);
          border-radius:10px;padding:10px 12px;flex:1;min-width:72px;
          transition:background 0.2s;
        }
        .sl-stat:hover { background:rgba(245,158,11,0.13); }
        .sl-stat-num { font-family:'DM Serif Display',serif;font-size:20px;color:#fcd34d;line-height:1; }
        .sl-stat-label { font-size:10px;color:rgba(255,255,255,0.3);margin-top:3px; }

        .sl-perks { display:flex;flex-direction:column;gap:8px; }
        .sl-perk {
          display:flex;align-items:center;gap:12px;
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:12px;padding:11px 13px;
          transition:all 0.25s;
        }
        .sl-perk:hover { background:rgba(245,158,11,0.07);border-color:rgba(245,158,11,0.2); }
        .sl-perk-icon { width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .sl-perk-text h5 { font-size:13px;font-weight:600;color:#fff;margin:0 0 2px; }
        .sl-perk-text p  { font-size:11px;color:rgba(255,255,255,0.28);margin:0; }

        .sl-social-proof {
          position:relative;z-index:1;margin-top:24px;
          padding-top:18px;border-top:1px solid rgba(255,255,255,0.06);
          display:flex;align-items:center;gap:12px;
        }
        .sl-avatars { display:flex; }
        .sl-avatar {
          width:28px;height:28px;border-radius:50%;
          border:2px solid rgba(13,13,10,0.9);
          overflow:hidden;margin-left:-8px;background:#1a1a2e;
        }
        .sl-avatar:first-child { margin-left:0; }
        .sl-avatar img { width:100%;height:100%;object-fit:cover;display:block; }
        .sl-proof-text { font-size:11px;color:rgba(255,255,255,0.28);line-height:1.5; }
        .sl-proof-text strong { color:rgba(255,255,255,0.55);font-weight:600; }
        .sl-stars { display:flex;gap:2px;margin-bottom:2px; }

        /* ════════════════════════════════
           RIGHT FORM
        ════════════════════════════════ */
        .sl-form-side {
          background:rgba(12,12,20,0.82);
          backdrop-filter:blur(28px);
          padding:48px 42px;
          display:flex;flex-direction:column;justify-content:center;
          border-left:1px solid rgba(255,255,255,0.06);
          position:relative;
        }
        .sl-form-side::before {
          content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.5),transparent);
        }
        @media(max-width:560px){ .sl-form-side{padding:36px 24px;} }

        .sl-form-head { margin-bottom:26px; }
        .sl-form-eyebrow { font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.28);font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px; }
        .sl-form-eyebrow::before { content:'';display:block;width:18px;height:1px;background:rgba(245,158,11,0.5); }
        .sl-form-title { font-family:'DM Serif Display',serif;font-size:27px;color:#fff;margin-bottom:7px;line-height:1.2; }
        .sl-form-title em { font-style:italic;background:linear-gradient(135deg,#fcd34d,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .sl-form-sub { font-size:13px;color:rgba(255,255,255,0.32); }
        .sl-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent);margin-bottom:22px; }

        .sl-field { margin-bottom:17px; }
        .sl-label { font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:7px;display:block; }
        .sl-input-wrap { position:relative; }
        .sl-input {
          width:100%;height:50px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;color:#fff;
          font-size:14px;font-family:'DM Sans',sans-serif;
          padding:0 16px;transition:all 0.25s;outline:none;
          box-sizing:border-box;
        }
        .sl-input.has-eye { padding-right:50px; }
        .sl-input::placeholder { color:rgba(255,255,255,0.18); }
        .sl-input:focus {
          border-color:rgba(245,158,11,0.65);
          background:rgba(245,158,11,0.06);
          box-shadow:0 0 0 3px rgba(245,158,11,0.1),0 2px 20px rgba(245,158,11,0.08);
        }
        .sl-input:disabled { opacity:0.45;cursor:not-allowed; }
        .sl-eye { position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.28);padding:4px;display:flex;align-items:center;transition:color 0.2s; }
        .sl-eye:hover { color:rgba(255,255,255,0.65); }

        .sl-row { display:flex;align-items:center;justify-content:space-between;margin-bottom:20px; }
        .sl-remember { display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,0.38);cursor:pointer; }
        .sl-remember input[type=checkbox] { width:15px;height:15px;accent-color:#f59e0b;cursor:pointer; }
        .sl-forgot { font-size:13px;font-weight:600;color:#fcd34d;background:none;border:none;cursor:pointer;transition:color 0.2s;padding:0; }
        .sl-forgot:hover { color:#fb923c;text-decoration:underline; }

        .sl-submit {
          width:100%;height:52px;
          background:linear-gradient(135deg,#f59e0b 0%,#f97316 100%);
          border:none;border-radius:12px;
          color:#0a0a0f;font-size:15px;font-weight:700;
          font-family:'DM Sans',sans-serif;cursor:pointer;
          position:relative;overflow:hidden;
          transition:all 0.3s;margin-bottom:16px;
          display:flex;align-items:center;justify-content:center;gap:8px;
          box-shadow:0 4px 24px rgba(245,158,11,0.28);
        }
        .sl-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 14px 44px rgba(245,158,11,0.48); }
        .sl-submit:active:not(:disabled) { transform:translateY(0); }
        .sl-submit:disabled { opacity:0.38;cursor:not-allowed; }
        .sl-submit::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.22),transparent);opacity:0;transition:opacity 0.3s; }
        .sl-submit:hover:not(:disabled)::before { opacity:1; }
        .sl-submit::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);transition:none; }
        .sl-submit:hover:not(:disabled)::after { animation:slShimmer 0.5s ease forwards; }
        @keyframes slShimmer { to{left:140%;} }

        .sl-trust {
          display:flex;align-items:center;justify-content:center;gap:18px;
          margin-bottom:18px;padding:12px;
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.05);
          border-radius:10px;
        }
        .sl-trust-item { display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(255,255,255,0.28); }
        .sl-trust-sep { width:1px;height:14px;background:rgba(255,255,255,0.1); }

        .sl-signup-row { text-align:center;font-size:13px;color:rgba(255,255,255,0.28); }
        .sl-signup-link { color:#fcd34d;font-weight:600;text-decoration:none;margin-left:5px;transition:color 0.2s; }
        .sl-signup-link:hover { color:#fb923c; }
      `}</style>

      <div className="sl-root">

        {/* ── Full-page background image ── */}
        <div className="sl-bg-img">
          <img
            src={BG_IMAGE}
            alt=""
            aria-hidden="true"
            onLoad={e => e.target.classList.add('sl-loaded')}
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1920&q=85&fit=crop';
              e.target.classList.add('sl-loaded');
            }}
          />
        </div>

        <div className="sl-orb sl-orb-1" />
        <div className="sl-orb sl-orb-2" />
        <div className="sl-orb sl-orb-3" />
        <div className="sl-orb sl-orb-4" />
        <div className="sl-grid" />
        <div className="sl-noise" />

        {/* Header */}
        <header className="sl-header">
          <Link to="/" className="sl-logo-mark">
            <div className="sl-logo-icon"><ShoppingCart size={18} color="#0a0a0f" /></div>
            <div>
              <div className="sl-logo-text">Fizzy Fuzz</div>
              <div className="sl-logo-sub">Seller Dashboard</div>
            </div>
          </Link>
          <nav className="sl-nav-btns">
            <div className="sl-seller-chip"><Store size={11} /> Seller Portal</div>
            <NavLink to="/sign-up" style={{ textDecoration: 'none' }}>
              <div className="sl-nav-btn"><FaRegUser size={13} /> Register</div>
            </NavLink>
          </nav>
        </header>

        {/* Main */}
        <main className="sl-main">
          <div className="sl-wrap">

            {/* ══ LEFT BANNER ══ */}
            <div className="sl-banner">
              <span className="sl-sparkle" />
              <span className="sl-sparkle" />
              <span className="sl-sparkle" />
              <span className="sl-sparkle" />

              <svg className="sl-chart-deco" viewBox="0 0 160 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="0,60 28,45 55,50 80,28 108,35 135,12 160,18"
                  stroke="url(#chartGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="0,60 28,45 55,50 80,28 108,35 135,12 160,18"
                  stroke="rgba(245,158,11,0.15)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="135" cy="12" r="4" fill="#fcd34d"/>
                <circle cx="135" cy="12" r="7" fill="rgba(252,211,77,0.2)"/>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="160" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#fcd34d"/>
                  </linearGradient>
                </defs>
              </svg>

              <div className="sl-banner-top">
                <div className="sl-banner-badge">
                  <TrendingUp size={10} /> Seller Hub
                </div>
                <h2 className="sl-banner-heading">
                  Grow your<br />business <em>faster.</em>
                </h2>
                <p className="sl-banner-desc">
                  Reach lakhs of customers, manage orders effortlessly, and track your revenue — all from one powerful dashboard.
                </p>

                {/* Product Image Showcase */}
                {/* <div className="sl-products">
                  {PRODUCT_IMGS.map((src, i) => (
                    <div className="sl-product-card" key={i}>
                      <img
                        src={src}
                        alt={`product ${i + 1}`}
                        className="sl-product-img"
                        loading="lazy"
                        onError={e => { e.target.src = `https://placehold.co/120x120/1a1200/fcd34d?text=P${i+1}`; }}
                      />
                      <div className="sl-product-label">
                        {["Watches","Skincare","Footwear","Fashion"][i]}
                      </div>
                    </div>
                  ))}
                </div> */}

                <div className="sl-stats">
                  <div className="sl-stat">
                    <div className="sl-stat-num">50K+</div>
                    <div className="sl-stat-label">Active buyers</div>
                  </div>
                  <div className="sl-stat">
                    <div className="sl-stat-num">₹2Cr+</div>
                    <div className="sl-stat-label">Seller payouts</div>
                  </div>
                  <div className="sl-stat">
                    <div className="sl-stat-num">99%</div>
                    <div className="sl-stat-label">Uptime SLA</div>
                  </div>
                </div>

                <div className="sl-perks">
                  <div className="sl-perk">
                    <div className="sl-perk-icon" style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.3),rgba(249,115,22,0.3))' }}>
                      <BarChart2 size={14} color="#fcd34d" />
                    </div>
                    <div className="sl-perk-text">
                      <h5>Real-Time Analytics</h5>
                      <p>Live sales, traffic &amp; revenue reports</p>
                    </div>
                  </div>
                  <div className="sl-perk">
                    <div className="sl-perk-icon" style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(168,85,247,0.3))' }}>
                      <PackageCheck size={14} color="#a5b4fc" />
                    </div>
                    <div className="sl-perk-text">
                      <h5>Order Management</h5>
                      <p>Fulfil, track &amp; manage returns easily</p>
                    </div>
                  </div>
                  <div className="sl-perk">
                    <div className="sl-perk-icon" style={{ background:'linear-gradient(135deg,rgba(52,211,153,0.25),rgba(99,102,241,0.25))' }}>
                      <ShieldCheck size={14} color="#34d399" />
                    </div>
                    <div className="sl-perk-text">
                      <h5>Secure Payouts</h5>
                      <p>Fast, reliable weekly settlements</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="sl-social-proof">
                <div className="sl-avatars">
                  {AVATARS.map((src, i) => (
                    <div className="sl-avatar" key={i}>
                      <img
                        src={src}
                        alt={`seller ${i+1}`}
                        onError={e => { e.target.src = `https://placehold.co/28x28/1a1200/fcd34d?text=${i+1}`; }}
                      />
                    </div>
                  ))}
                </div>
                <div className="sl-proof-text">
                  <div className="sl-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <strong>5,000+ sellers</strong> powering their business
                </div>
              </div>
            </div>

            {/* ══ RIGHT FORM ══ */}
            <div className="sl-form-side">
              <div className="sl-form-head">
                <p className="sl-form-eyebrow">Seller portal</p>
                <h1 className="sl-form-title">Sign in to <em>your store</em></h1>
                <p className="sl-form-sub">Access your seller dashboard &amp; manage products</p>
              </div>

              <div className="sl-divider" />

              <form onSubmit={handleSubmit}>
                <div className="sl-field">
                  <label className="sl-label">Seller Email</label>
                  <input
                    type="email"
                    className="sl-input"
                    name="email"
                    value={formFields.email}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    placeholder="seller@example.com"
                  />
                </div>

                <div className="sl-field">
                  <label className="sl-label">Password</label>
                  <div className="sl-input-wrap">
                    <input
                      type={isPasswordShow ? 'text' : 'password'}
                      className="sl-input has-eye"
                      name="password"
                      value={formFields.password}
                      disabled={isLoading}
                      onChange={onChangeInput}
                      placeholder="••••••••"
                    />
                    <button type="button" className="sl-eye" onClick={() => setisPasswordShow(!isPasswordShow)}>
                      {isPasswordShow ? <FaEyeSlash size={15} /> : <FaRegEye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="sl-row">
                  <label className="sl-remember">
                    <input type="checkbox" defaultChecked />
                    Remember me
                  </label>
                  <button type="button" className="sl-forgot" onClick={forgotPassword}>
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="sl-submit" disabled={!valideValue || isLoading}>
                  {isLoading
                    ? <CircularProgress color="inherit" size={22} />
                    : <><LogIn size={16} /> Sign In to Dashboard</>
                  }
                </button>

                {/* Trust badges */}
                <div className="sl-trust">
                  <div className="sl-trust-item">
                    <ShieldCheck size={12} color="#34d399" />
                    SSL Secured
                  </div>
                  <div className="sl-trust-sep" />
                  <div className="sl-trust-item">
                    <PackageCheck size={12} color="#a5b4fc" />
                    256-bit Encrypted
                  </div>
                  <div className="sl-trust-sep" />
                  <div className="sl-trust-item">
                    <Star size={12} color="#f59e0b" />
                    4.9 / 5 Rating
                  </div>
                </div>

                <p className="sl-signup-row">
                  New seller?
                  <Link to="/sign-up" className="sl-signup-link">Register your store →</Link>
                </p>
              </form>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default Login;
