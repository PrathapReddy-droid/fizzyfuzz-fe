import React, { useContext } from 'react'
import ReactDOMServer from 'react-dom/server';
import UploadBox from '../../Components/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import { Button } from '@mui/material';
import {
    FaCloudUploadAlt,
    FaTshirt,
} from "react-icons/fa";
import {
    MdPhoneIphone,
    MdLocalGroceryStore,
    MdKitchen,
    MdFace,
    MdSportsSoccer,
    MdMenuBook,
    MdToys,
    MdChair,
    MdDirectionsCar,
    MdLocalPharmacy,
    MdRestaurant,
    MdChildCare,
    MdPets,
    MdCardGiftcard,
    MdWatch,
    MdDevices,
    MdCreate,
    MdCategory,
} from "react-icons/md";
import { useState } from 'react';
import { deleteImages, postData } from '../../utils/api';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

// Curated set of ready-made category icons. Each renders into a small
// self-contained SVG badge (see iconToDataUrl) so picking one behaves
// exactly like an uploaded image — no backend changes needed.
const CATEGORY_ICONS = [
    { key: 'mobile', label: 'Mobile', Icon: MdPhoneIphone },
    { key: 'fashion', label: 'Fashion', Icon: FaTshirt },
    { key: 'grocery', label: 'Grocery', Icon: MdLocalGroceryStore },
    { key: 'kitchen', label: 'Home & Kitchen', Icon: MdKitchen },
    { key: 'beauty', label: 'Beauty', Icon: MdFace },
    { key: 'sports', label: 'Sports', Icon: MdSportsSoccer },
    { key: 'books', label: 'Books', Icon: MdMenuBook },
    { key: 'toys', label: 'Toys', Icon: MdToys },
    { key: 'furniture', label: 'Furniture', Icon: MdChair },
    { key: 'auto', label: 'Automotive', Icon: MdDirectionsCar },
    { key: 'pharmacy', label: 'Pharmacy', Icon: MdLocalPharmacy },
    { key: 'food', label: 'Food', Icon: MdRestaurant },
    { key: 'baby', label: 'Baby Care', Icon: MdChildCare },
    { key: 'pets', label: 'Pets', Icon: MdPets },
    { key: 'gifts', label: 'Gifts', Icon: MdCardGiftcard },
    { key: 'watches', label: 'Watches', Icon: MdWatch },
    { key: 'devices', label: 'Electronics', Icon: MdDevices },
    { key: 'stationery', label: 'Stationery', Icon: MdCreate },
    { key: 'other', label: 'Other', Icon: MdCategory },
];

// Renders a react-icons component into a rounded, colored SVG badge and
// returns it as a base64 data URL — a drop-in replacement for an uploaded
// image URL, usable anywhere <img src={...}> already works in this app.
const iconToDataUrl = (IconComponent, color = '#4f46e5', bg = '#eef2ff') => {
    const composite = (
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
            <rect width="200" height="200" rx="32" fill={bg} />
            <g transform="translate(50,50)">
                <IconComponent size={100} color={color} />
            </g>
        </svg>
    );
    const svgString = ReactDOMServer.renderToStaticMarkup(composite);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
};


const AddCategory = () => {

    const [formFields, setFormFields] = useState({
        name: "",
        images: [],
        isFssaiRequired: false,
    })

    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // Whether the "Category Image" section is in upload mode or icon-picker mode
    const [imageMode, setImageMode] = useState('upload');
    const history = useNavigate();

    const context = useContext(MyContext);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        })
    }

    // Whether products under this category are required to complete the
    // FSSAI compliance declaration (used by Add/Edit Product to gate that section).
    const handleChangeFssaiRequired = (event) => {
        const checked = event.target.checked;
        setFormFields(() => {
            return {
                ...formFields,
                isFssaiRequired: checked
            }
        })
    }

    const setPreviewsFun = (previewsArr) => {
        const imgArr = previews;
        for (let i = 0; i < previewsArr.length; i++) {
            imgArr.push(previewsArr[i])
        }

        setPreviews([])
        setTimeout(() => {
            setPreviews(imgArr)
            formFields.images = imgArr
        }, 10);
    }

    // Picking an icon reuses the exact same append path an uploaded image
    // would take, so the preview grid and form submission need no changes.
    const handleSelectIcon = (IconComponent) => {
        const dataUrl = iconToDataUrl(IconComponent);
        setPreviewsFun([dataUrl]);
    }

    const removeImg = (image, index) => {
        var imageArr = [];
        imageArr = previews;

        // Icon-picked images are local data URLs, never uploaded to the
        // server, so there's nothing to delete remotely — just drop it.
        if (image?.startsWith('data:')) {
            imageArr.splice(index, 1);
            setPreviews([]);
            setTimeout(() => {
                setPreviews(imageArr);
                formFields.images = imageArr
            }, 100);
            return;
        }

        deleteImages(`/api/category/deteleImage?img=${image}`).then((res) => {
            imageArr.splice(index, 1);

            setPreviews([]);
            setTimeout(() => {
                setPreviews(imageArr);
                formFields.images = imageArr
            }, 100);

        })
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        context?.setProgress(50);

        setIsLoading(true);

        if (formFields.name === "") {
            context.alertBox("error", "Please enter category name");
            setIsLoading(false);
            return false
        }

        if (previews?.length === 0) {
            context.alertBox("error", "Please select category image");
            setIsLoading(false);
            return false
        }
        formFields.name = formFields.name?.toUpperCase()
        postData("/api/category/create", formFields).then((res) => {
       
            setTimeout(() => {
                setIsLoading(false);
                context.setIsOpenFullScreenPanel({
                    open: false,
                })
                context?.getCat();
                history("/category/list")
                context?.setProgress(100);
            }, 2500);
        })
    }

    return (
        <section className='p-5 bg-gray-50'>
            <form className='form py-1 p-1 md:p-8 md:py-1' onSubmit={handleSubmit}>
                <div className='scroll max-h-[72vh] overflow-y-scroll pr-1 md:pr-4 pt-4'>
                    <div className='grid grid-cols-1 mb-3'>
                        <div className='col w-full md:w-[25%]'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'> Categegory Name</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="name" value={formFields.name} onChange={onChangeInput}
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 mb-3'>
                        <div className='col w-full md:w-[35%]'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Is FSSAI Required?</h3>
                            <div className='flex items-center gap-2'>
                                <Switch
                                    {...label}
                                    checked={formFields.isFssaiRequired}
                                    onChange={handleChangeFssaiRequired}
                                />
                                <span className='text-[13px] text-gray-600'>
                                    {formFields.isFssaiRequired ? "Required for products in this category" : "Not required"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <br />

                    <h3 className='text-[14px] font-[500] mb-2 text-black'> Categegory Image</h3>

                    <div className='flex items-center gap-2 mb-3'>
                        <button
                            type='button'
                            onClick={() => setImageMode('upload')}
                            className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${imageMode === 'upload'
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            Upload Image
                        </button>
                        <button
                            type='button'
                            onClick={() => setImageMode('icon')}
                            className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${imageMode === 'icon'
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            Choose Icon
                        </button>
                    </div>

                    {imageMode === 'icon' && (
                        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3 mb-4 p-4 border border-dashed border-[rgba(0,0,0,0.2)] rounded-lg bg-white'>
                            {CATEGORY_ICONS.map(({ key, label: iconLabel, Icon }) => (
                                <button
                                    type='button'
                                    key={key}
                                    onClick={() => handleSelectIcon(Icon)}
                                    title={iconLabel}
                                    className='flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-colors'
                                >
                                    <span className='w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[18px]'>
                                        <Icon />
                                    </span>
                                    <span className='text-[10px] text-gray-500 truncate w-full text-center'>{iconLabel}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                        {
                            previews?.length !== 0 && previews?.map((image, index) => {
                                return (
                                    <div className="uploadBoxWrapper mr-3 relative" key={index}>

                                        <span className='absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer' onClick={() => removeImg(image, index)}><IoMdClose className='text-white text-[17px]' /></span>


                                        <div className='uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>

                                            <img src={image} className='w-100' />
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {imageMode === 'upload' && (
                            <UploadBox multiple={true} name="images" url="/api/category/uploadImages" setPreviewsFun={setPreviewsFun} />
                        )}
                    </div>
                </div>

                <br />

                <br />
                <div className='w-[250px]'>
                    <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
                        {
                            isLoading === true ? <CircularProgress color="inherit" />
                                :
                                <>
                                    <FaCloudUploadAlt className='text-[25px] text-white' />
                                    Publish and View
                                </>
                        }
                    </Button>
                </div>


            </form>
        </section>
    )
}

export default AddCategory;