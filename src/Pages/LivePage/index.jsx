import React, { useContext } from "react";
import { IoVideocamOutline, IoTimeOutline, IoMailOutline, IoCallOutline } from "react-icons/io5";
import { MyContext } from "../../App";

const LiveComingSoon = () => {
    const context = useContext(MyContext)
    let isEnabled = context.userData?.isLiveEnabled
  return (
    <div className="min-h-[85vh] flex items-center justify-center  bg-[radial-gradient(ellipse_at_top_left,_#4b1366_0%,_#2a0a3d_40%,_#120016_75%,_#0a0010_100%)] px-4 rounded-lg">
      {isEnabled?<div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center">
        
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
          <IoVideocamOutline className="text-white text-4xl" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Live Shopping
        </h1>

        {/* Tagline */}
        <p className="text-sm uppercase tracking-widest text-purple-600 font-semibold mb-4">
          Fizzy Fuzz · Next Level Shopping
        </p>

        {/* Description */}
        <p className="text-gray-600 text-base mb-6 leading-relaxed">
          We’re cooking up something <span className="font-semibold">exciting</span> 🔥  
          <br />
          Our <span className="font-semibold text-purple-600">Live Shopping</span> experience is almost here.
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold mb-6">
          <IoTimeOutline />
          Live will be up soon
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500">
          Stay tuned for real-time shopping, exclusive drops, and creator-led experiences.
        </p>
      </div>:<div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full px-4 py-8 text-center">
  {/* Icon */}
  <div className="w-20 h-20 mx-auto mb-6 rounded-full  bg-[radial-gradient(ellipse_at_top_left,_#4b1366_0%,_#2a0a3d_40%,_#120016_75%,_#0a0010_100%)] flex items-center justify-center shadow-lg">
    <IoCallOutline className="text-white text-4xl" />
  </div>

  {/* Title */}
  <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
    Customer Care
  </h1>

  {/* Tagline */}
  <p className="text-sm uppercase tracking-widest text-purple-600 font-semibold mb-4">
    Fizzy Fuzz · We’re Here to Help
  </p>

  {/* Description */}
  <p className="text-gray-600 text-base mb-6 leading-relaxed">
    Need assistance with your live shopping Sessions?
    <br />
    Reach out to our <span className="font-semibold text-purple-600">Customer Care</span> team anytime.
  </p>

  {/* Contact Details */}
  <div className="w-1/8  flex justify-around gap-3 items-center mb-6">
    <a
      href="tel:9422799343"
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition"
    >
      <IoCallOutline />
      +91 94227 99343
    </a>

    <a
      href="mailto:care@fizzyfuzz.in"
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition"
    >
      <IoMailOutline />
      care@fizzyfuzz.in
    </a>
  </div>

  {/* Footer */}
  <p className="text-xs text-gray-500">
    Our support team is happy to assist you with any queries.
  </p>
</div>
}
    </div>
  );
};

export default LiveComingSoon;
