import { Button } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import OtpBox from "../../Components/OtpBox";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { ShoppingCart, ShieldCheck, Store, MailCheck, RefreshCw } from "lucide-react";
import { FaRegUser } from "react-icons/fa6";

// Same background as Login & SignUp
const BG_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=85&fit=crop";

const VerifyAccount = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    fetchDataFromApi("/api/logo").then((res) => {
      localStorage.setItem('logo', res?.logo[0]?.logo);
    });
  }, []);

  const handleOtpChange = (value) => setOtp(value);

  const verityOTP = (e) => {
    e.preventDefault();
    if (otp !== "") {
      setIsLoading(true);
      const actionType = localStorage.getItem("actionType");
      if (actionType !== "forgot-password") {
        postData("/api/user/verifyEmail", {
          email: localStorage.getItem("userEmail"),
          otp: otp
        }).then((res) => {
          if (res?.error === false) {
            context.alertBox("success", res?.message);
            localStorage.removeItem("userEmail");
            setIsLoading(false);
            history("/login");
          } else {
            context.alertBox("error", res?.message);
            setIsLoading(false);
            if (res?.message === "OTP expired") history("/sign-up");
          }
        });
      } else {
        postData("/api/user/verify-forgot-password-otp", {
          email: localStorage.getItem("userEmail"),
          otp: otp
        }).then((res) => {
          if (res?.error === false) {
            context.alertBox("success", res?.message);
            history("/change-password");
          } else {
            context.alertBox("error", res?.message);
            setIsLoading(false);
          }
        });
      }
    } else {
      context.alertBox("error", "Please enter OTP");
    }
  };

  const userEmail = localStorage.getItem("userEmail") || "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .va-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #080810;
          position: relative;
          overflow: hidden;
          color: #fff;
          display: flex;
          flex-direction: column;
        }

        /* ── Background image ── */
        .va-bg-img {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
        }
        .va-bg-img img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center 30%;
          display: block; opacity: 0; transition: opacity 1.4s ease;
        }
        .va-bg-img img.va-loaded { opacity: 1; }
        .va-bg-img::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(160deg,
            rgba(8,8,16,0.94) 0%, rgba(8,8,16,0.76) 45%, rgba(8,8,16,0.88) 100%);
        }

        /* ── Orbs ── */
        .va-orb { position:fixed;border-radius:50%;filter:blur(100px);opacity:0.22;pointer-events:none;animation:vaOrb 14s ease-in-out infinite alternate;z-index:1; }
        .va-orb-1 { width:700px;height:700px;background:radial-gradient(circle,#f59e0b 0%,transparent 65%);top:-250px;left:-180px;animation-duration:16s; }
        .va-orb-2 { width:550px;height:550px;background:radial-gradient(circle,#7c3aed 0%,transparent 65%);bottom:-150px;right:-100px;animation-duration:11s;animation-delay:-5s; }
        .va-orb-3 { width:300px;height:300px;background:radial-gradient(circle,#fb923c 0%,transparent 65%);top:55%;left:50%;transform:translate(-50%,-50%);opacity:0.13;animation-duration:20s;animation-delay:-11s; }
        @keyframes vaOrb {
          0% { transform:translate(0,0) scale(1); }
          100% { transform:translate(40px,30px) scale(1.08); }
        }

        .va-grid {
          position:fixed;inset:0;z-index:1;
          background-image: linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
          background-size:64px 64px; pointer-events:none;
          mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 85%);
        }
        .va-noise {
          position:fixed;inset:0;pointer-events:none;opacity:0.035;z-index:1;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ── Header ── */
        .va-header {
          position:fixed;top:0;left:0;right:0;
          padding:16px 40px;
          display:flex;align-items:center;justify-content:space-between;
          backdrop-filter:blur(24px);
          background:rgba(8,8,16,0.5);
          border-bottom:1px solid rgba(255,255,255,0.06);
          z-index:100;
        }
        .va-logo-mark { display:flex;align-items:center;gap:12px;text-decoration:none; }
        .va-logo-icon {
          width:38px;height:38px;
          background:linear-gradient(135deg,#f59e0b,#f97316);
          border-radius:10px;display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 22px rgba(245,158,11,0.45);
        }
        .va-logo-text { font-family:'DM Serif Display',serif;font-size:22px;background:linear-gradient(135deg,#fcd34d,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1; }
        .va-logo-sub  { font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.28);text-transform:uppercase;margin-top:2px; }
        .va-seller-chip {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.28);
          border-radius:100px;padding:5px 14px;
          font-size:11px;font-weight:600;letter-spacing:1px;
          color:#fcd34d;text-transform:uppercase;
        }
        .va-nav-btn { display:flex;align-items:center;gap:6px;padding:8px 20px;border-radius:100px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.55);background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);transition:all 0.25s;text-decoration:none;cursor:pointer; }
        .va-nav-btn:hover { background:rgba(245,158,11,0.18);border-color:rgba(245,158,11,0.45);color:#fff; }
        .va-nav-btns { display:flex;gap:10px;align-items:center; }
        @media(max-width:640px){ .va-nav-btns{display:none;} }

        /* ── Main ── */
        .va-main {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 100px 20px 60px;
          position: relative; z-index: 10;
        }

        /* ── Card ── */
        .va-card {
          width: 100%; max-width: 480px;
          background: rgba(12,12,20,0.82);
          backdrop-filter: blur(28px);
          border-radius: 28px;
          border: 1px solid rgba(245,158,11,0.12);
          box-shadow:
            0 50px 100px rgba(0,0,0,0.75),
            0 0 0 1px rgba(245,158,11,0.08),
            inset 0 1px 0 rgba(255,255,255,0.06);
          padding: 48px 44px 44px;
          position: relative;
          opacity: 0; transform: translateY(36px);
          animation: vaReveal 0.75s cubic-bezier(0.22,1,0.36,1) forwards 0.15s;
        }
        @keyframes vaReveal { to{ opacity:1; transform:translateY(0); } }
        @media(max-width:520px){ .va-card{ padding: 36px 24px 32px; } }

        /* top highlight line */
        .va-card::before {
          content:''; position:absolute; top:0; left:10%; right:10%; height:1px;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.55), transparent);
          border-radius: 100px;
        }

        /* sparkles */
        .va-sparkle {
          position:absolute;width:3px;height:3px;border-radius:50%;
          background:#fcd34d;opacity:0;
          animation:vaSparkle 4s ease-in-out infinite;
        }
        .va-sparkle:nth-child(1){top:12%;left:8%;animation-delay:0s;}
        .va-sparkle:nth-child(2){top:20%;right:10%;animation-delay:1.6s;}
        .va-sparkle:nth-child(3){bottom:18%;left:14%;animation-delay:2.8s;background:#fb923c;}
        .va-sparkle:nth-child(4){bottom:14%;right:8%;animation-delay:0.9s;}
        @keyframes vaSparkle {
          0%,100%{opacity:0;transform:scale(0);}
          50%{opacity:0.8;transform:scale(1);}
        }

        /* icon halo */
        .va-icon-wrap {
          width: 76px; height: 76px; margin: 0 auto 24px;
          position: relative; display: flex; align-items: center; justify-content: center;
        }
        .va-icon-halo {
          position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%);
          animation: vaPulse 2.4s ease-in-out infinite;
        }
        @keyframes vaPulse {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(1.18); opacity: 1; }
        }
        .va-icon-ring {
          width: 76px; height: 76px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(245,158,11,0.25), rgba(249,115,22,0.15));
          border: 1px solid rgba(245,158,11,0.35);
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1;
          box-shadow: 0 0 30px rgba(245,158,11,0.2);
        }

        /* eyebrow */
        .va-eyebrow {
          font-size:11px;letter-spacing:2px;text-transform:uppercase;
          color:rgba(255,255,255,0.28);font-weight:600;
          margin-bottom:8px;text-align:center;
          display:flex;align-items:center;justify-content:center;gap:6px;
        }
        .va-eyebrow::before,.va-eyebrow::after {
          content:'';display:block;width:24px;height:1px;background:rgba(245,158,11,0.4);
        }

        /* title */
        .va-title {
          font-family:'DM Serif Display',serif;
          font-size:30px;line-height:1.15;color:#fff;
          text-align:center;margin-bottom:10px;
        }
        .va-title em {
          font-style:italic;
          background:linear-gradient(135deg,#fcd34d,#fb923c);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .va-divider {
          height:1px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent);
          margin: 20px 0;
        }

        /* email pill */
        .va-email-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.22);
          border-radius: 100px; padding: 7px 16px;
          font-size: 13px; font-weight: 500; color: #fcd34d;
          margin: 0 auto 24px; display:flex; justify-content:center;
          max-width: fit-content; margin-left: auto; margin-right: auto;
          word-break: break-all; text-align: center;
        }

        /* OTP wrapper — override any dark OtpBox defaults */
        .va-otp-wrap {
          display: flex; justify-content: center;
          margin-bottom: 28px;
        }
        .va-otp-wrap input {
          color: #fff !important;
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-radius: 12px !important;
          font-family: 'DM Serif Display', serif !important;
          font-size: 22px !important;
          transition: border-color 0.25s, box-shadow 0.25s !important;
        }
        .va-otp-wrap input:focus {
          border-color: rgba(245,158,11,0.7) !important;
          background: rgba(245,158,11,0.07) !important;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.12) !important;
          outline: none !important;
        }

        /* submit */
        .va-submit {
          width: 100%; height: 52px;
          background: linear-gradient(135deg,#f59e0b 0%,#f97316 100%);
          border: none; border-radius: 12px;
          color: #0a0a0f; font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          position: relative; overflow: hidden;
          transition: all 0.3s; margin-bottom: 20px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 24px rgba(245,158,11,0.28);
        }
        .va-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 14px 44px rgba(245,158,11,0.48); }
        .va-submit:active:not(:disabled) { transform:translateY(0); }
        .va-submit:disabled { opacity:0.38;cursor:not-allowed; }
        .va-submit::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.22),transparent);opacity:0;transition:opacity 0.3s; }
        .va-submit:hover:not(:disabled)::before { opacity:1; }
        .va-submit::after { content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent); }
        .va-submit:hover:not(:disabled)::after { animation:vaShimmer 0.5s ease forwards; }
        @keyframes vaShimmer { to{left:140%;} }

        /* trust badges */
        .va-trust {
          display:flex;align-items:center;justify-content:center;gap:18px;
          padding:11px;
          background:rgba(255,255,255,0.02);
          border:1px solid rgba(255,255,255,0.05);
          border-radius:10px;
          margin-bottom: 18px;
        }
        .va-trust-item { display:flex;align-items:center;gap:5px;font-size:11px;color:rgba(255,255,255,0.28); }
        .va-trust-sep { width:1px;height:14px;background:rgba(255,255,255,0.1); }

        /* footer link */
        .va-footer { text-align:center;font-size:13px;color:rgba(255,255,255,0.28); }
        .va-footer a { color:#fcd34d;font-weight:600;text-decoration:none;margin-left:5px;transition:color 0.2s; }
        .va-footer a:hover { color:#fb923c; }
      `}</style>

      <div className="va-root">

        {/* Background */}
        <div className="va-bg-img">
          <img
            src={BG_IMAGE}
            alt=""
            aria-hidden="true"
            onLoad={e => e.target.classList.add('va-loaded')}
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1920&q=85&fit=crop';
              e.target.classList.add('va-loaded');
            }}
          />
        </div>

        <div className="va-orb va-orb-1" />
        <div className="va-orb va-orb-2" />
        <div className="va-orb va-orb-3" />
        <div className="va-grid" />
        <div className="va-noise" />

        {/* Header */}
        <header className="va-header">
          <Link to="/" className="va-logo-mark">
            <div className="va-logo-icon"><ShoppingCart size={18} color="#0a0a0f" /></div>
            <div>
              <div className="va-logo-text">Fizzy Fuzz</div>
              <div className="va-logo-sub">Seller Dashboard</div>
            </div>
          </Link>
          <nav className="va-nav-btns">
            <div className="va-seller-chip"><Store size={11} /> Seller Portal</div>
            <NavLink to="/login" style={{ textDecoration: 'none' }}>
              <div className="va-nav-btn"><FaRegUser size={13} /> Sign In</div>
            </NavLink>
          </nav>
        </header>

        {/* Main */}
        <main className="va-main">
          <div className="va-card">

            {/* sparkles */}
            <span className="va-sparkle" />
            <span className="va-sparkle" />
            <span className="va-sparkle" />
            <span className="va-sparkle" />

            {/* Icon */}
            <div className="va-icon-wrap">
              <div className="va-icon-halo" />
              <div className="va-icon-ring">
                <MailCheck size={30} color="#fcd34d" />
              </div>
            </div>

            {/* Heading */}
            <p className="va-eyebrow">Email Verification</p>
            <h1 className="va-title">Verify your <em>account</em></h1>

            <div className="va-divider" />

            {/* Email pill */}
            {userEmail && (
              <div className="va-email-pill">
                <MailCheck size={13} />
                OTP sent to &nbsp;<strong>{userEmail}</strong>
              </div>
            )}

            {/* OTP form */}
            <form onSubmit={verityOTP}>
              <div className="va-otp-wrap">
                <OtpBox length={6} onChange={handleOtpChange} />
              </div>

              <button type="submit" className="va-submit" disabled={isLoading}>
                {isLoading
                  ? <CircularProgress color="inherit" size={22} />
                  : <><ShieldCheck size={16} /> Verify OTP</>
                }
              </button>
            </form>

            {/* Trust badges */}
            <div className="va-trust">
              <div className="va-trust-item">
                <ShieldCheck size={12} color="#34d399" />
                SSL Secured
              </div>
              <div className="va-trust-sep" />
              <div className="va-trust-item">
                <RefreshCw size={12} color="#a5b4fc" />
                OTP expires in 10 min
              </div>
              <div className="va-trust-sep" />
              <div className="va-trust-item">
                <Store size={12} color="#f59e0b" />
                Seller Portal
              </div>
            </div>

            <p className="va-footer">
              Wrong email?
              <Link to="/sign-up">Re-register here</Link>
            </p>

          </div>
        </main>
      </div>
    </>
  );
};

export default VerifyAccount;
