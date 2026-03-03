import React, { useContext, useEffect, useRef, useState } from 'react'
import { MyContext } from '../../App';
import { FaCloudUploadAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { editData, fetchDataFromApi, postData, uploadImage } from "../../utils/api";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import 'react-international-phone/style.css';
import { Collapse } from "react-collapse";



const Profile = () => {

    const [avatarPreview, setAvatarPreview] = useState([]);
    const [kycPreview, setKycPreview] = useState('');
    const [uploading, setUploading] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isKYCLoading, setIsKYCLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [userId, setUserId] = useState("");
    const [isChangePasswordFormShow, setisChangePasswordFormShow] = useState(false);
    const [phone, setPhone] = useState('');
    const fileInputRef = useRef(null);
    const [formFields, setFormsFields] = useState({
        name: '',
        email: '',
        mobile: '',
        gst: '',        // string or null
        business: '',   // string or null
        ifsc: '',
        bankAccount: '',
        upi: '',
        aadhaarNumber: "",
        panNumber: "",
        kycDocument: '',
        address: '',
        city: '',
        state: '',
        country: 'INDIA',
        pickup_location: '',
        pinCode : ""
    });

    const [changePassword, setChangePassword] = useState({
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const context = useContext(MyContext);
    const history = useNavigate();




    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token === null) {
            history("/login");
        }

    }, [context?.isLogin])


    useEffect(() => {

            setUserId(context?.userData?._id);
            setFormsFields({
                name: context?.userData?.name,
                email: context?.userData?.email,
                mobile: context?.userData?.mobile,
                gst: context?.userData?.gst,
                business: context?.userData?.business,
                address: context?.userData?.address,
                kycDocument: context?.userData?.kyc_img,
                bankAccount : context?.userData?.bank_account,
                ifsc : context?.userData?.ifsc,
                kycNumber : context?.userData?.kyc_number ,
                aadhaarNumber : context?.userData?.aadhaar_number ,
                panNumber : context?.userData?.pan_number ,
                city: context?.userData?.city,
                state: context?.userData?.state,
                country: context?.userData?.country||'INDIA',
                pickup_location: context?.userData?.pickup_location,
                pinCode : context?.userData?.pin_number ,
            })

            const ph = `${context?.userData?.mobile}`
            console.log("context?.userData? :", context?.userData);

            setPhone(ph)

            setChangePassword({
                email: context?.userData?.email
            })

    }, [context?.userData?._id])


    const isGSTLocked = false;
    const isBusinessLocked = false;
    const isAddressLocked = false;

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormsFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        })

        setChangePassword((prev) => ({
                ...prev,
                [name]: value
            }));


    }


    const valideValue = formFields.name && phone?.length === 10;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("formFields : ", formFields);

        setIsLoading(true);

        if (!formFields.ifsc) {
            context.alertBox("error", "IFSC is required");
            setIsLoading(false);
            return;
        }
        if (!formFields.ifsc) {
            context.alertBox("error", "Bank Account is required");
            setIsLoading(false);
            return;
        }
        if (formFields.name === "") {
            context.alertBox("error", "Please enter full name");
            setIsLoading(false);
            return false
        }


        if (formFields.email === "") {
            context.alertBox("error", "Please enter email id");
            setIsLoading(false);
            return false
        }
        const addressRegex = /\d+/; // checks if any number exists

        if (!formFields.address || !addressRegex.test(formFields.address)) {
            context.alertBox("error", "Address must include house, flat, or road number");
            setIsLoading(false);
            return;
        }

        if (!formFields.city) {
            context.alertBox("error", "City is required");
            setIsLoading(false);
            return;
        }

        if (!formFields.state) {
            context.alertBox("error", "State is required");
            setIsLoading(false);
            return;
        }

        if (!formFields.country) {
            context.alertBox("error", "Country is required");
            setIsLoading(false);
            return;
        }

        if (!formFields.pickup_location) {
            context.alertBox("error", "Pickup location is required");
            setIsLoading(false);
            return;
        }

        if (!formFields.pinCode || formFields.pinCode.length !== 6) {
            context.alertBox("error", "Valid PIN Code is required");
            setIsLoading(false);
            return;
        }

        if (!formFields.kycDocument) {
            context.alertBox("error", "KYC document is required");
            setIsLoading(false);
            return;
        }


        if (formFields?.mobile === "" || formFields?.mobile?.length < 10) {
            context.alertBox("error", "Please enter mobile number");
            setIsLoading(false);
            return false
        }

         const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

        if (!formFields.panNumber&&!formFields.aadhaarNumber) {
            context.alertBox("error", "Please enter Aadhaar or PAN number");
            setIsLoading(false)
            return;
        }else if (formFields.panNumber&&!panRegex.test(formFields.panNumber)) {
            context.alertBox("error", "Invalid PAN number");
            setIsLoading(false)
            return;
        }else if (formFields.aadhaarNumber&&formFields.aadhaarNumber.length !== 12) {
            context.alertBox("error", "Aadhaar must be 12 digits");
            setIsLoading(false)
            return;
        }
               

        formFields.role = "SELLER"

        editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then((res) => {
            console.log(res)
            if (res?.error !== true) {
                setIsLoading(false);
                context.alertBox("success", res?.data?.message);
                location.reload()
            } else {
                context.alertBox("error", res?.data?.message);
                setIsLoading(false);
            }

        })


    }

    const valideValue2 =
            changePassword.oldPassword &&
            changePassword.newPassword &&
            changePassword.confirmPassword;

    


    const handleSubmitChangePassword = (e) => {
        e.preventDefault();

        setIsLoading2(true);

        if (changePassword.oldPassword === "") {
            context.alertBox("error", "Please enter old password");
            setIsLoading2(false);
            return false
        }


        if (changePassword.newPassword === "") {
            context.alertBox("error", "Please enter new password");
            setIsLoading2(false);
            return false
        }


        if (changePassword.confirmPassword === "") {
            context.alertBox("error", "Please enter confirm password");
            setIsLoading2(false);
            return false
        }

        if (changePassword.confirmPassword !== changePassword.newPassword) {
            context.alertBox("error", "password and confirm password not match");
            setIsLoading2(false);
            return false
        }


        postData(`/api/user/reset-password`, changePassword, { withCredentials: true }).then((res) => {
            console.log(res)
            if (res?.error !== true) {
                setIsLoading2(false);
                context.alertBox("success", res?.message);
                setisChangePasswordFormShow(false)
                setChangePassword(state=>({ ...state,
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }))
            } else {
                context.alertBox("error", res?.message);
                setIsLoading2(false);
                setisChangePasswordFormShow(false)
                setChangePassword(state=>({ ...state,
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }))
            }

        })


    }

    useEffect(() => {
       const userAvtar = [];
       if (context?.userData?.avatar) {
         setAvatarPreview([context.userData.avatar]);
       }
    }, [context?.userData])

const onChangeAvatar = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    context.alertBox("error", "Invalid image format");
    return;
  }

  setUploading(true);
  const formData = new FormData();
  formData.append("avatar", file);

  uploadImage("/api/user/user-avatar", formData).then((res) => {
    setUploading(false);
    if (res?.data?.avtar) {
      setFormsFields((prev) => ({
            ...prev,
            avatar: res.data.avtar
        }));
    }
  });
};

const onChangeKyc = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    context.alertBox("error", "Invalid document format");
    return;
  }

  setIsKYCLoading(true);
  const formData = new FormData();
  formData.append("kycDocument", file);

  uploadImage("/api/user/upload-kyc", formData).then((res) => {
    setIsKYCLoading(false);
    if (res.kycDocument) {
      setKycPreview(res.kycDocument);
      setFormsFields((prev) => ({
        ...prev,
        kycDocument: res.kycDocument
      }));
    }
  });
};



    return (
        <>
            <div className="card my-2 pt-3 w-[100%] sm:w-[100%] lg:w-[95%] shadow-md sm:rounded-lg text-white px-5 pb-5">
                <div className='flex items-center justify-between'>
                    <h2 className="text-[18px] font-[600]">
                        User Profile : 
                    </h2>
                    


                    <Button className="!ml-auto" onClick={() => setisChangePasswordFormShow(!isChangePasswordFormShow)}>Change Password</Button>
                </div>
                


                <br />


                <div className="w-[110px] h-[110px] rounded-full overflow-hidden mb-4 relative group flex items-center justify-center bg-gray-200">

                    {
                        uploading === true ? <CircularProgress color="inherit" /> :
                            <>
                                {avatarPreview.length ? (
                                    <img src={avatarPreview[0]} className="w-full h-full object-cover" />
                                ) : (
                                    <img src="/user.jpg" className="w-full h-full object-cover" />
                                )}


                            </>

                    }
                    


                    <div className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
                        <FaCloudUploadAlt className="text-[#fff] text-[25px]" />
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0"
                            onChange={onChangeAvatar}
                        />
                    </div>
                </div>
                <h2 className="text-xs font-[400]">
                    User ID : <span className='font-[500]'>{context?.userData?.uid}</span>
                </h2>

                <form className="form mt-8" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1  sm:grid-cols-2 gap-5">
                        <div className="col">
                            <label className="block text-xs font-medium text-gray-200 mb-1">
                                Full Name
                            </label>
                            <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] text-black focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="name" value={formFields.name}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput} />

                        </div>

                        <div className="col">
                            <label className="block text-xs font-medium text-gray-200 mb-1">
                                Email
                            </label>
                            <input type="email" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] text-black focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'
                                name="email"
                                value={formFields.email}
                                disabled={true}
                                onChange={onChangeInput} />

                        </div>

                        <div className="col">
                            <label className="block text-xs font-medium text-gray-200 mb-1">
                                Mobile
                            </label>
                            <div className="flex">
                                {/* Country Code */}
                                <span className="flex items-center px-3 h-[50px] border-2 border-r-0 border-[rgba(0,0,0,0.1)] rounded-l-md bg-gray-100 text-gray-700">
                                    +91
                                </span>

                                {/* Mobile Input */}
                                <input
                                    type="text"
                                    name="mobile"
                                    value={phone}
                                    disabled={isLoading}
                                    maxLength={10}
                                    inputMode="numeric"
                                    placeholder="Enter 10-digit mobile number"
                                    className="w-full h-[50px] border-2 text-black border-[rgba(0,0,0,0.1)] rounded-r-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');

                                        setPhone(value);
                                        setFormsFields((prev) => ({
                                            ...prev,
                                            mobile: value
                                        }));

                                    }}
                                />
                            </div>

                        </div>

                        {context?.userData?.role === "SELLER" && <>

                            <div className="col">
                                <label className="block text-xs font-medium text-gray-200 mb-1">
                                    IFSC Code
                                </label>
                                <input
                                    type="text"
                                    name="ifsc"
                                    value={formFields.ifsc || ''}
                                    disabled={isLoading}
                                    placeholder="IFSC Code"
                                    className="w-full h-[50px] text-black border-2 border-[rgba(0,0,0,0.1)] rounded-md px-3 focus:outline-none focus:border-[rgba(0,0,0,0.7)]"
                                    onChange={onChangeInput}
                                />
                            </div>
                            <div className="col">
                                
                                <label className="block text-xs font-medium text-gray-200 mb-1">
                                    Bank Account
                                </label>
                                <input
                                    type="text"
                                    name="bankAccount"
                                    value={formFields.bankAccount || ''}
                                    disabled={isLoading}
                                    placeholder="Bank Account Number"
                                    className="w-full h-[50px] border-2 text-black border-[rgba(0,0,0,0.1)] rounded-md px-3 focus:outline-none focus:border-[rgba(0,0,0,0.7)]"
                                    onChange={(e) =>
                                        setFormsFields((state)=>({ ...state,bankAccount: e.target.value.replace(/\D/g, '') }))
                                    }
                                />
                            </div>
                            <div className="col">
                                
                                
                            </div>
                            {/* KYC TYPE SELECT */}
                            {/* KYC TYPE */}
                             <div className="col">
                                <label className="block text-xs font-medium text-gray-200 mb-1">
                                    Pan Number
                                </label>
                                    <input
                                        type="text"
                                        name="panNumber"
                                        value={formFields.panNumber}
                                        disabled={isLoading}
                                        placeholder="Enter PAN number (ABCDE1234F)"
                                        maxLength={10}
                                        className="w-full h-[50px] border-2 text-black border-gray-200 rounded-md px-3
                 focus:outline-none focus:border-gray-700"
                                        onChange={(e) => {
                                            let value = e.target.value.toUpperCase();
                                            setFormsFields(prev => ({
                                                ...prev,
                                                panNumber : value
                                            }));
                                        }}
                                        required
                                    />

                                    <p className="text-xs text-gray-400 mt-1">
                                        Format: ABCDE1234F
                                    </p>
                                </div>
                                 <div className="col">
                                <label className="block text-xs font-medium text-gray-200 mb-1">
                                    Aadhaar Number
                                </label>
                                    <input
                                        type="text"
                                        name="aadhaarNumber"
                                        value={formFields.aadhaarNumber}
                                        disabled={isLoading}
                                        placeholder="Enter Aadhaar number (12 digits)"
                                        maxLength={12}
                                        className="w-full h-[50px] text-black border-2 border-gray-200 rounded-md px-3
                 focus:outline-none focus:border-gray-700"
                                        onChange={(e) => {
                                            let value = e.target.value.toUpperCase().replace(/\D/g, "");
                                            setFormsFields(prev => ({
                                                ...prev,
                                                aadhaarNumber : value
                                            }));
                                        }}
                                        required
                                    />

                                    <p className="text-xs text-gray-400 mt-1">
                                        Aadhaar must be 12 digits
                                    </p>
                                </div>

                            {/* KYC UPLOAD */}
                            <div className="col">
                            <label className="block text-xs font-medium text-gray-200 mb-1">
                                KYC Preview
                            </label>

                            <div
                                className={`relative w-full rounded-md border border-gray-200 overflow-hidden
                                flex items-center justify-center transition-all
                                ${formFields.kycDocument ? "h-40" : "h-12"}
                                ${isKYCLoading ? "bg-gray-100" : "bg-gray-200"}
                                `}
                            >
                                {/* Loader */}
                                {isKYCLoading && (
                                <CircularProgress size={22} className="text-gray-500" />
                                )}

                                {/* Image Preview */}
                                {!isKYCLoading && formFields.kycDocument && (
                                <img
                                    src={formFields.kycDocument}
                                    alt="KYC Preview"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                )}

                                {/* Upload Overlay */}
                                {!isKYCLoading && (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center
                                    bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <FaCloudUploadAlt className="text-white text-2xl mb-1" />
                                    <span className="text-xs text-white font-medium">
                                    Upload / Change
                                    </span>
                                </div>
                                )}

                                {/* Empty State */}
                                {!isKYCLoading && !formFields.kycDocument && (
                                <div
                                    className="flex items-center justify-center gap-2 text-gray-400 cursor-pointer"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <FaCloudUploadAlt className="text-lg" />
                                    <span className="text-xs">Upload KYC Document</span>
                                </div>
                                )}

                                {/* File Input */}
                                <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={onChangeKyc}
                                />
                            </div>

                            {/* Helper Text */}
                            {/* {!formFields.kycType && (
                                <p className="mt-1 text-[11px] text-gray-400">
                                Select document type first
                                </p>
                            )} */}
                            </div>

                            <div className="col">
  <label className="block text-xs font-medium text-gray-200 mb-1">
    Address Line
  </label>
  <input
    name="address"
    value={formFields.address || ''}
    onChange={onChangeInput}
    className="w-full text-black border-2 border-gray-200 rounded-md px-3 py-2"
  />
  <p className="text-xs text-gray-400 mt-1">
                                        Aadhaar must include house, flat or road number
                                    </p>
</div>

<div className="col">
  <label className="block text-xs font-medium text-gray-200 mb-1">
    City
  </label>
  <input
    type="text"
    name="city"
    value={formFields.city || ''}
    onChange={onChangeInput}
    className="w-full h-[50px] text-black border-2 border-gray-200 rounded-md px-3"
  />
</div>

<div className="col">
  <label className="block text-xs font-medium text-gray-200 mb-1">
    State
  </label>
  <input
    type="text"
    name="state"
    value={formFields.state || ''}
    onChange={onChangeInput}
    className="w-full h-[50px] text-black border-2 border-gray-200 rounded-md px-3"
  />
</div>

<div className="col">
  <label className="block text-xs font-medium text-gray-200 mb-1">
    Country
  </label>
  <input
    type="text"
    name="country"
    value="INDIA"
    disabled
    className="w-full h-[50px] text-black border-2 border-gray-200 rounded-md px-3 bg-gray-100 cursor-not-allowed"
  />
</div>

<div className="col">
  <label className="block text-xs font-medium text-gray-200 mb-1">
    Pickup Location
  </label>
  <input
    type="text"
    name="pickup_location"
    value={formFields.pickup_location || ''}
    onChange={onChangeInput}
    className="w-full h-[50px] text-black border-2 border-gray-200 rounded-md px-3"
  />
</div>

<div className="col">
  <label className="block text-xs font-medium text-gray-200 mb-1">
    PIN Code
  </label>
  <input
    type="text"
    name="pinCode"
    value={formFields.pinCode || ''}
    maxLength={6}
    onChange={(e) =>
      setFormsFields(prev => ({
        ...prev,
        pinCode: e.target.value.replace(/\D/g, '')
      }))
    }
    className="w-full h-[50px] text-black border-2 border-gray-200 rounded-md px-3"
  />
</div>

                            <div className="col">
                                <label className="block text-xs font-medium text-gray-200 mb-1">
                                    GST Number
                                </label>
                                {/* <h4 className="text-[14px] font-[500] mb-1">GST Number (Optional)</h4> */}

                                <input
                                    type="text"
                                    className="w-full text-black h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md 
               focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                                    name="gst"
                                    value={formFields.gst || ''}
                                    disabled={isLoading || isGSTLocked}
                                    placeholder="Enter GST number"
                                    onChange={onChangeInput}
                                />

                                {isGSTLocked && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        GST cannot be changed once updated
                                    </p>
                                )}
                            </div>
                            {/* <div className="col">
                                <label className="block text-xs font-medium text-gray-200 mb-1">
                                    Business Type
                                </label>

                                <select
                                    name="business"
                                    value={formFields.business || ''}
                                    disabled={isLoading || isBusinessLocked}
                                    onChange={onChangeInput}
                                    className="w-full h-[50px] border-2 text-black border-[rgba(0,0,0,0.1)] rounded-md 
               focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3 bg-white"
                                >
                                    <option value="" disabled>
                                        Select business type
                                    </option>

                                    <option value="Retail">Retail</option>
                                    <option value="Wholesale">Wholesale</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="IT Services">IT Services</option>
                                    <option value="Education">Education</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Finance">Finance</option>
                                    <option value="E-commerce">E-commerce</option>
                                    <option value="Food & Beverage">Food & Beverage</option>
                                    <option value="Other">Other</option>
                                </select>

                                {isBusinessLocked && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Business type cannot be changed once updated
                                    </p>
                                )}
                            </div> */}





                        </>}



                    </div>



                    <br />



                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={!valideValue} className="btn-blue btn-lg w-full">
                            {
                                isLoading === true ? <CircularProgress color="inherit" />
                                    :
                                    'Update Profile'
                            }
                        </Button>

                    </div>
                </form>


            </div>


            <Collapse isOpened={isChangePasswordFormShow}>
                <div className="card w-[100%] sm:w-[100%] lg:w-[75%]  bg-white p-5 shadow-md rounded-md">
                    <div className="flex items-center pb-3">
                        <h2 className="text-[18px] font-[600] pb-0">Change Password</h2>
                    </div>
                    <hr />


                    <form className="mt-8" onSubmit={handleSubmitChangePassword}>
                        <div className="grid grid-cols-1  sm:grid-cols-2 gap-5">
                            <div className="col">
                                <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] text-black focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="oldPassword" value={changePassword.oldPassword}
                                    disabled={isLoading2 === true ? true : false}
                                    onChange={onChangeInput} placeholder='Old Password' />
                            </div>

                            <div className="col">
                                <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] text-black focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="newPassword" value={changePassword.newPassword}
                                    disabled={isLoading2 === true ? true : false}
                                    onChange={onChangeInput} placeholder='New Password' />

                            </div>

                            <div className="col">
                                <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] text-black focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="confirmPassword" value={changePassword.confirmPassword}
                                    disabled={isLoading2 === true ? true : false}
                                    onChange={onChangeInput} placeholder='Confirm Password' />

                            </div>

                        </div>



                        <br />

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={!valideValue2} className="btn-blue btn-lg w-[100%]">
                                {
                                    isLoading2 === true ? <CircularProgress color="inherit" />
                                        :
                                        'Change Password'
                                }
                            </Button>

                        </div>
                    </form>



                </div>
            </Collapse>

        </>
    )
}


export default Profile;