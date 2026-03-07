import React, { useState } from "react";
import {
  ShieldCheck, Lock, Eye, FileText, Cookie, Smartphone,
  Share2, Globe, Database, Baby, UserCheck, RefreshCw,
  Phone, Mail, MapPin, ChevronDown, ChevronUp
} from "lucide-react";

const SECTIONS = [
  {
    icon: <Eye size={16} color="#fcd34d" />,
    title: "1. Information We Collect",
    content: [
      "When you use the Fizzy Fuzz platform, we may collect certain personal information from you including: Name, Phone number, Email address, Delivery address, Payment information, and Account login information.",
      "You may provide this information when creating an account, placing an order, contacting customer support, or participating in promotions or offers.",
      "Some parts of the platform may be accessed without creating an account. However, certain services require registration.",
    ]
  },
  {
    icon: <Database size={16} color="#fcd34d" />,
    title: "2. Information Collected Automatically",
    content: [
      "When you use our platform, we may automatically collect certain information such as: Device information, IP address, Browser type, Pages visited, Purchase history, and Browsing patterns.",
      "This information helps us improve our services and provide a better user experience.",
    ]
  },
  {
    icon: <FileText size={16} color="#fcd34d" />,
    title: "3. How We Use Your Information",
    content: [
      "Fizzy Fuzz may use your information for the following purposes: To process and deliver orders, to provide customer support, to send order updates and notifications, and to improve our products and services.",
      "We also use your information to detect fraud or illegal activity, to send promotional offers and updates, and to personalize the shopping experience.",
    ]
  },
  {
    icon: <Smartphone size={16} color="#fcd34d" />,
    title: "4. Device Permissions",
    content: [
      "With your permission, the Fizzy Fuzz app may request access to certain device features such as: Camera, Photo gallery, Location, Contacts, and Device information.",
      "These permissions help provide certain features of the application. You may disable them at any time through your device settings.",
    ]
  },
  {
    icon: <Cookie size={16} color="#fcd34d" />,
    title: "5. Cookies",
    content: [
      "Our platform may use cookies to improve your experience. Cookies are small files stored on your device that help us understand how users interact with the platform.",
      "Cookies help us: Improve website performance, remember user preferences, analyze traffic, and provide personalized content.",
      "You may disable cookies through your browser settings.",
    ]
  },
  {
    icon: <Share2 size={16} color="#fcd34d" />,
    title: "6. Sharing of Information",
    content: [
      "Fizzy Fuzz may share your information with trusted partners such as: Sellers on the platform, Delivery partners, Payment service providers, and Technology partners.",
      "This sharing helps us process orders and deliver services. We may also share information if required by law.",
    ]
  },
  {
    icon: <Globe size={16} color="#fcd34d" />,
    title: "7. Third-Party Services",
    content: [
      "Our platform may contain links to third-party websites or services. These websites have their own privacy policies. Fizzy Fuzz is not responsible for their privacy practices.",
      "Users should review third-party privacy policies before providing personal information.",
    ]
  },
  {
    icon: <Lock size={16} color="#fcd34d" />,
    title: "8. Security of Information",
    content: [
      "We take reasonable security measures to protect your personal information. These measures include secure servers and restricted access to data.",
      "However, internet data transmission cannot be guaranteed to be completely secure. Users are responsible for protecting their own login credentials.",
    ]
  },
  {
    icon: <Baby size={16} color="#fcd34d" />,
    title: "9. Children's Privacy",
    content: [
      "Fizzy Fuzz services are intended only for users who are 18 years or older. We do not knowingly collect personal information from children under 18 years of age.",
    ]
  },
  {
    icon: <Database size={16} color="#fcd34d" />,
    title: "10. Data Retention",
    content: [
      "We retain personal information only for as long as necessary. This may include purposes such as: Order processing, Legal compliance, Fraud prevention, and Business analysis.",
      "We may keep anonymous data for research purposes.",
    ]
  },
  {
    icon: <UserCheck size={16} color="#fcd34d" />,
    title: "11. Your Rights",
    content: [
      "You have the right to: Access your personal information, Update or correct your information, Request deletion of certain data, and Withdraw consent.",
      "You may contact us for assistance regarding any of these requests.",
    ]
  },
  {
    icon: <ShieldCheck size={16} color="#fcd34d" />,
    title: "12. Consent",
    content: [
      "By using the Fizzy Fuzz platform and providing personal information, you consent to the collection and use of your information according to this Privacy Policy.",
    ]
  },
  {
    icon: <RefreshCw size={16} color="#fcd34d" />,
    title: "13. Changes to This Privacy Policy",
    content: [
      "Fizzy Fuzz may update this Privacy Policy from time to time. Any changes will be posted on our platform.",
      "Users are encouraged to review this policy periodically to stay informed of any updates.",
    ]
  },
];

const PolicySection = ({ section, index }) => {
  const [open, setOpen] = useState(index < 2);
  return (
    <div className="pp-section">
      <button className="pp-section-header" onClick={() => setOpen(!open)} type="button">
        <div className="pp-section-icon-wrap">{section.icon}</div>
        <span className="pp-section-title">{section.title}</span>
        <div className="pp-chevron">{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</div>
      </button>
      {open && (
        <div className="pp-section-body">
          {section.content.map((para, i) => (
            <p key={i} className="pp-para">{para}</p>
          ))}
        </div>
      )}
    </div>
  );
};

const PrivacyPolicy = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .pp-root { font-family:'DM Sans',sans-serif; color:#fff; width:100%; }

        /* ── Hero ── */
        .pp-hero {
          background:linear-gradient(135deg,rgba(19,13,0,0.98) 0%,rgba(13,13,10,0.96) 60%,rgba(18,9,0,0.98) 100%);
          border:1px solid rgba(245,158,11,0.18);
          border-radius:20px;padding:36px 36px 32px;
          margin-bottom:20px;position:relative;overflow:hidden;
        }
        .pp-hero::before {
          content:'';position:absolute;top:0;left:8%;right:8%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.6),transparent);
        }
        .pp-hero::after {
          content:'';position:absolute;bottom:-40px;right:-40px;
          width:200px;height:200px;border-radius:50%;
          background:radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 70%);
          pointer-events:none;
        }
        .pp-hero-badge {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);
          border-radius:100px;padding:4px 14px;
          font-size:11px;font-weight:600;letter-spacing:1.5px;
          color:#fcd34d;text-transform:uppercase;margin-bottom:16px;
        }
        .pp-hero-title {
          font-family:'DM Serif Display',serif;
          font-size:32px;line-height:1.15;color:#fff;margin-bottom:10px;
        }
        .pp-hero-title em {
          font-style:italic;
          background:linear-gradient(135deg,#fcd34d,#fb923c);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .pp-hero-meta { font-size:13px;color:rgba(255,255,255,0.35);margin-bottom:20px; }
        .pp-hero-chips { display:flex;gap:10px;flex-wrap:wrap; }
        .pp-hero-chip {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
          border-radius:100px;padding:5px 14px;
          font-size:12px;color:rgba(255,255,255,0.45);
        }

        /* ── Disclaimer banner ── */
        .pp-disclaimer {
          background:rgba(245,158,11,0.06);
          border:1px solid rgba(245,158,11,0.18);
          border-radius:12px;padding:14px 18px;
          margin-bottom:16px;
          font-size:12.5px;color:rgba(255,255,255,0.45);line-height:1.65;
        }
        .pp-disclaimer strong { color:rgba(255,255,255,0.65); }

        /* ── Sections ── */
        .pp-section {
          background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:14px;margin-bottom:10px;overflow:hidden;
          transition:border-color 0.25s;
        }
        .pp-section:hover { border-color:rgba(245,158,11,0.2); }
        .pp-section-header {
          width:100%;display:flex;align-items:center;gap:12px;
          padding:16px 20px;background:none;border:none;cursor:pointer;
          text-align:left;transition:background 0.2s;
        }
        .pp-section-header:hover { background:rgba(245,158,11,0.05); }
        .pp-section-icon-wrap {
          width:32px;height:32px;border-radius:9px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(249,115,22,0.12));
          border:1px solid rgba(245,158,11,0.2);
        }
        .pp-section-title { flex:1;font-size:14px;font-weight:600;color:#fff;letter-spacing:0.2px; }
        .pp-chevron { color:rgba(255,255,255,0.3);flex-shrink:0;transition:color 0.2s; }
        .pp-section-header:hover .pp-chevron { color:#fcd34d; }
        .pp-section-body {
          padding:4px 20px 20px 64px;
          border-top:1px solid rgba(255,255,255,0.05);
        }
        @media(max-width:520px){ .pp-section-body{ padding:12px 16px 18px; } }
        .pp-para {
          font-size:13.5px;line-height:1.75;
          color:rgba(255,255,255,0.5);margin-bottom:10px;
        }
        .pp-para:last-child { margin-bottom:0; }
        .pp-para::before { content:'–';color:rgba(245,158,11,0.5);margin-right:8px;font-weight:700; }

        /* ── Contact card ── */
        .pp-contact {
          background:rgba(12,8,0,0.7);
          border:1px solid rgba(245,158,11,0.15);
          border-radius:16px;padding:24px 28px;margin-top:10px;
          position:relative;overflow:hidden;
        }
        .pp-contact::before {
          content:'';position:absolute;top:0;left:8%;right:8%;height:1px;
          background:linear-gradient(90deg,transparent,rgba(245,158,11,0.45),transparent);
        }
        .pp-contact-title {
          font-family:'DM Serif Display',serif;font-size:16px;color:#fff;
          margin-bottom:16px;display:flex;align-items:center;gap:8px;
        }
        .pp-contact-grid { display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px; }
        @media(max-width:600px){ .pp-contact-grid{ grid-template-columns:1fr; } }
        .pp-contact-item {
          display:flex;align-items:flex-start;gap:10px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:10px;padding:12px 14px;
        }
        .pp-contact-icon {
          width:28px;height:28px;border-radius:8px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(249,115,22,0.1));
        }
        .pp-contact-label { font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:3px; }
        .pp-contact-value { font-size:13px;color:rgba(255,255,255,0.7);line-height:1.5; }
      `}</style>

      <div className="pp-root">

        {/* Hero */}
        <div className="pp-hero">
          <div className="pp-hero-badge">
            <ShieldCheck size={10} /> Privacy Policy
          </div>
          <h1 className="pp-hero-title">
            Your Privacy, Our <em>Commitment</em>
          </h1>
          <p className="pp-hero-meta">
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            &nbsp;·&nbsp; Fizzy Fuzz – Next Level Shoppie
          </p>
          <div className="pp-hero-chips">
            <div className="pp-hero-chip"><Globe size={11} /> Governed by Indian Law</div>
            <div className="pp-hero-chip"><MapPin size={11} /> Chennai, Tamil Nadu</div>
            <div className="pp-hero-chip"><FileText size={11} /> 13 Sections</div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pp-disclaimer">
          <strong>Disclaimer:</strong> If there is any difference between the English version and any translated version of this Privacy Policy, the English version will take precedence. Fizzy Fuzz respects the privacy of its users and is committed to protecting your personal information and ensuring safe transactions.
        </div>

        {/* Sections */}
        {SECTIONS.map((section, i) => (
          <PolicySection key={i} section={section} index={i} />
        ))}

        {/* Contact */}
        <div className="pp-contact">
          <div className="pp-contact-title">
            <div style={{ width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,rgba(245,158,11,0.25),rgba(249,115,22,0.15))',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Phone size={14} color="#fcd34d" />
            </div>
            Contact Information
          </div>
          <div className="pp-contact-grid">
            <div className="pp-contact-item">
              <div className="pp-contact-icon"><MapPin size={13} color="#fcd34d" /></div>
              <div>
                <div className="pp-contact-label">Address</div>
                <div className="pp-contact-value">S1 Avenue, Anugraha Theatre Street, Shanthi Nagar, Kolathur, Chennai – 600099, Tamil Nadu, India</div>
              </div>
            </div>
            <div className="pp-contact-item">
              <div className="pp-contact-icon"><Phone size={13} color="#fcd34d" /></div>
              <div>
                <div className="pp-contact-label">Phone</div>
                <div className="pp-contact-value">+91 94227 99343</div>
              </div>
            </div>
            <div className="pp-contact-item">
              <div className="pp-contact-icon"><Mail size={13} color="#fcd34d" /></div>
              <div>
                <div className="pp-contact-label">Email</div>
                <div className="pp-contact-value">info@fizzyfuzz.in</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default PrivacyPolicy;
