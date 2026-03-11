import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/free-mode';
import { Navigation, FreeMode } from "swiper/modules";
import { GoGift } from "react-icons/go";
import { IoStatsChartSharp } from "react-icons/io5";
import { FiPieChart } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { MdOutlineReviews } from "react-icons/md";
import { MyContext } from "../../App";

const DashboardBoxes = (props) => {
  const context = useContext(MyContext);

  const boxes = [
    {
      label: "Total Users",
      value: props?.users,
      icon: <FiPieChart />,
      accent: <IoStatsChartSharp />,
      gradient: "linear-gradient(135deg, #4f29c0 0%, #7c3aed 100%)",
      glow: "rgba(124, 58, 237, 0.45)",
      shimmer: "rgba(255,255,255,0.06)",
    },
    {
      label: "Total Orders",
      value: props?.orders,
      icon: <GoGift />,
      accent: <FiPieChart />,
      gradient: "linear-gradient(135deg, #6d28d9 0%, #9b59f5 100%)",
      glow: "rgba(155, 89, 245, 0.45)",
      shimmer: "rgba(255,255,255,0.06)",
    },
    {
      label: "Total Products",
      value: props?.products,
      icon: <RiProductHuntLine />,
      accent: <IoStatsChartSharp />,
      gradient: "linear-gradient(135deg, #3b1fa8 0%, #6d28d9 100%)",
      glow: "rgba(109, 40, 217, 0.45)",
      shimmer: "rgba(255,255,255,0.06)",
    },
    {
      label: "Total Category",
      value: props?.category,
      icon: <MdOutlineReviews />,
      accent: <IoStatsChartSharp />,
      gradient: "linear-gradient(135deg, #2e1a63 0%, #4f29c0 100%)",
      glow: "rgba(79, 41, 192, 0.45)",
      shimmer: "rgba(255,255,255,0.06)",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .db-slider {
          margin-bottom: 20px;
        }

        .db-box {
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          padding: 22px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(139, 92, 246, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .db-box:hover {
          transform: translateY(-3px);
        }

        .db-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--shimmer);
          opacity: 0;
          transition: opacity 0.2s ease;
          border-radius: inherit;
        }

        .db-box:hover::before {
          opacity: 1;
        }

        .db-box-icon {
          font-size: 36px;
          color: rgba(255,255,255,0.9);
          flex-shrink: 0;
          z-index: 1;
        }

        .db-box-info {
          flex: 1;
          min-width: 0;
          z-index: 1;
        }

        .db-box-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 4px;
        }

        .db-box-value {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .db-box-bg-icon {
          font-size: 64px;
          color: rgba(255,255,255,0.08);
          flex-shrink: 0;
          z-index: 0;
          position: absolute;
          right: -8px;
          bottom: -8px;
        }

        /* Swiper nav override */
        .db-slider .swiper-button-next,
        .db-slider .swiper-button-prev {
          color: #9b59f5;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: 50%;
          width: 36px;
          height: 36px;
        }

        .db-slider .swiper-button-next::after,
        .db-slider .swiper-button-prev::after {
          font-size: 13px;
          font-weight: 700;
        }

        .db-slider .swiper-button-next:hover,
        .db-slider .swiper-button-prev:hover {
          background: rgba(124,58,237,0.3);
        }
      `}</style>

      <Swiper
        slidesPerView={4}
        spaceBetween={12}
        navigation={context?.windowWidth < 1100 ? false : true}
        modules={[Navigation, FreeMode]}
        freeMode={true}
        breakpoints={{
          300: { slidesPerView: 1, spaceBetween: 12 },
          550: { slidesPerView: 2, spaceBetween: 12 },
          900: { slidesPerView: 3, spaceBetween: 12 },
          1100: { slidesPerView: 4, spaceBetween: 12 },
        }}
        className="db-slider"
      >
        {boxes.map((box, i) => (
          <SwiperSlide key={i}>
            <div
              className="db-box"
              style={{
                background: box.gradient,
                boxShadow: `0 8px 28px ${box.glow}`,
                "--shimmer": box.shimmer,
              }}
            >
              <span className="db-box-icon">{box.icon}</span>
              <div className="db-box-info">
                <div className="db-box-label">{box.label}</div>
                <div className="db-box-value">{box.value ?? "—"}</div>
              </div>
              <span className="db-box-bg-icon">{box.accent}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default DashboardBoxes;
