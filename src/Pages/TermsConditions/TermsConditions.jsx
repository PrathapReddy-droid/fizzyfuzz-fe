import React from "react";
import {
  FileText,
  UserCheck,
  ShieldAlert,
  Ban,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="">
      <div className=" mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-sm opacity-90">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 space-y-6 text-gray-700 text-sm leading-relaxed">

          <p className="text-base">
            Welcome to our platform. By accessing or using our services, you
            agree to be bound by these Terms & Conditions. If you do not agree,
            please discontinue use immediately.
          </p>

          <TermItem
            icon={<UserCheck />}
            title="Use of Services"
            text="You agree to use our services only for lawful purposes and in compliance with all applicable laws and regulations."
          />

          <TermItem
            icon={<ShieldAlert />}
            title="User Responsibilities"
            text="You are responsible for safeguarding your account credentials and for all activities performed under your account."
          />

          <TermItem
            icon={<FileText />}
            title="Content Ownership"
            text="All platform content, trademarks, and intellectual property belong to us unless explicitly stated otherwise."
          />

          <TermItem
            icon={<Ban />}
            title="Termination"
            text="We reserve the right to suspend or terminate your access to the platform at any time if these terms are violated."
          />

          <TermItem
            icon={<AlertTriangle />}
            title="Limitation of Liability"
            text="We are not liable for any indirect, incidental, or consequential damages resulting from use of our services."
          />

          <TermItem
            icon={<RefreshCw />}
            title="Changes to Terms"
            text="These Terms & Conditions may be updated periodically. Continued use of the platform signifies acceptance of the revised terms."
          />

          <div className="border-t pt-5 text-xs text-gray-500">
            If you have any questions regarding these terms, please contact our
            support team.
          </div>

        </div>
      </div>
    </div>
  );
};

const TermItem = ({ icon, title, text }) => (
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

export default TermsConditions;
