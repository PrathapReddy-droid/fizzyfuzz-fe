import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Collapse } from "react-collapse";
import { IoVideocam } from "react-icons/io5";
import { IoRadio } from "react-icons/io5";
// Icons
import { RxDashboard } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { SiBloglovin } from "react-icons/si";
import { IoLogoBuffer } from "react-icons/io";
import { MdPolicy } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri";

import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import { ShoppingCart } from "lucide-react";

const Sidebar = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const { userData, windowWidth, isSidebarOpen } = context;
  const [openMenu, setOpenMenu] = useState(null);

  const closeSidebar = () => {
    if (windowWidth < 992) context.setisSidebarOpen(false);
    setOpenMenu(null);
  };

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const logout = async () => {
    closeSidebar();
    const res = await fetchDataFromApi(
      `/api/user/logout?token=${localStorage.getItem("refreshToken")}`,
      { withCredentials: true }
    );

    if (res?.error === false) {
      context.setIsLogin(false);
      localStorage.clear();
      navigate("/login");
    }
  };

  /* ---------------- UI Components ---------------- */

  const MenuButton = ({ icon, label, onClick }) => (
    <Button
      className="w-full !capitalize !justify-start flex gap-2 text-[14px]
      !text-[rgba(255,255,255)] hover:!text-black !font-[500] items-center !py-2
      hover:!bg-[#f1f1f1]"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );

  const SubItem = ({ to, label, onClick }) => (
    <li>
      {to ? (
        <Link to={to} onClick={closeSidebar}>
          <Button className="submenu-btn !text-blue-200">{label}</Button>
        </Link>
      ) : (
        <Button className="submenu-btn !text-blue-200" onClick={onClick}>
          {label}
        </Button>
      )}
    </li>
  );

  /* ---------------- JSX ---------------- */

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-[52] h-full bg-[radial-gradient(ellipse_at_top_left,_#4b1366_0%,_#2a0a3d_40%,_#120016_75%,_#0a0010_100%)] text-white border-r transition-all duration-300
        ${isSidebarOpen ? "w-[280px] px-4" : "w-0 px-0 overflow-hidden"}`}
      >
        {/* Logo */}
        <div className="py-3" onClick={closeSidebar}>
          <Link to="/">
            {/* <img
              src={localStorage.getItem("logo")}
              className="w-[170px]"
              alt="logo"
            /> */}
            <div className="flex flex-col items-center justify-center gap-1 select-none">
              {/* Logo Row */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl
                  shadow-sm">

                <ShoppingCart size={22} className="text-indigo-300" />

                <span className="font-extrabold text-[20px]
                     bg-gradient-to-r from-indigo-400 to-purple-400
                     bg-clip-text text-transparent tracking-wide">
                  Fizzy Fuzz
                </span>
              </div>

              {/* Tagline */}
              <p className="text-[12px] text-gray-500 tracking-widest -mt-3 uppercase">
                Next Level Shoppie
              </p>
            </div>
          </Link>
        </div>



        {/* Menu */}
        <ul className="mt-2 overflow-y-auto max-h-[calc(100vh-180px)] pb-6 text-white">

          {userData?.role === "ADMIN" && (
            <li>
              <Link to="/" onClick={closeSidebar}>
                <MenuButton icon={<RxDashboard />} label="Dashboard" />
              </Link>
            </li>
          )}

          {/* Home Slides */}
          {userData?.role === "ADMIN" && (
            <li>
              <MenuButton
                icon={<FaRegImage />}
                label="Home Slides"
                onClick={() => toggleMenu("slides")}
              />
              <Collapse isOpened={openMenu === "slides"}>
                <ul className="pl-6">
                  <SubItem to="/homeSlider/list" label="Home Banner List" />
                  <SubItem
                    label="Add Home Banner"
                    onClick={() =>
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Home Slide",
                      })
                    }
                  />
                </ul>
              </Collapse>
            </li>
          )}

          {/* Category */}
          {userData?.role === "ADMIN" && (
            <li>
              <MenuButton
                icon={<TbCategory />}
                label="Category"
                onClick={() => toggleMenu("category")}
              />
              <Collapse isOpened={openMenu === "category"}>
                <ul className="pl-6">
                  <SubItem to="/category/list" label="Category List" />
                  <SubItem
                    label="Add Category"
                    onClick={() =>
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add New Category",
                      })
                    }
                  />
                  <SubItem to="/subCategory/list" label="Sub Category List" />
                </ul>
              </Collapse>
            </li>
          )}

          

          {/* Products */}
          {(userData?.role === "ADMIN" || userData?.role === "SELLER") && (
            <li>
              <MenuButton
                icon={<RiProductHuntLine />}
                label="Products"
                onClick={() => toggleMenu("products")}
              />
              <Collapse isOpened={openMenu === "products"}>
                <ul className="pl-6">
                  <SubItem to="/products" label="Product List" />
                  {userData?.role === "ADMIN" && (
                    <>
                      <SubItem to="/products/pending" label="Pending Products" />
                      <SubItem
                        label="Add Product"
                        onClick={() =>
                          context.setIsOpenFullScreenPanel({
                            open: true,
                            model: "Add Product",
                          })
                        }
                      />
                    </>
                  )}
                </ul>
              </Collapse>
            </li>
          )}

          {/* Users */}
          {userData?.role === "ADMIN" && (
            <li>
              <Link to="/users" onClick={closeSidebar}>
                <MenuButton icon={<FiUsers />} label="Users" />
              </Link>
            </li>
          )}

          {/* Orders */}
          {(userData?.role === "ADMIN" || userData?.role === "SELLER") && (
            <li>
              <Link to="/orders" onClick={closeSidebar}>
                <MenuButton icon={<IoBagCheckOutline />} label="Orders" />
              </Link>
            </li>
          )}

          {/* Blogs */}
          {userData?.role === "SUPER-ADMIN" && (
            <li>
              <MenuButton
                icon={<SiBloglovin />}
                label="Blogs"
                onClick={() => toggleMenu("blogs")}
              />
              <Collapse isOpened={openMenu === "blogs"}>
                <ul className="pl-6">
                  <SubItem to="/blog/List" label="Blog List" />
                  <SubItem
                    label="Add Blog"
                    onClick={() =>
                      context.setIsOpenFullScreenPanel({
                        open: true,
                        model: "Add Blog",
                      })
                    }
                  />
                </ul>
              </Collapse>
            </li>
          )}

          {/* Logo */}
          {/* {userData?.role === "ADMIN" && (
            <li>
              <Link to="/logo/manage" onClick={closeSidebar}>
                <MenuButton icon={<IoLogoBuffer />} label="Manage Logo" />
              </Link>
            </li>
          )} */}
          { (
            <li>
              <Link to="/video" onClick={closeSidebar}>
                <MenuButton icon={<IoVideocam />} label="Upload Video" />
              </Link>
            </li>
          )}
        {userData?.role === "SELLER" && (
          <li>
            <Link to="/make-live" onClick={closeSidebar}>
              <MenuButton icon={<IoRadio />} label="Make Live" />
            </Link>
          </li>
        )}

          {/* Legal Section */}
          <li className="mt-4 mb-2 px-3 text-xs uppercase tracking-wide text-gray-400">
            Legal
          </li>

          <li>
            <a
              href="/terms-and-conditions"
              rel="noopener noreferrer"
            >
              <MenuButton icon={<MdPolicy />} label="Terms & Conditions" />
            </a>
          </li>

          <li>
            <a
              href="/privacy-policy"
              rel="noopener noreferrer"
            >
              <MenuButton icon={<RiShieldUserLine />} label="Privacy Policy" />
            </a>
          </li>
        </ul>
                {/* Logout (TOP) */}
        

        {/* Footer */}
<div className="absolute bottom-0 left-0 w-full border-t border-white/10 
bg-[radial-gradient(ellipse_at_top_left,_#4b1366_0%,_#2a0a3d_40%,_#120016_75%,_#0a0010_100%)] 
backdrop-blur-md px-5 py-4 text-center shadow-inner">

  {/* {(userData?.role === "ADMIN" || userData?.role === "SELLER") && (
    <div className="mb-4">
      <div className="flex justify-center">
        <MenuButton
          icon={<IoMdLogOut />}
          label="Logout"
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg 
          bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
        />
      </div>

      <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  )} */}

  {/* Customer Care Section */}
<div className="w-full border-b border-white/10  bg-[radial-gradient(ellipse_at_top_left,_#3a0f55_0%,_#1e082e_60%,_#0a0010_100%)] 
px-4 py-2 flex flex-col items-center justify-between text-xs text-gray-300">

  {/* Left Section */}
  <div className="flex flex-col items-center gap-2 mb-2">
    <span className="flex items-center gap-1 hover:text-white transition">
      📞 <span className="font-medium">+91 94227 99343</span>
    </span>

    <a
      href="mailto:care@fizzyfuzz.in"
      className="flex items-center gap-1 hover:text-white transition"
    >
      📧 care@fizzyfuzz.in
    </a>
  </div>

  {/* Right Section */}
  <div className="flex flex-col items-center gap-3">
    {(userData?.role === "ADMIN" || userData?.role === "SELLER") && (
      <button
        onClick={logout}
        className="flex items-center gap-1 px-3 py-1 rounded-md 
        bg-white/10 hover:bg-white/20 text-white transition"
      >
        <IoMdLogOut size={14} />
        Logout
      </button>
    )}

    <span className="text-gray-400 hidden sm:block">
      © 2026 SLVD TECH
    </span>
  </div>
</div>


  {/* Footer */}
  {/* <p className="text-xs text-gray-400 tracking-wide">
    © 2026 <span className="text-gray-300 font-medium">SLVD TECH</span>
  </p> */}
</div>

      </div>

      

      {/* Mobile Overlay */}
      {windowWidth < 920 && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[51]"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
