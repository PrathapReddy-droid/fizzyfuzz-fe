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


const AddProduct = () => {
    const [videoPreview, setVideoPreview] = useState(null);
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
        rating: 0,
        isFeatured: false,
        discount: 0,
        bannerTitleName: "",
        bannerimages: [],
        isDisplayOnHomeBanner: false,
        product_pincode : "",
        shipment_days : "",
        variants: {
            color: [],
            ram: [],
            weight: [],
            size: [],
            length: [],
            width: [],
        }
    });



    const [productCat, setProductCat] = React.useState('');
    const [productSubCat, setProductSubCat] = React.useState('');
    const [productFeatured, setProductFeatured] = React.useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [productThirdLavelCat, setProductThirdLavelCat] = useState('');

    const [previews, setPreviews] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState("");
    const [bannerPreviews, setBannerPreviews] = useState([]);

    const [checkedSwitch, setCheckedSwitch] = useState(false);
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
        width: []
    });

    const [variantInput, setVariantInput] = useState({
        color: "",
        ram: "",
        weight: "",
        size: "",
        length: "",
        width: ""
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


    const history = useNavigate();

    const context = useContext(MyContext);


    useEffect(() => {

        fetchDataFromApi("/api/product/productRAMS/get").then(res => {
            if (!res?.error) {
                setVariantOptions(prev => ({
                    ...prev,
                    ram: res.data.map(i => i.name)
                }));
            }
        });

        fetchDataFromApi("/api/product/productWeight/get").then(res => {
            if (!res?.error) {
                setVariantOptions(prev => ({
                    ...prev,
                    weight: res.data.map(i => i.name)
                }));
            }
        });

        fetchDataFromApi("/api/product/productSize/get").then(res => {
            if (!res?.error) {
                setVariantOptions(prev => ({
                    ...prev,
                    size: res.data.map(i => i.name)
                }));
            }
        });
    }, []);



    const handleChangeProductCat = (event) => {
        setProductCat(event.target.value);
        setProductSubCat('')
        setProductThirdLavelCat('');
        formFields.catId = event.target.value
        formFields.category = event.target.value

    };

    const selectCatByName = (name) => {
        formFields.catName = name
    }

    const handleChangeProductSubCat = (event) => {
        setProductSubCat(event.target.value);
        setProductThirdLavelCat('');
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
            if(name === "price" && prev.oldPrice){
                const price = Number(value);
                const oldPrice = Number(prev.oldPrice);
                const discount = Math.floor(((oldPrice - price) / oldPrice)*100);
                updatedFields.discount = discount > 0 ? discount : 0 ;
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


const setPreviewsFun = (data) => {
    let images = [];

    // Case 1: UploadBox passed array directly
    if (Array.isArray(data)) {
        images = data;
    }
    // Case 2: UploadBox passed API response
    else if (Array.isArray(data?.images)) {
        images = data.images;
    }
    // Case 3: nothing passed
    else {
        console.warn("setPreviewsFun received invalid data:", data);
        return;
    }

    setPreviews(prev => {
        const updated = [...prev, ...images];

        setFormFields(state => ({
            ...state,
            images: updated
        }));

        return updated;
    });
};



    const setVideoPreviewsFun = (video) => {
        setVideoPreviews([video[0]])
        formFields.video = [video[0]]
    }

const setBannerImagesFun = (data) => {
    let images = [];

    if (Array.isArray(data)) {
        images = data;
    } else if (Array.isArray(data?.images)) {
        images = data.images;
    } else {
        console.warn("setBannerImagesFun received invalid data:", data);
        return;
    }

    setBannerPreviews(prev => {
        const updated = [...prev, ...images];

        setFormFields(state => ({
            ...state,
            bannerimages: updated
        }));

        return updated;
    });
};





const removeImg = (image, index) => {
    deleteImages(`/api/category/deteleImage?img=${image}`).then(() => {
        setPreviews(prev => {
            const updated = prev.filter((_, i) => i !== index);

            setFormFields(state => ({
                ...state,
                images: updated
            }));

            return updated;
        });
    });
};


const removeBannerImg = (image, index) => {
    deleteImages(`/api/category/deteleImage?img=${image}`).then(() => {
        setBannerPreviews(prev => {
            const updated = prev.filter((_, i) => i !== index);

            setFormFields(state => ({
                ...state,
                bannerimages: updated
            }));

            return updated;
        });
    });
};



const handleChangeSwitch = (event) => {
    const checked = event.target.checked;
    setCheckedSwitch(checked);

    setFormFields(prev => ({
        ...prev,
        isDisplayOnHomeBanner: checked
    }));
};

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
        if (formFields?.shipment_days === ""){
            context.alertBox("error", "Please enter Expected Shipment Days");
            return false;
        }
        if (formFields?.product_pincode === ""){
            context.alertBox("error", "Please enter Product PIN code");
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
        formFields.seller = context?.userData._id
        formFields.seller_name = context?.userData.name

        if (previews?.length === 0) {
            context.alertBox("error", "Please select product images");
            return false;
        }
        setIsLoading(true);

        postData("/api/product/create", formFields).then((res) => {

            if (res?.error === false) {
                context.alertBox("success", res?.message);
                setTimeout(() => {
                    setIsLoading(false);
                    context.setIsOpenFullScreenPanel({
                        open: false,
                    })
                    history("/products");
                }, 1000);
            } else {
                setIsLoading(false);
                context.alertBox("error", res?.message);
            }
        })
    }

    return (
        <section className='p-5 bg-gray-50'>
            <form className='form py-1 p-1 md:p-8 md:py-1' onSubmit={handleSubmitg}>
                <div className='scroll max-h-[72vh] overflow-y-scroll pr-4'>

                    <div className='grid grid-cols-1 mb-3'>
                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Name</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="name" value={formFields.name} onChange={onChangeInput} />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 mb-3'>
                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Description</h3>
                            <textarea type="text" className='w-full h-[140px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="description" value={formFields.description} onChange={onChangeInput} />
                        </div>
                    </div>



                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4'>
                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Category</h3>

                            {
                                context?.catData?.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="productCatDrop"
                                    size="small"
                                    className='w-full'
                                    value={productCat}
                                    label="Category"
                                    onChange={handleChangeProductCat}
                                >
                                    {
                                        context?.catData?.map((cat, index) => {
                                            return (
                                                <MenuItem value={cat?._id} key={index}
                                                    onClick={() => selectCatByName(cat?.name)}>{cat?.name}</MenuItem>
                                            )
                                        })
                                    }

                                </Select>
                            }


                        </div>

                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Sub Category</h3>

                            {
                                context?.catData?.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="productCatDrop"
                                    size="small"
                                    className='w-full'
                                    value={productSubCat}
                                    label="Sub Category"
                                    onChange={handleChangeProductSubCat}
                                >
                                    {
                                        context?.catData?.map((cat, index) => {
                                            return (
                                                cat?.children?.length !== 0 && cat?.children?.map((subCat, index) => {
                                                    if (productCat == subCat.parentId) {
                                                        return (
                                                            <MenuItem value={subCat?._id} key={index}
                                                                onClick={() => selectSubCatByName(subCat?.name)}
                                                            >
                                                                {subCat?.name}
                                                            </MenuItem>
                                                        )
                                                    }
                                                })

                                            )
                                        })
                                    }

                                </Select>
                            }



                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Third Lavel Category</h3>

                            {
                                context?.catData?.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="productCatDrop"
                                    size="small"
                                    className='w-full'
                                    value={productThirdLavelCat}
                                    label="Sub Category"
                                    onChange={handleChangeProductThirdLavelCat}
                                >
                                    {
                                        context?.catData?.map((cat) => {
                                            return (
                                                cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                                                    return (
                                                        subCat?.children?.length !== 0 && subCat?.children?.map((thirdLavelCat, index) => {
                                                            if (productSubCat == thirdLavelCat?.parentId) {
                                                                return <MenuItem value={thirdLavelCat?._id} key={index}
                                                                    onClick={() => selectSubCatByThirdLavel(thirdLavelCat?.name)}>{thirdLavelCat?.name}</MenuItem>
                                                            }
                                                        })

                                                    )
                                                })

                                            )
                                        })
                                    }

                                </Select>
                            }



                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product MRP</h3>
                            <input type="number" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="oldPrice" value={formFields.oldPrice} onChange={onChangeInput} />
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1  text-black'>Product Price</h3>
                            <input type="number" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="price" value={formFields.price} onChange={onChangeInput} />
                        </div>

                        {context.userData.role === "ADMIN" && <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Is Featured?</h3>
                            <Select
                                labelId="demo-simple-select-label"
                                id="productCatDrop"
                                size="small"
                                className='w-full'
                                value={productFeatured}
                                label="Category"
                                onChange={handleChangeProductFeatured}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        </div>}


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Stock</h3>
                            <input type="number" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="countInStock" value={formFields.countInStock} onChange={onChangeInput} />
                        </div>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Model</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="brand" value={formFields.brand} onChange={onChangeInput} />
                        </div>
                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1 text-black'>Product Discount</h3>
                            <input type="number" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm ' name="discount" value={formFields.discount} disabled onChange={onChangeInput} />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-[500] mb-1">Expected Shipment Days</h3>
                            <input type="number" value={formFields.shipment_days} name='shipment_days' onChange={onChangeInput} className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm" />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-[500] mb-1">Product PIN Code</h3>
                            <input type="number" value={formFields.product_pincode} name='product_pincode' onChange={onChangeInput} className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm" />
                        </div>
                    </div>




                    {context.userData.role === "ADMIN" && <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4'>


                        <div className='col'>
                            <h3 className='text-[14px] font-[500] mb-1  text-black'>Product Rating </h3>
                            <Rating name="half-rating" defaultValue={0} onChange={onChangeRating} />
                        </div>


                    </div>}

                    <h3 className="font-[700] text-[18px] mt-5 mb-3">Product Variants</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {["color", "ram", "weight", "size", "length", "width"].map(type => (
                            <div key={type}>
                                <h3 className="text-[14px] font-[500] mb-1 upped">{type}</h3>

                                <Select
                                    size="small"
                                    className="w-full"
                                    value=""
                                    onChange={e =>
                                        setVariantInput(prev => ({ ...prev, [type]: e.target.value }))
                                    }
                                >
                                    {variantOptions[type]?.map((opt, i) => (
                                        <MenuItem key={i} value={opt}>
                                            {opt}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        className="w-full h-[36px] border border-gray-300 rounded px-2 text-sm"
                                        placeholder={`Add custom ${type}`}
                                        value={variantInput[type]}
                                        onChange={e =>
                                            setVariantInput(prev => ({ ...prev, [type]: e.target.value }))
                                        }
                                    />
                                    <Button variant="contained" size="small" onClick={() => addVariant(type)}>
                                        Add
                                    </Button>
                                </div>

                                <div className="flex gap-2 flex-wrap mt-2">
                                    {formFields.variants[type].map((item, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1"
                                        >
                                            {item}
                                            <IoMdClose
                                                className="cursor-pointer"
                                                onClick={() => removeVariant(type, item)}
                                            />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>



                    <div className='col w-full p-5 px-0'>
                        <h3 className="font-[700] text-[18px] mb-3">Media & Images</h3>

                        <div className="grid gap-2 grid-row">
                            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                                {
                                    previews?.length !== 0 && previews?.map((image, index) => {
                                        return (
                                            <div className="uploadBoxWrapper relative" key={index}>

                                                <span className='absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer' onClick={() => removeImg(image, index)}><IoMdClose className='text-white text-[17px]' /></span>


                                                <div className='uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>

                                                    <img src={image} className='w-100' />
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                                <UploadBox
                                    multiple={true}
                                    name="images"
                                    url="/api/product/uploadImages"
                                    setPreviewsFun={setPreviewsFun}
                                    />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">

                                {/* Video Preview */}
                                {videoPreview && (
                                    <div className="relative">
                                        <span
                                            className="absolute w-[20px] h-[20px] rounded-full bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                                            onClick={() => {
                                                setVideoPreview(null);
                                                setVideoFile(null);
                                            }}
                                        >
                                            <IoMdClose className="text-white text-[17px]" />
                                        </span>

                                        <div className="h-[150px] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Upload Box */}
                                {!videoPreview && (
                                    <label className="h-[150px] border border-dashed rounded-md bg-gray-100 hover:bg-gray-200 flex flex-col items-center justify-center cursor-pointer">
                                        <span className="text-sm text-gray-600">Upload Video</span>
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

                    <div className='col w-full p-5 px-0'>

                        <div className='bg-gray-100 p-4 w-full'>
                            <div className="flex items-center gap-8">
                                <h3 className="font-[700] text-[18px] mb-3">Banner Images</h3>
                                <Switch {...label} onChange={handleChangeSwitch} checked={checkedSwitch} />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">

                                {
                                    bannerPreviews?.length !== 0 && bannerPreviews?.map((image, index) => {
                                        return (
                                            <div className="uploadBoxWrapper relative" key={index}>

                                                <span className='absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer' onClick={() => removeBannerImg(image, index)}><IoMdClose className='text-white text-[17px]' /></span>


                                                <div className='uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>

                                                    <img src={image} className='w-100' />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                {checkedSwitch && (
                                    <UploadBox
                                        multiple
                                        name="bannerimages"
                                        url="/api/product/uploadBannerImages"
                                        setPreviewsFun={setBannerImagesFun}
                                    />
                                    )}


                                {/* <UploadBox multiple={true} name="bannerimages" url="/api/product/uploadBannerImages" setPreviewsFun={setBannerImagesFun} /> */}
                            </div>


                            <br />

                            <h3 className="font-[700] text-[18px] mb-3">Banner Title</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="bannerTitleName" value={formFields.bannerTitleName} onChange={onChangeInput} />
                        </div>



                    </div>

                </div>



                <hr />
                <br />
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

            </form>
        </section>
    )
}

export default AddProduct;