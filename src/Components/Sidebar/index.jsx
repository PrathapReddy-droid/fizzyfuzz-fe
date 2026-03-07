import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Collapse } from "react-collapse";
import { IoVideocam, IoRadio } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine, RiShieldUserLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { SiBloglovin } from "react-icons/si";
import { MdPolicy } from "react-icons/md";
import { ShoppingCart } from "lucide-react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

const Sidebar = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleNavClick = () => {
    setOpenMenu(null);
    closeSidebar();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        .sb * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        /* ── Sidebar shell ── */
        .sb-shell {
          position: fixed; top: 0; left: 0; z-index: 52;
          height: 100vh;
          background: radial-gradient(ellipse at top left, #2d1060 0%, #1a0840 40%, #0f0519 75%, #0a0010 100%);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column;
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease;
          overflow: hidden;
        }
        .sb-shell.open  { width: 260px; opacity: 1; }
        .sb-shell.closed { width: 0; opacity: 0; pointer-events: none; }

        /* ── Logo area ── */
        .sb-logo {
          padding: 18px 20px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
          text-decoration: none;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
        }
        .sb-logo-row {
          display: flex; align-items: center; gap: 9px;
        }
        .sb-logo-text {
          font-family: 'DM Serif Display', serif;
          font-size: 20px; font-weight: 400;
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; letter-spacing: -0.2px;
        }
        .sb-logo-tag {
          font-size: 10px; color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 2px; margin-top: 1px;
        }

        /* ── Scrollable nav area ── */
        .sb-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 12px 10px 16px;
        }
        .sb-nav::-webkit-scrollbar { width: 4px; }
        .sb-nav::-webkit-scrollbar-track { background: transparent; }
        .sb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

        /* ── Section label ── */
        .sb-section-label {
          font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25);
          text-transform: uppercase; letter-spacing: 1px;
          padding: 14px 12px 6px; user-select: none;
        }

        /* ── Nav item ── */
        .sb-item {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; width: 100%;
          padding: 9px 12px; border-radius: 10px; margin-bottom: 2px;
          cursor: pointer; border: none; background: transparent;
          color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 500;
          transition: all 0.15s ease; text-decoration: none; text-align: left;
        }
        .sb-item:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.9);
        }
        .sb-item.active {
          background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.18));
          color: #a78bfa;
          border: 1px solid rgba(139,92,246,0.2);
        }
        .sb-item-left { display: flex; align-items: center; gap: 10px; }
        .sb-item-icon { font-size: 16px; flex-shrink: 0; opacity: 0.8; }
        .sb-item.active .sb-item-icon { opacity: 1; }
        .sb-chevron { font-size: 18px; opacity: 0.5; transition: transform 0.2s; }
        .sb-chevron.open { transform: rotate(180deg); opacity: 0.8; }

        /* ── Submenu ── */
        .sb-submenu { padding: 4px 0 4px 16px; }
        .sb-subitem {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 7px 12px; border-radius: 8px; margin-bottom: 1px;
          cursor: pointer; border: none; background: transparent;
          color: rgba(255,255,255,0.4); font-size: 12.5px; font-weight: 500;
          transition: all 0.15s ease; text-decoration: none; text-align: left;
          position: relative;
        }
        .sb-subitem::before {
          content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 0; background: #818cf8; border-radius: 2px;
          transition: height 0.15s ease;
        }
        .sb-subitem:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.75); }
        .sb-subitem:hover::before { height: 14px; }
        .sb-subitem.active { color: #a78bfa; background: rgba(99,102,241,0.1); }
        .sb-subitem.active::before { height: 14px; background: #a78bfa; }

        /* ── Footer ── */
        .sb-footer {
          flex-shrink: 0;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(0,0,0,0.25);
          padding: 14px 16px;
        }
        .sb-contact-row {
          display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px;
        }
        .sb-contact-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 11.5px; color: rgba(255,255,255,0.35);
          text-decoration: none; transition: color 0.15s;
        }
        .sb-contact-item:hover { color: rgba(255,255,255,0.65); }
        .sb-contact-emoji { font-size: 12px; }

        .sb-footer-actions {
          display: flex; align-items: center; justify-content: space-between;
        }
        .sb-copyright {
          font-size: 11px; color: rgba(255,255,255,0.2); font-weight: 500;
        }
        .sb-logout-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
          color: rgba(239,68,68,0.7); border-radius: 8px;
          padding: 5px 12px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.15s ease; font-family: 'DM Sans', sans-serif;
        }
        .sb-logout-btn:hover {
          background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.4);
          color: #f87171;
        }

        /* ── Mobile overlay ── */
        .sb-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          z-index: 51; backdrop-filter: blur(2px);
        }
      `}</style>

      <div className={`sb sb-shell ${isSidebarOpen ? 'open' : 'closed'}`}>

        {/* ── Logo ── */}
        <Link to="/" className="sb-logo" onClick={closeSidebar}>
          <div className="sb-logo-row">
            <ShoppingCart size={20} color="#a78bfa" />
            <span className="sb-logo-text">Fizzy Fuzz</span>
          </div>
          <span className="sb-logo-tag">Next Level Shoppie</span>
        </Link>

        {/* ── Nav ── */}
        <nav className="sb-nav">

          {/* ── MAIN ── */}
          <div className="sb-section-label">Main</div>

          {userData?.role === "ADMIN" && (
            <Link to="/" className={`sb-item ${isActive('/') ? 'active' : ''}`} onClick={handleNavClick}>
              <div className="sb-item-left">
                <RxDashboard className="sb-item-icon" />
                <span>Dashboard</span>
              </div>
            </Link>
          )}

          {/* Home Slides */}
          {userData?.role === "ADMIN" && (
            <>
              <button className={`sb-item ${openMenu === 'slides' ? 'active' : ''}`} onClick={() => toggleMenu('slides')}>
                <div className="sb-item-left">
                  <FaRegImage className="sb-item-icon" />
                  <span>Home Slides</span>
                </div>
                <MdExpandMore className={`sb-chevron ${openMenu === 'slides' ? 'open' : ''}`} />
              </button>
              <Collapse isOpened={openMenu === 'slides'}>
                <div className="sb-submenu">
                  <Link to="/homeSlider/list" className={`sb-subitem ${isActive('/homeSlider/list') ? 'active' : ''}`} onClick={handleNavClick}>
                    Banner List
                  </Link>
                  <button className="sb-subitem" onClick={() => { context.setIsOpenFullScreenPanel({ open: true, model: 'Add Home Slide' }); handleNavClick(); }}>
                    Add Banner
                  </button>
                </div>
              </Collapse>
            </>
          )}

          {/* Category */}
          {userData?.role === "ADMIN" && (
            <>
              <button className={`sb-item ${openMenu === 'category' ? 'active' : ''}`} onClick={() => toggleMenu('category')}>
                <div className="sb-item-left">
                  <TbCategory className="sb-item-icon" />
                  <span>Category</span>
                </div>
                <MdExpandMore className={`sb-chevron ${openMenu === 'category' ? 'open' : ''}`} />
              </button>
              <Collapse isOpened={openMenu === 'category'}>
                <div className="sb-submenu">
                  <Link to="/category/list" className={`sb-subitem ${isActive('/category/list') ? 'active' : ''}`} onClick={handleNavClick}>Category List</Link>
                  <button className="sb-subitem" onClick={() => { context.setIsOpenFullScreenPanel({ open: true, model: 'Add New Category' }); handleNavClick(); }}>Add Category</button>
                  <Link to="/subCategory/list" className={`sb-subitem ${isActive('/subCategory/list') ? 'active' : ''}`} onClick={handleNavClick}>Sub Category List</Link>
                </div>
              </Collapse>
            </>
          )}

          {/* ── CATALOGUE ── */}
          <div className="sb-section-label">Catalogue</div>

          {/* Products */}
          {(userData?.role === "ADMIN" || userData?.role === "SELLER") && (
            <>
              <button className={`sb-item ${openMenu === 'products' ? 'active' : ''}`} onClick={() => toggleMenu('products')}>
                <div className="sb-item-left">
                  <RiProductHuntLine className="sb-item-icon" />
                  <span>Products</span>
                </div>
                <MdExpandMore className={`sb-chevron ${openMenu === 'products' ? 'open' : ''}`} />
              </button>
              <Collapse isOpened={openMenu === 'products'}>
                <div className="sb-submenu">
                  <Link to="/products" className={`sb-subitem ${isActive('/products') ? 'active' : ''}`} onClick={handleNavClick}>Product List</Link>
                  {userData?.role === "ADMIN" && (
                    <>
                      <Link to="/products/pending" className={`sb-subitem ${isActive('/products/pending') ? 'active' : ''}`} onClick={handleNavClick}>Pending Products</Link>
                      <button className="sb-subitem" onClick={() => { context.setIsOpenFullScreenPanel({ open: true, model: 'Add Product' }); handleNavClick(); }}>Add Product</button>
                    </>
                  )}
                </div>
              </Collapse>
            </>
          )}

          {/* Users */}
          {userData?.role === "ADMIN" && (
            <Link to="/users" className={`sb-item ${isActive('/users') ? 'active' : ''}`} onClick={handleNavClick}>
              <div className="sb-item-left">
                <FiUsers className="sb-item-icon" />
                <span>Users</span>
              </div>
            </Link>
          )}

          {/* Orders */}
          {(userData?.role === "ADMIN" || userData?.role === "SELLER") && (
            <Link to="/orders" className={`sb-item ${isActive('/orders') ? 'active' : ''}`} onClick={handleNavClick}>
              <div className="sb-item-left">
                <IoBagCheckOutline className="sb-item-icon" />
                <span>Orders</span>
              </div>
            </Link>
          )}

          {/* Blogs */}
          {userData?.role === "SUPER-ADMIN" && (
            <>
              <button className={`sb-item ${openMenu === 'blogs' ? 'active' : ''}`} onClick={() => toggleMenu('blogs')}>
                <div className="sb-item-left">
                  <SiBloglovin className="sb-item-icon" />
                  <span>Blogs</span>
                </div>
                <MdExpandMore className={`sb-chevron ${openMenu === 'blogs' ? 'open' : ''}`} />
              </button>
              <Collapse isOpened={openMenu === 'blogs'}>
                <div className="sb-submenu">
                  <Link to="/blog/List" className={`sb-subitem ${isActive('/blog/List') ? 'active' : ''}`} onClick={handleNavClick}>Blog List</Link>
                  <button className="sb-subitem" onClick={() => { context.setIsOpenFullScreenPanel({ open: true, model: 'Add Blog' }); handleNavClick(); }}>Add Blog</button>
                </div>
              </Collapse>
            </>
          )}

          {/* ── MEDIA ── */}
          <div className="sb-section-label">Media</div>

          <Link to="/video" className={`sb-item ${isActive('/video') ? 'active' : ''}`} onClick={handleNavClick}>
            <div className="sb-item-left">
              <IoVideocam className="sb-item-icon" />
              <span>Upload Video</span>
            </div>
          </Link>

          {userData?.role === "SELLER" && (
            <Link to="/make-live" className={`sb-item ${isActive('/make-live') ? 'active' : ''}`} onClick={handleNavClick}>
              <div className="sb-item-left">
                <IoRadio className="sb-item-icon" />
                <span>Make Live</span>
              </div>
            </Link>
          )}

          {/* ── LEGAL ── */}
          <div className="sb-section-label">Legal</div>

          <a href="/terms-and-conditions" className="sb-item">
            <div className="sb-item-left">
              <MdPolicy className="sb-item-icon" />
              <span>Terms & Conditions</span>
            </div>
          </a>

          <a href="/privacy-policy" className="sb-item">
            <div className="sb-item-left">
              <RiShieldUserLine className="sb-item-icon" />
              <span>Privacy Policy</span>
            </div>
          </a>

        </nav>

        {/* ── Footer ── */}
        <div className="sb-footer">
          <div className="sb-contact-row">
            <span className="sb-contact-item">
              <span className="sb-contact-emoji">📞</span>
              +91 94227 99343
            </span>
            <a href="mailto:care@fizzyfuzz.in" className="sb-contact-item">
              <span className="sb-contact-emoji">📧</span>
              care@fizzyfuzz.in
            </a>
          </div>
          <div className="sb-footer-actions">
            <span className="sb-copyright">© 2026 SLVD TECH</span>
            {(userData?.role === "ADMIN" || userData?.role === "SELLER") && (
              <button className="sb-logout-btn" onClick={logout}>
                <IoMdLogOut size={13} />
                Logout
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Mobile overlay */}
      {windowWidth < 992 && isSidebarOpen && (
        <div className="sb-overlay" onClick={handleNavClick} />
      )}
    </>
  );
};

export default Sidebar;
