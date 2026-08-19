import React, { useContext, useEffect, useState } from 'react';
import { Button, TextField, CircularProgress, Switch } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { FiClock } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { MyContext } from '../../App';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const columns = [
    { id: "image", label: "IMAGE", minWidth: 250 },
    { id: "action", label: "ACTION", minWidth: 100 },
];

// Base path for the banner-related APIs

// Shared MUI overrides so text fields read as part of the dark-glass system
// rather than default MUI white inputs.
const inputSx = {
    "& .MuiOutlinedInput-root": {
        color: "#f3e8ff",
        borderRadius: "12px",
        backgroundColor: "rgba(255,255,255,0.04)",
        "& fieldset": { borderColor: "rgba(196,132,252,0.25)" },
        "&:hover fieldset": { borderColor: "rgba(196,132,252,0.5)" },
        "&.Mui-focused fieldset": { borderColor: "#c084fc" },
    },
    "& .MuiInputLabel-root": { color: "rgba(243,232,255,0.5)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#c084fc" },
    "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)", opacity: 0.6 },
};

export const HomeSliderBanners = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [slidesData, setSlidesData] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [open, setOpen] = useState(false);



    const context = useContext(MyContext);

    useEffect(() => {
        getData();
    }, [context?.isOpenFullScreenPanel])

    const getData = () => {
        context?.setProgress(50);
        fetchDataFromApi("/api/homeSlides").then((res) => {
            setSlidesData(res?.data || []);
            context?.setProgress(100);
            let arr = [];

            for (let i = 0; i < res?.data?.length; i++) {
                arr.push({
                    src: res?.data[i]?.images[0]
                })
            }

            setPhotos(arr);
        });
    }

    

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const deleteSlide = (id) => {
        if (context?.userData?.role === "ADMIN") {
            deleteData(`/api/homeSlides/${id}`).then((res) => {
                context.alertBox("success", "Slide deleted");
                getData();
            })
        } else {
            context.alertBox("error", "Only admin can delete data");
        }
    }

    return (
        <div
            className="relative"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {/* Ambient background glow, consistent with the rest of the dashboard */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] bg-purple-600/20 rounded-full blur-[120px]" />
            <div className="pointer-events-none absolute top-40 -right-24 w-[380px] h-[380px] bg-fuchsia-500/10 rounded-full blur-[120px]" />

            <div className="relative grid grid-cols-1 md:grid-cols-2 items-center px-2 py-0 mt-1 md:mt-2">
                <h2
                    className="text-[20px] font-[700] text-white tracking-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                >
                    Home Slider Banners
                </h2>

                <div className="col flex items-center justify-start md:justify-end gap-3 mt-3 md:mt-0">
                    <Button
                        startIcon={<IoMdAdd />}
                        className="!text-white !normal-case !font-[600] !px-5 !py-[9px] !rounded-full"
                        sx={{
                            background: "linear-gradient(135deg, #9333ea, #c026d3)",
                            boxShadow: "0 8px 20px -6px rgba(168,85,247,0.6)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #a855f7, #d946ef)",
                                boxShadow: "0 10px 24px -6px rgba(168,85,247,0.8)",
                            },
                        }}
                        onClick={() => context.setIsOpenFullScreenPanel({
                            open: true,
                            model: 'Add Home Slide'
                        })}
                    >
                        Add Home Slide
                    </Button>
                </div>
            </div>

            {/* --- Slides Table --- */}
            <div
                className="relative my-5 rounded-2xl border border-white/10 overflow-hidden shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
                style={{ background: "linear-gradient(180deg, #241338 0%, #1a0e2b 100%)" }}
            >
                <TableContainer sx={{ maxHeight: 460, backgroundColor: "#0a1233" }}>
                    <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: "#0a1233" }}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        width={column.minWidth}
                                        key={column.id}
                                        align={column.align}
                                        sx={{
                                            background: "linear-gradient(180deg, #3b1d63 0%, #2a1148 100%)",
                                            color: "rgba(233,213,255,0.9)",
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            letterSpacing: "0.08em",
                                            borderBottom: "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {slidesData?.length !== 0 ? (
                                slidesData?.slice()?.reverse()?.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "rgba(64, 43, 93, 0.8)" :  "#0a1233",
                                            "&:hover": { backgroundColor: "rgba(196,132,252,0.07)" },
                                            "& td": {
                                                borderBottom: "1px solid rgba(255,255,255,0.07)",
                                                backgroundColor: "#0a1233",
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <div
                                                className="w-[90px] h-[90px] shrink-0 rounded-xl overflow-hidden border border-white/10 cursor-pointer group"
                                                onClick={() => setOpen(true)}
                                            >
                                                <img
                                                    src={item?.images[0]}
                                                    alt="Slide"
                                                    className="w-[90px] h-[90px] object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    className="!w-[36px] !h-[36px] !min-w-[36px] !rounded-full"
                                                    sx={{
                                                        backgroundColor: "rgba(255,255,255,0.06)",
                                                        border: "1px solid rgba(255,255,255,0.12)",
                                                        "&:hover": { backgroundColor: "rgba(196,132,252,0.18)" },
                                                    }}
                                                    onClick={() => context.setIsOpenFullScreenPanel({
                                                        open: true,
                                                        model: 'Edit Home Slide',
                                                        id: item?._id
                                                    })}
                                                >
                                                    <AiOutlineEdit className="text-[#e9d5ff] text-[18px]" />
                                                </Button>

                                                <Button
                                                    className="!w-[36px] !h-[36px] !min-w-[36px] !rounded-full"
                                                    sx={{
                                                        backgroundColor: "rgba(255,255,255,0.06)",
                                                        border: "1px solid rgba(255,255,255,0.12)",
                                                        "&:hover": { backgroundColor: "rgba(244,63,94,0.2)" },
                                                    }}
                                                    onClick={() => deleteSlide(item?._id)}
                                                >
                                                    <GoTrash className="text-[#fecdd3] text-[16px]" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center" sx={{ py: 6, border: "none" }}>
                                        <p className="text-[rgba(243,232,255,0.4)] text-sm">
                                            No slides added yet
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
    rowsPerPageOptions={[10, 25, 100]}
    component="div"
    count={slidesData?.length || 0}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    SelectProps={{
        sx: {
            backgroundColor: "#0f1c4d",
            color: "#403749",
            borderRadius: "8px",
            paddingLeft: "8px",
        },
        MenuProps: {
            PaperProps: {
                sx: {
                    backgroundColor: "#0f1c4d",
                    color: "#e9d5ff",
                    "& .MuiMenuItem-root:hover": {
                        backgroundColor: "#4a568b",
                    },
                    "& .Mui-selected": {
                        backgroundColor: "#4a568b !important",
                    },
                },
            },
        },
    }}
    sx={{
        color: "rgba(243,232,255,0.7)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "#0a1233",
        "& .MuiTablePagination-selectIcon": { color: "rgba(243,232,255,0.5)" },
        "& .MuiTablePagination-select": {
            backgroundColor: "#203069",
            borderRadius: "8px",
        },
    }}
/>
            </div>

            {/* --- Offer Expiration Time --- */}


            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={photos}
            />
        </div>
    )
}

export default HomeSliderBanners;