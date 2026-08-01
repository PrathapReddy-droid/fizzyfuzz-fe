import React, { useState, useEffect } from 'react';
import { Button } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import SearchBox from '../../Components/SearchBox';
import { FaAngleUp } from "react-icons/fa6";
import { HiOutlineTrash, HiOutlineShoppingBag } from "react-icons/hi2";
import { deleteData, editData, fetchDataFromApi } from '../../utils/api';
import Pagination from "@mui/material/Pagination";

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useContext } from 'react';

import { MyContext } from "../../App.jsx";

const statusStyles = {
  pending: "bg-amber-50 text-amber-600 ring-amber-200",
  confirm: "bg-blue-50 text-blue-600 ring-blue-200",
  delivered: "bg-emerald-50 text-emerald-600 ring-emerald-200",
};

const selectSx = (status) => ({
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  fontSize: "12.5px",
  fontWeight: 600,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor:
      status === "delivered" ? "#A7E4C6" : status === "confirm" ? "#B9CCF7" : "#F3D9A6",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#C7CCE8" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#6C63FF",
    borderWidth: "1.5px",
  },
});

export const Orders = () => {

  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');

  const [ordersData, setOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageOrder, setPageOrder] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalOrdersData, setTotalOrdersData] = useState([]);

  const context = useContext(MyContext);


  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };


  const handleChange = (event, id) => {
    setOrderStatus(event.target.value);

    const obj = {
      id: id,
      order_status: event.target.value
    }

    editData(`/api/order/order-status/${id}`, obj).then((res) => {
      if (res?.data?.error === false) {
        context.alertBox("success", res?.data?.message);
      }
    })

  };


  useEffect(() => {
    context?.setProgress(50);
    fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
      if (res?.error === false) {
        setOrdersData(res?.data)
        context?.setProgress(100);
      }
    })
    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      if (res?.error === false) {
        setTotalOrdersData(res)
      }
    })
  }, [orderStatus, pageOrder])


  useEffect(() => {

    // Filter orders based on search query
    if (searchQuery !== "") {
      const filteredOrders = totalOrdersData?.data?.filter((order) =>
        order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order?.createdAt.includes(searchQuery)
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

  }, [searchQuery])


  const deleteOrder = (id) => {
    if (context?.userData?.role === "ADMIN") {
      deleteData(`/api/order/deleteOrder/${id}`).then((res) => {
        fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
          if (res?.error === false) {
            setOrdersData(res?.data)
            context?.setProgress(100);
            context.alertBox("success", "Order Delete successfully!");
          }
        })

        fetchDataFromApi(`/api/order/order-list`).then((res) => {
          if (res?.error === false) {
            setTotalOrdersData(res)
          }
        })

      })
    } else {
      context.alertBox("error", "Only admin can delete data");
    }
  }


  return (
    <div
      className="card my-2 md:mt-4 rounded-2xl bg-white border border-[#ECECF5]"
      style={{ boxShadow: "0 1px 2px rgba(30,27,58,0.04), 0 16px 40px -20px rgba(30,27,58,0.14)" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 px-6 py-5 flex-col sm:flex-row items-center">
        <div>
          <h2 className="text-[20px] font-[700] text-[#1E1B3A] tracking-tight text-left mb-1">Recent Orders</h2>
          <p className="text-[13px] text-[#8A8AA3]">{ordersData?.length ?? 0} orders on this page</p>
        </div>
        <div className="ml-auto w-full mt-3 lg:mt-0">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPageOrder={setPageOrder}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto px-2 pb-2">
        <table className="w-full text-sm text-left rtl:text-right text-[#4B4B63] border-separate border-spacing-0">
          <thead className="text-[11.5px] font-[700] tracking-wide text-[#6B6B85] uppercase bg-[#F7F7FC]">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-xl">
                &nbsp;
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Paymant Id
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Name
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Address
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Pincode
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Total Amount
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Email
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                User Id
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Order Status
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Date
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap rounded-r-xl">
                Action
              </th>
            </tr>
          </thead>
          <tbody>

            {
              ordersData?.length !== 0 && ordersData?.map((order, index) => {
                const status = order?.order_status ?? orderStatus ?? "pending";
                const expanded = isOpenOrderdProduct === index;
                return (
                  <React.Fragment key={order?._id || index}>
                    <tr className={`transition-colors duration-150 hover:bg-[#F7F7FC] ${expanded ? "bg-[#FAFAFE]" : "bg-white"}`}>
                      <td className="px-6 py-4 font-[500] border-b border-[#F1F1F7]">
                        <Button
                          onClick={() => isShowOrderdProduct(index)}
                          sx={{
                            width: 34,
                            height: 34,
                            minWidth: 34,
                            borderRadius: "10px",
                            backgroundColor: expanded ? "#EFEFFB" : "#F7F7FC",
                            border: "1px solid #ECECF5",
                            "&:hover": { backgroundColor: "#EFEFFB" },
                          }}
                        >
                          {
                            expanded ? <FaAngleUp className="text-[14px] text-[#4B4B63]" /> : <FaAngleDown className="text-[14px] text-[#4B4B63]" />
                          }

                        </Button>
                      </td>
                      <td className="px-6 py-4 font-[500] border-b border-[#F1F1F7]">
                        <span className="text-[#6C63FF] text-[12.5px] font-[600]">
                          {order?._id}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-[500] border-b border-[#F1F1F7]">
                        <span className="text-[#6C63FF] whitespace-nowrap text-[12.5px] font-[600]">{order?.paymentId ? order?.paymentId : 'CASH ON DELIVERY'}</span>
                      </td>

                      <td className="px-6 py-4 font-[600] whitespace-nowrap border-b border-[#F1F1F7] text-[#1E1B3A]">
                        {order?.userId?.name}
                      </td>

                      <td className="px-6 py-4 font-[500] border-b border-[#F1F1F7]">{order?.delivery_address?.mobile}</td>

                      <td className="px-6 py-4 font-[500] border-b border-[#F1F1F7]">
                        <span className='inline-block text-[11px] font-[700] uppercase tracking-wide px-2 py-1 bg-[#F1F1F9] text-[#6B6B85] rounded-full mb-1'>{order?.delivery_address?.addressType}</span>
                        <span className="block w-[400px] text-[13px] text-[#4B4B63]">
                          {order?.delivery_address?.
                            address_line1 + " " +
                            order?.delivery_address?.city + " " +
                            order?.delivery_address?.landmark + " " +
                            order?.delivery_address?.state + " " +
                            order?.delivery_address?.country
                          }
                        </span>
                      </td>

                      <td className="px-6 py-4 font-[500] border-b border-[#F1F1F7]">{order?.delivery_address?.pincode}</td>

                      <td className="px-6 py-4 font-[700] text-[#1E1B3A] border-b border-[#F1F1F7]">{(order?.totalAmt ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>

                      <td className="px-6 py-4 font-[500] border-b border-[#F1F1F7]">
                        {order?.userId?.email?.substr(0, 5) + '***'}
                      </td>

                      <td className="px-6 py-4 font-[500] border-b border-[#F1F1F7]">
                        <span className="text-[#6C63FF] text-[12.5px] font-[600]">
                          {order?.userId?._id}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-[500] border-b border-[#F1F1F7]">
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={order?.order_status !== null ? order?.order_status : orderStatus}
                          label="Status"
                          size="small"
                          className="w-full"
                          sx={selectSx(status)}
                          onChange={(e) => handleChange(e, order?._id)}
                        >
                          <MenuItem value={'pending'}>Pending</MenuItem>
                          <MenuItem value={'confirm'}>Confirm</MenuItem>
                          <MenuItem value={'delivered'}>Delivered</MenuItem>
                        </Select>
                      </td>
                      <td className="px-6 py-4 font-[500] whitespace-nowrap border-b border-[#F1F1F7] text-[13px] text-[#8A8AA3]">
                        {order?.createdAt?.split("T")[0]}
                      </td>
                      <td className="px-6 py-4 font-[500] whitespace-nowrap border-b border-[#F1F1F7]">
                        <Button
                          onClick={() => deleteOrder(order?._id)}
                          size="small"
                          startIcon={<HiOutlineTrash />}
                          sx={{
                            textTransform: "none",
                            borderRadius: "999px",
                            fontWeight: 600,
                            fontSize: "12px",
                            color: "#E1493F",
                            border: "1px solid #F5D3D0",
                            backgroundColor: "#FEF6F5",
                            "&:hover": { backgroundColor: "#FCE9E7", borderColor: "#E1493F" },
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>

                    {expanded && (
                      <tr>
                        <td className="pl-20 pr-6 pb-5 pt-1 bg-[#FAFAFE]" colSpan="13">
                          <div className="relative overflow-x-auto rounded-xl border border-[#ECECF5] bg-white">
                            <table className="w-full text-sm text-left rtl:text-right text-[#4B4B63]">
                              <thead className="text-[11px] font-[700] tracking-wide text-[#6B6B85] uppercase bg-[#F7F7FC]">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Product Id
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Product Title
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Image
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Quantity
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Price
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 whitespace-nowrap"
                                  >
                                    Sub Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  order?.products?.map((item, index) => (
                                    <tr key={item?._id || index} className="bg-white border-b border-[#F1F1F7] w-full last:border-b-0 hover:bg-[#F7F7FC] transition-colors duration-150">
                                      <td className="px-6 py-4 font-[500] text-[#8A8AA3] text-[12.5px]">
                                        {item?._id}
                                      </td>
                                      <td className="px-6 py-4 font-[600] w-[200px] text-[#1E1B3A]">
                                        {item?.productTitle}
                                      </td>
                                      <td className="px-6 py-4 font-[500]">
                                        <img
                                          src={item?.image}
                                          alt={item?.productTitle || "Product image"}
                                          className="w-[40px] h-[40px] object-cover rounded-lg ring-1 ring-[#ECECF5]"
                                        />
                                      </td>
                                      <td className="px-6 py-4 font-[500] whitespace-nowrap">
                                        {item?.quantity ?? 0}
                                      </td>
                                      <td className="px-6 py-4 font-[500]">
                                        {(item?.price ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
                                      </td>
                                      <td className="px-6 py-4 font-[700] text-[#1E1B3A]">
                                        {((item?.price ?? 0) * (item?.quantity ?? 0)).toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
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
                )
              })

            }

            {
              ordersData?.length === 0 &&
              <tr>
                <td colSpan={13} className="border-none">
                  <div className="flex flex-col items-center justify-center gap-2 w-full min-h-[240px]">
                    <div className="w-12 h-12 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
                      <HiOutlineShoppingBag className="text-[22px] text-[#6C63FF]" />
                    </div>
                    <p className="text-[14px] font-[600] text-[#1E1B3A]">No orders found</p>
                    <p className="text-[12.5px] text-[#8A8AA3]">Orders will show up here as customers check out.</p>
                  </div>
                </td>
              </tr>
            }






          </tbody>
        </table>
      </div>


      {
        orders?.totalPages > 1 &&
        <div className="flex items-center justify-center mt-6 pb-6">
          <Pagination
            showFirstButton showLastButton
            count={orders?.totalPages}
            page={pageOrder}
            onChange={(e, value) => setPageOrder(value)}
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 600,
              },
              "& .Mui-selected": {
                backgroundColor: "#6C63FF !important",
                color: "#fff",
              },
            }}
          />
        </div>
      }
    </div>
  )
}


export default Orders;