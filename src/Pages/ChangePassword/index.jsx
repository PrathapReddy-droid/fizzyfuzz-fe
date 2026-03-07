import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from "../../App.jsx";
import { fetchDataFromApi, postData } from "../../utils/api.js";
import { ShoppingCart, ShieldCheck, Store, KeyRound, Lock, LogIn } from "lucide-react";

// Same background as the rest of the suite
const BG_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=85&fit=crop";

const ChangePassword = () => {
  const [isPasswordShow, setisPasswordShow]   = useState(false);
  const [isPasswordShow2, setisPasswordShow2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormsFields] = useState({
    email: localStorage.getItem("userEmail"),
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formFields.newPassword)     { context.alertBox("error", "Please enter new password");     setIsLoading(false); return; }
    if (!formFields.confirmPassword) { context.alertBox("error", "Please enter confirm password"); setIsLoading(false); return; }
    if (formFields.confirmPassword !== formFields.newPassword) {
      context.alertBox("error", "Password and confirm password do not match");
      setIsLoading(false); return;
    }

    postData(`/api/user/reset-password`, formFields).then((res) => {
      if (res?.error === false) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("actionType");
        context.alertBox("success", res?.message);
        setIsLoading(false);
        history("/login");
      } else {
        context.alertBox("error", res?.message);
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .cp-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #080810;
          position: relative;
          overflow: hidden;
          color: #fff;
        }

        /* ── Background image ── */
        .cp-bg-img { position:fixed;inset:0;z-index:0;pointer-events:none; }
        .cp-bg-img img {
          width:100%;height:100%;object-fit:cover;object-position:center 30%;
          display:block;opacity:0;transition:opacity 1.4s ease;
        }
        .cp-bg-img img.cp-loaded { opacity:1; }
        .cp-bg-img::after {
          content:'';position:absolute;inset:0;
          background:linear-gradient(160deg,rgba(8,8,16,0.94) 0%,rgba(8,8,16,0.76) 45%,rgba(8,8,16,0.88) 100%);
        }

        /* ── Orbs ── */
        .cp-orb { position:fixed;border-radius:50%;filter:blur(100px);opacity:0.22;pointer-events:none;animation:cpOrb 14s ease-in-out infinite alternate;z-index:1; }
        .cp-orb-1 { width:700px;height:700px;background:radial-gradient(circle,#f59e0b 0%,transparent 65%);top:-250px;left:-180px;animation-duration:16s; }
        .cp-orb-2 { width:550px;height:550px;background:radial-gradient(circle,#7c3aed 0%,transparent 65%);bottom:-150px;right:-100px;animation-duration:11s;animation-delay:-5s; }
        .cp-orb-3 { width:300px;height:300px;background:radial-gradient(circle,#fb923c 0%,transparent 65%);top:55%;left:50%;transform:translate(-50%,-50%);opacity:0.13;animation-duration:20s;animation-delay:-11s; }
        @keyframes cpOrb {
          0%   { transform:translate(0,0) scale(1); }
          100% { transform:translate(40px,30px) scale(1.08); }
        }

        .cp-grid {
          position:fixed;inset:0;z-index:1;
          background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
          background-size:64px 64px;pointer-events:none;
          mask-image:radial-gradient(ellipse at 50% 50%,black 30%,transparent 85%);
        }
        .cp-noise {
          position:fixed;inset:0;pointer-events:none;opacity:0.035;z-index:1;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-size:200px 200px;
        }

        /* ── Header ── */
        .cp-header {
          position:fixed;top:0;left:0;right:0;
          padding:16px 40px;
          display:flex;align-items:center;justify-content:space-between;
          backdrop-filter:blur(24px);
          background:rgba(8,8,16,0.5);
          border-bottom:1px solid rgba(255,255,255,0.06);
          z-index:100;
        }
        .cp-logo-mark { display:flex;align-items:center;gap:12px;text-decoration:none; }
        .cp-logo-icon { width:38px;height:38px;background:linear-gradient(135deg,#f59e0b,#f97316);border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 22px rgba(245,158,11,0.45); }
        .cp-logo-text { font-family:'DM Serif Display',serif;font-size:22px;background:linear-gradient(135deg,#fcd34d,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1; }
        .cp-logo-sub  { font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.28);text-transform:uppercase;margin-top:2px; }
        .cp-seller-chip { display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.28);border-radius:100px;padding:5px 14px;font-size:11px;font-weight:600;letter-spacing:1px;color:#fcd34d;text-transform:uppercase; }
        .cp-nav-btn { display:flex;align-items:center;gap:6px;padding:8px 20px;border-radius:100px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.55);background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);transition:all 0.25s;text-decoration:none;cursor:pointer; }
        .cp-nav-btn:hover { background:rgba(245,158,11,0.18);border-color:rgba(245,158,11,0.45);color:#fff; }
        .cp-nav-btns { display:flex;gap:10px;align-items:center; }
        @media(max-width:640px){ .cp-nav-btns{display:none;} }

        /* ── Main ── */
        .cp-main {
          min-height:100vh;
          display:flex;align-items:center;justify-content:center;
          padding:100px 20px 60px;
          position:relative;z-index:10;
        }

        /* ── Card ── */
        .cp-card {
          width:100%;max-width:460px;
          background:rgba(12,12,20,0.82);
          backdrop-filter:blur(28px);
          border-radius:28px;
          border:1px solid rgba(245,158,11,0.12);
          box-shadow:0 50px 100px rgba(0,0,0,0.75),0 0 0 1px rgba(245,158,11,0.08),inset 0 1px 0 rgba(255,255,255,0.06);
          padding:48px 44px 44px;
          position:relative;
          opacity:0;transform:translateY(36px);
          animation:cpReveal 0.75s cubic-bezier(0.22,1,0.36,1) forwards 0.15s;
        }
        @keyframes cpReveal { to{ opacity:1;transform:translateY(0); } }
        @media(max-width:520px){ .cp-card{ padding:36px 24px 32px; } }

        /* top edge glow */
        .cp-card::before {
          content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.55),transparent);
          border-radius:100px;
        }

        /* sparkles */
        .cp-sparkle { position:absolute;width:3px;height:3px;border-radius:50%;background:#fcd34d;opacity:0;animation:cpSparkle 4s ease-in-out infinite; }
        .cp-sparkle:nth-child(1){top:12%;left:8%;animation-delay:0s;}
        .cp-sparkle:nth-child(2){top:20%;right:10%;animation-delay:1.6s;}
        .cp-sparkle:nth-child(3){bottom:18%;left:14%;animation-delay:2.8s;background:#fb923c;}
        .cp-sparkle:nth-child(4){bottom:14%;right:8%;animation-delay:0.9s;}
        @keyframes cpSparkle {
          0%,100%{opacity:0;transform:scale(0);}
          50%{opacity:0.8;transform:scale(1);}
        }

        /* icon halo */
        .cp-icon-wrap { width:76px;height:76px;margin:0 auto 24px;position:relative;display:flex;align-items:center;justify-content:center; }
        .cp-icon-halo { position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(245,158,11,0.2) 0%,transparent 70%);animation:cpPulse 2.4s ease-in-out infinite; }
        @keyframes cpPulse {
          0%,100%{transform:scale(1);opacity:0.6;}
          50%{transform:scale(1.18);opacity:1;}
        }
        .cp-icon-ring { width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,rgba(245,158,11,0.25),rgba(249,115,22,0.15));border:1px solid rgba(245,158,11,0.35);display:flex;align-items:center;justify-content:center;position:relative;z-index:1;box-shadow:0 0 30px rgba(245,158,11,0.2); }

        /* eyebrow */
        .cp-eyebrow { font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.28);font-weight:600;margin-bottom:8px;text-align:center;display:flex;align-items:center;justify-content:center;gap:6px; }
        .cp-eyebrow::before,.cp-eyebrow::after { content:'';display:block;width:24px;height:1px;background:rgba(245,158,11,0.4); }

        .cp-title { font-family:'DM Serif Display',serif;font-size:30px;line-height:1.15;color:#fff;text-align:center;margin-bottom:8px; }
        .cp-title em { font-style:italic;background:linear-gradient(135deg,#fcd34d,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .cp-sub { font-size:13px;color:rgba(255,255,255,0.3);text-align:center;margin-bottom:0; }

        .cp-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent);margin:20px 0; }

        /* fields */
        .cp-field { margin-bottom:16px; }
        .cp-label { font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.38);margin-bottom:7px;display:block; }
        .cp-input-wrap { position:relative; }
        .cp-input {
          width:100%;height:50px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;color:#fff;
          font-size:14px;font-family:'DM Sans',sans-serif;
          padding:0 48px 0 16px;transition:all 0.25s;outline:none;
          box-sizing:border-box;
        }
        .cp-input::placeholder { color:rgba(255,255,255,0.18); }
        .cp-input:focus { border-color:rgba(245,158,11,0.65);background:rgba(245,158,11,0.06);box-shadow:0 0 0 3px rgba(245,158,11,0.1),0 2px 20px rgba(245,158,11,0.08); }
        .cp-input:disabled { opacity:0.45;cursor:not-allowed; }
        .cp-eye { position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.28);padding:4px;display:flex;align-items:center;transition:color 0.2s; }
        .cp-eye:hover { color:rgba(255,255,255,0.65); }

        /* match indicator */
        .cp-match { font-size:11px;margin-top:5px;display:flex;align-items:center;gap:5px; }
        .cp-match.ok  { color:#34d399; }
        .cp-match.err { color:#f87171; }

        /* submit */
        .cp-submit {
          width:100%;height:52px;
          background:linear-gradient(135deg,#f59e0b 0%,#f97316 100%);
          border:none;border-radius:12px;
          color:#0a0a0f;font-size:15px;font-weight:700;
          font-family:'DM Sans',sans-serif;cursor:pointer;
          position:relative;overflow:hidden;
          transition:all 0.3s;margin-bottom:20px;
          display:flex;align-items:center;justify-content:center;gap:8px;
          box-shadow:0 4px 24px rgba(245,158,11,0.28);
        }
        .cp-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 14px 44px rgba(245,158,11,0.48); }
        .cp-submit:active:not(:disabled) { transform:translateY(0); }
        .cp-submit:disabled { opacity:0.38;cursor:not-allowed; }
        .cp-submit::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.22),transparent);opacity:0;transition:opacity 0.3s; }
        .cp-submit:hover:not(:disabled)::before { opacity:1; }
        .cp-submit::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent); }
        .cp-submit:hover:not(:disabled)::after { animation:cpShimmer 0.5s ease forwards; }
        @keyframes cpShimmer { to{left:140%;} }

        /* trust */
        .cp-trust { display:flex;align-items:center;justify-content:center;gap:18px;padding:11px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;margin-bottom:18px; }
        .cp-trust-item { display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(255,255,255,0.28); }
        .cp-trust-sep { width:1px;height:14px;background:rgba(255,255,255,0.1); }

        .cp-footer { text-align:center;font-size:13px;color:rgba(255,255,255,0.28); }
        .cp-footer a { color:#fcd34d;font-weight:600;text-decoration:none;margin-left:5px;transition:color 0.2s; }
        .cp-footer a:hover { color:#fb923c; }
      `}</style>

      <div className="cp-root">

        {/* Background */}
        <div className="cp-bg-img">
          <img
            src={BG_IMAGE}
            alt=""
            aria-hidden="true"
            onLoad={e => e.target.classList.add('cp-loaded')}
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1920&q=85&fit=crop';
              e.target.classList.add('cp-loaded');
            }}
          />
        </div>

        <div className="cp-orb cp-orb-1" />
        <div className="cp-orb cp-orb-2" />
        <div className="cp-orb cp-orb-3" />
        <div className="cp-grid" />
        <div className="cp-noise" />

        {/* Header */}
        <header className="cp-header">
          <Link to="/" className="cp-logo-mark">
            <div className="cp-logo-icon"><ShoppingCart size={18} color="#0a0a0f" /></div>
            <div>
              <div className="cp-logo-text">Fizzy Fuzz</div>
              <div className="cp-logo-sub">Seller Dashboard</div>
            </div>
          </Link>
          <nav className="cp-nav-btns">
            <div className="cp-seller-chip"><Store size={11} /> Seller Portal</div>
            <NavLink to="/login" style={{ textDecoration: 'none' }}>
              <div className="cp-nav-btn"><FaRegUser size={13} /> Sign In</div>
            </NavLink>
          </nav>
        </header>

        {/* Main */}
        <main className="cp-main">
          <div className="cp-card">

            <span className="cp-sparkle" />
            <span className="cp-sparkle" />
            <span className="cp-sparkle" />
            <span className="cp-sparkle" />

            {/* Icon */}
            <div className="cp-icon-wrap">
              <div className="cp-icon-halo" />
              <div className="cp-icon-ring">
                <KeyRound size={30} color="#fcd34d" />
              </div>
            </div>

            {/* Heading */}
            <p className="cp-eyebrow">Account Security</p>
            <h1 className="cp-title">Set new <em>password</em></h1>
            <p className="cp-sub">Choose a strong password for your seller account</p>

            <div className="cp-divider" />

            <form onSubmit={handleSubmit}>

              {/* New Password */}
              <div className="cp-field">
                <label className="cp-label">New Password</label>
                <div className="cp-input-wrap">
                  <input
                    type={isPasswordShow ? 'text' : 'password'}
                    className="cp-input"
                    name="newPassword"
                    value={formFields.newPassword}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    placeholder="Enter new password"
                  />
                  <button type="button" className="cp-eye" onClick={() => setisPasswordShow(!isPasswordShow)}>
                    {isPasswordShow ? <FaEyeSlash size={15} /> : <FaRegEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="cp-field">
                <label className="cp-label">Confirm Password</label>
                <div className="cp-input-wrap">
                  <input
                    type={isPasswordShow2 ? 'text' : 'password'}
                    className="cp-input"
                    name="confirmPassword"
                    value={formFields.confirmPassword}
                    disabled={isLoading}
                    onChange={onChangeInput}
                    placeholder="Re-enter new password"
                  />
                  <button type="button" className="cp-eye" onClick={() => setisPasswordShow2(!isPasswordShow2)}>
                    {isPasswordShow2 ? <FaEyeSlash size={15} /> : <FaRegEye size={15} />}
                  </button>
                </div>
                {/* Live match indicator */}
                {formFields.confirmPassword.length > 0 && (
                  formFields.newPassword === formFields.confirmPassword
                    ? <p className="cp-match ok">✓ Passwords match</p>
                    : <p className="cp-match err">✗ Passwords do not match</p>
                )}
              </div>

              <button type="submit" className="cp-submit" disabled={!valideValue || isLoading}>
                {isLoading
                  ? <CircularProgress color="inherit" size={22} />
                  : <><Lock size={16} /> Update Password</>
                }
              </button>
            </form>

            {/* Trust badges */}
            <div className="cp-trust">
              <div className="cp-trust-item">
                <ShieldCheck size={12} color="#34d399" />
                SSL Secured
              </div>
              <div className="cp-trust-sep" />
              <div className="cp-trust-item">
                <KeyRound size={12} color="#a5b4fc" />
                256-bit Encrypted
              </div>
              <div className="cp-trust-sep" />
              <div className="cp-trust-item">
                <Store size={12} color="#f59e0b" />
                Seller Portal
              </div>
            </div>

            <p className="cp-footer">
              Remembered it?
              <Link to="/login"><LogIn size={12} style={{display:'inline',marginRight:3}} /> Back to Sign In</Link>
            </p>

          </div>
        </main>
      </div>
    </>
  );
};

export default ChangePassword;
