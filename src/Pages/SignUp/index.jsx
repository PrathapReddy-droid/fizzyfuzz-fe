import { Button } from "@mui/material";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import LoadingButton from "@mui/lab/LoadingButton";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

import { fetchDataFromApi, postData } from '../../utils/api.js';
import { useContext } from "react";
import { MyContext } from "../../App.jsx";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
    const [loadingGoogle, setLoadingGoogle] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isPasswordShow, setisPasswordShow] = useState(false);

    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
        // gst: "",
        // business : ""
    })

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        fetchDataFromApi("/api/logo").then((res) => {
            localStorage.setItem('logo', res?.logo[0]?.logo)
        })
    }, [])

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        })
    }


    const valideValue = Object.values(formFields).every(el => el)




    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        if (formFields.name === "") {
            context.alertBox("error", "Please enter full name");
            return false
        }

        if (formFields.email === "") {
            context.alertBox("error", "Please enter email id");
            return false
        }

        // if (formFields.business === "") {
        //     context.alertBox("error", "Please enter email id");
        //     return false
        // }
        // if (formFields.gst === "") {
        //     context.alertBox("error", "Please enter email id");
        //     return false
        // }
        const isValidMobile = formFields.mobile?.length === 10;

        if (!isValidMobile) {
            context.alert("error","Please enter a valid 10-digit mobile number");
            return;
        }

        // Final value to send to backend
        const finalMobile = `${formFields.mobile}`;

        formFields.mobile = finalMobile
        if (formFields.password === "") {
            console.log("contextcontextcontextcontext",context);
            
            context.alertBox("error", "Please enter password");
            return false
        }
        formFields.role = "SELLER"

        postData("/api/user/sellerRegister", formFields).then((res) => {
            console.log(res)

            if (res?.error !== true) {
                setIsLoading(false);
                context.alertBox("success", res?.message);
                localStorage.setItem("userEmail", formFields.email)
                setFormFields({
                    name: "",
                    email: "",
                    password: ""
                })

                history("/verify-account")
            } else {
                context.alertBox("error", res?.message);
                setIsLoading(false);
            }

        })


    }


    // const authWithGoogle = () => {

    //     setLoadingGoogle(true);

    //     signInWithPopup(auth, googleProvider)
    //         .then((result) => {
    //             // This gives you a Google Access Token. You can use it to access the Google API.
    //             const credential = GoogleAuthProvider.credentialFromResult(result);
    //             const token = credential.accessToken;
    //             // The signed-in user info.
    //             const user = result.user;

    //             const fields = {
    //                 name: user.providerData[0].displayName,
    //                 email: user.providerData[0].email,
    //                 password: null,
    //                 avatar: user.providerData[0].photoURL,
    //                 mobile: user.providerData[0].phoneNumber,
    //                 role: "USER"
    //             };


    //             postData("/api/user/authWithGoogle", fields).then((res) => {

    //                 if (res?.error !== true) {
    //                     setLoadingGoogle(false);
    //                     setIsLoading(false);
    //                     context.alertBox("success", res?.message);
    //                     localStorage.setItem("userEmail", fields.email)
    //                     localStorage.setItem("accessToken", res?.data?.accesstoken);
    //                     localStorage.setItem("refreshToken", res?.data?.refreshToken);

    //                     context.setIsLogin(true);

    //                     history("/")
    //                 } else {
    //                     context.alertBox("error", res?.message);
    //                     setIsLoading(false);
    //                 }

    //             })

    //             console.log(user)
    //             // IdP data available using getAdditionalUserInfo(result)
    //             // ...
    //         }).catch((error) => {
    //             // Handle Errors here.
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             // The email of the user's account used.
    //             const email = error.customData.email;
    //             // The AuthCredential type that was used.
    //             const credential = GoogleAuthProvider.credentialFromError(error);
    //             // ...
    //         });


    // }

    return (
        <section className="text-white w-full">
            <header className="w-full static lg:fixed top-0 left-0  px-4 py-3 flex items-center justify-center sm:justify-between z-50">
                <Link to="/">
                    {/* <img
                        src={localStorage.getItem("logo")}
                        className="w-[200px]"
                    /> */}
                                             <div className="flex flex-col items-center justify-center gap-1 select-none">
              {/* Logo Row */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl
                  shadow-sm">

                <ShoppingCart size={22} className="text-indigo-300" />

                <span className="font-extrabold text-[20px]
                     bg-gradient-to-r from-indigo-400 to-purple-400
                     bg-clip-text text-transparent tracking-wide">
                  Fizzy Fuzz
                </span>
              </div>

              {/* Tagline */}
              <p className="text-[12px] text-gray-500 tracking-widest -mt-3 uppercase">
                Next Level Shoppie
              </p>
            </div>
                </Link>

                <div className="hidden sm:flex items-center gap-0">
                    <NavLink to="/login" exact={true} activeClassName="isActive">
                        <Button className="!rounded-full !text-white !px-5 flex gap-1">
                            <CgLogIn className="text-[18px]" /> Login
                        </Button>
                    </NavLink>

                    <NavLink to="/sign-up" exact={true} activeClassName="isActive">
                        <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
                            <FaRegUser className="text-[15px]" /> Sign Up
                        </Button>
                    </NavLink>
                </div>
            </header>
            <img src="/patern.webp" className="w-full fixed top-0 left-0 opacity-5" />

            <div className="loginBox card w-full md:w-[600px] h-[auto] pb-20 mx-auto pt-5 lg:pt-20 relative z-50">
                <div className="text-center">
                    <img src="/icon.svg" className="m-auto invert" />
                </div>

                <h1 className="text-center text-[18px] sm:text-[35px] font-[800] mt-4">
                    Join us today! Get special <br />benefits and stay up-to-date.
                </h1>

                {/* <div className="flex items-center justify-center w-full mt-5 gap-4">
                     <LoadingButton
                        size="small"
                        onClick={authWithGoogle}
                        endIcon={<FcGoogle />}
                        loading={loadingGoogle}
                        loadingPosition="end"
                        variant="outlined"
                        className="!bg-none !py-2 !text-[15px] !capitalize !px-5 !text-[rgba(0,0,0,0.7)]"
                    >
                        Signin with Google
                    </LoadingButton> 

                 </div> */}

                <br />

                {/* <div className="w-full flex items-center justify-center gap-3">
                    <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
                    <span className="text-[10px] lg:text-[14px] font-[500]">
                        Or, Sign Up with your email
                    </span>
                    <span className="flex items-center w-[100px] h-[1px] bg-[rgba(0,0,0,0.2)]"></span>
                </div> */}

                <br />

                <form className="w-full px-8 mt-3" onSubmit={handleSubmit}>
                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Full Name</h4>
                        <input
                            type="text"
                            className="w-full h-[50px] border-2 text-black border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                            name="name"
                            placeholder="Enter your full name"
                            value={formFields.name}
                            disabled={isLoading === true ? true : false}
                            onChange={onChangeInput}
                        />
                    </div>

                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Email</h4>
                        <input
                            type="email"
                            className="w-full h-[50px] border-2 text-black border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                            name="email"
                            placeholder="Enter your email"
                            value={formFields.email}
                            disabled={isLoading === true ? true : false}
                            onChange={onChangeInput}
                        />
                    </div>

                    {/* <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">GST Number</h4>
                        <input
                            type="gst"
                            className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                            name="gst"
                            value={formFields.gst}
                            disabled={isLoading === true ? true : false}
                            onChange={onChangeInput}
                        />
                    </div> */}

                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Mobile</h4>

                        <div className="flex">
                            {/* Country Code */}
                            <span className="flex items-center px-3 h-[50px] border-2 border-r-0 
                     border-[rgba(0,0,0,0.1)] rounded-l-md bg-gray-100 text-gray-700">
                                +91
                            </span>

                            {/* Mobile Input */}
                            <input
                                type="text"
                                name="mobile"
                                value={formFields.mobile}
                                disabled={isLoading === true}
                                maxLength={10}
                                inputMode="numeric"
                                placeholder="Enter 10-digit mobile number"
                                className="w-full h-[50px] text-black border-2 border-[rgba(0,0,0,0.1)] 
                 rounded-r-md focus:border-[rgba(0,0,0,0.7)] 
                 focus:outline-none px-3"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, ""); // allow only numbers
                                    if (value.length <= 10) {
                                        onChangeInput({
                                            target: {
                                                name: "mobile",
                                                value,
                                            },
                                        });
                                    }
                                }}
                            />
                        </div>

                        {/* Optional validation message */}
                        {formFields.mobile && formFields.mobile.length !== 10 && (
                            <p className="text-red-500 text-[12px] mt-1">
                                Mobile number must be 10 digits
                            </p>
                        )}
                    </div>

  {/* <div className="form-group mb-4 w-full">
  <h4 className="text-[14px] font-[500] mb-1">Business</h4>

  <select
    name="business"
    value={formFields.business}
    disabled={isLoading === true}
    onChange={onChangeInput}
    className="w-full h-[50px] border-2 border-[rgba(0,0,0,0.1)] rounded-md 
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
</div> */}


                    <div className="form-group mb-4 w-full">
                        <h4 className="text-[14px] font-[500] mb-1">Password</h4>
                        <div className="relative w-full">
                            <input
                                type={isPasswordShow === false ? 'password' : 'text'}
                                className="w-full h-[50px] border-2  text-black border-[rgba(0,0,0,0.1)] rounded-md focus:border-[rgba(0,0,0,0.7)] focus:outline-none px-3"
                                name="password"
                                placeholder="Enter your password"
                                value={formFields.password}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                            />
                            <Button className="!absolute top-[7px] right-[10px] z-50 !rounded-full !w-[35px] !h-[35px] !min-w-[35px] !text-gray-600" onClick={() => setisPasswordShow(!isPasswordShow)}>
                                {isPasswordShow === false ? (
                                    <FaRegEye className="text-[18px]" />
                                ) : (
                                    <FaEyeSlash className="text-[18px]" />
                                )}
                            </Button>
                        </div>
                    </div>




                   <div className="mb-4">
  <label className="flex items-start gap-2 text-[13px] text-gray-600">
    <input
      type="checkbox"
      className="mt-1 accent-primary cursor-pointer"
      required
    />

    <span>
      I accept the{" "}
      <Link
        to="https://fizzyfuzz.in"
        target="_blank"
        className="text-primary font-semibold hover:underline"
      >
        Terms & Conditions
      </Link>{" "}
      and{" "}
      <Link
        to="https://fizzyfuzz.in"
        target="_blank"
        className="text-primary font-semibold hover:underline"
      >
        Privacy Policy
      </Link>
    </span>
  </label>
</div>

<div className="flex items-center justify-between">
  <span className="text-[14px]">Already have an account?</span>

  <Link
    to="/login"
    className="text-primary font-[700] text-[15px] hover:underline hover:text-gray-700 cursor-pointer"
  >
    Sign In
  </Link>
</div>


                    <Button type="submit" className="btn-blue btn-lg w-full" disabled={!valideValue} >
                        {
                            isLoading === true ? <CircularProgress color="inherit" />
                                :
                                'Sign Up'
                        }
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default SignUp;
