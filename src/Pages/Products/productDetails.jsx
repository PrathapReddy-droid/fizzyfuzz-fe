import React, { useEffect, useRef, useState } from 'react';
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdFilterVintage } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';

const ProductDetails = () => {

    const [slideIndex, setSlideIndex] = useState(0);
    const [product, setProduct] = useState();
    const [reviewsData, setReviewsData] = useState([])
    const zoomSliderBig = useRef();
    const zoomSliderSml = useRef();

    const { id } = useParams();

    const navigate = useNavigate();

    const goBack = () => {
        navigate("/products"); // 👈 your product listing route
    };
    useEffect(() => {
        fetchDataFromApi(`/api/user/getReviews?productId=${id}`).then((res) => {
            if (res?.error === false) {
                setReviewsData(res.reviews)
            }
        })
    }, [])

    const goto = (index) => {
        setSlideIndex(index);
        zoomSliderSml.current.swiper.slideTo(index);
        zoomSliderBig.current.swiper.slideTo(index);
    }

    const VariantBlock = ({ title, items }) => (
        items?.length > 0 && (
            <div>
                <p className="text-sm font-medium mb-1">{title}</p>
                <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 border rounded-md text-sm cursor-pointer hover:bg-black hover:text-white transition"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        )
    );



    useEffect(() => {
        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            if (res?.error === false) {
                setTimeout(() => {
                    setProduct(res?.product)
                }, 500);
            }
        })
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-xl shadow-md p-4">
                    <Swiper
                        ref={zoomSliderBig}
                        slidesPerView={1}
                        className="rounded-lg overflow-hidden"
                    >
                        {product?.images?.map((img, i) => (
                            <SwiperSlide key={i}>
                                <InnerImageZoom src={img} zoomType="hover" />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Thumbnails */}
                    <div className="flex gap-3 mt-4">
                        {product?.images?.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                onClick={() => goto(i)}
                                className={`w-16 h-16 rounded-md object-cover cursor-pointer border 
        ${slideIndex === i ? "border-black" : "border-gray-200"}`}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT – Product Info */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                   <div className='w-full flex justify-between'>
                     <h1 className="text-2xl font-semibold">{product?.name}</h1>
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-600 hover:text-black transition"
                    >
                        ← Back to Products
                    </button>
                   </div>

                    <div className="flex items-center gap-3">
                        <Rating value={product?.rating} readOnly size="small" />
                        <span className="text-sm text-gray-500">
                            ({reviewsData.length} reviews)
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                        <span className="text-2xl font-bold text-green-600">
                            ₹{product?.price}
                        </span>

                        {product?.oldPrice && (
                            <span className="line-through text-gray-400">
                                ₹{product?.oldPrice}
                            </span>
                        )}

                        {product?.discount > 0 && (
                            <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                                {product.discount}% OFF
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                        <p><b>Brand:</b> {product?.brand}</p>
                        <p><b>Category:</b> {product?.catName}</p>
                        <p><b>Stock:</b> {product?.countInStock}</p>
                        <p><b>Status:</b> {product?.sale ? "On Sale" : "Regular"}</p>
                    </div>
                    <div className="space-y-4 mt-5">
                        {product?.variants &&
                            Object.entries(product.variants).map(([key, values]) =>
                                values?.length > 0 && (
                                    <VariantBlock
                                        key={key}
                                        title={key.toUpperCase()}
                                        items={values}
                                    />
                                )
                            )
                        }
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                        <h2 className="text-lg font-semibold mb-2">Product Description</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {product?.description}
                        </p>
                    </div>
                    {/* <div className="mt-10">
  <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

  <div className="space-y-4">
    {reviewsData.map((review, i) => (
      <div key={i} className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex items-center gap-4">
          <img
            src={review.image || "/user.jpg"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <h4 className="font-medium">{review.userName}</h4>
              <Rating value={review.rating} readOnly size="small" />
            </div>
            <p className="text-xs text-gray-500">
              {review.createdAt?.split("T")[0]}
            </p>
          </div>
        </div>

        <p className="text-sm mt-3 text-gray-700">{review.review}</p>
      </div>
    ))}
  </div>
</div> */}


                </div>
            </div>
        </div>
    )
}


export default ProductDetails;