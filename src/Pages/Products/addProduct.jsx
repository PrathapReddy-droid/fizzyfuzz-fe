import React, { useContext, useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import UploadBox from '../../Components/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IoMdClose } from "react-icons/io";
import { Button } from '@mui/material';
import { FaCloudUploadAlt, FaCalculator } from "react-icons/fa";
import { MyContext } from '../../App';
import { deleteImages, editData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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

const AddProduct = () => {
    const [videoPreview, setVideoPreview] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [bannerPreviews, setBannerPreviews] = useState([]);
    const [fssaiImagePreviews, setFssaiImagePreviews] = useState([]);
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
        product_pincode: "",
        shipment_days: "",
        // FSSAI compliance declaration
        fssaiCompliant: "",
        fssaiLicenseNumber: "",
        fssaiImages: [],
        declarationStatus: "",
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
    const [productCatName, setProductCatName] = React.useState('');
    const [productSubCat, setProductSubCat] = React.useState('');
    const [productFeatured, setProductFeatured] = React.useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [productThirdLavelCat, setProductThirdLavelCat] = useState('');

    const [previews, setPreviews] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState("");

    const [checkedSwitch, setCheckedSwitch] = useState(false);

    // ── Price Calculator state ──
    // costPrice / marginPercent are what the seller types in.
    // calcCategory is chosen independently from the main Product Category —
    // searched from whatever categories exist in the pricings collection.
    // calcRates comes from the backend (commission / shipping / gst / payment gateway %)
    // for the selected calculator category.
    const [calcInputs, setCalcInputs] = useState({ costPrice: '', marginPercent: '' });
    const [calcCategory, setCalcCategory] = useState(null); // { _id, categoryName } | null
    const [pricingCategories, setPricingCategories] = useState([]);
    const [pricingCategoriesLoading, setPricingCategoriesLoading] = useState(false);
    const [calcRates, setCalcRates] = useState(null);
    const [calcRatesLoading, setCalcRatesLoading] = useState(false);
    const [calcResult, setCalcResult] = useState(null);

    // Product is treated as "food" whenever the selected category name mentions it —
    // this is what gates the FSSAI declaration block below.
    const isFoodCategory = productCatName?.toLowerCase().includes('food');

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

        // Auto upload
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

    const setFssaiImagesFun = (data) => {
        let images = [];

        if (Array.isArray(data)) {
            images = data;
        } else if (Array.isArray(data?.images)) {
            images = data.images;
        } else {
            console.warn("setFssaiImagesFun received invalid data:", data);
            return;
        }

        setFssaiImagePreviews(prev => {
            const updated = [...prev, ...images];

            setFormFields(state => ({
                ...state,
                fssaiImages: updated
            }));

            return updated;
        });
    };

    const removeFssaiImg = (image, index) => {
        deleteImages(`/api/category/deteleImage?img=${image}`).then(() => {
            setFssaiImagePreviews(prev => {
                const updated = prev.filter((_, i) => i !== index);

                setFormFields(state => ({
                    ...state,
                    fssaiImages: updated
                }));

                return updated;
            });
        });
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

    // Derived: the full category object currently selected, and its sub category object.
    // Used to build the Sub Category and Third Level Category dropdown options.
    const selectedCatObject = context?.catData?.find(cat => cat?._id === productCat);
    const selectedSubCatObject = selectedCatObject?.children?.find(subCat => subCat?._id === productSubCat);

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

    // Fetch the list of categories that actually have a pricing rule configured,
    // for the calculator's own category search — independent of the main
    // Product Category dropdown above.
    useEffect(() => {
        setPricingCategoriesLoading(true);
        fetchDataFromApi("/api/product/pricingCategories").then(res => {
            if (!res?.error && Array.isArray(res?.data)) {
                setPricingCategories(res.data);
            } else {
                setPricingCategories([]);
            }
            setPricingCategoriesLoading(false);
        }).catch(() => {
            setPricingCategories([]);
            setPricingCategoriesLoading(false);
        });
    }, []);

    // Fetch commission / shipping / GST / payment-gateway rates for the Price
    // Calculator whenever the calculator's own category selection changes.
    // Fetch rates by the pricing rule's own _id — not a product category id
    useEffect(() => {
        if (!calcCategory?._id) {
            setCalcRates(null);
            setCalcResult(null);
            return;
        }

        setCalcRatesLoading(true);
        setCalcResult(null);

        fetchDataFromApi(`/api/product/pricingRates?id=${calcCategory._id}`).then(res => {
            if (!res?.error && res?.data) {
                setCalcRates({
                    commissionPercent: Number(res.data.commissionPercent) || 0,
                    paymentGatewayPercent: Number(res.data.paymentGatewayPercent) || 0,
                    gstPercent: Number(res.data.gstPercent) || 0,
                    shippingFee: Number(res.data.shippingFee) || 0,
                });
            } else {
                setCalcRates(null);
            }
            setCalcRatesLoading(false);
        }).catch(() => {
            setCalcRates(null);
            setCalcRatesLoading(false);
        });
    }, [calcCategory]);

    // Works backward from cost price + desired margin to a suggested selling price,
    // accounting for platform commission, payment gateway fee, GST and shipping —
    // all of which are taken as a % (or flat fee) of the final selling price.
    const calculatePrice = () => {
        if (!calcRates || !calcInputs.costPrice) return;

        const cost = Number(calcInputs.costPrice);
        const margin = Number(calcInputs.marginPercent) || 0;
        const { commissionPercent, paymentGatewayPercent, gstPercent, shippingFee } = calcRates;

        const desiredProfit = cost * (margin / 100);
        const numerator = cost + desiredProfit + shippingFee;
        const totalPercentCut = (commissionPercent + paymentGatewayPercent + gstPercent) / 100;
        const denominator = 1 - totalPercentCut;

        const sellingPrice = denominator > 0 ? numerator / denominator : numerator;

        const commissionAmt = sellingPrice * (commissionPercent / 100);
        const paymentGatewayAmt = sellingPrice * (paymentGatewayPercent / 100);
        const gstAmt = sellingPrice * (gstPercent / 100);
        const netProfit = sellingPrice - cost - commissionAmt - paymentGatewayAmt - gstAmt - shippingFee;

        setCalcResult({
            sellingPrice,
            commissionAmt,
            paymentGatewayAmt,
            gstAmt,
            shippingFee,
            netProfit,
        });
    };

    // Auto-recalculate whenever the rates arrive and the seller has already typed a cost price
    useEffect(() => {
        if (calcRates && calcInputs.costPrice) {
            calculatePrice();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calcRates]);

    const onChangeCalcInput = (e) => {
        const { name, value } = e.target;
        setCalcInputs(prev => ({ ...prev, [name]: value }));
    };

    const applyCalculatedPrice = () => {
        if (!calcResult) return;
        const roundedPrice = Math.round(calcResult.sellingPrice);

        setFormFields(prev => {
            let updated = { ...prev, price: roundedPrice };
            if (prev.oldPrice) {
                const oldPrice = Number(prev.oldPrice);
                const discount = Math.floor(((oldPrice - roundedPrice) / oldPrice) * 100);
                updated.discount = discount > 0 ? discount : 0;
            }
            return updated;
        });

        context?.alertBox("success", "Suggested price applied to Product Price");
    };

    const handleChangeProductCat = (event) => {
        const catId = event.target.value;
        const catObj = context?.catData?.find(cat => cat?._id === catId);
        const catName = catObj?.name || '';

        setProductCat(catId);
        setProductCatName(catName);
        // Reset the downstream selections whenever the category changes,
        // since sub category / third level options depend entirely on it.
        setProductSubCat('');
        setProductThirdLavelCat('');

        setFormFields(prev => ({
            ...prev,
            catId,
            category: catId,
            catName,
            // Clear stale child category data so it never rides along with a new parent
            subCatId: "",
            subCat: "",
            thirdsubCatId: "",
            thirdsubCat: "",
            // Reset FSSAI answers whenever the category changes away from food
            // so a stale answer never gets submitted for a non-food product.
            ...(catName.toLowerCase().includes('food') ? {} : {
                fssaiCompliant: "",
                fssaiLicenseNumber: "",
                declarationStatus: "",
            })
        }));
    };

    const handleChangeProductSubCat = (event) => {
        const subCatId = event.target.value;
        const subCatObj = selectedCatObject?.children?.find(subCat => subCat?._id === subCatId);

        setProductSubCat(subCatId);
        // Reset third level whenever sub category changes, since its options
        // depend entirely on the chosen sub category.
        setProductThirdLavelCat('');

        setFormFields(prev => ({
            ...prev,
            subCatId,
            subCat: subCatObj?.name || "",
            thirdsubCatId: "",
            thirdsubCat: "",
        }));
    };

    const handleChangeProductThirdLavelCat = (event) => {
        const thirdsubCatId = event.target.value;
        const thirdCatObj = selectedSubCatObject?.children?.find(third => third?._id === thirdsubCatId);

        setProductThirdLavelCat(thirdsubCatId);
        setFormFields(prev => ({
            ...prev,
            thirdsubCatId,
            thirdsubCat: thirdCatObj?.name || "",
        }));
    };

    const handleChangeProductFeatured = (event) => {
        setProductFeatured(event.target.value);
        setFormFields(prev => ({ ...prev, isFeatured: event.target.value }));
    };

    // FSSAI declaration handlers
    const handleChangeFssaiCompliant = (event) => {
        setFormFields(prev => ({ ...prev, fssaiCompliant: event.target.value }));
    };

    const handleChangeDeclarationStatus = (event) => {
        setFormFields(prev => ({ ...prev, declarationStatus: event.target.value }));
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
                const discount = Math.floor(((oldPrice - price) / oldPrice) * 100);
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

    const setPreviewsFun = (data) => {
        let images = [];

        if (Array.isArray(data)) {
            images = data;
        } else if (Array.isArray(data?.images)) {
            images = data.images;
        } else {
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
        setFormFields(prev => ({ ...prev, video: [video[0]] }));
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
        if (formFields?.shipment_days === "") {
            context.alertBox("error", "Please enter Expected Shipment Days");
            return false;
        }
        if (formFields?.product_pincode === "") {
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
        if (formFields?.fssaiImages.length === 0) {
            context.alertBox("error", "Please upload your FSSAI license/packaging document");
            return false;
        }

        // FSSAI checks only apply to products under a Food category
        if (isFoodCategory) {
            if (formFields?.fssaiCompliant === "") {
                context.alertBox("error", "Please answer the packaging compliance question");
                return false;
            }
            if (formFields?.fssaiLicenseNumber.trim() === "") {
                context.alertBox("error", "Please enter your FSSAI License Number");
                return false;
            }
            if (formFields?.declarationStatus === "") {
                context.alertBox("error", "Please accept the FSSAI declaration to continue");
                return false;
            }
            if (formFields?.declarationStatus === "Decline") {
                context.alertBox("error", "You must accept the declaration to publish this product");
                return false;
            }
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

    const canPublish = !isFoodCategory || formFields.declarationStatus === "Accept";

    return (
        <section className="bg-white">
            <form className="py-1 p-1 md:p-6 md:py-1" onSubmit={handleSubmitg}>
                <div className="scroll max-h-[74vh] overflow-y-scroll pr-2 -mr-2">

                    <SectionCard title="Basic details" subtitle="Name and describe the product the way customers will see it.">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <h3 className={labelCls}>Product Name</h3>
                                <input type="text" className={inputCls} name="name" value={formFields.name} onChange={onChangeInput} placeholder="e.g. Classic Cotton T-Shirt" />
                            </div>
                            <div>
                                <h3 className={labelCls}>Product Description</h3>
                                <textarea className={`${inputCls} h-[130px] py-3 resize-none`} name="description" value={formFields.description} onChange={onChangeInput} placeholder="What makes this product worth buying?" />
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Category & pricing" subtitle="Where this product lives in the catalog, and what it costs.">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <h3 className={labelCls}>Product Category</h3>
                                {context?.catData?.length !== 0 &&
                                    <Select
                                        size="small"
                                        sx={selectSx}
                                        value={productCat}
                                        displayEmpty
                                        onChange={handleChangeProductCat}
                                    >
                                        <MenuItem value="" disabled>Select category</MenuItem>
                                        {context?.catData?.map((cat, index) => (
                                            <MenuItem value={cat?._id} key={index}>{cat?.name}</MenuItem>
                                        ))}
                                    </Select>
                                }
                            </div>

                            {/* Sub Category — locked until a Category is selected. Options are
                                derived only from the selected category's children, so a
                                mismatched sub category can never be chosen. */}
                            <div>
                                <h3 className={labelCls}>Sub Category</h3>
                                {context?.catData?.length !== 0 &&
                                    <Select
                                        size="small"
                                        sx={selectSx}
                                        value={productSubCat}
                                        displayEmpty
                                        disabled={!productCat}
                                        onChange={handleChangeProductSubCat}
                                    >
                                        <MenuItem value="" disabled>
                                            {productCat ? "Select sub category" : "Select a category first"}
                                        </MenuItem>
                                        {selectedCatObject?.children?.map((subCat, i2) => (
                                            <MenuItem value={subCat?._id} key={i2}>
                                                {subCat?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                }
                            </div>

                            {/* Third Level Category — locked until a Sub Category is selected.
                                Options are derived only from the selected sub category's children. */}
                            <div>
                                <h3 className={labelCls}>Third Level Category</h3>
                                {context?.catData?.length !== 0 &&
                                    <Select
                                        size="small"
                                        sx={selectSx}
                                        value={productThirdLavelCat}
                                        displayEmpty
                                        disabled={!productSubCat}
                                        onChange={handleChangeProductThirdLavelCat}
                                    >
                                        <MenuItem value="" disabled>
                                            {productSubCat ? "Select third level" : "Select a sub category first"}
                                        </MenuItem>
                                        {selectedSubCatObject?.children?.map((thirdLavelCat, i3) => (
                                            <MenuItem value={thirdLavelCat?._id} key={i3}>
                                                {thirdLavelCat?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                }
                            </div>

                            <div>
                                <h3 className={labelCls}>Product MRP</h3>
                                <input type="number" className={inputCls} name="oldPrice" value={formFields.oldPrice} onChange={onChangeInput} placeholder="0.00" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Product Price</h3>
                                <input type="number" className={inputCls} name="price" value={formFields.price} onChange={onChangeInput} placeholder="0.00" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Product Discount</h3>
                                <input type="number" className={`${inputCls} bg-gray-50 text-gray-500`} name="discount" value={formFields.discount} disabled onChange={onChangeInput} />
                            </div>

                            {context.userData.role === "ADMIN" && (
                                <div>
                                    <h3 className={labelCls}>Is Featured?</h3>
                                    <Select
                                        size="small"
                                        sx={selectSx}
                                        value={productFeatured}
                                        onChange={handleChangeProductFeatured}
                                    >
                                        <MenuItem value={true}>True</MenuItem>
                                        <MenuItem value={false}>False</MenuItem>
                                    </Select>
                                </div>
                            )}

                            <div>
                                <h3 className={labelCls}>Product Stock</h3>
                                <input type="number" className={inputCls} name="countInStock" value={formFields.countInStock} onChange={onChangeInput} placeholder="0" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Product Model</h3>
                                <input type="text" className={inputCls} name="brand" value={formFields.brand} onChange={onChangeInput} placeholder="Model / brand" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Expected Shipment Days</h3>
                                <input type="number" className={inputCls} value={formFields.shipment_days} name="shipment_days" onChange={onChangeInput} placeholder="e.g. 3" />
                            </div>

                            <div>
                                <h3 className={labelCls}>Product PIN Code</h3>
                                <input type="number" className={inputCls} value={formFields.product_pincode} name="product_pincode" onChange={onChangeInput} placeholder="e.g. 682001" />
                            </div>

                            {context.userData.role === "ADMIN" && (
                                <div>
                                    <h3 className={labelCls}>Product Rating</h3>
                                    <Rating name="half-rating" defaultValue={0} onChange={onChangeRating} />
                                </div>
                            )}
                        </div>

                        {/* ── Price Calculator ──
    Independent category picker (searchable) sourced from the pricings
    collection. Helps the seller work out a selling price from cost price
    + desired margin, factoring in commission, payment gateway fee, GST
    and shipping for whichever category they pick here. */}
                        <div className="mt-5 border border-indigo-100 bg-indigo-50/40 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                <h4 className="text-[13.5px] font-bold text-indigo-900 flex items-center gap-2">
                                    <FaCalculator className="text-indigo-500" /> Price Calculator
                                </h4>
                                {!calcCategory && (
                                    <span className="text-[11.5px] text-indigo-500">Search and select a category to load rates</span>
                                )}
                                {calcCategory && calcRatesLoading && (
                                    <span className="text-[11.5px] text-indigo-500 flex items-center gap-1">
                                        <CircularProgress size={12} /> Loading rates…
                                    </span>
                                )}
                                {calcCategory && !calcRatesLoading && !calcRates && (
                                    <span className="text-[11.5px] text-red-500">Couldn't load rates for this category</span>
                                )}
                            </div>

                            <div className="mb-3">
                                <h3 className={labelCls}>Calculator Category</h3>
                                <Autocomplete
                                    size="small"
                                    options={pricingCategories}
                                    loading={pricingCategoriesLoading}
                                    value={calcCategory}
                                    getOptionLabel={(option) => option?.categoryName || ""}
                                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                    onChange={(event, newValue) => setCalcCategory(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Search category…"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fff',
                                                    fontSize: '13.5px',
                                                },
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {pricingCategoriesLoading ? <CircularProgress size={14} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    noOptionsText={pricingCategoriesLoading ? "Loading…" : "No priced categories found"}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                <div>
                                    <h3 className={labelCls}>Cost Price (₹)</h3>
                                    <input
                                        type="number"
                                        className={inputCls}
                                        name="costPrice"
                                        value={calcInputs.costPrice}
                                        onChange={onChangeCalcInput}
                                        placeholder="e.g. 500"
                                    />
                                </div>
                                <div>
                                    <h3 className={labelCls}>Desired Margin (%)</h3>
                                    <input
                                        type="number"
                                        className={inputCls}
                                        name="marginPercent"
                                        value={calcInputs.marginPercent}
                                        onChange={onChangeCalcInput}
                                        placeholder="e.g. 20"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        fullWidth
                                        disabled={!calcRates || !calcInputs.costPrice}
                                        onClick={calculatePrice}
                                        sx={{
                                            height: '42px',
                                            textTransform: 'none',
                                            fontSize: '13.5px',
                                            fontWeight: 600,
                                            borderRadius: '8px',
                                            backgroundColor: '#4f46e5',
                                            '&:hover': { backgroundColor: '#4338ca' },
                                        }}
                                    >
                                        Calculate
                                    </Button>
                                </div>
                            </div>

                            {calcResult && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[12.5px] text-gray-500">
                                            Suggested Selling Price {calcCategory ? `· ${calcCategory.categoryName}` : ''}
                                        </span>
                                        <span className="text-[17px] font-bold text-indigo-700">₹{calcResult.sellingPrice.toFixed(2)}</span>
                                    </div>

                                    <div className="border-t border-dashed border-gray-200 my-2" />

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[12px] text-gray-500">
                                            <span>Platform Commission ({calcRates.commissionPercent}%)</span>
                                            <span>- ₹{calcResult.commissionAmt.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[12px] text-gray-500">
                                            <span>Payment Gateway Fee ({calcRates.paymentGatewayPercent}%)</span>
                                            <span>- ₹{calcResult.paymentGatewayAmt.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[12px] text-gray-500">
                                            <span>GST ({calcRates.gstPercent}%)</span>
                                            <span>- ₹{calcResult.gstAmt.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[12px] text-gray-500">
                                            <span>Shipping Fee</span>
                                            <span>- ₹{calcResult.shippingFee.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                                        <span className="text-[13px] font-semibold text-gray-700">Net Profit</span>
                                        <span className={`text-[14px] font-bold ${calcResult.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ₹{calcResult.netProfit.toFixed(2)}
                                        </span>
                                    </div>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        disableElevation
                                        onClick={applyCalculatedPrice}
                                        sx={{
                                            mt: 2,
                                            textTransform: 'none',
                                            fontSize: '12.5px',
                                            fontWeight: 600,
                                            borderRadius: '8px',
                                            borderColor: '#c7d2fe',
                                            color: '#4f46e5',
                                            '&:hover': { borderColor: '#818cf8', backgroundColor: '#eef2ff' },
                                        }}
                                    >
                                        Use this price
                                    </Button>
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
                                        value=""
                                        displayEmpty
                                        onChange={e =>
                                            setVariantInput(prev => ({ ...prev, [type]: e.target.value }))
                                        }
                                    >
                                        <MenuItem value="" disabled>Choose existing</MenuItem>
                                        {variantOptions[type]?.map((opt, i) => (
                                            <MenuItem key={i} value={opt}>
                                                {opt}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <div className="flex gap-2 mt-1">
                                        <input
                                            type="text"
                                            className={`${inputCls} h-[36px]`}
                                            placeholder={`Add custom ${type}`}
                                            value={variantInput[type]}
                                            onChange={e =>
                                                setVariantInput(prev => ({ ...prev, [type]: e.target.value }))
                                            }
                                        />
                                        <Button variant="contained" size="small" disableElevation onClick={() => addVariant(type)}>
                                            Add
                                        </Button>
                                    </div>

                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {formFields.variants[type].map((item, i) => (
                                            <span
                                                key={i}
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

                                    <UploadBox
                                        multiple={true}
                                        name="images"
                                        url="/api/product/uploadImages"
                                        setPreviewsFun={setPreviewsFun}
                                    />
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
                                <UploadBox
                                    multiple
                                    name="bannerimages"
                                    url="/api/product/uploadBannerImages"
                                    setPreviewsFun={setBannerImagesFun}
                                />
                            )}
                        </div>

                        <h3 className={labelCls}>Banner Title</h3>
                        <input type="text" className={inputCls} name="bannerTitleName" value={formFields.bannerTitleName} onChange={onChangeInput} placeholder="Optional headline for the home banner" />
                    </SectionCard>

                    {/* FSSAI Compliance Declaration — only relevant for products under a Food category */}
                    {isFoodCategory && (
                        <SectionCard
                            title="FSSAI compliance declaration"
                            subtitle="Confirm your product packaging and license details before publishing."
                            tag="Required for food products"
                            className={
                                formFields.declarationStatus === "Accept"
                                    ? "!border-green-200"
                                    : formFields.declarationStatus === "Decline"
                                        ? "!border-red-200"
                                        : ""
                            }
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex flex-col">
                                    <h4 className="text-[13.5px] font-semibold text-gray-800 leading-snug min-h-[42px] flex items-start">
                                        Do all your products have Manufacturer/Importer Details, Veg/Non-Veg mark, and MRP mentioned on the primary packaging? <span className="text-red-600 ml-1">*</span>
                                    </h4>
                                    <Select
                                        size="small"
                                        sx={{ ...selectSx, mt: 1 }}
                                        displayEmpty
                                        value={formFields.fssaiCompliant}
                                        onChange={handleChangeFssaiCompliant}
                                    >
                                        <MenuItem value="" disabled>Select an option</MenuItem>
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </Select>
                                </div>

                                <div className="flex flex-col">
                                    <h4 className="text-[13.5px] font-semibold text-gray-800 leading-snug min-h-[42px] flex items-start">
                                        FSSAI License Number <span className="text-red-600 ml-1">*</span>
                                    </h4>
                                    <input
                                        type="text"
                                        name="fssaiLicenseNumber"
                                        value={formFields.fssaiLicenseNumber}
                                        onChange={onChangeInput}
                                        placeholder="e.g. 12345678901234"
                                        className={`${inputCls} mt-1`}
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-[13.5px] font-semibold text-gray-800 mb-2">
                                    Upload FSSAI License / Packaging Document <span className="text-red-600 ml-1">*</span>
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {fssaiImagePreviews?.length !== 0 && fssaiImagePreviews?.map((image, index) => (
                                        <div className="relative" key={index}>
                                            <span
                                                className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-600 -top-[6px] -right-[6px] flex items-center justify-center z-50 cursor-pointer shadow-sm"
                                                onClick={() => removeFssaiImg(image, index)}
                                            >
                                                <IoMdClose className="text-white text-[14px]" />
                                            </span>
                                            <div className="rounded-lg overflow-hidden border border-gray-200 h-[120px] w-full bg-gray-50 flex items-center justify-center">
                                                <img src={image} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    ))}

                                    <UploadBox
                                        multiple={false}
                                        name="fssaiImages"
                                        url="/api/product/uploadFssaiImages"
                                        setPreviewsFun={setFssaiImagesFun}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6">
                                <p className="text-[12.5px] leading-relaxed text-gray-600">
                                    I acknowledge that I have read, and do hereby affirm my commitment to ensuring the ongoing accuracy, validity, and lawful authorization of the representation, warranty, covenant, and undertaking throughout my advertisement, distribution, marketing, supply, or sale of the food products on the Flipkart website. I acknowledge to be fully compliant with all applicable laws, including the Food Safety and Standards Act, 2006, Food Safety and Standards (Licensing and Registration of Food Business) Regulations, 2011, and Food Safety and Standards (Labelling &amp; Display) Regulations, 2020, as amended from time to time. Furthermore, I undertake to promptly address and resolve any complaints concerning product efficacy, quality, or other related matters.
                                </p>
                            </div>

                            <div className="md:w-1/3">
                                <h4 className="text-[13.5px] font-semibold mb-2 text-gray-800">
                                    Accept Declaration <span className="text-red-600">*</span>
                                </h4>
                                <Select
                                    size="small"
                                    sx={selectSx}
                                    displayEmpty
                                    value={formFields.declarationStatus}
                                    onChange={handleChangeDeclarationStatus}
                                >
                                    <MenuItem value="" disabled>Select</MenuItem>
                                    <MenuItem value="Accept">Accept</MenuItem>
                                    <MenuItem value="Decline">Decline</MenuItem>
                                </Select>

                                {formFields.declarationStatus === "Decline" && (
                                    <p className="text-[12px] text-red-600 mt-2">
                                        You must accept the declaration to publish this product.
                                    </p>
                                )}
                            </div>
                        </SectionCard>
                    )}

                </div>

                <div className="border-t border-gray-200 pt-5 mt-2">
                    {canPublish ? (
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
                            {isLoading === true ? <CircularProgress size={22} color="inherit" />
                                : (
                                    <>
                                        <FaCloudUploadAlt className="text-[20px] text-white" />
                                        Publish and View
                                    </>
                                )}
                        </Button>
                    ) : (
                        <div className="w-full text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg py-3 text-[13px] text-gray-500">
                            Accept the FSSAI declaration above to enable publishing
                        </div>
                    )}
                </div>
            </form>
        </section>
    )
}

export default AddProduct;