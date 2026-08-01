import React, { useContext, useEffect, useState } from 'react';
import { Button, useTheme } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import Rating from '@mui/material/Rating';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Progress from "../../Components/ProgressBar";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import { HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import { HiOutlineClock, HiOutlineCheckCircle } from "react-icons/hi2";
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData, deleteMultipleData, postData } from '../../utils/api';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from '@mui/material/CircularProgress';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast } from 'react-toastify';


const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
    { id: "product", label: "PRODUCT", minWidth: 100 },
    { id: "approval", label: "APPROVAL", minWidth: 100 },
    { id: "category", label: "CATEGORY", minWidth: 100 },
    {
        id: "subcategory",
        label: "SUB CATEGORY",
        minWidth: 150,
    },
    {
        id: "price",
        label: "PRICE",
        minWidth: 130,
    },
    {
        id: "rating",
        label: "RATING",
        minWidth: 100,
    },
    {
        id: "action",
        label: "ACTION",
        minWidth: 120,
    },
];

// Shared MUI overrides so the Select controls match the rest of the
// refreshed palette instead of MUI's stock outline styling.
const selectSx = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E4E7F2",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#C7CCE8",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#6C63FF",
        borderWidth: "1.5px",
    },
};




export const PendingProducts = () => {
    const [productCat, setProductCat] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const [productData, setProductData] = useState([]);
    const [productTotalData, setProductTotalData] = useState([]);

    const [productSubCat, setProductSubCat] = React.useState('');
    const [productThirdLavelCat, setProductThirdLavelCat] = useState('');
    const [sortedIds, setSortedIds] = useState([]);
    const [isLoading, setIsloading] = useState(false);

    const [pageOrder, setPageOrder] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const [photos, setPhotos] = useState([]);
    const [open, setOpen] = useState(false);

    const context = useContext(MyContext);

    useEffect(() => {
        getProducts(page, rowsPerPage);
    }, [context?.isOpenFullScreenPanel, page, rowsPerPage])


    const handleAction = async (status,product) => {
            console.log(product);
            
        const requestBody = {
            requestId: product._id,      // change as per your data
            status: status,          // APPROVED | REJECTED
        };

        try {
            postData(`/api/product/productApproval`,requestBody).then((res) => {
                getProducts(page, rowsPerPage)
            

            })
        } catch (error) {
            console.error('Error:', error.message);
        }
        };

    useEffect(() => {
        // Filter orders based on search query
        if (searchQuery !== "") {
            const filteredOrders = productTotalData?.totalProducts?.filter((product) =>
                product._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.catName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product?.subCat?.includes(searchQuery)
            );
            setProductData({
                error: false,
                success: true,
                products: filteredOrders,
                total: filteredOrders?.length,
                page: parseInt(page),
                totalPages: Math.ceil(filteredOrders?.length / rowsPerPage),
                totalCount: productData?.totalCount
            });

        } else {
            getProducts(page, rowsPerPage);
        }

    }, [searchQuery])


    // Handler to toggle all checkboxes
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        // Update all items' checked status
        const updatedItems = productData?.products?.map((item) => ({
            ...item,
            checked: isChecked,
        }));
        setProductData({
            error: false,
            success: true,
            products: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalCount: productData?.totalCount
        });

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

        const updatedItems = productData?.products?.map((item) =>
            item._id === id ? { ...item, checked: !item.checked } : item
        );
        setProductData({
            error: false,
            success: true,
            products: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalCount: productData?.totalCount
        });



        // Update the sorted IDs state
        const selectedIds = updatedItems
            .filter((item) => item.checked)
            .map((item) => item._id)
            .sort((a, b) => a - b);
        setSortedIds(selectedIds);
    };


    const getProducts = async (page, limit) => {
        
        setIsloading(true)
        fetchDataFromApi(`/api/product/getAllPendingProducts/${null}`).then((res) => {
            setProductData(res)

            setProductTotalData(res)
            setIsloading(false)

            let arr = [];

            for (let i = 0; i < res?.products?.length; i++) {
                arr.push({
                    src: res?.products[i]?.images[0]
                })
            }

            setPhotos(arr);

        })
    }

    const handleChangeProductCat = (event) => {
        if (event.target.value !== null) {
            setProductCat(event.target.value);
            setProductSubCat('');
            setProductThirdLavelCat('');
            setIsloading(true)
            fetchDataFromApi(`/api/product/getAllPendingProducts/${event.target.value}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });

                    setTimeout(() => {
                        setIsloading(false)
                    }, 300);
                }
            })
        } else {
            getProducts(0, 50);
            setProductSubCat('');
            setProductCat(event.target.value);
            setProductThirdLavelCat('');
        }

    };


    const handleChangeProductSubCat = (event) => {
        if (event.target.value !== null) {
            setProductSubCat(event.target.value);
            setProductCat('');
            setProductThirdLavelCat('');
            setIsloading(true)
            fetchDataFromApi(`/api/product/getPenindgProductsBySubCatId/${event.target.value}`).then((res) => {
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false)
                    }, 500);
                }
            })
        } else {
            setProductSubCat(event.target.value);
            getProducts(0, 50);
            setProductCat('');
            setProductThirdLavelCat('');
        }
    };

    const handleChangeProductThirdLavelCat = (event) => {
        if (event.target.value !== null) {
            setProductThirdLavelCat(event.target.value);
            setProductCat('');
            setProductSubCat('');
            setIsloading(true)
            fetchDataFromApi(`/api/product/getAllProductsByThirdLavelCat/${event.target.value}`).then((res) => {
                console.log(res)
                if (res?.error === false) {
                    setProductData({
                        error: false,
                        success: true,
                        products: res?.products,
                        total: res?.products?.length,
                        page: parseInt(page),
                        totalPages: Math.ceil(res?.products?.length / rowsPerPage),
                        totalCount: res?.products?.length
                    });
                    setTimeout(() => {
                        setIsloading(false)
                    }, 300);
                }
            })
        } else {
            setProductThirdLavelCat(event.target.value);
            getProducts(0, 50);
            setProductCat('');
            setProductSubCat('');
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const deleteProduct = (id) => {
        if (context?.userData?.role === "ADMIN") {
            deleteData(`/api/product/${id}`).then((res) => {
                getProducts();
                context.alertBox("success", "Product deleted");

            })
        } else {
            context.alertBox("error", "Only admin can delete data");
        }
    }


    const deleteMultipleProduct = () => {

        if (sortedIds.length === 0) {
            context.alertBox('error', 'Please select items to delete.');
            return;
        }


        try {
            deleteMultipleData(`/api/product/deleteMultiple`, {
                data: { ids: sortedIds },
            }).then((res) => {
                getProducts();
                context.alertBox("success", "Product deleted");
                setSortedIds([]);

            })

        } catch (error) {
            context.alertBox('error', 'Error deleting items.');
        }


    }



    const handleChangePage = (event, newPage) => {
        getProducts(page, rowsPerPage);
        setPage(newPage);
    };

    return (
        <>
            {/* Soft ambient backdrop: two low-opacity radial blooms over a
               near-white base so the panel feels calm rather than stark
               white, without competing with the data in the table. */}
            <div
                className="min-h-screen -m-6 p-6"
                style={{
                    
                }}
            >

            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <div>
                    <h2 className="text-[20px] font-[700] text-white tracking-tight flex items-center gap-3">
                        Pending Products
                        <span className="text-[12px] font-[600] text-[#6C63FF] bg-[#6C63FF]/10 px-2.5 py-1 rounded-full">
                            {productData?.products?.length ?? 0} awaiting review
                        </span>
                    </h2>
                    <p className="text-[13px] text-[#8A8AA3] mt-1">
                        Review new listings before they go live in the storefront.
                    </p>
                </div>

                {/* <div className="col w-[75%] ml-auto flex items-center justify-end gap-3">
                    {
                        sortedIds?.length !== 0 && <Button variant="contained" className="btn-sm" size="small" color="error"
                            onClick={deleteMultipleProduct}>Delete</Button>
                    }


                    <Button className="btn-blue !text-white btn-sm"
                        onClick={() => context.setIsOpenFullScreenPanel({
                            open: true,
                            model: 'Add Product'
                        })}>Add Product</Button>
                </div> */}


            </div>


            <div
                className="my-5 pt-6 rounded-2xl bg-white backdrop-blur-sm border border-[#ECECF5]"
                style={{ boxShadow: "0 1px 2px rgba(30,27,58,0.04), 0 12px 32px -16px rgba(30,27,58,0.12)" }}
            >

                <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-4 w-full px-6 justify-beetween gap-4">
                    <div className="col">
                        <h4 className="font-[600] text-[12px] uppercase tracking-wide text-[#8A8AA3] mb-2">Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Select
                                labelId="demo-simple-select-label"
                                id="productCatDrop"
                                size="small"
                                className='w-full'
                                sx={selectSx}
                                value={productCat}
                                label="Category"
                                onChange={handleChangeProductCat}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {
                                    context?.catData?.map((cat, index) => {
                                        return (
                                            <MenuItem value={cat?._id}>{cat?.name}</MenuItem>
                                        )
                                    })
                                }

                            </Select>
                        }
                    </div>


                    <div className="col">
                        <h4 className="font-[600] text-[12px] uppercase tracking-wide text-[#8A8AA3] mb-2">Sub Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Select
                                labelId="demo-simple-select-label"
                                id="productCatDrop"
                                size="small"
                                className='w-full'
                                sx={selectSx}
                                value={productSubCat}
                                label="Sub Category"
                                onChange={handleChangeProductSubCat}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {
                                    context?.catData?.map((cat, index) => {
                                        return (
                                            cat?.children?.length !== 0 && cat?.children?.map((subCat, index_) => {
                                                return (
                                                    <MenuItem value={subCat?._id}>
                                                        {subCat?.name}</MenuItem>
                                                )
                                            })

                                        )
                                    })
                                }

                            </Select>
                        }
                    </div>


                    <div className="col">
                        <h4 className="font-[600] text-[12px] uppercase tracking-wide text-[#8A8AA3] mb-2">Third Level Sub Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Select
                                labelId="demo-simple-select-label"
                                id="productCatDrop"
                                size="small"
                                className='w-full'
                                sx={selectSx}
                                value={productThirdLavelCat}
                                label="Sub Category"
                                onChange={handleChangeProductThirdLavelCat}
                            >
                                <MenuItem value={null}>None</MenuItem>
                                {
                                    context?.catData?.map((cat) => {
                                        return (
                                            cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                                                return (
                                                    subCat?.children?.length !== 0 && subCat?.children?.map((thirdLavelCat, index) => {
                                                        return <MenuItem value={thirdLavelCat?._id} key={index}
                                                        >{thirdLavelCat?.name}</MenuItem>
                                                    })

                                                )
                                            })

                                        )
                                    })
                                }

                            </Select>
                        }

                    </div>


                    <div className="col w-full ml-auto flex items-center">
                        <div style={{ alignSelf: 'end' }} className="w-full">
                            <SearchBox
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                setPageOrder={setPageOrder}
                            />
                        </div>
                    </div>

                </div>

                <div className="h-6" />
                <TableContainer sx={{ maxHeight: 440, px: 1 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        backgroundColor: "#F7F7FC",
                                        borderBottom: "1px solid #ECECF5",
                                    }}
                                >
                                    <Checkbox {...label} size="small"
                                        onChange={handleSelectAll}
                                        checked={productData?.products?.length > 0 ? productData?.products?.every((item) => item.checked) : false}
                                        sx={{
                                            color: "#C7CCE8",
                                            "&.Mui-checked": { color: "#6C63FF" },
                                        }}
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                        sx={{
                                            backgroundColor: "#F7F7FC",
                                            color: "#6B6B85",
                                            fontSize: "11.5px",
                                            fontWeight: 700,
                                            letterSpacing: "0.06em",
                                            borderBottom: "1px solid #ECECF5",
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {
                                isLoading === false ? productData?.products?.length !== 0 && productData?.products?.map((product, index) => {
                                    return (
                                        <TableRow
                                            key={index}
                                            className="transition-colors duration-150 hover:bg-[#F7F7FC]"
                                            sx={{
                                                backgroundColor: product.checked === true ? "rgba(108,99,255,0.06)" : "transparent",
                                                "& td": { borderBottom: "1px solid #F1F1F7" },
                                            }}
                                        >
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <Checkbox {...label} size="small" checked={product.checked === true ? true : false}
                                                    onChange={(e) => handleCheckboxChange(e, product._id, index)}
                                                    sx={{
                                                        color: "#C7CCE8",
                                                        "&.Mui-checked": { color: "#6C63FF" },
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex items-center gap-4 w-[300px]" title={product?.name}>
                                                    <div className="img w-[65px] h-[65px] rounded-xl overflow-hidden group cursor-pointer ring-1 ring-[#ECECF5] shadow-sm" onClick={() => setOpen(true)}>
                                                        <LazyLoadImage
                                                            alt={"image"}
                                                            effect="blur"
                                                            src={product?.images[0]}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div className="info w-[75%]">
                                                        <h3 className="font-[600] text-[12.5px] leading-4 text-[#1E1B3A] hover:text-[#6C63FF] transition-colors">
                                                            <Link to={`/product/${product?._id}`}>
                                                                {product?.name?.substr(0, 50) + '...'}
                                                            </Link>
                                                        </h3>
                                                        <span className="text-[12px] text-[#8A8AA3]">{product?.brand}</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p
                                                    className={`inline-flex items-center gap-1.5 rounded-full text-[11.5px] font-[600] px-3 py-1 ${
                                                        product?.isApproved
                                                            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                                                            : "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
                                                    }`}
                                                >
                                                    {product?.isApproved ? (
                                                        <HiOutlineCheckCircle className="text-[14px]" />
                                                    ) : (
                                                        <HiOutlineClock className="text-[14px]" />
                                                    )}
                                                    {product?.isApproved ? "Approved" : "Pending"}
                                                </p>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }} className="!text-[13px] !text-[#4B4B63]">
                                                {product?.catName}
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }} className="!text-[13px] !text-[#4B4B63]">
                                                {product?.subCat}
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex gap-1 flex-col">
                                                    <span className="oldPrice line-through leading-3 text-[#B3B3C6] text-[13px] font-[500]">
                                                        {product?.oldPrice?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
                                                    </span>
                                                    <span className="price text-[#1E1B3A] text-[14px] font-[700]">
                                                        {product?.price?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
                                                    </span>
                                                </div>
                                            </TableCell>



                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className="text-[14px] w-[100px]">
                                                    <Rating name="half-rating" size="small" defaultValue={product?.rating} readOnly />
                                                </p>


                                            </TableCell>


                                            <TableCell align="center">
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        disableElevation
                                                        onClick={() => handleAction('APPROVED', product)}
                                                        startIcon={<HiOutlineCheck />}
                                                        sx={{
                                                            textTransform: "none",
                                                            borderRadius: "999px",
                                                            fontWeight: 600,
                                                            fontSize: "12.5px",
                                                            backgroundColor: "#1FAE6D",
                                                            boxShadow: "0 1px 2px rgba(31,174,109,0.25)",
                                                            "&:hover": { backgroundColor: "#189259" },
                                                        }}
                                                    >
                                                        Approve
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => handleAction('REJECTED', product)}
                                                        startIcon={<HiOutlineX />}
                                                        sx={{
                                                            textTransform: "none",
                                                            borderRadius: "999px",
                                                            fontWeight: 600,
                                                            fontSize: "12.5px",
                                                            color: "#E1493F",
                                                            borderColor: "#F5D3D0",
                                                            backgroundColor: "#FEF6F5",
                                                            "&:hover": { backgroundColor: "#FCE9E7", borderColor: "#E1493F" },
                                                        }}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                                </TableCell>
                                        </TableRow>
                                    )
                                })


                                    :

                                    <>
                                        <TableRow>
                                            <TableCell colSpan={8} sx={{ border: "none" }}>
                                                <div className="flex flex-col items-center justify-center gap-3 w-full min-h-[400px]">
                                                    <CircularProgress size={30} sx={{ color: "#6C63FF" }} />
                                                    <span className="text-[13px] text-[#8A8AA3]">Loading pending products…</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                    </>
                            }

                            {
                                isLoading === false && productData?.products?.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ border: "none" }}>
                                        <div className="flex flex-col items-center justify-center gap-2 w-full min-h-[300px]">
                                            <div className="w-12 h-12 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
                                                <HiOutlineCheckCircle className="text-[24px] text-[#6C63FF]" />
                                            </div>
                                            <p className="text-[14px] font-[600] text-[#1E1B3A]">All caught up</p>
                                            <p className="text-[12.5px] text-[#8A8AA3]">There are no products waiting for review right now.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            }



                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[50, 100, 150, 200]}
                    component="div"
                    count={productData?.totalPages * rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: "1px solid #ECECF5",
                        color: "#4B4B63",
                    }}
                />
            </div>


            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={photos}
            />

            </div>
        </>
    )
}

export default PendingProducts;