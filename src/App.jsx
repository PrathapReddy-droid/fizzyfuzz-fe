import "./App.css";
import "./responsive.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyAccount from "./Pages/VerifyAccount";
import ChangePassword from "./Pages/ChangePassword";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/Products/productDetails";
import PendingProducts from "./Pages/Products/PendingProducts";
import HomeSliderBanners from "./Pages/HomeSliderBanners";
import CategoryList from "./Pages/Categegory";
import SubCategoryList from "./Pages/Categegory/subCatList";
import Users from "./Pages/Users";
import Orders from "./Pages/Orders";
import Profile from "./Pages/Profile";
import AddRAMS from "./Pages/Products/addRAMS.JSX";
import AddWeight from "./Pages/Products/addWeight";
import AddSize from "./Pages/Products/addSize";
import BannerV1List from "./Pages/Banners/bannerV1List";
import { BannerList2 } from "./Pages/Banners/bannerList2";
import { BlogList } from "./Pages/Blog";
import ManageLogo from "./Pages/ManageLogo";
import { createContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "./utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./Components/AdminLayout/AdminLayout";
import TermsConditions from "./Pages/TermsConditions/TermsConditions";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import VideoPage from "./Pages/VideoPage";
import LiveComingSoon from "./Pages/LivePage";


const MyContext = createContext();
function App() {
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarWidth, setSidebarWidth] = useState(18);
  // const navigate = useNavigate()
  const [progress, setProgress] = useState(0);


  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    id: ""
  });


  useEffect(() => {
    localStorage.removeItem("userEmail")
    if (windowWidth < 992) {
      setisSidebarOpen(false);
      setSidebarWidth(100)
    } else {
      setSidebarWidth(18)
    }
  }, [])


  useEffect(() => {
    console.log(userData);
    
    if (userData?.role !== "ADMIN") {
      const handleContextmenu = e => {
        e.preventDefault()
      }
      document.addEventListener('contextmenu', handleContextmenu)
      return function cleanup() {
        document.removeEventListener('contextmenu', handleContextmenu)
      }
    }
  }, [userData])


  const alertBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg)
    }
    if (type === "error") {
      toast.error(msg)
    }
  }


  useEffect(() => {

    const token = localStorage.getItem('accessToken');

    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);

      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        setUserData(res.data);
        if (res?.response?.data?.message === "You have not login") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsLogin(false);
          alertBox("error", "Your session is closed please login again")

          //window.location.href = "/login"
        }
      })

    } else {
      setIsLogin(false);
    }

  }, [isLogin])


  useEffect(() => {
    getCat();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, [])


  const getCat = () => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res?.data)
    })
  }


  const values = {
    isSidebarOpen,
    setisSidebarOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
    alertBox,
    setUserData,
    userData,
    setAddress,
    address,
    catData,
    setCatData,
    getCat,
    windowWidth,
    setSidebarWidth,
    sidebarWidth,
    setProgress,
    progress
  };

  return (
    <>
    <MyContext.Provider value={values}>
      <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policies" element={<PrivacyPolicy />} />
        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/pending" element={<PendingProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/product/addRams" element={<AddRAMS />} />
          <Route path="/product/addWeight" element={<AddWeight />} />
          <Route path="/product/addSize" element={<AddSize />} />

          <Route path="/homeSlider/list" element={<HomeSliderBanners />} />
          <Route path="/category/list" element={<CategoryList />} />
          <Route path="/subCategory/list" element={<SubCategoryList />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/bannerV1/list" element={<BannerV1List />} />
          <Route path="/bannerlist2/list" element={<BannerList2 />} />
          <Route path="/blog/list" element={<BlogList />} />
          <Route path="/logo/manage" element={<ManageLogo />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/make-live" element={<LiveComingSoon />} />
        </Route>

      </Routes>
    </BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </MyContext.Provider>
    </>
  );
}

export default App;
export { MyContext };
