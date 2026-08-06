import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api.js';
import { MyContext } from "../../App.jsx";
import { ShoppingCart, ShieldCheck, KeyRound, Smartphone } from "lucide-react";

const BG_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=85&fit=crop";
const RESEND_SECONDS = 30;

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  const context = useContext(MyContext);
  const history = useNavigate();
  const location = useLocation();

  // sessionToken + mobile were handed off by the SignUp/Login page via navigate state
  const sessionToken = location.state?.sessionToken;
  const mobile = location.state?.mobile;
  const purpose = location.state?.purpose || "register";

  useEffect(() => {
    // No sessionToken means someone landed here directly — bounce back
    if (!sessionToken) {
      context.alertBox("error", "Your session expired. Please try again.");
      history("/register");
    }
  }, [sessionToken]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const otpValue = otp.join("");
  const isOtpComplete = otpValue.length === 6;

  const handleChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, "");
    if (!value) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }
    const next = [...otp];
    next[index] = value[value.length - 1];
    setOtp(next);
    if (index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split("");
    while (next.length < 6) next.push("");
    setOtp(next);
    const lastIndex = Math.min(pasted.length, 6) - 1;
    inputsRef.current[lastIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isOtpComplete || isLoading) return;
    setIsLoading(true);

    const payload = { sessionToken, otp: otpValue };

    postData("/api/user/verifyOtp", payload).then((res) => {
      setIsLoading(false);

      if (res?.error === true) {
        // e.g. { message: "Invalid OTP", error: true, success: false }
        context.alertBox("error", res?.message || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
        return;
      }

      if (res?.success === true) {
        // { message: "Login successfully", data: { accesstoken, refreshToken } }
        localStorage.setItem("accessToken", res?.data?.accesstoken);
        localStorage.setItem("refreshToken", res?.data?.refreshToken);
        context.alertBox("success", res?.message || "Login successful");
        history("/dashboard");
        return;
      }

      context.alertBox("error", res?.message || "Something went wrong. Please try again.");
    }).catch(() => {
      setIsLoading(false);
      context.alertBox("error", "Something went wrong. Please try again.");
    });
  };

  const handleResend = () => {
    if (secondsLeft > 0 || isResending) return;
    setIsResending(true);

    postData("/api/user/resendOtp", { sessionToken }).then((res) => {
      setIsResending(false);

      if (res?.error === true) {
        context.alertBox("error", res?.message || "Could not resend OTP");
        return;
      }

      context.alertBox("success", res?.message || "OTP resent");
      setSecondsLeft(RESEND_SECONDS);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    }).catch(() => {
      setIsResending(false);
      context.alertBox("error", "Could not resend OTP");
    });
  };

  const maskedMobile = mobile || "your registered number";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .vo-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #080810;
          position: relative;
          overflow: hidden;
          color: #fff;
        }

        .vo-bg-img { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .vo-bg-img img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center 30%; display: block;
          opacity: 0; transition: opacity 1.4s ease;
        }
        .vo-bg-img img.vo-loaded { opacity: 1; }
        .vo-bg-img::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(160deg,
            rgba(8,8,16,0.94) 0%,
            rgba(8,8,16,0.76) 45%,
            rgba(8,8,16,0.88) 100%);
        }

        .vo-orb { position:fixed;border-radius:50%;filter:blur(100px);opacity:0.22;pointer-events:none;animation:voOrb 14s ease-in-out infinite alternate;z-index:1; }
        .vo-orb-1 { width:700px;height:700px;background:radial-gradient(circle,#f59e0b 0%,transparent 65%);top:-250px;left:-180px;animation-duration:16s; }
        .vo-orb-2 { width:550px;height:550px;background:radial-gradient(circle,#7c3aed 0%,transparent 65%);bottom:-150px;right:-100px;animation-duration:11s;animation-delay:-5s; }
        @keyframes voOrb { 0%{transform:translate(0,0) scale(1);} 100%{transform:translate(40px,30px) scale(1.08);} }

        .vo-grid {
          position:fixed;inset:0;z-index:1;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
          background-size:64px 64px;
          pointer-events:none;
          mask-image: radial-gradient(ellipse at 50% 50%, black 30%, transparent 85%);
        }

        .vo-header {
          position:fixed;top:0;left:0;right:0;
          padding:16px 40px;
          display:flex;align-items:center;justify-content:space-between;
          backdrop-filter:blur(24px);
          background:rgba(8,8,16,0.5);
          border-bottom:1px solid rgba(255,255,255,0.06);
          z-index:100;
        }
        .vo-logo-mark { display:flex;align-items:center;gap:12px;text-decoration:none; }
        .vo-logo-icon {
          width:38px;height:38px;
          background:linear-gradient(135deg,#f59e0b,#f97316);
          border-radius:10px;display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 22px rgba(245,158,11,0.45);
        }
        .vo-logo-text { font-family:'DM Serif Display',serif;font-size:22px;background:linear-gradient(135deg,#fcd34d,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1; }
        .vo-logo-sub  { font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.28);text-transform:uppercase;margin-top:2px; }

        .vo-main {
          min-height:100vh;
          display:flex;align-items:center;justify-content:center;
          padding:100px 20px 60px;
          position:relative;z-index:10;
        }
        .vo-card {
          width:100%;max-width:440px;
          background:rgba(12,12,20,0.82);
          backdrop-filter:blur(28px);
          border-radius:28px;
          padding:44px 40px;
          box-shadow:
            0 50px 100px rgba(0,0,0,0.75),
            0 0 0 1px rgba(245,158,11,0.12),
            inset 0 1px 0 rgba(255,255,255,0.06);
          position:relative;overflow:hidden;
          opacity:0;transform:translateY(36px);
          animation:voReveal 0.75s cubic-bezier(0.22,1,0.36,1) forwards 0.15s;
        }
        @keyframes voReveal { to{opacity:1;transform:translateY(0);} }
        .vo-card::before {
          content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.5),transparent);
        }
        @media(max-width:520px){ .vo-card{padding:34px 24px;} }

        .vo-icon-badge {
          width:56px;height:56px;border-radius:16px;
          background:linear-gradient(135deg,rgba(245,158,11,0.25),rgba(249,115,22,0.15));
          border:1px solid rgba(245,158,11,0.35);
          display:flex;align-items:center;justify-content:center;
          margin-bottom:20px;
          box-shadow:0 0 24px rgba(245,158,11,0.15);
        }

        .vo-eyebrow { font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.28);font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px; }
        .vo-eyebrow::before { content:'';display:block;width:18px;height:1px;background:rgba(245,158,11,0.5); }
        .vo-title { font-family:'DM Serif Display',serif;font-size:27px;color:#fff;margin-bottom:8px;line-height:1.2; }
        .vo-title em { font-style:italic;background:linear-gradient(135deg,#fcd34d,#fb923c);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        .vo-sub { font-size:13.5px;color:rgba(255,255,255,0.4);line-height:1.6;margin-bottom:28px; }
        .vo-sub strong { color:rgba(255,255,255,0.75);font-weight:600; }

        .vo-otp-row { display:flex;gap:10px;margin-bottom:22px; }
        .vo-otp-box {
          width:100%;aspect-ratio:1;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;
          text-align:center;
          font-size:22px;font-weight:600;color:#fff;
          font-family:'DM Sans',sans-serif;
          outline:none;transition:all 0.25s;
          box-sizing:border-box;
        }
        .vo-otp-box:focus {
          border-color:rgba(245,158,11,0.65);
          background:rgba(245,158,11,0.06);
          box-shadow:0 0 0 3px rgba(245,158,11,0.1),0 2px 20px rgba(245,158,11,0.08);
        }
        .vo-otp-box:disabled { opacity:0.45;cursor:not-allowed; }

        .vo-resend-row { display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:24px;font-size:13px;color:rgba(255,255,255,0.32); }
        .vo-resend-btn { background:none;border:none;color:#fcd34d;font-weight:600;font-size:13px;cursor:pointer;padding:0;font-family:'DM Sans',sans-serif; }
        .vo-resend-btn:hover:not(:disabled) { color:#fb923c;text-decoration:underline; }
        .vo-resend-btn:disabled { color:rgba(255,255,255,0.25);cursor:not-allowed; }

        .vo-submit {
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
        .vo-submit:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 14px 44px rgba(245,158,11,0.48); }
        .vo-submit:disabled { opacity:0.38;cursor:not-allowed; }

        .vo-back-link { display:block;text-align:center;font-size:13px;color:rgba(255,255,255,0.32);text-decoration:none; }
        .vo-back-link:hover { color:#fcd34d; }

        .vo-trust {
          display:flex;align-items:center;justify-content:center;gap:6px;
          margin-top:22px;padding-top:18px;
          border-top:1px solid rgba(255,255,255,0.06);
          font-size:11px;color:rgba(255,255,255,0.28);
        }
      `}</style>

      <div className="vo-root">
        <div className="vo-bg-img">
          <img
            src={BG_IMAGE}
            alt=""
            aria-hidden="true"
            onLoad={e => e.target.classList.add('vo-loaded')}
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1920&q=85&fit=crop';
              e.target.classList.add('vo-loaded');
            }}
          />
        </div>
        <div className="vo-orb vo-orb-1" />
        <div className="vo-orb vo-orb-2" />
        <div className="vo-grid" />

        <header className="vo-header">
          <Link to="/" className="vo-logo-mark">
            <div className="vo-logo-icon"><ShoppingCart size={18} color="#0a0a0f" /></div>
            <div>
              <div className="vo-logo-text">Fizzy Fuzz</div>
              <div className="vo-logo-sub">Seller Dashboard</div>
            </div>
          </Link>
        </header>

        <main className="vo-main">
          <div className="vo-card">
            <div className="vo-icon-badge">
              <KeyRound size={24} color="#fcd34d" />
            </div>

            <p className="vo-eyebrow">{purpose === "register" ? "Verify to continue" : "Verify OTP"}</p>
            <h1 className="vo-title">Enter <em>OTP</em></h1>
            <p className="vo-sub">
              We've sent a 6-digit code via SMS to <strong>{maskedMobile}</strong>. Enter it below to verify your number.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="vo-otp-row" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="vo-otp-box"
                    value={digit}
                    disabled={isLoading}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <div className="vo-resend-row">
                {secondsLeft > 0 ? (
                  <span>Resend code in {secondsLeft}s</span>
                ) : (
                  <>
                    <span>Didn't get the code?</span>
                    <button
                      type="button"
                      className="vo-resend-btn"
                      onClick={handleResend}
                      disabled={isResending}
                    >
                      {isResending ? "Sending..." : "Resend OTP"}
                    </button>
                  </>
                )}
              </div>

              <button type="submit" className="vo-submit" disabled={!isOtpComplete || isLoading}>
                {isLoading
                  ? <CircularProgress color="inherit" size={22} />
                  : <><Smartphone size={16} /> Verify &amp; Continue</>
                }
              </button>

              <Link to="/register" className="vo-back-link">← Back to registration</Link>
            </form>

            <div className="vo-trust">
              <ShieldCheck size={12} color="#34d399" /> Your number is only used for verification
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default VerifyOtp;