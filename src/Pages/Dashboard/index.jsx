import React, { useState, PureComponent, useContext, useEffect } from "react";
import DashboardBoxes from "../../Components/DashboardBoxes";
import { FaPlus } from "react-icons/fa6";
import { Button, Pagination } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import { FaAngleUp } from "react-icons/fa6";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { MyContext } from '../../App';
import SearchBox from "../../Components/SearchBox";
import { fetchDataFromApi, postData } from "../../utils/api";
import Products from "../Products";


const Dashboard = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);

  const [productCat, setProductCat] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [type, setType] = React.useState("USER");
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const [chartData, setChartData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const [productData, setProductData] = useState([]);
  const [productTotalData, setProductTotalData] = useState([]);

  const [ordersData, setOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageOrder, setPageOrder] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  const [totalOrdersData, setTotalOrdersData] = useState([]);

  const [users, setUsers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [ordersCount, setOrdersCount] = useState(null);

  const context = useContext(MyContext);


    useEffect(() => {
      context?.setProgress(30);
        getProducts(page, rowsPerPage);
    }, [])


  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };


  useEffect(() => {


    fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
      if (res?.error === false) {
        setOrdersData(res?.data)
      }
    })
    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      if (res?.error === false) {
        setTotalOrdersData(res)
      }
    })
    fetchDataFromApi(`/api/order/count`).then((res) => {
      if (res?.error === false) {
        setOrdersCount(res?.count)
      }
    })
  }, [pageOrder])


  useEffect(() => {

    // Filter orders based on search query
    if (orderSearchQuery !== "") {
      const filteredOrders = totalOrdersData?.data?.filter((order) =>
        order._id?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order?.userId?.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order?.userId?.email.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order?.createdAt.includes(orderSearchQuery)
      );
      setOrdersData(filteredOrders)
    } else {
      fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
        if (res?.error === false) {
          setOrders(res)
          setOrdersData(res?.data)
        }
      })
    }
  }, [orderSearchQuery])



  useEffect(() => {
    getTotalSalesByYear();

    fetchDataFromApi("/api/user/getAllUsers").then((res) => {
      if (res?.error === false) {
        setUsers(res?.users)
      }
    })

    fetchDataFromApi("/api/user/getAllReviews").then((res) => {
      if (res?.error === false) {
        setAllReviews(res?.reviews)
      }
    })

  }, [])



  const getProducts = async (page, limit) => {
         fetchDataFromApi(`/api/product/getAllProducts?page=${page + 1}&limit=${limit}`).then((res) => {
             setProductData(res)
             setProductTotalData(res)
             context?.setProgress(100);
         })
     }


  const getTotalUsersByYear = (type) => {
    setType(type)
    let value = type.toUpperCase()
    postData(`/api/order/users`,{type:value}).then((res) => {
      console.log("resresresresresres : ",res);
      
      const users = [];
      res?.TotalUsers?.length !== 0 &&
        res?.TotalUsers?.map((item) => {
          users.push({
            name: item?.name,
            TotalUsers: parseInt(item?.TotalUsers),
          });
        });

      const uniqueArr = users.filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.name === obj.name)
      );
      setChartData(uniqueArr);
    })
  }

  const getTotalSalesByYear = () => {
    fetchDataFromApi(`/api/order/sales`).then((res) => {
      const sales = [];
      res?.monthlySales?.length !== 0 &&
        res?.monthlySales?.map((item) => {
          sales.push({
            name: item?.name,
            TotalSales: parseInt(item?.TotalSales),
          });
        });

      const uniqueArr = sales.filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.name === obj.name)
      );
      setChartData(uniqueArr);
    });
  }



  return (
    <>
      <div className="w-full py-4 lg:py-1 px-5 border-2 bg-[radial-gradient(ellipse_at_top_left,_#4b1366_0%,_#2a0a3d_40%,_#120016_75%,_#0a0010_100%)] border-[rgba(255,255,255,0.1)] flex items-center gap-8 mb-5 justify-between rounded-xl">
        <div className="info text-white">
          <h1 className="text-[26px] lg:text-[35px] font-bold leading-8 lg:leading-10 mb-3">
            Welcome,
            <br />
            <span className="text-blue-400">{context?.userData?.name}</span>
          </h1>
          <p>
            Here’s What happening on your store today. See the statistics at
            once.
          </p>
          <br />
          {/* <Button className="btn-blue btn !capitalize" onClick={() => context.setIsOpenFullScreenPanel({
            open: true,
            model: "Add Product"
          })}>
            <FaPlus /> Add Product
          </Button> */}
        </div>

        <img src="/shop-illustration.webp" className="w-[250px] hidden lg:block" />
      </div>

      {
        productData?.products?.length !== 0 && users?.length !== 0 && allReviews?.length !== 0 && <DashboardBoxes orders={ordersCount} products={productData?.products?.length} users={users?.length} reviews={allReviews?.length} category={context?.catData?.length} />
      }

      <Products/>

<div className="card my-6 shadow-lg rounded-xl bg-white border border-gray-100">

  {/* Header */}
  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
    <h2 className="text-[18px] font-semibold text-gray-800">
      Recent Orders
    </h2>

    <div className="w-full lg:w-[300px] mt-3 lg:mt-0">
      <SearchBox
        searchQuery={orderSearchQuery}
        setSearchQuery={setOrderSearchQuery}
        setPageOrder={setPageOrder}
      />
    </div>
  </div>

  {/* Table */}
  <div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-600">
      <thead className="text-xs uppercase bg-gray-100 text-gray-700">
        <tr>
          <th className="px-4 py-3"></th>
          {[
            "Order ID", "Payment ID", "Name", "Phone",
            "Address", "Pincode", "Total",
            "Email", "User ID", "Status", "Date"
          ].map((h) => (
            <th key={h} className="px-4 py-3 whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {ordersData?.length > 0 && ordersData.map((order, index) => (
          <React.Fragment key={order?._id}>

            {/* Order Row */}
            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3">
                <Button
                  className="!w-[34px] !h-[34px] !min-w-[34px] !rounded-full !bg-gray-100 hover:!bg-gray-200"
                  onClick={() => isShowOrderdProduct(index)}
                >
                  {isOpenOrderdProduct === index
                    ? <FaAngleUp className="text-gray-700" />
                    : <FaAngleDown className="text-gray-700" />
                  }
                </Button>
              </td>

              <td className="px-4 py-3 font-medium text-primary">
                {order?._id}
              </td>

              <td className="px-4 py-3 text-[13px] whitespace-nowrap">
                {order?.paymentId || "CASH ON DELIVERY"}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {order?.userId?.name}
              </td>

              <td className="px-4 py-3">
                {order?.delivery_address?.mobile}
              </td>

              <td className="px-4 py-3">
                <span className="inline-block mb-1 text-xs px-2 py-[2px] bg-gray-100 rounded-md">
                  {order?.delivery_address?.addressType}
                </span>
                <p className="max-w-[420px] w-80 text-[13px] text-gray-600 leading-snug">
                  {`${order?.delivery_address?.address_line1}, 
                    ${order?.delivery_address?.city}, 
                    ${order?.delivery_address?.landmark}, 
                    ${order?.delivery_address?.state}, 
                    ${order?.delivery_address?.country}`}
                </p>
              </td>

              <td className="px-4 py-3">
                {order?.delivery_address?.pincode}
              </td>

              <td className="px-4 py-3 font-semibold">
                ₹{order?.totalAmt?.toLocaleString("en-IN")}
              </td>

              <td className="px-4 py-3">
                {order?.userId?.email}
              </td>

              <td className="px-4 py-3 text-primary">
                {order?.userId?._id}
              </td>

              <td className="px-4 py-3">
                <Badge status={order?.order_status} />
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {order?.createdAt?.split("T")[0]}
              </td>
            </tr>

            {/* Products Row */}
            {isOpenOrderdProduct === index && (
              <tr className="bg-gray-50">
                <td colSpan="12" className="px-10 py-4">
                  <div className="rounded-lg overflow-hidden border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200 text-xs uppercase">
                        <tr>
                          {["Product ID", "Title", "Image", "Qty", "Price", "Subtotal"].map(h => (
                            <th key={h} className="px-4 py-2">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {order?.products?.map((item, i) => (
                          <tr key={item?._id || i} className="border-b bg-white">
                            <td className="px-4 py-2 text-gray-600">
                              {item?._id}
                            </td>

                            <td className="px-4 py-2 font-medium">
                              {item?.productTitle}
                            </td>

                            <td className="px-4 py-2">
                              <img
                                src={item?.image}
                                alt={item?.productTitle}
                                className="w-10 h-10 rounded-md object-cover border"
                              />
                            </td>

                            <td className="px-4 py-2">
                              {item?.quantity ?? 0}
                            </td>

                            <td className="px-4 py-2">
                              ₹{(item?.price ?? 0).toLocaleString("en-IN")}
                            </td>

                            <td className="px-4 py-2 font-semibold">
                              ₹{((item?.price ?? 0) * (item?.quantity ?? 0)).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  {orders?.totalPages > 1 && (
    <div className="flex justify-center py-6">
      <Pagination
        showFirstButton
        showLastButton
        count={orders?.totalPages}
        page={pageOrder}
        onChange={(e, value) => setPageOrder(value)}
      />
    </div>
  )}
</div>


{context?.userData?.role === "ADMIN" && (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

      .ac-wrap {
        font-family: 'Outfit', sans-serif;
        --bg:           #12052e;
        --surface:      #1a0a3d;
        --surface-2:    #22104f;
        --surface-3:    #2e1a63;
        --line:         rgba(139, 92, 246, 0.18);
        --accent:       #7c3aed;
        --accent-2:     #9b59f5;
        --accent-glow:  rgba(124, 58, 237, 0.35);
        --accent-dim:   rgba(124, 58, 237, 0.15);
        --blue:         #3b82f6;
        --blue-dim:     rgba(59,130,246,0.15);
        --orange:       #f59e0b;
        --orange-dim:   rgba(245,158,11,0.15);
        --green:        #22c55e;
        --green-dim:    rgba(34,197,94,0.15);
        --text:         #ede9fe;
        --text-dim:     #a78bca;
        --muted:        #6b4f8a;
        background: var(--surface);
        border-radius: 20px;
        border: 1px solid var(--line);
        box-shadow: 0 8px 40px rgba(10, 2, 30, 0.6);
        overflow: hidden;
        margin: 24px 0;
      }

      /* ── HEADER ── */
      .ac-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 24px 32px;
        border-bottom: 1px solid var(--line);
        background: linear-gradient(135deg, rgba(124,58,237,0.12) 0%, transparent 55%);
      }

      .ac-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .ac-header-icon {
        width: 38px;
        height: 38px;
        border-radius: 11px;
        background: var(--accent-dim);
        border: 1px solid rgba(124,58,237,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .ac-title {
        font-size: 17px;
        font-weight: 700;
        color: var(--text);
        letter-spacing: -0.01em;
      }

      .ac-subtitle {
        font-size: 12px;
        color: var(--text-dim);
        font-weight: 300;
        margin-top: 1px;
      }

      /* ── TOGGLE BUTTONS ── */
      .ac-toggles {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .ac-toggle {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 7px 14px;
        font-family: 'Outfit', sans-serif;
        font-size: 12px;
        font-weight: 500;
        border-radius: 99px;
        border: 1px solid var(--line);
        background: var(--surface-2);
        color: var(--text-dim);
        cursor: pointer;
        transition: all 0.2s ease;
        letter-spacing: 0.01em;
      }

      .ac-toggle:hover {
        color: var(--text);
        border-color: rgba(124,58,237,0.4);
        background: var(--surface-3);
      }

      .ac-toggle.active-user {
        background: var(--blue-dim);
        border-color: rgba(59,130,246,0.4);
        color: #93c5fd;
        box-shadow: 0 0 10px rgba(59,130,246,0.2);
      }

      .ac-toggle.active-seller {
        background: var(--orange-dim);
        border-color: rgba(245,158,11,0.4);
        color: #fcd34d;
        box-shadow: 0 0 10px rgba(245,158,11,0.2);
      }

      .ac-toggle.active-sales {
        background: var(--green-dim);
        border-color: rgba(34,197,94,0.4);
        color: #86efac;
        box-shadow: 0 0 10px rgba(34,197,94,0.2);
      }

      .ac-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      /* ── SUMMARY CARDS ── */
      .ac-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
        border-bottom: 1px solid var(--line);
      }

      @media (max-width: 640px) {
        .ac-stats { grid-template-columns: 1fr; }
        .ac-stat + .ac-stat { border-top: 1px solid var(--line); border-left: none !important; }
      }

      .ac-stat {
        padding: 22px 28px;
        position: relative;
        overflow: hidden;
      }

      .ac-stat + .ac-stat {
        border-left: 1px solid var(--line);
      }

      .ac-stat-glow {
        position: absolute;
        top: -20px;
        right: -20px;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        opacity: 0.15;
        filter: blur(24px);
        pointer-events: none;
      }

      .ac-stat-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        color: var(--text-dim);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .ac-stat-label-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .ac-stat-value {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 1;
      }

      .ac-stat-sub {
        font-size: 11px;
        color: var(--muted);
        margin-top: 6px;
        font-weight: 300;
      }

      /* ── CHART AREA ── */
      .ac-chart-wrap {
        padding: 24px 28px 28px;
      }

      .ac-chart-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .ac-chart-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        color: var(--text-dim);
      }

      .ac-chart-legend {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .ac-legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: var(--text-dim);
      }

      .ac-legend-swatch {
        width: 24px;
        height: 4px;
        border-radius: 2px;
      }

      .ac-chart-scroll {
        overflow-x: auto;
      }

      .ac-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        gap: 12px;
      }

      .ac-empty-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        background: var(--surface-2);
        border: 1px solid rgba(124,58,237,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ac-empty-text {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-dim);
      }

      .ac-empty-sub {
        font-size: 12px;
        color: var(--muted);
        font-weight: 300;
      }
    `}</style>

    <div className="ac-wrap">

      {/* ── HEADER ── */}
      <div className="ac-header">
        <div className="ac-header-left">
          <div className="ac-header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9b59f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6"  y1="20" x2="6"  y2="14" />
            </svg>
          </div>
          <div>
            <div className="ac-title">Users & Sales Analytics</div>
            <div className="ac-subtitle">Year-over-year breakdown</div>
          </div>
        </div>

        <div className="ac-toggles">
          <button
            onClick={() => getTotalUsersByYear("User")}
            className={`ac-toggle ${type === "User" ? "active-user" : ""}`}
          >
            <span className="ac-dot" style={{ background: "#3b82f6" }} />
            Total Users
          </button>
          <button
            onClick={() => getTotalUsersByYear("Seller")}
            className={`ac-toggle ${type === "Seller" ? "active-seller" : ""}`}
          >
            <span className="ac-dot" style={{ background: "#f59e0b" }} />
            Total Sellers
          </button>
          <button
            onClick={getTotalSalesByYear}
            className={`ac-toggle ${type === "Sales" ? "active-sales" : ""}`}
          >
            <span className="ac-dot" style={{ background: "#22c55e" }} />
            Total Sales
          </button>
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="ac-stats">
        {/* Users */}
        <div className="ac-stat">
          <div className="ac-stat-glow" style={{ background: "#3b82f6" }} />
          <div className="ac-stat-label">
            <span className="ac-stat-label-dot" style={{ background: "#3b82f6" }} />
            Total Users
          </div>
          <div className="ac-stat-value" style={{ color: "#93c5fd" }}>
            {type === "User"
              ? (chartData?.reduce((a, b) => a + (b.TotalUsers || 0), 0) ?? 0).toLocaleString()
              : "—"}
          </div>
          <div className="ac-stat-sub">Registered accounts</div>
        </div>

        {/* Sellers */}
        <div className="ac-stat">
          <div className="ac-stat-glow" style={{ background: "#f59e0b" }} />
          <div className="ac-stat-label">
            <span className="ac-stat-label-dot" style={{ background: "#f59e0b" }} />
            Total Sellers
          </div>
          <div className="ac-stat-value" style={{ color: "#fcd34d" }}>
            {type === "Seller"
              ? (chartData?.reduce((a, b) => a + (b.TotalUsers || 0), 0) ?? 0).toLocaleString()
              : "—"}
          </div>
          <div className="ac-stat-sub">Active seller accounts</div>
        </div>

        {/* Sales */}
        <div className="ac-stat">
          <div className="ac-stat-glow" style={{ background: "#22c55e" }} />
          <div className="ac-stat-label">
            <span className="ac-stat-label-dot" style={{ background: "#22c55e" }} />
            Total Sales
          </div>
          <div className="ac-stat-value" style={{ color: "#86efac" }}>
            ₹{(chartData?.reduce((a, b) => a + (b.TotalSales || 0), 0) ?? 0).toLocaleString("en-IN")}
          </div>
          <div className="ac-stat-sub">Revenue this period</div>
        </div>
      </div>

      {/* ── CHART ── */}
      <div className="ac-chart-wrap">
        <div className="ac-chart-header">
          <span className="ac-chart-label">Monthly Breakdown</span>
          <div className="ac-chart-legend">
            {chartData?.some(d => d.TotalUsers) && (
              <div className="ac-legend-item">
                <div className="ac-legend-swatch" style={{ background: type === "Seller" ? "#f59e0b" : "#3b82f6" }} />
                {type === "Seller" ? "Sellers" : "Users"}
              </div>
            )}
            {chartData?.some(d => d.TotalSales) && (
              <div className="ac-legend-item">
                <div className="ac-legend-swatch" style={{ background: "#22c55e" }} />
                Sales
              </div>
            )}
          </div>
        </div>

        <div className="ac-chart-scroll">
          {chartData?.length > 0 ? (
            <BarChart
              width={context?.windowWidth > 1100 ? context.windowWidth - 400 : 900}
              height={380}
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="gradUser" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradSeller" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#b45309" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#15803d" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(139,92,246,0.12)"
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#a78bca", fontFamily: "Outfit" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "#a78bca", fontFamily: "Outfit" }}
                axisLine={false}
                tickLine={false}
                width={55}
              />

              <Tooltip
                cursor={{ fill: "rgba(124,58,237,0.08)", radius: 6 }}
                contentStyle={{
                  backgroundColor: "#1a0a3d",
                  borderRadius: "12px",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#ede9fe",
                  fontFamily: "Outfit",
                  fontSize: "13px",
                  boxShadow: "0 8px 32px rgba(10,2,30,0.6)",
                  padding: "10px 14px",
                }}
                labelStyle={{ color: "#a78bca", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}
                formatter={(value, name) =>
                  name === "TotalSales"
                    ? [`₹${value.toLocaleString("en-IN")}`, "Total Sales"]
                    : [value.toLocaleString(), type === "Seller" ? "Sellers" : "Users"]
                }
              />

              <Bar
                dataKey="TotalUsers"
                radius={[6, 6, 0, 0]}
                fill={type === "Seller" ? "url(#gradSeller)" : "url(#gradUser)"}
                maxBarSize={40}
              />

              <Bar
                dataKey="TotalSales"
                radius={[6, 6, 0, 0]}
                fill="url(#gradSales)"
                maxBarSize={40}
              />
            </BarChart>
          ) : (
            <div className="ac-empty">
              <div className="ac-empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6"  y1="20" x2="6"  y2="14" />
                </svg>
              </div>
              <div className="ac-empty-text">No data available</div>
              <div className="ac-empty-sub">Select a metric above to load chart data</div>
            </div>
          )}
        </div>
      </div>

    </div>
  </>
)}

    </>
  );
};

export default Dashboard;
