import React, { useContext, useState, useEffect } from 'react';
import { Button } from "@mui/material";
import { IoMdAdd } from "react-icons/io";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { deleteData, deleteMultipleData, editData, fetchDataFromApi, postData } from '../../utils/api';
import { FaCheckDouble } from "react-icons/fa6";

import CircularProgress from '@mui/material/CircularProgress';


const label = { inputProps: { "aria-label": "Checkbox demo" } };

const baseColumns = [
  { id: "user", label: "USER", minWidth: 80 },
  { id: "userPh", label: "USER PHONE NO", minWidth: 130 },
  { id: "verifyemail", label: "EMAIL VERIFY", minWidth: 130 },
  { id: "createdDate", label: "CREATED", minWidth: 130 },
  { id: "live", label: "LIVE OPTION", minWidth: 130 },
  { id: "action", label: "ACTION", minWidth: 130 },
];



export const Users = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [userData, setUserData] = useState([]);
    const [userTotalData, setUserTotalData] = useState([]);
    const [isLoading, setIsloading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [type, setType] = useState("USER");
    const [sortedIds, setSortedIds] = useState([]);

    const context = useContext(MyContext);

    const isSeller = type === "SELLER";
    const columns = React.useMemo(() => {
    if (type === "USER") {
        return baseColumns.filter(col => col.id !== "live");
    }
    return baseColumns; // SELLER
    }, [type]);
    const theme = {
        cardBg: isSeller ? "bg-orange-50" : "bg-blue-50",
        text: isSeller ? "text-orange-600" : "text-blue-600",
        bar: isSeller ? "#f97316" : "#2563eb"
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    useEffect(() => {
        getUsers(page, rowsPerPage, type);
    }, [type, page, rowsPerPage]);


    const getUsers = (page, limit,type) => {
        setIsloading(true);
        setPage(page);
        fetchDataFromApi(`/api/user/getAllUsers?page=${page + 1}&limit=${limit}&type=${type}`).then((res) => {
            setUserData(res)
            setUserTotalData(res)
            setIsloading(false)
        })
    }


    useEffect(() => {
        // Filter orders based on search query
        if (searchQuery !== "") {
            const filteredItems = userTotalData?.totalUsers?.filter((user) =>
                user._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.createdAt?.toLowerCase().includes(searchQuery.toLowerCase())

            );
            setUserData({
                error: false,
                success: true,
                users: filteredItems,
                total: filteredItems?.length,
                page: parseInt(page),
                totalPages: Math.ceil(filteredItems?.length / rowsPerPage),
                totalUsersCount: userData?.totalUsersCount
            })
        } else {
            getUsers(page, rowsPerPage,type);
        }

    }, [searchQuery])



    // Handler to toggle all checkboxes
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        // Update all items' checked status
        const updatedItems = userData?.users?.map((item) => ({
            ...item,
            checked: isChecked,
        }));

        setUserData({
            error: false,
            success: true,
            users: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalUsersCount: userData?.totalUsersCount
        })

        // Update the sorted IDs state
        if (isChecked) {
            const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b);
            setSortedIds(ids);
        } else {
            setSortedIds([]);
        }
    };


    // Handler to toggle individual checkboxes
    const handleCheckboxChange = (e, id, index) => {

        const updatedItems = userData?.users?.map((item) =>
            item._id === id ? { ...item, checked: !item.checked } : item
        );

        setUserData({
            error: false,
            success: true,
            users: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalUsersCount: userData?.totalUsersCount
        })


        // Update the sorted IDs state
        const selectedIds = updatedItems
            .filter((item) => item.checked)
            .map((item) => item._id)
            .sort((a, b) => a - b);
        setSortedIds(selectedIds);

    };

    const toggleUserLive = async (userId) => {
        try {
            postData(`/api/user/toggleUserLive`,{userId})
            .then((res) => {
                getUsers(page, rowsPerPage)
            }).catch(err=>{
                console.log(err);
            })

        } catch (err) {
            console.log(err);
        }
        };


    const deleteMultiple = () => {
        if (context?.userData?.role === "ADMIN") {
            if (sortedIds.length === 0) {
                context.alertBox('error', 'Please select items to delete.');
                return;
            }


            try {
                deleteMultipleData(`/api/user/deleteMultiple`, {
                    data: { ids: sortedIds },
                }).then((res) => {
                    getUsers(page, rowsPerPage);
                    context.alertBox("success", "User deleted");
                    setSortedIds([]);

                })

            } catch (error) {
                context.alertBox('error', 'Error deleting items.');
            }
        } else {
            context.alertBox("error", "Only admin can delete data");
        }


    }


    const deleteUser = (id) => {
        if (context?.userData?.role === "ADMIN") {
            deleteData(`/api/user/deleteUser/${id}`).then((res) => {
                getUsers(page, rowsPerPage);
            })
        } else {
            context.alertBox("error", "Only admin can delete data");
        }
    }

    return (
        <>

            <div className="card my-2 pt-5 shadow-md sm:rounded-lg bg-white">

                <div className="flex items-center w-full px-5 pb-4 justify-beetween">
                    <div className="col w-[40%]">
                        <h2 className="text-[18px] font-[600]">
                            Users List
                        </h2>
                    </div>




                    <div className="col w-[40%] ml-auto flex items-center gap-3">
                        {
                            sortedIds?.length !== 0 && <Button variant="contained" className="btn-sm" size="small" color="error"
                                onClick={deleteMultiple}>Delete</Button>
                        }
                        <SearchBox
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </div>

                </div>
                <div className=" w-full px-8 flex items-center gap-3 mb-3">
                    <Button
                        variant={type === "USER" ? "contained" : "outlined"}
                        color="primary"
                        size="small"
                        onClick={() => setType("USER")}
                    >
                        Users
                    </Button>

                    <Button
                        variant={type === "SELLER" ? "contained" : "outlined"}
                        color="warning"
                        size="small"
                        onClick={() => setType("SELLER")}
                    >
                        Sellers
                    </Button>
                    </div>

<TableContainer
  sx={{
    maxHeight: 520,
    borderRadius: 2,
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
  }}
>
  <Table stickyHeader aria-label="users table">
    {/* ---------- TABLE HEAD ---------- */}
    <TableHead>
      <TableRow>
        <TableCell sx={{ bgcolor: "#f8fafc" }}>
          <Checkbox
            size="small"
            onChange={handleSelectAll}
            checked={
              userData?.users?.length > 0 &&
              userData?.users?.every((item) => item.checked)
            }
          />
        </TableCell>

        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            sx={{
              bgcolor: "#f8fafc",
              fontWeight: 600,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.04em"
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    {/* ---------- TABLE BODY ---------- */}
    <TableBody>
      {!isLoading && userData?.users?.length > 0 ? (
        userData.users.map((user, index) => (
          <TableRow
            key={index}
            hover
            sx={{
              bgcolor: user.checked ? "#e3f2fd" : "white",
              transition: "all 0.2s"
            }}
          >
            {/* Checkbox */}
            <TableCell>
              <Checkbox
                size="small"
                checked={!!user.checked}
                onChange={(e) =>
                  handleCheckboxChange(e, user._id, index)
                }
              />
            </TableCell>

            {/* User Info */}
            <TableCell>
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || "/user.jpg"}
                  className="w-[44px] h-[44px] rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MdOutlineMarkEmailRead size={14} />
                    {user?.email?.slice(0, 6)}***
                  </p>
                </div>
              </div>
            </TableCell>

            {/* Mobile */}
            <TableCell>
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <MdLocalPhone />
                {user?.mobile || "N/A"}
              </span>
            </TableCell>

            {/* Email Verify */}
            <TableCell>
              {user?.verify_email ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                  <FaCheckDouble size={12} /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                  Not Verified
                </span>
              )}
            </TableCell>

            {/* Created Date */}
            <TableCell>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <SlCalender />
                {user?.createdAt?.split("T")[0]}
              </span>
            </TableCell>

            {/* Live Enable / Disable */}
            {type=="SELLER"&&<TableCell>
              <Button
                size="small"
                variant="contained"
                color={user?.isLiveEnabled ? "success" : "warning"}
                onClick={() =>
                  toggleUserLive(user._id)
                }
              >
                {user?.isLiveEnabled ? "Live" : "Disabled"}
              </Button>
            </TableCell>}

            {/* Actions */}
            <TableCell>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => deleteUser(user._id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))
      ) : isLoading ? (
        <TableRow>
          <TableCell colSpan={8}>
            <div className="flex justify-center items-center h-[300px]">
              <CircularProgress />
            </div>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell colSpan={8}>
            <div className="text-center py-20 text-gray-500">
              No users found
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

                <TablePagination
                    rowsPerPageOptions={[50, 100, 150, 200]}
                    component="div"
                    count={userData?.totalPages * rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div >


        </>
    )
}

export default Users;
