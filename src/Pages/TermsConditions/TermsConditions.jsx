import React, { useState } from "react";
import {
  FileText, UserCheck, ShieldAlert, Ban, AlertTriangle, RefreshCw,
  PackageCheck, BadgeIndianRupee, Store, Truck, RotateCcw,
  Scale, Lock, Globe, Phone, ChevronDown, ChevronUp
} from "lucide-react";

const SECTIONS = [
  {
    icon: <UserCheck size={16} color="#fcd34d" />,
    title: "1. Introduction & Acceptance",
    content: [
      "Welcome to FizzyFuzz. These Terms & Conditions ('Terms') govern your use of the FizzyFuzz platform, including the seller dashboard, buyer storefront, and all associated services ('Platform').",
      "By registering as a seller or buyer on FizzyFuzz, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must immediately cease use of the Platform.",
      "FizzyFuzz reserves the right to modify these Terms at any time. Continued use of the Platform after any such changes constitutes your acceptance of the new Terms.",
    ]
  },
  {
    icon: <Store size={16} color="#fcd34d" />,
    title: "2. Seller Eligibility & Registration",
    content: [
      "To register as a seller on FizzyFuzz, you must be at least 18 years of age and a resident of India with a valid PAN or Aadhaar number.",
      "Sellers must provide accurate and complete business information including GSTIN (if applicable), bank account details, and a valid KYC document at the time of registration.",
      "FizzyFuzz reserves the right to reject any seller application or revoke seller status at its sole discretion if any information is found to be false, misleading, or in violation of these Terms.",
      "Each individual or business entity is allowed only one seller account. Creating multiple accounts may result in permanent suspension.",
    ]
  },
  {
    icon: <PackageCheck size={16} color="#fcd34d" />,
    title: "3. Product Listings & Prohibited Items",
    content: [
      "Sellers are solely responsible for the accuracy, quality, and legality of their product listings. All product descriptions, images, and pricing must be truthful and not misleading.",
      "Sellers must not list counterfeit, pirated, stolen, or otherwise illegal products. Prohibited categories include but are not limited to: narcotics, weapons, adult content, endangered species products, and items banned under Indian law.",
      "FizzyFuzz reserves the right to remove any listing and suspend any seller account found to be in violation of these guidelines without prior notice.",
      "Sellers must ensure that their products comply with all applicable Indian laws including the Consumer Protection Act 2019, Legal Metrology Act, and Food Safety and Standards Act.",
    ]
  },
  {
    icon: <BadgeIndianRupee size={16} color="#fcd34d" />,
    title: "4. Pricing, Fees & Payouts",
    content: [
      "Sellers are free to set their own prices on the Platform. However, FizzyFuzz reserves the right to enforce a minimum or maximum price for certain categories to maintain competitive standards.",
      "FizzyFuzz charges a platform commission on each completed sale. The commission rate varies by product category and will be clearly communicated to the seller prior to listing.",
      "Payouts to sellers are processed on a weekly settlement cycle. Funds are transferred directly to the registered bank account within 7 business days of order completion.",
      "FizzyFuzz deducts applicable TDS (Tax Deducted at Source) as required under Indian tax law before processing payout. Sellers are responsible for their own GST filings and tax obligations.",
    ]
  },
  {
    icon: <Truck size={16} color="#fcd34d" />,
    title: "5. Shipping & Order Fulfilment",
    content: [
      "Sellers are responsible for packing, labelling, and dispatching orders within the stipulated processing time as agreed upon at the time of registration.",
      "FizzyFuzz partners with third-party logistics providers for delivery. Sellers must ensure packages are securely packed and comply with the logistics provider's packaging guidelines.",
      "In case of a failed delivery due to an incorrect or incomplete address provided by the buyer, the seller will be refunded the product value minus logistics charges.",
      "Sellers must update the order status promptly on the Platform. Failure to dispatch within the agreed timeline may result in automatic order cancellation and negative impact on seller ratings.",
    ]
  },
  {
    icon: <RotateCcw size={16} color="#fcd34d" />,
    title: "6. Returns, Refunds & Cancellations",
    content: [
      "FizzyFuzz operates a buyer-friendly return policy. Buyers may request a return within 7 days of delivery for eligible products. Sellers must accept valid return requests.",
      "In the event of a return, the refund to the buyer will be processed within 5–7 business days. The corresponding amount will be deducted from the seller's next payout cycle.",
      "If a product is found to be damaged, defective, or significantly different from its listing, the seller bears full responsibility for the return logistics cost and full refund.",
      "Sellers may cancel an order prior to dispatch in exceptional circumstances. Repeated cancellations will negatively affect the seller's performance score and may lead to account suspension.",
    ]
  },
  {
    icon: <ShieldAlert size={16} color="#fcd34d" />,
    title: "7. Seller Responsibilities & Conduct",
    content: [
      "Sellers must maintain a minimum seller rating of 3.5 stars. Sellers falling below this threshold for two consecutive months may have their accounts reviewed or suspended.",
      "Sellers are prohibited from engaging in fraudulent activity, price manipulation, fake reviews, or any conduct designed to deceive buyers or FizzyFuzz.",
      "Sellers must not communicate with buyers outside the FizzyFuzz Platform for transactional purposes. Any attempt to divert sales off-platform is a violation of these Terms.",
      "All communication with buyers must be professional, respectful, and in compliance with applicable laws. FizzyFuzz reserves the right to monitor and record such communications.",
    ]
  },
  {
    icon: <Lock size={16} color="#fcd34d" />,
    title: "8. Intellectual Property",
    content: [
      "All platform content, trademarks, logos, designs, and technology owned by FizzyFuzz are protected under applicable intellectual property laws. Sellers may not reproduce or misuse any such content.",
      "By uploading product images, descriptions, or other content to the Platform, sellers grant FizzyFuzz a non-exclusive, royalty-free, worldwide licence to use such content for marketing and platform operations.",
      "Sellers warrant that all content they upload does not infringe the intellectual property rights of any third party. FizzyFuzz shall not be liable for any third-party IP claims arising from seller content.",
    ]
  },
  {
    icon: <AlertTriangle size={16} color="#fcd34d" />,
    title: "9. Limitation of Liability",
    content: [
      "FizzyFuzz acts as an intermediary marketplace and is not the seller of record. FizzyFuzz is not liable for the quality, safety, legality, or delivery of products listed by sellers.",
      "To the maximum extent permitted by law, FizzyFuzz's total liability to any seller shall not exceed the total fees paid by that seller to FizzyFuzz in the 3 months preceding the claim.",
      "FizzyFuzz is not liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.",
    ]
  },
  {
    icon: <Ban size={16} color="#fcd34d" />,
    title: "10. Account Suspension & Termination",
    content: [
      "FizzyFuzz reserves the right to suspend or permanently terminate any seller account that violates these Terms, engages in fraudulent conduct, or poses a risk to buyers or the Platform.",
      "Upon termination, any pending payouts will be held for 30 days to process open disputes and returns. Remaining balances will be settled as per the standard payout schedule.",
      "Sellers may request account deactivation at any time by contacting support. However, obligations arising from existing orders must be fulfilled prior to deactivation.",
    ]
  },
  {
    icon: <Scale size={16} color="#fcd34d" />,
    title: "11. Governing Law & Dispute Resolution",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.",
      "FizzyFuzz encourages parties to resolve disputes amicably. In the event of a dispute, the aggrieved party must first raise the matter through FizzyFuzz's internal grievance redressal mechanism.",
      "If a dispute cannot be resolved internally within 30 days, it shall be referred to binding arbitration under the Arbitration and Conciliation Act, 1996.",
    ]
  },
  {
    icon: <Phone size={16} color="#fcd34d" />,
    title: "12. Contact & Grievance Officer",
    content: [
      "For any queries, complaints, or feedback regarding these Terms or the Platform, please contact our Seller Support team at support@fizzyfuzz.in.",
      "In accordance with the Information Technology Act, 2000, our Grievance Officer can be reached at: grievance@fizzyfuzz.in. We endeavour to resolve all grievances within 30 days of receipt.",
      "FizzyFuzz's registered office is located in India. All formal legal notices must be addressed to the registered office address as listed on the Platform.",
    ]
  },
  {
    icon: <RefreshCw size={16} color="#fcd34d" />,
    title: "13. Amendments to Terms",
    content: [
      "FizzyFuzz reserves the right to update or amend these Terms at any time. Sellers will be notified of material changes via email or a prominent notice on the Platform.",
      "Continued use of the Platform following the posting of revised Terms constitutes your acceptance of those changes. It is your responsibility to review these Terms periodically.",
    ]
  },
];

const TermSection = ({ section, index }) => {
  const [open, setOpen] = useState(index < 2);
  return (
    <div className="tc-section">
      <button className="tc-section-header" onClick={() => setOpen(!open)} type="button">
        <div className="tc-section-icon-wrap">{section.icon}</div>
        <span className="tc-section-title">{section.title}</span>
        <div className="tc-chevron">{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</div>
      </button>
      {open && (
        <div className="tc-section-body">
          {section.content.map((para, i) => (
            <p key={i} className="tc-para">{para}</p>
          ))}
        </div>
      )}
    </div>
  );
};

const TermsConditions = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        .tc-root {
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          width: 100%;
        }

        /* ── Hero ── */
        .tc-hero {
          background: linear-gradient(135deg, rgba(19,13,0,0.98) 0%, rgba(13,13,10,0.96) 60%, rgba(18,9,0,0.98) 100%);
          border: 1px solid rgba(245,158,11,0.18);
          border-radius: 20px;
          padding: 36px 36px 32px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }
        .tc-hero::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent);
        }
        .tc-hero::after {
          content: '';
          position: absolute; bottom: -40px; right: -40px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .tc-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 100px; padding: 4px 14px;
          font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
          color: #fcd34d; text-transform: uppercase; margin-bottom: 16px;
        }
        .tc-hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px; line-height: 1.15; color: #fff; margin-bottom: 10px;
        }
        .tc-hero-title em {
          font-style: italic;
          background: linear-gradient(135deg, #fcd34d, #fb923c);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .tc-hero-meta {
          font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 20px;
        }
        .tc-hero-chips { display: flex; gap: 10px; flex-wrap: wrap; }
        .tc-hero-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px; padding: 5px 14px;
          font-size: 12px; color: rgba(255,255,255,0.45);
        }

        /* ── Sections ── */
        .tc-section {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          margin-bottom: 10px;
          overflow: hidden;
          transition: border-color 0.25s;
        }
        .tc-section:hover { border-color: rgba(245,158,11,0.2); }

        .tc-section-header {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 16px 20px;
          background: none; border: none; cursor: pointer;
          text-align: left; transition: background 0.2s;
        }
        .tc-section-header:hover { background: rgba(245,158,11,0.05); }

        .tc-section-icon-wrap {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.12));
          border: 1px solid rgba(245,158,11,0.2);
        }
        .tc-section-title {
          flex: 1;
          font-size: 14px; font-weight: 600; color: #fff; letter-spacing: 0.2px;
        }
        .tc-chevron { color: rgba(255,255,255,0.3); flex-shrink: 0; transition: color 0.2s; }
        .tc-section-header:hover .tc-chevron { color: #fcd34d; }

        .tc-section-body {
          padding: 4px 20px 20px 64px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        @media(max-width:520px){ .tc-section-body { padding: 12px 16px 18px; } }

        .tc-para {
          font-size: 13.5px;
          line-height: 1.75;
          color: rgba(255,255,255,0.5);
          margin-bottom: 10px;
          padding-left: 0;
        }
        .tc-para:last-child { margin-bottom: 0; }
        .tc-para::before {
          content: '–';
          color: rgba(245,158,11,0.5);
          margin-right: 8px;
          font-weight: 700;
        }

        /* ── Footer ── */
        .tc-footer {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 20px 24px;
          margin-top: 10px;
          display: flex; align-items: center; gap: 14px;
        }
        .tc-footer-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.1));
        }
        .tc-footer-text { font-size: 12.5px; color: rgba(255,255,255,0.35); line-height: 1.6; }
        .tc-footer-text strong { color: rgba(255,255,255,0.6); }
      `}</style>

      <div className="tc-root">

        {/* Hero */}
        <div className="tc-hero">
          <div className="tc-hero-badge">
            <FileText size={10} /> Legal Document
          </div>
          <h1 className="tc-hero-title">
            Seller Terms &amp; <em>Conditions</em>
          </h1>
          <p className="tc-hero-meta">
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            &nbsp;·&nbsp; Effective for all FizzyFuzz Seller accounts
          </p>
          <div className="tc-hero-chips">
            <div className="tc-hero-chip"><Globe size={11} /> Governed by Indian Law</div>
            <div className="tc-hero-chip"><Scale size={11} /> Jurisdiction: Bengaluru, KA</div>
            <div className="tc-hero-chip"><FileText size={11} /> 13 Sections</div>
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map((section, i) => (
          <TermSection key={i} section={section} index={i} />
        ))}

        {/* Footer note */}
        <div className="tc-footer">
          <div className="tc-footer-icon">
            <Phone size={15} color="#fcd34d" />
          </div>
          <p className="tc-footer-text">
            Questions about these Terms? Contact our Seller Support team at{" "}
            <strong>support@fizzyfuzz.in</strong> or reach our Grievance Officer at{" "}
            <strong>grievance@fizzyfuzz.in</strong>. We respond within 30 days.
          </p>
        </div>

      </div>
    </>
  );
};

export default TermsConditions;
