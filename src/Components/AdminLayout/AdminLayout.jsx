import Header from "../Header/index";
import Sidebar from "../Sidebar/index";
import { useContext } from "react";
import { MyContext } from "../../App";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { isSidebarOpen, windowWidth, sidebarWidth } = useContext(MyContext);

  return (
    <section className="main h-auto">
      <Header />
      <div className="contentMain flex">
        <div
          className={`overflow-hidden sidebarWrapper ${
            isSidebarOpen
              ? windowWidth < 992
                ? `w-[${sidebarWidth / 1.5}%]`
                : "w-[20%]"
              : "w-[0px] opacity-0 invisible"
          } transition-all `}
        >
          <Sidebar />
        </div>

        <div
          className={`contentRight overflow-hidden py-4 px-5 ${
            isSidebarOpen && windowWidth < 992 && "opacity-0"
          } transition-all 
`}
          style={{ width: isSidebarOpen ? "80%" : "100%" }}
        >
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default AdminLayout;
