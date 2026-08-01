import React, { useContext, useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import UploadBox from '../../Components/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import { Button } from '@mui/material';
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from '../../App';
import { deleteImages, editData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

// Shared style tokens so every field looks the same
const inputCls =
    'w-full h-[42px] border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3 text-[13.5px] text-gray-800 bg-white transition-colors placeholder:text-gray-400';
const labelCls = 'text-[13px] font-semibold mb-1.5 text-gray-700 block';
const selectSx = {
    width: '100%',
    borderRadius: '8px',
    fontSize: '13.5px',
    backgroundColor: '#fff',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#c7d2fe' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#818cf8', borderWidth: '2px' },
};

const SectionCard = ({ title, subtitle, tag, children, className = '' }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6 mb-5 ${className}`}>
        {(title || tag) && (
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                {title && <h3 className="font-bold text-[16px] text-gray-900">{title}</h3>}
                {tag && (
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 whitespace-nowrap">
                        {tag}
                    </span>
                )}
            </div>
        )}
        {subtitle && <p className="text-[12.5px] text-gray-500 mb-5">{subtitle}</p>}
        {children}
    </div>
);


const EditProduct = () => {

    const [videoPreviews, setVideoPreviews] = useState("");
    const [videoPreview, setVideoPreview] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [videoSuccess, setVideoSuccess] = useState(false);
    const [formFields, setFormFields] = useState({
        name: "",
        description: "",
        images: [],
        brand: "",
        price: "",
        oldPrice: "",
        category: "",
        catName: "",
        catId: "",
        subCatId: "",
        subCat: "",
        thirdsubCat: "",
        thirdsubCatId: "",
        countInStock: "",
        rating: "",
        isFeatured: false,
        discount: "",
        productRam: [],
        size: [],
        productWeight: [],
        bannerTitleName: '',
        bannerimages: [],
        isDisplayOnHomeBanner: false,
        shipment_days: '',
        product_pincode: '',
        variants: {
            color: [],
            ram: [],
            weight: [],
            size: [],
            length: [],
            width: [],
        }
    })


    const [productCat, setProductCat] = React.useState('');
    const [productSubCat, setProductSubCat] = React.useState('');
    const [productFeatured, setProductFeatured] = React.useState(false);
    const [productRamsData, setProductRamsData] = React.useState([]);
    const [productWeightData, setProductWeightData] = React.useState([]);
    const [productSizeData, setProductSizeData] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [productThirdLavelCat, setProductThirdLavelCat] = useState('');

    const [previews, setPreviews] = useState([]);
    const [bannerPreviews, setBannerPreviews] = useState([]);

    const [checkedSwitch, setCheckedSwitch] = useState(false);

    const history = useNavigate();

    const context = useContext(MyContext);
    const handleVideoSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("video/")) {
            alert("Please select a valid video file");
            return;
        }

        if (!formFields?.name) {
            context.alertBox("error", "Please enter product name before uploading video");
            return;
        }

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));

        // 🔥 Auto Upload
        const formData = new FormData();
        formData.append("title", formFields.name);
        formData.append("user_id", context?.userData._id);
        formData.append("role", context?.userData.role);
        formData.append("video", file);

        try {
            const data = await editData(
                "/api/product/uploadVideo",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setVideoSuccess(data.success);

            if (data.success) {
                console.log("Video uploaded:", data);
                setFormFields((state) => ({
                    ...state,
                    video_url: data?.video?.video_url,
                }));
            } else {
                console.log("Video not uploaded");
            }
        } catch (err) {
            console.error("Upload failed:", err);
        }
    };

    const [variantOptions, setVariantOptions] = useState({
        color: ["Red", "Blue", "Black"],
        ram: [],
        weight: [],
        size: [],
        length: [],
        width: [],
    });
    useEffect(() => {
        console.log("context", context)
    }, [context])
    const [variantInput, setVariantInput] = useState({
        color: [],
        ram: [],
        weight: [],
        size: [],
        length: [],
        width: []
    });
    const addVariant = (type) => {
        const value = variantInput[type].trim();
        if (!value) return;

        setFormFields(prev => ({
            ...prev,
            variants: {
                ...prev.variants,
                [type]: [...new Set([...prev.variants[type], value])]
            }
        }));

        setVariantInput(prev => ({ ...prev, [type]: "" }));
    };
    const removeVariant = (type, value) => {
        setFormFields(prev => ({
            ...prev,
            variants: {
                ...prev.variants,
                [type]: prev.variants[type].filter(v => v !== value)
            }
        }));
    };
    useEffect(() => {

        fetchDataFromApi("/api/product/productRAMS/get").then((res) => {
            if (res?.error === false) {
                setProductRamsData(res?.data);
            }
        })

        fetchDataFromApi("/api/product/productWeight/get").then((res) => {
            if (res?.error === false) {
                setProductWeightData(res?.data);
            }
        })

        fetchDataFromApi("/api/product/productSize/get").then((res) => {
            if (res?.error === false) {
                setProductSizeData(res?.data);
            }
        })


        fetchDataFromApi(`/api/product/${context?.isOpenFullScreenPanel?.id}`).then((res) => {
            setFormFields({
                name: res?.product?.name,
                description: res?.product?.description,
                images: res?.product?.images,
                brand: res?.product?.brand,
                price: Number(res?.product?.price || 0),
                oldPrice: Number(res?.product?.oldPrice || 0),
                category: res?.product?.category,
                catName: res?.product?.catName,
                catId: res?.product?.catId,
                subCatId: res?.product?.subCatId,
                subCat: res?.product?.subCat,
                thirdsubCat: res?.product?.thirdsubCat,
                thirdsubCatId: res?.product?.thirdsubCatId,
                countInStock: res?.product?.countInStock,
                rating: res?.product?.rating,
                isFeatured: res?.product?.isFeatured,
                discount: Number(res?.product?.discount || 0),
                productRam: res?.product?.productRam,
                size: res?.product?.size,
                productWeight: res?.product?.productWeight,
                bannerTitleName: res?.product?.bannerTitleName,
                bannerimages: res?.product?.bannerimages,
                variants: res?.product?.variants,
                isDisplayOnHomeBanner: res?.product?.isDisplayOnHomeBanner,
                shipment_days: res?.product?.shipment_days,
                product_pincode: res?.product?.product_pincode,
                video_url: res?.product?.video_url,
            })
            setVideoPreview(res?.product?.video_url)
            setVariantInput(res?.product?.variants)
            setProductCat(res?.product?.catId);
            setProductSubCat(res?.product?.subCatId);
            setProductThirdLavelCat(res?.product?.thirdsubCatId);
            setProductFeatured(res?.product?.isFeatured)
            setCheckedSwitch(res?.product?.isDisplayOnHomeBanner)

            setPreviews(res?.product?.images);
            setBannerPreviews(res?.product?.bannerimages);


        })
    }, []);


    const handleChangeProductCat = (event) => {
        setProductCat(event.target.value);
        formFields.catId = event.target.value
        formFields.category = event.target.value

    };

    const selectCatByName = (name) => {
        formFields.catName = name
    }

    const handleChangeProductSubCat = (event) => {
        setProductSubCat(event.target.value);
        formFields.subCatId = event.target.value
    };

    const selectSubCatByName = (name) => {
        formFields.subCat = name
    }

    const handleChangeProductThirdLavelCat = (event) => {
        setProductThirdLavelCat(event.target.value);
        formFields.thirdsubCatId = event.target.value
    };

    const selectSubCatByThirdLavel = (name) => {
        formFields.thirdsubCat = name
    }


    const handleChangeProductFeatured = (event) => {
        setProductFeatured(event.target.value);
        formFields.isFeatured = event.target.value
    };




    const onChangeInput = (e) => {
        const { name, value } = e.target;

        setFormFields((prev) => {
            let updatedFields = {
                ...prev,
                [name]: value
            };

            if (name === "price" && prev.oldPrice) {
                const price = Number(value);
                const oldPrice = Number(prev.oldPrice);

                const discount = Math.floor(
                    ((oldPrice - price) / oldPrice) * 100
                );

                updatedFields.discount = discount > 0 ? discount : 0;
            }

            return updatedFields;
        });
    };



    const onChangeRating = (e) => {
        setFormFields((formFields) => (
            {
                ...formFields,
                rating: e.target.value
            }
        ))
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

    const removeImg = (image, index) => {
        var imageArr = [];
        imageArr = previews;
        deleteImages(`/api/category/deteleImage?img=${image}`).then((res) => {
            imageArr.splice(index, 1);

            setPreviews([]);
            setTimeout(() => {
                setPreviews(imageArr);
                formFields.images = imageArr
            }, 100);

        })
    }


    const setBannerImagesFun = (previewsArr) => {
        const imgArr = bannerPreviews;
        for (let i = 0; i < previewsArr.length; i++) {
            imgArr.push(previewsArr[i])
        }

        setBannerPreviews([])
        setTimeout(() => {
            setBannerPreviews(imgArr)
            formFields.bannerimages = imgArr
        }, 10);
    }



    const removeBannerImg = (image, index) => {
        var imageArr = [];
        imageArr = bannerPreviews;
        deleteImages(`/api/category/deteleImage?img=${image}`).then((res) => {
            imageArr.splice(index, 1);

            setBannerPreviews([]);
            setTimeout(() => {
                setBannerPreviews(imageArr);
                formFields.bannerimages = imageArr
            }, 100);

        })
    }



    const handleChangeSwitch = (event) => {
        setCheckedSwitch(event.target.checked);
        formFields.isDisplayOnHomeBanner = event.target.checked;
    }

    const handleSubmitg = (e) => {
        e.preventDefault(0);

        console.log(formFields)
        if (formFields.name === "") {
            context.alertBox("error", "Please enter product name");
            return false;
        }

        if (formFields.description === "") {
            context.alertBox("error", "Please enter product description");
            return false;
        }



        if (formFields?.catId === "") {
            context.alertBox("error", "Please select product category");
            return false;
        }



        if (formFields?.price === "") {
            context.alertBox("error", "Please enter product price");
            return false;
        }


        if (formFields?.oldPrice === "") {
            context.alertBox("error", "Please enter product MRP");
            return false;
        }

        if (formFields?.shipment_days === "") {
            context.alertBox("error", "Please enter expected shipment days");
            return false;
        }
        if (formFields?.product_pincode === "") {
            context.alertBox("error", "Please enter product pin");
            return false;
        }

        if (formFields?.countInStock === "") {
            context.alertBox("error", "Please enter  product stock");
            return false;
        }


        if (formFields?.brand === "") {
            context.alertBox("error", "Please enter product model");
            return false;
        }


        if (formFields?.discount === "") {
            context.alertBox("error", "Please enter product discount");
            return false;
        }




        if (formFields?.rating === "") {
            context.alertBox("error", "Please enter  product rating");
            return false;
        }


        if (previews?.length === 0) {
            context.alertBox("error", "Please select product images");
            return false;
        }
        setIsLoading(true);

        editData(`/api/product/updateProduct/${context?.isOpenFullScreenPanel?.id}`, formFields).then((res) => {

            console.log(res)
            if (res?.data?.error === false) {
                context.alertBox("success", res?.data?.message);
                setTimeout(() => {
                    setIsLoading(false);
                    context.setIsOpenFullScreenPanel({
                        open: false,
                    })
                    history("/products");
                }, 1000);
            } else {
                setIsLoading(false);
                context.alertBox("error", res?.data?.message);
            }
        })
    }

    return (
        <section className="bg-white">
            <form className="py-1 p-1 md:p-6 md:py-1" onSubmit={handleSubmitg}>
                <div className="scroll max-h-[74vh] overflow-y-scroll pr-2 -mr-2">

                    <SectionCard title="Basic details" subtitle="Name and describe the product the way customers will see it.">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <h3 className={labelCls}>Product Name</h3>
                                <input
                                    type="text"
                                    name="name"
                                    value={formFields.name}
                                    onChange={onChangeInput}
                                    className={inputCls}
                                    placeholder="e.g. Classic Cotton T-Shirt"
                                />
                            </div>
                            <div>
                                <h3 className={labelCls}>Product Description</h3>
                                <textarea
                                    name="description"
                                    value={formFields.description}
                                    onChange={onChangeInput}
                                    className={`${inputCls} h-[130px] py-3 resize-none`}
                                    placeholder="What makes this product worth buying?"
                                />
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Category & pricing" subtitle="Where this product lives in the catalog, and what it costs.">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            <div>
                                <h3 className={labelCls}>Product Category</h3>
                                <Select size="small" sx={selectSx} value={productCat} onChange={handleChangeProductCat}>
                                    {context?.catData?.map(cat => (
                                        <MenuItem key={cat._id} value={cat._id} onClick={() => selectCatByName(cat.name)}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <h3 className={labelCls}>Product Sub Category</h3>
                                <Select size="small" sx={selectSx} value={productSubCat} onChange={handleChangeProductSubCat}>
                                    {context?.catData?.flatMap(cat =>
                                        cat.children?.map(sub => (
                                            <MenuItem key={sub._id} value={sub._id} onClick={() => selectSubCatByName(sub.name)}>
                                                {sub.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </div>

                            <div>
                                <h3 className={labelCls}>Third Level Category</h3>
                                <Select size="small" sx={selectSx} value={productThirdLavelCat} onChange={handleChangeProductThirdLavelCat}>
                                    {context?.catData?.flatMap(cat =>
                                        cat.children?.flatMap(sub =>
                                            sub.children?.map(third => (
                                                <MenuItem
                                                    key={third._id}
                                                    value={third._id}
                                                    onClick={() => selectSubCatByThirdLavel(third.name)}
                                                >
                                                    {third.name}
                                                </MenuItem>
                                            ))
                                        )
                                    )}
                                </Select>
                            </div>

                            <div>
                                <h3 className={labelCls}>Product MRP</h3>
                                <input type="number" name="oldPrice" value={formFields.oldPrice} onChange={onChangeInput} className={inputCls} placeholder="0.00" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Price</h3>
                                <input type="number" name="price" value={formFields.price} onChange={onChangeInput} className={inputCls} placeholder="0.00" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Discount</h3>
                                <input type="number" disabled value={formFields.discount} className={`${inputCls} bg-gray-50 text-gray-500`} />
                            </div>

                            {context.userData.role === "ADMIN" && (
                                <div>
                                    <h3 className={labelCls}>Is Featured?</h3>
                                    <Select size="small" sx={selectSx} value={productFeatured} onChange={handleChangeProductFeatured}>
                                        <MenuItem value={true}>True</MenuItem>
                                        <MenuItem value={false}>False</MenuItem>
                                    </Select>
                                </div>
                            )}

                            <div>
                                <h3 className={labelCls}>Stock</h3>
                                <input type="number" name="countInStock" value={formFields.countInStock} onChange={onChangeInput} className={inputCls} placeholder="0" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Product Model</h3>
                                <input type="text" name="brand" value={formFields.brand} onChange={onChangeInput} className={inputCls} placeholder="Model / brand" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Expected Shipment Days</h3>
                                <input type="number" name="shipmentDays" value={formFields.shipment_days} onChange={onChangeInput} className={inputCls} placeholder="e.g. 3" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Product PIN Code</h3>
                                <input type="number" name="product_pincode" value={formFields.product_pincode} onChange={onChangeInput} className={inputCls} placeholder="e.g. 682001" />
                            </div>

                            {context.userData.role === "ADMIN" && (
                                <div>
                                    <h3 className={labelCls}>Product Rating</h3>
                                    <Rating value={formFields.rating} onChange={onChangeRating} />
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    <SectionCard title="Product variants" subtitle="Pick from existing options or add your own for each attribute.">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {["color", "ram", "weight", "size", "length", "width"].map(type => (
                                <div key={type} className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                                    <h3 className={`${labelCls} capitalize`}>{type}</h3>

                                    <Select
                                        size="small"
                                        sx={{ ...selectSx, mb: 1 }}
                                        value={variantInput?.[type] || ""}
                                        onChange={e =>
                                            setVariantInput(prev => ({ ...prev, [type]: e.target.value }))
                                        }
                                    >
                                        {(variantOptions?.[type] || []).map(opt => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </Select>

                                    <div className="flex gap-2 mt-1">
                                        <input
                                            className={`${inputCls} h-[36px]`}
                                            placeholder={`Add custom ${type}`}
                                            value={variantInput?.[type] || ""}
                                            onChange={e => setVariantInput(prev => ({ ...prev, [type]: e.target.value }))}
                                        />
                                        <Button variant="contained" size="small" disableElevation onClick={() => addVariant(type)}>
                                            Add
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(formFields?.variants?.[type] || []).map(item => (
                                            <span
                                                key={item}
                                                className="bg-white border border-gray-200 px-2 py-1 rounded-md text-[12.5px] flex items-center gap-1 text-gray-700"
                                            >
                                                {item}
                                                <IoMdClose
                                                    className="cursor-pointer text-gray-400 hover:text-red-500"
                                                    onClick={() => removeVariant(type, item)}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Media & images" subtitle="Upload clear, well-lit photos and an optional product video.">
                        <div className="grid gap-5">
                            <div>
                                <h4 className="text-[12.5px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Images</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {previews?.length !== 0 && previews?.map((image, index) => (
                                        <div className="relative" key={index}>
                                            <span
                                                className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[6px] -right-[6px] flex items-center justify-center z-50 cursor-pointer shadow-sm"
                                                onClick={() => removeImg(image, index)}
                                            >
                                                <IoMdClose className="text-white text-[14px]" />
                                            </span>
                                            <div className="rounded-lg overflow-hidden border border-gray-200 h-[120px] w-full bg-gray-50 flex items-center justify-center">
                                                <img src={image} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    ))}

                                    <UploadBox multiple={true} name="images" url="/api/product/uploadImages" setPreviewsFun={setPreviewsFun} />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[12.5px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Video</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {videoPreview && (
                                        <div className="relative">
                                            <span
                                                className="absolute w-[20px] h-[20px] rounded-full bg-red-600 -top-[6px] -right-[6px] flex items-center justify-center z-50 cursor-pointer shadow-sm"
                                                onClick={() => {
                                                    setVideoPreview(null);
                                                    setVideoFile(null);
                                                }}
                                            >
                                                <IoMdClose className="text-white text-[14px]" />
                                            </span>

                                            <div className="h-[120px] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                                                <video
                                                    src={videoPreview}
                                                    controls
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {!videoPreview && (
                                        <label className="h-[120px] border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center cursor-pointer transition-colors">
                                            <FaCloudUploadAlt className="text-gray-400 text-[20px] mb-1" />
                                            <span className="text-[12.5px] text-gray-500">Upload video</span>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                hidden
                                                onChange={handleVideoSelect}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex items-center gap-4 mb-4">
                            <h3 className="font-bold text-[16px] text-gray-900">Banner images</h3>
                            <Switch {...label} onChange={handleChangeSwitch} checked={checkedSwitch} />
                            <span className="text-[12.5px] text-gray-500">{checkedSwitch ? "Shown on home banner" : "Not shown on home banner"}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-5">
                            {bannerPreviews?.length !== 0 && bannerPreviews?.map((image, index) => (
                                <div className="relative" key={index}>
                                    <span
                                        className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[6px] -right-[6px] flex items-center justify-center z-50 cursor-pointer shadow-sm"
                                        onClick={() => removeBannerImg(image, index)}
                                    >
                                        <IoMdClose className="text-white text-[14px]" />
                                    </span>
                                    <div className="rounded-lg overflow-hidden border border-gray-200 h-[120px] w-full bg-gray-50 flex items-center justify-center">
                                        <img src={image} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            ))}

                            {checkedSwitch && (
                                <UploadBox multiple={true} name="bannerimages" url="/api/product/uploadBannerImages" setPreviewsFun={setBannerImagesFun} />
                            )}
                        </div>

                        <h3 className={labelCls}>Banner Title</h3>
                        <input
                            type="text"
                            className={inputCls}
                            name="bannerTitleName"
                            value={formFields.bannerTitleName}
                            onChange={onChangeInput}
                            placeholder="Optional headline for the home banner"
                        />
                    </SectionCard>

                </div>

                <div className="border-t border-gray-200 pt-5 mt-2">
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        className="w-full flex gap-2"
                        sx={{
                            height: '46px',
                            textTransform: 'none',
                            fontSize: '14px',
                            fontWeight: 600,
                            borderRadius: '10px',
                            backgroundColor: '#4f46e5',
                            '&:hover': { backgroundColor: '#4338ca' },
                        }}
                    >
                        {isLoading ? <CircularProgress size={22} color="inherit" />
                            : (
                                <>
                                    <FaCloudUploadAlt className="text-[20px] text-white" />
                                    Publish and View
                                </>
                            )}
                    </Button>
                </div>
            </form>
        </section>
    )
}

export default EditProduct;