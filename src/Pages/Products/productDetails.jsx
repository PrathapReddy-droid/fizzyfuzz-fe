import React, { useEffect, useRef, useState } from 'react';
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
import { MdBrandingWatermark, MdFilterVintage } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { BsBoxSeam, BsArrowLeft } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";
import Rating from '@mui/material/Rating';

const ProductDetails = () => {

    const [slideIndex, setSlideIndex] = useState(0);
    const [product, setProduct] = useState();
    const [reviewsData, setReviewsData] = useState([]);
    const zoomSliderBig = useRef();

    const { id } = useParams();
    const navigate = useNavigate();

    const goBack = () => {
        navigate("/products");
    };

    useEffect(() => {
        fetchDataFromApi(`/api/user/getReviews?productId=${id}`).then((res) => {
            if (res?.error === false) {
                setReviewsData(res.reviews);
            }
        });
    }, []);

    useEffect(() => {
        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            if (res?.error === false) {
                setTimeout(() => {
                    setProduct(res?.product);
                }, 500);
            }
        });
    }, []);

    // Thumbnail click -> move main swiper to that slide
    const goto = (index) => {
        setSlideIndex(index);
        zoomSliderBig.current?.swiper?.slideTo(index);
    };

    // Manual swipe on main image -> keep thumbnails in sync
    const handleMainSlideChange = (swiper) => {
        setSlideIndex(swiper.activeIndex);
    };

    const MetaItem = ({ icon, label, value }) => (
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
            <span className="text-gray-400 text-[16px] shrink-0">{icon}</span>
            <div className="min-w-0">
                <p className="text-[11px] text-gray-400 leading-none mb-1">{label}</p>
                <p className="text-[13.5px] font-semibold text-gray-800 truncate leading-none">{value ?? "—"}</p>
            </div>
        </div>
    );

    const VariantBlock = ({ title, items }) => (
        items?.length > 0 && (
            <div>
                <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
                <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                        <span
                            key={i}
                            className="px-3.5 py-1.5 border border-gray-200 rounded-full text-[13px] text-gray-700 cursor-pointer bg-white hover:bg-black hover:text-white hover:border-black transition-colors"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        )
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back button */}
            <button
                onClick={goBack}
                className="flex items-center gap-2 mb-5 text-[13.5px] font-medium text-gray-500 hover:text-black transition-colors"
            >
                <BsArrowLeft className="text-[15px]" />
                Back to Products
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT — Image gallery */}
                <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-5">
                    <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                        <Swiper
                            ref={zoomSliderBig}
                            modules={[Navigation]}
                            navigation
                            slidesPerView={1}
                            onSlideChange={handleMainSlideChange}
                            className="rounded-xl overflow-hidden product-zoom-swiper"
                        >
                            {product?.images?.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <InnerImageZoom src={img} zoomType="hover" className="w-full" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                        {product?.images?.map((img, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goto(i)}
                                className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                                    ${slideIndex === i
                                        ? "border-indigo-500 ring-2 ring-indigo-100"
                                        : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300"}`}
                            >
                                <img src={img} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT — Product info */}
                <div className="space-y-5">

                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
                        <h1 className="text-[22px] font-bold text-gray-900 leading-snug">{product?.name}</h1>

                        <div className="flex items-center gap-2.5 mt-2.5">
                            <Rating value={product?.rating || 0} readOnly size="small" />
                            <span className="text-[12.5px] text-gray-400">
                                ({reviewsData.length} review{reviewsData.length === 1 ? "" : "s"})
                            </span>
                        </div>

                        <div className="flex items-end gap-3 mt-4">
                            <span className="text-[28px] font-bold text-green-600 leading-none">
                                ₹{product?.price}
                            </span>

                            {product?.oldPrice && (
                                <span className="text-[15px] line-through text-gray-400 leading-none mb-0.5">
                                    ₹{product?.oldPrice}
                                </span>
                            )}

                            {product?.discount > 0 && (
                                <span className="text-[12px] font-semibold bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-md leading-none">
                                    {product.discount}% OFF
                                </span>
                            )}
                        </div>

                        {/* Meta grid */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <MetaItem icon={<MdBrandingWatermark />} label="Brand" value={product?.brand} />
                            <MetaItem icon={<BiSolidCategoryAlt />} label="Category" value={product?.catName} />
                            <MetaItem icon={<BsBoxSeam />} label="Stock" value={product?.countInStock} />
                            <MetaItem
                                icon={product?.sale ? <HiOutlineSparkles /> : <MdFilterVintage />}
                                label="Status"
                                value={product?.sale ? "On Sale" : "Regular"}
                            />
                        </div>
                    </div>

                    {/* Variants */}
                    {product?.variants && Object.values(product.variants).some(v => v?.length > 0) && (
                        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-6 space-y-5">
                            {Object.entries(product.variants).map(([key, values]) =>
                                values?.length > 0 && (
                                    <VariantBlock key={key} title={key} items={values} />
                                )
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
                        <h2 className="text-[15px] font-bold text-gray-900 mb-2">Product Description</h2>
                        <p className="text-[13.5px] text-gray-600 leading-relaxed whitespace-pre-line">
                            {product?.description}
                        </p>
                    </div>

                    {/* Reviews — kept commented, ready to enable */}
                    {/*
                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
                        <h2 className="text-[15px] font-bold text-gray-900 mb-4">Customer Reviews</h2>
                        <div className="space-y-4">
                            {reviewsData.map((review, i) => (
                                <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={review.image || "/user.jpg"}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-[13.5px] font-semibold text-gray-800">{review.userName}</h4>
                                                <Rating value={review.rating} readOnly size="small" />
                                            </div>
                                            <p className="text-[11px] text-gray-400">
                                                {review.createdAt?.split("T")[0]}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-[13px] mt-2.5 text-gray-600 leading-relaxed">{review.review}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    */}

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;