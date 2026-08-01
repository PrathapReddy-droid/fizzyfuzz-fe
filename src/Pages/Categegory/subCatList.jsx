import React, { useContext, useState } from 'react';
import { Button, Autocomplete, TextField } from "@mui/material";
import { MyContext } from '../../App';
import { HiOutlinePlus, HiOutlineFolderOpen } from "react-icons/hi2";

const autocompleteSx = {
    width: '260px',
    backgroundColor: '#fff',
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        fontSize: '13.5px',
        paddingTop: '2px',
        paddingBottom: '2px',
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ECECF5' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#DCDCF2' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6C63FF', borderWidth: '2px' },
};

export const SubCategoryList = () => {

    // Which top-level category is currently selected. Only that category's
    // sub categories (and their third-level children) are rendered below —
    // we no longer list every category at once.
    const [selectedCatId, setSelectedCatId] = useState('');
    const context = useContext(MyContext);

    const selectedCat = context?.catData?.find(cat => cat?._id === selectedCatId);

    return (
        <>
            {/* Clean white canvas with a whisper-thin dot texture so the
               page doesn't read as a flat, empty rectangle. */}
            <div
                className="min-h-screen -m-6 p-6"
                style={{
                    backgroundSize: "22px 22px",
                }}
            >

            <div className="flex items-center flex-col md:flex-row justify-start  md:justify-between px-2 py-0 mt-3">
                <div className="w-full md:w-[50%] mb-2 md:mb-0">
                    <h2 className="text-[20px] font-[700] text-white tracking-tight">
                        Sub Category List
                    </h2>
                    <p className="text-[13px] text-[#8A8AA3] mt-1">
                        {context?.catData?.length ?? 0} top-level categories · select one to manage its sub categories
                    </p>
                </div>

                <div className="col mr-auto md:mr-0 md:ml-auto flex items-center justify-end gap-3">
                    <Button
                        size="small"
                        startIcon={<HiOutlinePlus />}
                        onClick={() => context.setIsOpenFullScreenPanel({
                            open: true,
                            model: 'Add New Sub Category'
                        })}
                        sx={{
                            textTransform: "none",
                            borderRadius: "999px",
                            fontWeight: 600,
                            fontSize: "12.5px",
                            px: 2.2,
                            color: "#fff",
                            backgroundColor: "#6C63FF",
                            boxShadow: "0 4px 14px -4px rgba(108,99,255,0.55)",
                            "&:hover": { backgroundColor: "#5A52E0" },
                        }}
                        variant="contained"
                        disableElevation
                    >
                        Add New Sub Category
                    </Button>
                </div>


            </div>

            {/* Category picker — type to search, list scrolls once results
               overflow. Choosing a category here filters everything below
               down to just that category's sub categories. */}
            <div className="px-2 mt-4">
                <Autocomplete
                    size="small"
                    sx={autocompleteSx}
                    options={context?.catData || []}
                    getOptionLabel={(option) => option?.name || ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    value={selectedCat || null}
                    onChange={(event, newValue) => setSelectedCatId(newValue?._id || '')}
                    ListboxProps={{
                        style: { maxHeight: 280, overflowY: 'auto' },
                    }}
                    renderInput={(params) => (
                        <TextField {...params} placeholder="Search category…" />
                    )}
                />
            </div>


            <div
                className="my-5 pt-5 pb-5 px-5 rounded-2xl bg-white border border-[#ECECF5]"
                style={{ boxShadow: "0 1px 2px rgba(30,27,58,0.04), 0 16px 40px -20px rgba(30,27,58,0.14)" }}
            >
                {
                    context?.catData?.length === 0 &&
                    <div className="flex flex-col items-center justify-center gap-2 w-full min-h-[240px]">
                        <div className="w-12 h-12 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
                            <HiOutlineFolderOpen className="text-[22px] text-[#6C63FF]" />
                        </div>
                        <p className="text-[14px] font-[600] text-[#1E1B3A]">No categories yet</p>
                        <p className="text-[12.5px] text-[#8A8AA3]">Add a sub category to start building your tree.</p>
                    </div>
                }

                {
                    context?.catData?.length !== 0 && !selectedCatId &&
                    <div className="flex flex-col items-center justify-center gap-2 w-full min-h-[240px]">
                        <div className="w-12 h-12 rounded-full bg-[#6C63FF]/10 flex items-center justify-center">
                            <HiOutlineFolderOpen className="text-[22px] text-[#6C63FF]" />
                        </div>
                        <p className="text-[14px] font-[600] text-[#1E1B3A]">Select a category</p>
                        <p className="text-[12.5px] text-[#8A8AA3]">Pick a category above to view and manage its sub categories.</p>
                    </div>
                }

                {
                    context?.catData?.length !== 0 && selectedCatId &&
                    <>
                        <div className='flex items-center w-full px-1 h-10 mb-2'>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] mr-3 flex-shrink-0" />
                            <span className='font-[600] text-[13.5px] text-[#1E1B3A]'>
                                {selectedCat?.name}
                            </span>
                            <span className="text-[11px] font-[600] text-[#8A8AA3] bg-[#F1F1F9] rounded-full px-2.5 py-1 ml-3">
                                {selectedCat?.children?.length ?? 0} sub {selectedCat?.children?.length === 1 ? "category" : "categories"}
                            </span>
                        </div>

                        {
                            (selectedCat?.children?.length ?? 0) === 0 &&
                            <div className="flex flex-col items-center justify-center gap-2 w-full min-h-[160px]">
                                <p className="text-[13px] font-[600] text-[#1E1B3A]">No sub categories yet</p>
                                <p className="text-[12.5px] text-[#8A8AA3]">Add a sub category under {selectedCat?.name} to get started.</p>
                            </div>
                        }

                        {
                            (selectedCat?.children?.length ?? 0) !== 0 &&
                            <ul className='w-full pb-3 px-3'>
                                {selectedCat?.children?.map((subCat, index_) => {
                                    return (
                                        <li className='w-full py-1 pl-4 border-l-2 border-[#ECECF5] ml-2' key={index_}>
                                            {/* Read-only row — edit/delete controls removed for this level */}
                                            <div className='flex items-center w-full h-11 px-3 rounded-lg'>
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]/60 mr-3 flex-shrink-0" />
                                                <span className='text-[13px] font-[500] text-[#1E1B3A]'>{subCat?.name}</span>
                                            </div>

                                            {
                                                subCat?.children?.length !== 0 &&
                                                <ul className="pl-4 mt-1 border-l-2 border-[#F1F1F7] ml-2">
                                                    {
                                                        subCat?.children?.map((thirdLevel, index__) => {
                                                            return (
                                                                <li
                                                                    key={index__}
                                                                    className="w-full rounded-lg transition-colors duration-150 hover:bg-[#F7F7FC]"
                                                                >
                                                                    {/* Read-only row — edit/delete controls removed for this level */}
                                                                    <div className='flex items-center w-full h-10 px-3 rounded-lg'>
                                                                        <span className="w-1 h-1 rounded-full bg-[#8A8AA3] mr-3 flex-shrink-0" />
                                                                        <span className='text-[12.5px] font-[500] text-[#4B4B63]'>{thirdLevel?.name}</span>
                                                                    </div>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            }

                                        </li>
                                    )
                                })}
                            </ul>
                        }
                    </>
                }
            </div>

            </div>
        </>
    )
}

export default SubCategoryList;