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
  <div className="card my-6 rounded-xl bg-white shadow-lg border border-gray-100">

    {/* Header */}
    <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 py-5 border-b bg-gray-50 rounded-t-xl">
      <h2 className="text-[18px] font-semibold text-gray-800">
        Users & Sales Analytics
      </h2>

      {/* Toggle Buttons */}
      <div className="flex gap-3 mt-3 lg:mt-0">
        <button
          onClick={()=>getTotalUsersByYear("User")}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border 
                     hover:bg-blue-50 transition"
        >
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          Total Users
        </button>

        <button
          onClick={()=>getTotalUsersByYear("Seller")}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border 
                     hover:bg-blue-50 transition"
        >
          <span className="w-3 h-3 rounded-full bg-orange-600"></span>
          Total Seller
        </button>
        <button
          onClick={getTotalSalesByYear}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border 
                     hover:bg-green-50 transition"
        >
          <span className="w-3 h-3 rounded-full bg-green-600"></span>
          Total Sales
        </button>
      </div>
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 py-4">
      <div className="p-4 rounded-lg bg-blue-50">
        <p className="text-sm text-gray-500 capitalize">Total User</p>
        <h3 className="text-2xl font-bold text-blue-600">
          {type=="User"?(chartData?.reduce((a, b) => a + (b.TotalUsers || 0), 0)):0}
        </h3>
      </div>
      <div className="p-4 rounded-lg bg-blue-50">
        <p className="text-sm text-gray-500 capitalize">Total Seller</p>
        <h3 className="text-2xl font-bold text-orange-600">
          {type=="Seller"?(chartData?.reduce((a, b) => a + (b.TotalUsers || 0), 0)):0}
        </h3>
      </div>
      <div className="p-4 rounded-lg bg-green-50">
        <p className="text-sm text-gray-500">Total Sales</p>
        <h3 className="text-2xl font-bold text-green-600">
          ₹{chartData?.reduce((a, b) => a + (b.TotalSales || 0), 0)?.toLocaleString("en-IN")}
        </h3>
      </div>
    </div>

    {/* Chart */}
    <div className="px-6 pb-6 overflow-x-auto">
      {chartData?.length > 0 && (
        <BarChart
          width={context?.windowWidth > 1100 ? context.windowWidth - 400 : 900}
          height={420}
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            axisLine={false}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
          />

          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            contentStyle={{
              backgroundColor: "#111827",
              borderRadius: "8px",
              border: "none",
              color: "#fff"
            }}
            formatter={(value, name) =>
              name === "TotalSales"
                ? [`₹${value.toLocaleString("en-IN")}`, "Total Sales"]
                : [value, "Total Users"]
            }
          />

          <Legend />

          <Bar
            dataKey="TotalUsers"
            radius={[6, 6, 0, 0]}
            fill={type === "Seller" ? "#f59e0b" : "#2563eb"}
          />

          <Bar
            dataKey="TotalSales"
            radius={[6, 6, 0, 0]}
            fill="#16a34a"
          />
        </BarChart>
      )}
    </div>
  </div>
)}

    </>
  );
};

export default Dashboard;
