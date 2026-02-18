import React from "react";
import { ShieldCheck, Lock, Eye, FileText, Cookie } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="">
      <div className="mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm opacity-90">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 space-y-6 text-gray-700 text-sm leading-relaxed">

          <p className="text-base">
            Your privacy matters to us. This Privacy Policy explains how we
            collect, use, and safeguard your information when you use our
            platform.
          </p>

          {/* Section */}
          <PolicyItem
            icon={<Eye />}
            title="Information We Collect"
            text="We may collect personal details such as your name, email address, phone number, and usage data when you interact with our services."
          />

          <PolicyItem
            icon={<FileText />}
            title="How We Use Your Information"
            text="Your information helps us operate, maintain, enhance our services, and communicate important updates."
          />

          <PolicyItem
            icon={<Lock />}
            title="Data Security"
            text="We use appropriate technical and organizational security measures to protect your personal data."
          />

          <PolicyItem
            icon={<ShieldCheck />}
            title="Sharing of Information"
            text="We do not sell or rent your personal data. Information may be shared only when legally required or necessary for service delivery."
          />

          <PolicyItem
            icon={<Cookie />}
            title="Cookies"
            text="Cookies may be used to improve your experience and understand platform usage trends."
          />

          <div className="border-t pt-5 text-xs text-gray-500">
            This policy may be updated periodically. Continued use of our
            services indicates acceptance of the updated terms.
          </div>

        </div>
      </div>
    </div>
  );
};

const PolicyItem = ({ icon, title, text }) => (
  <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border hover:shadow-sm transition">
    <div className="text-indigo-600 mt-1">{icon}</div>
    <div>
      <h2 className="font-semibold text-base mb-1 text-gray-800">
        {title}
      </h2>
      <p>{text}</p>
    </div>
  </div>
);

export default PrivacyPolicy;
