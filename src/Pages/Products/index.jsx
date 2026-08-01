import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import Progress from "../../Components/ProgressBar";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineXCircle, HiOutlinePlus, HiOutlineExclamationTriangle, HiOutlineCube } from "react-icons/hi2";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData, deleteMultipleData } from '../../utils/api';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from '@mui/material/CircularProgress';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
    { id: "product", label: "PRODUCT", minWidth: 150 },
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
        id: "sales",
        label: "SALES",
        minWidth: 100,
    },
    {
        id: "stock",
        label: "STOCK",
        minWidth: 100,
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

// Shared MUI overrides so the Select controls read as one deliberate
// system instead of MUI's stock outline styling.
const selectSx = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    transition: "border-color 0.15s ease",
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

// Caps each category dropdown's open list to roughly 5 rows tall; beyond
// that the list scrolls instead of growing the page, and typing in the
// field narrows the list down via search.
const autocompleteListboxSx = {
    maxHeight: 220,
    "& .MuiAutocomplete-option": {
        fontSize: "13px",
    },
};

const iconBtnSx = {
    width: 34,
    height: 34,
    minWidth: 34,
    borderRadius: "10px",
    backgroundColor: "#F7F7FC",
    border: "1px solid #ECECF5",
    transition: "all 0.15s ease",
    "&:hover": { backgroundColor: "#EFEFFB", borderColor: "#DCDCF2", transform: "translateY(-1px)" },
};

const statusStyles = {
    APPROVED: {
        classes: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
        icon: <HiOutlineCheckCircle className="text-[14px]" />,
    },
    PENDING: {
        classes: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
        icon: <HiOutlineClock className="text-[14px]" />,
    },
    REJECTED: {
        classes: "bg-red-50 text-red-500 ring-1 ring-red-200",
        icon: <HiOutlineXCircle className="text-[14px]" />,
    },
};

// Lightweight shimmering placeholder row shown while a page/filter is
// loading, so the table shell stays in place instead of collapsing to a
// centered spinner every time.
const SkeletonRow = () => (
    <TableRow>
        <TableCell><div className="h-4 w-4 rounded bg-[#F1F1F7] animate-pulse" /></TableCell>
        <TableCell>
            <div className="flex items-center gap-4">
                <div className="w-[65px] h-[65px] rounded-xl bg-[#F1F1F7] animate-pulse shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                    <div className="h-3 w-3/4 rounded bg-[#F1F1F7] animate-pulse" />
                    <div className="h-2.5 w-1/3 rounded bg-[#F1F1F7] animate-pulse" />
                </div>
            </div>
        </TableCell>
        <TableCell><div className="h-5 w-20 rounded-full bg-[#F1F1F7] animate-pulse" /></TableCell>
        <TableCell><div className="h-3 w-16 rounded bg-[#F1F1F7] animate-pulse" /></TableCell>
        <TableCell><div className="h-3 w-20 rounded bg-[#F1F1F7] animate-pulse" /></TableCell>
        <TableCell><div className="h-3 w-14 rounded bg-[#F1F1F7] animate-pulse" /></TableCell>
        <TableCell><div className="h-3 w-10 rounded bg-[#F1F1F7] animate-pulse" /></TableCell>
        <TableCell><div className="h-3 w-10 rounded bg-[#F1F1F7] animate-pulse" /></TableCell>
        <TableCell><div className="h-3 w-16 rounded bg-[#F1F1F7] animate-pulse" /></TableCell>
    </TableRow>
);

export const Products = () => {
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

    // Tracks the pending delete confirmation. `type` is 'single' or
    // 'multiple'; `id` holds the product id when type is 'single'.
    const [confirmDelete, setConfirmDelete] = useState({ open: false, type: null, id: null });

    const context = useContext(MyContext);
    const navigate = useNavigate()

    // Flattened sub category options. When a top-level category is
    // selected, only that category's children are offered; otherwise
    // every category's children are pooled together.
    const subCategoryOptions = useMemo(() => {
        const source = productCat
            ? context?.catData?.filter((cat) => cat?._id === productCat)
            : context?.catData;

        const result = [];
        source?.forEach((cat) => {
            cat?.children?.forEach((subCat) => {
                result.push(subCat);
            });
        });
        return result;
    }, [context?.catData, productCat]);

    // Flattened third-level category options, pooled across every
    // category/sub category so they can all be searched in one field.
    // Third-level options now cascade off whichever of category / sub category
// is currently selected (mirrors subCategoryOptions' cascading logic).
const thirdLevelOptions = useMemo(() => {
    const catSource = productCat
        ? context?.catData?.filter((cat) => cat?._id === productCat)
        : context?.catData;

    const result = [];
    catSource?.forEach((cat) => {
        cat?.children?.forEach((subCat) => {
            // If a sub category is selected, only pull third-level items
            // belonging to that specific sub category.
            if (productSubCat && subCat?._id !== productSubCat) return;
            subCat?.children?.forEach((thirdLevel) => {
                result.push(thirdLevel);
            });
        });
    });
    return result;
}, [context?.catData, productCat, productSubCat]);

    const selectedCategoryOption = useMemo(
        () => context?.catData?.find((cat) => cat?._id === productCat) ?? null,
        [context?.catData, productCat]
    );

    const selectedSubCategoryOption = useMemo(
        () => subCategoryOptions?.find((subCat) => subCat?._id === productSubCat) ?? null,
        [subCategoryOptions, productSubCat]
    );

    const selectedThirdLevelOption = useMemo(
        () => thirdLevelOptions?.find((thirdLevel) => thirdLevel?._id === productThirdLavelCat) ?? null,
        [thirdLevelOptions, productThirdLavelCat]
    );

    useEffect(() => {
        getProducts(page, rowsPerPage);
    }, [context?.isOpenFullScreenPanel, page, rowsPerPage])



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
        fetchDataFromApi(`/api/product/getAllProducts?page=${page + 1}&limit=${limit}`).then((res) => {
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
            fetchDataFromApi(`/api/product/getAllProductsByCatId/${event.target.value}`).then((res) => {
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
            fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${event.target.value}`).then((res) => {
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
    const getMissingProfileFields = (user) => {
  if (!user) return ["User data missing"];

  const missing = [];

  const hasPanOrAadhaar =
    Boolean(user.pan_number?.trim()) || Boolean(user.aadhaar_number?.trim());

  if (!hasPanOrAadhaar) missing.push("KYC Details");
  if (!user.gst?.trim()) missing.push("GST");
  if (!user.bank_account?.trim()) missing.push("Bank Account Number");
  if (!user.ifsc?.trim()) missing.push("IFSC Code");
  if(!user.city||!user.email||!user.mobile||!user.name||!user.state||!user.address||!user.pin_number||!user.pickup_location) missing.push("delivery information");

  return missing;
};
    const isProfileComplete = (user) => {
  if (!user) return false;

  const hasPanOrAadhaar =
    Boolean(user.pan_number?.trim()) || Boolean(user.aadhaar_number?.trim());

  return (
    hasPanOrAadhaar &&
    Boolean(user.gst?.trim()) &&
    Boolean(user.bank_account?.trim()) &&
    Boolean(user.ifsc?.trim()) &&
    Boolean(user.pin_number?.toString().trim())
  );
};


    // Opens the confirmation dialog for a single product instead of
    // deleting right away.
    const deleteProduct = (id) => {
        if (context?.userData?.role === "ADMIN") {
            setConfirmDelete({ open: true, type: 'single', id });
        } else {
            context.alertBox("error", "Only admin can delete data");
        }
    }


    // Opens the confirmation dialog for the currently selected products
    // instead of deleting right away.
    const deleteMultipleProduct = () => {

        if (sortedIds.length === 0) {
            context.alertBox('error', 'Please select items to delete.');
            return;
        }

        setConfirmDelete({ open: true, type: 'multiple', id: null });
    }


    const closeDeleteConfirm = () => {
        setConfirmDelete({ open: false, type: null, id: null });
    }


    // Runs the actual delete request once the user confirms in the dialog.
    const confirmDeleteAction = () => {
        if (confirmDelete.type === 'single') {
            deleteData(`/api/product/${confirmDelete.id}`).then((res) => {
                getProducts();
                context.alertBox("success", "Product deleted");
                closeDeleteConfirm();
            })
        } else if (confirmDelete.type === 'multiple') {
            try {
                deleteMultipleData(`/api/product/deleteMultiple`, {
                    data: { ids: sortedIds },
                }).then((res) => {
                    getProducts();
                    context.alertBox("success", "Product deleted");
                    setSortedIds([]);
                    closeDeleteConfirm();
                })

            } catch (error) {
                context.alertBox('error', 'Error deleting items.');
                closeDeleteConfirm();
            }
        }
    }



    const handleChangePage = (event, newPage) => {
        getProducts(page, rowsPerPage);
        setPage(newPage);
    };

    return (
        <>
            {/* Soft dot-grid canvas so the page reads as a considered
               surface rather than a flat, empty rectangle. */}
            <div
                className="min-h-screen -m-6 p-6"
                style={{
                    backgroundColor: "#FAFAFD",
                    backgroundImage: "radial-gradient(#E7E7F3 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            >

            <div className="flex items-center justify-between px-2 py-0 mt-3 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center shrink-0">
                        <HiOutlineCube className="text-[20px] text-[#6C63FF]" />
                    </div>
                    <div>
                        <h2 className="text-[20px] font-[700] text-[#1E1B3A] tracking-tight leading-tight">
                            Products
                        </h2>
                        <p className="text-[13px] text-[#8A8AA3] mt-0.5">
                            {productData?.totalCount ?? productData?.products?.length ?? 0} products in your catalog
                        </p>
                    </div>
                </div>

                <div className="col ml-auto flex items-center justify-end gap-3">
                    {
                        sortedIds?.length !== 0 &&
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={deleteMultipleProduct}
                            startIcon={<GoTrash />}
                            sx={{
                                textTransform: "none",
                                borderRadius: "999px",
                                fontWeight: 600,
                                fontSize: "12.5px",
                                color: "#E1493F",
                                borderColor: "#F5D3D0",
                                backgroundColor: "#FEF6F5",
                                transition: "all 0.15s ease",
                                "&:hover": { backgroundColor: "#FCE9E7", borderColor: "#E1493F" },
                            }}
                        >
                            Delete ({sortedIds.length})
                        </Button>
                    }


                   <Button
                        size="small"
                        startIcon={<HiOutlinePlus />}
                        onClick={() => {
                            console.log(context);

                            const user = context.userData;

                            // Admins can add products without completing the
                            // seller profile checklist; every other role
                            // still needs to pass the validation below.
                            if (user?.role !== "ADMIN") {
                                const missingFields = getMissingProfileFields(user)
                                if (missingFields.length > 0) {
                                    context.alertBox("error",
                                        `Please update your profile before adding product.\nMissing: ${missingFields.join(", ")}`
                                    );

                                    setTimeout(() => {
                                        navigate("/profile");
                                    }, 1000);

                                    return;
                                }
                            }

                            // ✅ Open modal if profile is complete (or user is ADMIN)
                            context.setIsOpenFullScreenPanel({
                                open: true,
                                model: "Add Product",
                            });
                        }}
                        sx={{
                            textTransform: "none",
                            borderRadius: "999px",
                            fontWeight: 600,
                            fontSize: "12.5px",
                            px: 2.2,
                            color: "#fff",
                            backgroundColor: "#6C63FF",
                            boxShadow: "0 4px 14px -4px rgba(108,99,255,0.55)",
                            transition: "all 0.15s ease",
                            "&:hover": { backgroundColor: "#5A52E0", boxShadow: "0 6px 16px -4px rgba(108,99,255,0.6)", transform: "translateY(-1px)" },
                        }}
                        variant="contained"
                        disableElevation
                    >
                        Add Product
                    </Button>

                </div>


            </div>


            <div
                className="my-5 pt-6 rounded-2xl bg-white border border-[#ECECF5] transition-shadow"
                style={{ boxShadow: "0 1px 2px rgba(30,27,58,0.04), 0 16px 40px -20px rgba(30,27,58,0.14)" }}
            >

                <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-4 w-full px-6 justify-beetween gap-4">
                    <div className="col">
                        <h4 className="font-[600] text-[12px] uppercase tracking-wide text-[#8A8AA3] mb-2">Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Autocomplete
                                size="small"
                                className="w-full"
                                options={context?.catData || []}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                value={selectedCategoryOption}
                                onChange={(event, newValue) => handleChangeProductCat({ target: { value: newValue ? newValue?._id : null } })}
                                ListboxProps={{ sx: autocompleteListboxSx }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search category..."
                                        sx={selectSx}
                                    />
                                )}
                            />
                        }
                    </div>


                    <div className="col">
                        <h4 className="font-[600] text-[12px] uppercase tracking-wide text-[#8A8AA3] mb-2">Sub Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Autocomplete
                                size="small"
                                className="w-full"
                                options={subCategoryOptions}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                value={selectedSubCategoryOption}
                                onChange={(event, newValue) => handleChangeProductSubCat({ target: { value: newValue ? newValue?._id : null } })}
                                ListboxProps={{ sx: autocompleteListboxSx }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search sub category..."
                                        sx={selectSx}
                                    />
                                )}
                            />
                        }
                    </div>


                    <div className="col">
                        <h4 className="font-[600] text-[12px] uppercase tracking-wide text-[#8A8AA3] mb-2">Third Level Sub Category By</h4>
                        {
                            context?.catData?.length !== 0 &&
                            <Autocomplete
                                size="small"
                                className="w-full"
                                options={thirdLevelOptions}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                value={selectedThirdLevelOption}
                                onChange={(event, newValue) => handleChangeProductThirdLavelCat({ target: { value: newValue ? newValue?._id : null } })}
                                ListboxProps={{ sx: autocompleteListboxSx }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search third level..."
                                        sx={selectSx}
                                    />
                                )}
                            />
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
                                    const status = statusStyles[product?.status] ?? statusStyles.PENDING;
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
                                                    <div className="img w-[65px] h-[65px] rounded-xl overflow-hidden group cursor-pointer ring-1 ring-[#ECECF5] shadow-sm transition-transform duration-200 hover:scale-[1.03]" onClick={() => setOpen(true)}>
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
                                                <p className={`inline-flex items-center gap-1.5 rounded-full text-[11.5px] font-[600] px-3 py-1 ${status.classes}`}>
                                                    {status.icon}
                                                    {product?.status}
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
                                                <p className="text-[13px] w-[70px] text-[#4B4B63]">
                                                    <span className="font-[700] text-[#1E1B3A]">{product?.sale}</span> sale
                                                </p>
                                            </TableCell>


                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className="text-[13px] w-[70px]">
                                                    <span className="font-[700] text-[#6C63FF]">{product?.countInStock}</span>
                                                </p>
                                            </TableCell>


                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <p className="text-[14px] w-[100px]">
                                                    <Rating name="half-rating" size="small" defaultValue={product?.rating} readOnly />
                                                </p>


                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className="flex items-center gap-1.5">
                                                    <Button
                                                        sx={iconBtnSx}
                                                        onClick={() => context.setIsOpenFullScreenPanel({
                                                            open: true,
                                                            model: 'Edit Product',
                                                            id: product?._id
                                                        })}
                                                    >
                                                        <AiOutlineEdit className="text-[#4B4B63] text-[18px]" />
                                                    </Button>

                                                    <Link to={`/product/${product?._id}`}>
                                                        <Button sx={iconBtnSx}>
                                                            <FaRegEye className="text-[#4B4B63] text-[16px]" />
                                                        </Button>
                                                    </Link>

                                                    <Button
                                                        sx={{
                                                            ...iconBtnSx,
                                                            "&:hover": { backgroundColor: "#FCE9E7", borderColor: "#F5D3D0" },
                                                        }}
                                                        onClick={() => deleteProduct(product?._id)}
                                                    >
                                                        <GoTrash className="text-[#E1493F] text-[16px]" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })


                                    :

                                    <>
                                        {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
                                    </>
                            }

                            {
                                isLoading === false && productData?.products?.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={9} sx={{ border: "none" }}>
                                        <div className="flex flex-col items-center justify-center gap-2 w-full min-h-[300px]">
                                            <div className="w-12 h-12 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
                                                <HiOutlinePlus className="text-[22px] text-[#6C63FF]" />
                                            </div>
                                            <p className="text-[14px] font-[600] text-[#1E1B3A]">No products yet</p>
                                            <p className="text-[12.5px] text-[#8A8AA3]">Add your first product to see it listed here.</p>
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

            <Dialog
                open={confirmDelete.open}
                onClose={closeDeleteConfirm}
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        px: 1,
                        py: 0.5,
                    },
                }}
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, fontWeight: 700, color: "#1E1B3A" }}>
                    <span className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <HiOutlineExclamationTriangle className="text-[18px] text-[#E1493F]" />
                    </span>
                    {confirmDelete.type === 'multiple' ? 'Delete selected products?' : 'Delete this product?'}
                </DialogTitle>
                <DialogContent>
                    <p className="text-[13.5px] text-[#6B6B85]">
                        {confirmDelete.type === 'multiple'
                            ? `This will permanently remove ${sortedIds.length} selected product${sortedIds.length === 1 ? '' : 's'}. This action cannot be undone.`
                            : 'This will permanently remove the product. This action cannot be undone.'}
                    </p>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={closeDeleteConfirm}
                        sx={{
                            textTransform: "none",
                            borderRadius: "999px",
                            fontWeight: 600,
                            fontSize: "12.5px",
                            color: "#4B4B63",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDeleteAction}
                        variant="contained"
                        disableElevation
                        sx={{
                            textTransform: "none",
                            borderRadius: "999px",
                            fontWeight: 600,
                            fontSize: "12.5px",
                            px: 2.2,
                            backgroundColor: "#E1493F",
                            transition: "all 0.15s ease",
                            "&:hover": { backgroundColor: "#C93F36" },
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            </div>
        </>
    )
}

export default Products;