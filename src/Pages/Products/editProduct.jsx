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



const EditProduct = () => {
  
    const [videoPreviews, setVideoPreviews] = useState("");
    const [videoPreview, setVideoPreview] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [videoSuccess,setVideoSuccess] = useState(false);
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
        isDisplayOnHomeBanner:false,
        shipment_days : '' ,
        product_pincode : '' ,
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
    useEffect(()=>{
      console.log("context",context)
    },[context])
    const [variantInput, setVariantInput] = useState({
        color: [],
        ram: [],
        weight: [],
        size: [],
        length: [] ,
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
                price:Number(res?.product?.price || 0) ,
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
                isDisplayOnHomeBanner:res?.product?.isDisplayOnHomeBanner,
                shipment_days : res?.product?.shipment_days,
                product_pincode : res?.product?.product_pincode,
                video_url : res?.product?.video_url,
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



    const handleChangeSwitch=(event)=>{
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
<section className="p-5 bg-gray-50">
  <form className="form p-1 md:p-8" onSubmit={handleSubmitg}>
    <div className="max-h-[72vh] overflow-y-auto pr-4">

      {/* Product Name */}
      <div className="grid grid-cols-1 mb-4">
        <div>
          <h3 className="text-[14px] font-[500] mb-1">Product Name</h3>
          <input
            type="text"
            name="name"
            value={formFields.name}
            onChange={onChangeInput}
            className="w-full h-[40px] border rounded-sm p-3 text-sm"
          />
        </div>
      </div>

      {/* Product Description */}
      <div className="grid grid-cols-1 mb-6">
        <div>
          <h3 className="text-[14px] font-[500] mb-1">Product Description</h3>
          <textarea
            name="description"
            value={formFields.description}
            onChange={onChangeInput}
            className="w-full h-[140px] border rounded-sm p-3 text-sm"
          />
        </div>
      </div>

      {/* Product Meta Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">

        {/* Category */}
        <div>
          <h3 className="text-[14px] font-[500] mb-1">Product Category</h3>
          <Select size="small" className="w-full" value={productCat} onChange={handleChangeProductCat}>
            {context?.catData?.map(cat => (
              <MenuItem key={cat._id} value={cat._id} onClick={() => selectCatByName(cat.name)}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Sub Category */}
        <div>
          <h3 className="text-[14px] font-[500] mb-1">Product Sub Category</h3>
          <Select size="small" className="w-full" value={productSubCat} onChange={handleChangeProductSubCat}>
            {context?.catData?.flatMap(cat =>
              cat.children?.map(sub => (
                <MenuItem key={sub._id} value={sub._id} onClick={() => selectSubCatByName(sub.name)}>
                  {sub.name}
                </MenuItem>
              ))
            )}
          </Select>
        </div>

        {/* Third Level */}
        <div>
          <h3 className="text-[14px] font-[500] mb-1">Third Level Category</h3>
          <Select size="small" className="w-full" value={productThirdLavelCat} onChange={handleChangeProductThirdLavelCat}>
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
          <h3 className="text-[14px] font-[500] mb-1">Product MRP</h3>
          <input type="number" name="oldPrice" value={formFields.oldPrice} onChange={onChangeInput} className="input" />
        </div>

        <div>
          <h3 className="text-[14px] font-[500] mb-1">Price</h3>
          <input type="number" name="price" value={formFields.price} onChange={onChangeInput} className="input" />
        </div>

        {context.userData.role=="ADMIN"&&<div>
          <h3 className="text-[14px] font-[500] mb-1">Is Featured?</h3>
          <Select size="small" className="w-full" value={productFeatured} onChange={handleChangeProductFeatured}>
            <MenuItem  value={true}>True</MenuItem>
            <MenuItem value={false}>False</MenuItem>
          </Select>
        </div>}

        <div>
          <h3 className="text-[14px] font-[500] mb-1">Stock</h3>
          <input type="number" name="countInStock" value={formFields.countInStock} onChange={onChangeInput} className="input" />
        </div>

        <div>
          <h3 className="text-[14px] font-[500] mb-1">Product Model</h3>
          <input type="text" name="brand" value={formFields.brand} onChange={onChangeInput} className="input" />
        </div>

        <div>
          <h3 className="text-[14px] font-[500] mb-1">Discount</h3>
          <input type="number" disabled value={formFields.discount} className="input bg-gray-100" />
        </div>

        <div>
          <h3 className="text-[14px] font-[500] mb-1">Expected Shipment Days</h3>
          <input type="number" name="shipmentDays" value={formFields.shipment_days} onChange={onChangeInput} className="input" />
        </div>

        <div>
          <h3 className="text-[14px] font-[500] mb-1">Product PIN Code</h3>
          <input type="number" name="product_pincode" value={formFields.product_pincode} onChange={onChangeInput} className="input" />
        </div>
      </div>

      {/* Rating */}
      {context.userData.role==="ADMIN"&&<div className="grid grid-cols-1 md:grid-cols-4 mb-6">
        <div>
          <h3 className="text-[14px] font-[500] mb-1">Product Rating</h3>
          <Rating value={formFields.rating} onChange={onChangeRating} />
        </div>
      </div>}

      {/* Variants */}
      <h3 className="text-[18px] font-[700] mb-3">Product Variants</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {["color", "ram", "weight", "size", "length","width"].map(type => (
          <div key={type}>
            <h3 className="text-[14px] font-[500] mb-1 uppercase">{type}</h3>

            <Select size="small" className="w-full" value={variantInput?.[type] || ""} onChange={e =>
              setVariantInput(prev => ({ ...prev, [type]: e.target.value }))
            }>
              {(variantOptions?.[type] || []).map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>

            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 h-[36px] border rounded px-2 text-sm"
                value={variantInput?.[type] || ""}
                onChange={e => setVariantInput(prev => ({ ...prev, [type]: e.target.value }))}
              />
              <Button size="small" variant="contained" onClick={() => addVariant(type)}>Add</Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {(formFields?.variants?.[type] || []).map(item => (
                <span key={item} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                  {item}
                  <IoMdClose className="cursor-pointer" onClick={() => removeVariant(type, item)} />
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


                                <UploadBox multiple={true} name="images" url="/api/product/uploadImages" setPreviewsFun={setPreviewsFun} />
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


                                <UploadBox multiple={true} name="bannerimages" url="/api/product/uploadBannerImages" setPreviewsFun={setBannerImagesFun} />
                            </div>


                            <br />

                            <h3 className="font-[700] text-[18px] mb-3">Banner Title</h3>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="bannerTitleName" value={formFields.bannerTitleName} onChange={onChangeInput} />
                        </div>



                    </div>
    </div>

    <Button type="submit" className="btn-blue w-full mt-4 flex justify-center gap-2">
      {isLoading ? <CircularProgress size={20} /> : <>
        <FaCloudUploadAlt className="text-[22px]" />
        Publish and View
      </>}
    </Button>
  </form>
</section>

    )
}

export default EditProduct;
