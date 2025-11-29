import React, {  useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { BrowserRouter as Router, Route, Routes ,Navigate} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Excel.css";
import "./Login.css";
import "./Signup.css";
 

// ---------------------- LOGIN COMPONENT ----------------------


function Login() {
  const navigate = useNavigate();

  const [mode] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [forgotValue, setForgotValue] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(null); // 0: forgot, 1: otp, 2: reset

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ===== LOGIN =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      console.log("Login Payload:", payload);

      const res = await axios.post(
        "https://cloth-backend-yhka.onrender.com/login",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login Response:", res.data);

      if (res.data.success) {
        alert("Login successful!");

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        // ⬅ Redirect to Dashboard
        navigate("/dashboard");

      } else {
        alert(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.log("Login error:", err?.response || err);
      const msg =
        err?.response?.data?.message || "Something went wrong. Try again!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };


  // === Forgot password ===
  const handleForgotPassword = async () => {
    if (!forgotValue || forgotValue.trim() === "") {
      alert("Please enter your email or mobile number");
      return;
    }

    try {
      setLoading(true);
      const payload = forgotValue.includes("@")
        ? { email: forgotValue.trim().toLowerCase() }
        : { mobileNumber: forgotValue.trim() };

      console.log("Forgot payload:", payload);

      const res = await axios.post(
        "https://cloth-backend-yhka.onrender.com/forgot-password",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Forgot response:", res?.data);

      if (res.data?.success) {
        alert("OTP sent successfully!");
        setStep(1);
      } else {
        alert(res.data?.message || "Reset failed");
      }
    } catch (err) {
      console.error("Forgot password error:", err?.response || err);
      alert(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ====== Verify OTP ======
  const handleVerifyOtp = async () => {
    if (!resetOtp || resetOtp.trim() === "") return alert("Please enter OTP");

    try {
      setLoading(true);
      const res = await axios.post(
        "https://cloth-backend-yhka.onrender.com/verify-otp",
        { otp: resetOtp.toString().trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Verify OTP response:", res?.data);

      if (res.data?.success) {
        alert("OTP verified successfully!");
        setStep(2);
      } else {
        alert(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP verify error:", err?.response || err);
      alert(err?.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  // ====== Reset Password ======
const handleResetPassword = async (e) => {
  if (e) e.preventDefault();

  try {
    if (!newPassword || !confirmPassword) {
      return alert("Please fill both password fields");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);

    // FRONTEND MUST MATCH BACKEND FIELDS
    const payload = {
      newPassword,
      confirmPassword
    };

    // Add OTP if available
    if (resetOtp) payload.otp = resetOtp;

    // Add email or mobile
    if (forgotValue) {
      if (forgotValue.includes("@")) {
        payload.email = forgotValue.trim().toLowerCase();
      } else {
        payload.mobileNumber = forgotValue.trim();
      }
    }

    console.log("Reset payload:", payload);

    const res = await axios.post(
      "https://cloth-backend-yhka.onrender.com/reset-password",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Reset response:", res?.data);

    if (res.data?.success) {
      alert(res.data.message || "Password reset successful!");

      setStep(null);
      setNewPassword("");
      setConfirmPassword("");
      setResetOtp("");
      setForgotValue("");
      setShowSuccessModal(true);

    } else {
      alert(res.data?.message || "Unable to reset password.");
    }

  } catch (err) {
    console.error("Reset error:", err?.response || err);
    alert(
      "Error resetting password: " +
        (err?.response?.data?.message || err?.message || "Server error")
    );
  } finally {
    setLoading(false);
  }
};



  // ====== Resend OTP ======
  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://cloth-backend-yhka.onrender.com/resend-otp",
        { value: forgotValue }
      );
      console.log("Resend response:", res?.data);
      if (res.data?.success) alert("OTP resent successfully");
      else alert(res.data?.message || "Failed to resend OTP");
    } catch (err) {
      console.error("Resend error:", err?.response || err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginpage-container">
      <div className="loginpage-box">
        <div className="loginpage-left">Meesho</div>
        <div className="loginpage-right">
          <h2>{mode === "login" ? "Login" : "Sign up"}</h2>
          <div className="underline" />

          {mode === "login" && (
            <form onSubmit={handleSubmit} className="loginpage-form">
              <div className="field full">
                <label className="field-label">E-mail ID</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field full">
                <label className="field-label">Password</label>
                <div className="input-wrap">
                  <input
                    className="input-design"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <p className="forgot-link">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="forgot-link"
                >
                  Forgot Password?
                </button>
              </p>

              <div className="field full">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Please wait..." : "Next"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* (forgot/otp/reset/success modals unchanged) */}
      {step === 0 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="forgot">Forgot Password</h3>
            <label>Email or Mobile Number</label>
            <input
              type="text"
              placeholder="Enter email or mobile"
              value={forgotValue}
              onChange={(e) => setForgotValue(e.target.value)}
            />
            <button className="btn-primary" onClick={handleForgotPassword} disabled={loading}>
              Send OTP
            </button>
            <button className="close-btn" onClick={() => setStep(null)}>
              ✖ Close
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="forgot">Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={resetOtp}
              onChange={(e) => setResetOtp(e.target.value)}
            />
            <button className="btn-primary" onClick={handleVerifyOtp} disabled={loading}>
              Verify OTP
            </button>
            <p className="resend-text">
              Didn't get OTP?{" "}
              <button type="button" onClick={handleResend} className="resend-link" disabled={loading}>
                Resend
              </button>
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="forgot">Reset Password</h3>

            <label>New Password</label>
            <div className="input-wrap">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowNewPassword((s) => !s)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label>Confirm Password</label>
            <div className="input-wrap">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword((s) => !s)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button className="btn-primary" onClick={handleResetPassword} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="forgot">Success!</h3>
            <p className="forgot">Congratulations! You have been successfully authenticated</p>
            <button className="btn-primary" onClick={() => setShowSuccessModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

//----signup component -----//


function Signup() {
const[formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gst: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
  });

const cityList = [
  "Ahmedabad",
  "Bangalore",
  "Bhopal",
  "Chennai",
  "Delhi",
  "Ghaziabad",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Kanpur",
  "Kolkata",
  "Lucknow",
  "Mumbai",
  "Nagpur",
  "Patna",
  "Pimpri-Chinchwad",
  "Pune",
  "Surat",
  "Thane",
  "Vadodara",
  "Visakhapatnam"
];


const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

// For State input
 


  const [searchTerm, setSearchTerm] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const [showStates,setShowStates] = useState(false)
  const [showCities,setShowCities] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldPopups, setFieldPopups] = useState({}); // { fieldName: message }
  const [agree, setAgree] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const isMounted = useRef(true);

  // allow the number part in side phone input 




  // prevent state updates when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // city ref

  useEffect(() => {
  function handleClickOutside(e) {
    if (cityRef.current && !cityRef.current.contains(e.target)) {
      setShowCities(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
   }, []);


   // state ref 
  useEffect(() => {
  function handleOutsideState(e) {
    if (stateRef.current && !stateRef.current.contains(e.target)) {
      setShowStates(false);
    }
  }

   document.addEventListener("mousedown", handleOutsideState);
   return () => {
    document.removeEventListener("mousedown", handleOutsideState);
   };
   }, []);



  // hide error toast automatically after 4s
  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => {
      if (isMounted.current) setErrorMsg("");
    }, 1000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  // hide success toast automatically after 1s
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => {
      if (isMounted.current) setSuccessMsg("");
    }, 2000);
    return () => clearTimeout(t);
  }, [successMsg]);

  // show a per-field popup for a short time
  const showFieldPopup = (field, msg, duration = 3000) => {
    setFieldPopups((prev) => ({ ...prev, [field]: msg }));
    // clear after duration
    setTimeout(() => {
      if (!isMounted.current) return;
      setFieldPopups((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }, duration);
  };

  
  // handle input change
const handleChange = (e) => {
  const { name, value } = e.target;
  let updatedValue = value;

  // ⭐ PHONE: auto +91 + digits only
  if (name === "phone") {
    let clean = value.replace(/^\+91/, "");   // remove manual +91
    clean = clean.replace(/[^0-9]/g, "");     // digits only
    clean = clean.slice(0, 10);               // max 10 digits
    updatedValue = "+91 " + clean;
  }

  // ⭐ GST: only CAPITAL letters + digits (block lowercase)
  if (name === "gst") {
    updatedValue = value.toUpperCase().replace(/[^0-9A-Z]/g, "");
    // lowercase converts to uppercase automatically
    // alphabets + numbers ONLY
  }

  // update input values
  setFormData((prev) => ({
    ...prev,
    [name]: updatedValue,
  }));

  // clear errors
  setErrorMsg("");
  setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  setFieldPopups((prev) => {
    const copy = { ...prev };
    delete copy[name];
    return copy;
  });
};



  

  // validation - improved checks for phone, gst, password length
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name required";
    if (!formData.lastName.trim()) errors.lastName = "Last name required";

    if (!formData.email.trim()) {
      errors.email = "Email required";
    } else {
      // basic email format check
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(formData.email.trim())) errors.email = "Invalid email";
    }

    // phone: exactly 10 digits
    let phone = formData.phone.replace(/\s+/g, "").trim();
    const phoneRe = /^(\+91[0-9]{10}|[0-9]{10})$/;

    if (!phone) {
    errors.phone = "add +91 Phone number required";
    } else if (!phoneRe.test(phone)) {
    errors.phone = "Enter 10 digit phone number";
    }



    // gst: exactly 8 digits (per your requirement). adjust if needed.
const gst = formData.gst.toUpperCase().replace(/\s+/g, "");

const gstRe = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9][A-Z][0-9A-Z]$/;

if (!gst) {
  errors.gst = "15 character GST is required";
} else if (gst.length !== 15) {
  errors.gst = "GST must be exactly 15 characters";
} else if (!gstRe.test(gst)) {
  errors.gst = "Invalid GST format. Use only CAPITAL letters and numbers";
}




    if (!formData.city.trim()) errors.city = "City required";
    if (!formData.state.trim()) errors.state = "State required";

    // password length 8-15
    const pwd = formData.password;
    if (!pwd.trim()) {
      errors.password = "8-15 char password required";
    } else if (pwd.length < 8 || pwd.length > 15) {
      errors.password = "Password must be 8 to 15 characters";
    }

    if (!formData.confirmPassword.trim())
      errors.confirmPassword = "Confirm password required";

    if (
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password !== formData.confirmPassword
    )
      errors.confirmPassword = "Passwords do not match";

    if (!agree) errors.agree = "Please agree to terms & conditions";

    return errors;
  };

  // handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      // show a popup for each invalid field so user notices immediately
      Object.entries(errors).forEach(([field, msg]) => {
        showFieldPopup(field, msg, 3000);
      });

      return;
    }

    setLoading(true);

    // Navigate to dashboard immediately (user requested)
    navigate("/dashboard");

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobileNumber: formData.phone,
      gstNumber: formData.gst,
      city: formData.city,
      state: formData.state,
      createPassword: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    try {
      const res = await axios.post(
        "https://cloth-backend-yhka.onrender.com/signup",
        payload
      );

      const body = res.data || {};
      const msg = (body.message || "").toLowerCase();
      const successDetected =
        body.success === true ||
        body.status === true ||
        msg.includes("success") ||
        msg.includes("created") ||
        msg.includes("registered");

      if (successDetected) {
        if (isMounted.current) {
          setErrorMsg(""); // clear errors
          setSuccessMsg("Signup successful! Redirecting to dashboard...");
        }
        if (body.token) localStorage.setItem("token", body.token);
      } else {
        if (isMounted.current)
          setErrorMsg(body.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      if (isMounted.current)
        setErrorMsg(
          err.response?.data?.message || err.message || "Server/network error"
        );
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  // small helper styles for popups (inline so you don't need external CSS)
  const popupStyle = {
    position: "absolute",
    left: 0,
    top: "100%",
    marginTop: 6,
    background: "#fff3f3",
    color: "#c40000",
    border: "1px solid #f0c0c0",
    padding: "6px 8px",
    borderRadius: 6,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    fontSize: 12,
    zIndex: 999,
    whiteSpace: "nowrap",
  };

  const inputContainerStyle = { position: "relative", display: "block" };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* ERROR TOAST (fixed so it doesn't push content) */}
        {errorMsg && (
          <div
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              maxWidth: 320,
              background: "white",
              color: "#f30505ff",
              padding: "12px 16px",
              borderRadius: 8,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              zIndex: 9999,
              fontWeight: 600,
            }}
            role="alert"
            aria-live="assertive"
          >
            {errorMsg}
          </div>
        )}

        {/* SUCCESS TOAST */}
        {successMsg && (
          <div
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              maxWidth: 320,
              background: "#e6ffed",
              color: "#04660f",
              padding: "12px 16px",
              borderRadius: 8,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              zIndex: 9999,
              fontWeight: 600,
            }}
            role="status"
            aria-live="polite"
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="signup-form">
          {/* First Name */}
          <div className="field half" style={inputContainerStyle}>
            <label>
              First Name<span className="spd">*</span>
            </label>
            <input
              className={`input-design  ${fieldErrors.firstName ? "input-error" : ""}`}
              type="text"
              name="firstName"
              placeholder={fieldErrors.firstName || ""}
              value={formData.firstName}
              onChange={handleChange}
            />
            {fieldPopups.firstName && <div style={popupStyle}>{fieldPopups.firstName}</div>}
          </div>

          {/* Last Name */}
          <div className="field half length" style={inputContainerStyle}>
            <label>
              Last 
              Name<span className="spd">*</span>
            </label>
            <input
              className={`input-design ${fieldErrors.lastName ? "input-error" : ""}`}
              type="text"
              name="lastName"
              placeholder={fieldErrors.lastName || ""}
              value={formData.lastName}
              onChange={handleChange}
            />
            {fieldPopups.lastName && <div style={popupStyle}>{fieldPopups.lastName}</div>}
          </div>

          {/* Email */}
          <div className="field full" style={inputContainerStyle}>
            <div className="emailamg">
              <label>Email</label>
              <input
                className={`input-design2 ${fieldErrors.email ? "input-error" : ""}`}
                type="email"
                name="email"
                placeholder={fieldErrors.email || ""}
                value={formData.email}
                onChange={handleChange}
              />
              {fieldPopups.email && <div style={popupStyle}>{fieldPopups.email}</div>}
            </div>
          </div>

          {/* Phone */}
          <div className="field half" style={inputContainerStyle}>
            <div className="phone-mange">
            <label>
              Phone<span className="spd">*</span>
            </label>
            <input
            className={`input-design ${fieldErrors.phone ? "input-error" : ""}`}
             type="text"
             name="phone"
             placeholder={fieldErrors.phone || ""}
             value={formData.phone}
            onChange={handleChange}
             />

            {fieldPopups.phone && <div style={popupStyle}>{fieldPopups.phone}</div>}
          </div>
          </div>

          {/* GST */}
          <div className="field half length" style={inputContainerStyle}>
            <div className="gstamg">
              <label className="fst">
                GST Number<span className="spd">*</span>
              </label>
              <input
                className={`input-design ${fieldErrors.gst ? "input-error" : ""}`}
                type="text"
                name="gst"
                maxLength={15} 
                placeholder={fieldErrors.gst || ""}
                value={formData.gst}
                onChange={handleChange}
              />
              {fieldPopups.gst && <div style={popupStyle}>{fieldPopups.gst}</div>}
            </div>
          </div>


   {/*state*/}
   <div className="field half length" style={inputContainerStyle}>
    <div className="state-mange" style={{ position: "relative" }} ref={stateRef}>
    <div className="state-mng" style={{ position: "relative", overflow: "visible" }}>
       <label>
      State<span className="spd">*</span>
     </label>

  {/* Input */}
    <input
    className={`input-design tab-view ${fieldErrors.state ? "input-error" : ""}`}
    type="text"
    name="state"
    placeholder={fieldErrors.state || "Select State"}
    value={searchTerm}        // <-- keep this as searchTerm
    onClick={() => setShowStates(!showStates)}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ position: "relative", zIndex: 20 }}
    />
    {/* Dropdown */}

     {showStates && (
     <ul className="city-dropdown">
      {states
        .filter(state => state.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((stateName, idx) => (
        <li
        key={idx}
        onClick={() => {
        setFormData({ ...formData, state: stateName }); // store for backend
        setSearchTerm(stateName);                        // show in input
        setShowStates(false);
       }}
       >
      {stateName}
      </li>
       ))}
      </ul>
         )}
      </div>
      </div>
      </div>




     {/* City */}
     <div className="field half" style={inputContainerStyle}>
     <div className="city-mange" style={{ position: "relative" }} ref={cityRef}>
     <div className="city-mng" style={{ position: "relative", overflow: "visible" }}>
     <label>
     City<span className="spd">*</span>
     </label>
     {/* Input */}
      <input
        className={`input-design ${fieldErrors.city ? "input-error" : ""}`}
        type="text"
        name="city"
        placeholder={fieldErrors.city || "Select City"}
        value={searchCity}                      // controlled input
        onClick={() => setShowCities(!showCities)}
        onChange={(e) => setSearchCity(e.target.value)}
        style={{ position: "relative", zIndex: 20 }}
      />
      {/* Dropdown */}
      {showCities && (
      <ul className="city-dropdown">
      {cityList
      .filter(city => city.toLowerCase().includes(searchCity.toLowerCase()))
      .map((cityName, idx) => (
       <li
       key={idx}
       onClick={() => {
       setFormData({ ...formData, city: cityName }); // store for backend
       setSearchCity(cityName);                       // show in input
       setShowCities(false);
       }}
       >
       {cityName}
       </li>
        ))}
      </ul>
      )}

      {/* Popup */}
      {fieldPopups.city && <div style={popupStyle}>{fieldPopups.city}</div>}
    </div>
  </div>
</div>


          {/* Password */}
          <div className="field half password-field" style={inputContainerStyle}>
            <div className="password-mange">
              <label>
                Password<span className="spd">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  className={`setting2 ${fieldErrors.password ? "input-error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={fieldErrors.password || ""}
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {fieldPopups.password && <div style={popupStyle}>{fieldPopups.password}</div>}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="field half password-field" style={inputContainerStyle}>
            <div>
            <label className="confirm-pass">
              Confirm Password<span className="spd">*</span>
            </label>
            <div className="password-wrapper">
              <input
                className={`setting1 ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder={fieldErrors.confirmPassword || ""}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                className="eye-icon2"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {fieldPopups.confirmPassword && (
              <div style={popupStyle}>{fieldPopups.confirmPassword}</div>
            )}
          </div>
          </div>

          {/* Checkbox */}
          <div className="warning" style={{ position: "relative" }}>
            <p className="prg">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />{" "}
              I agree to terms & conditions <span className="spd">*</span>
            </p>
            {fieldErrors.agree && (
              <p style={{ color: "red", fontSize: "12px" }}>{fieldErrors.agree}</p>
            )}
            {fieldPopups.agree && <div style={{ ...popupStyle, left: 0 }}>{fieldPopups.agree}</div>}
          </div>

          <div className="field full">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Please wait..." : "SignUp"}
            </button>
          </div>

          <div className="account">
            <p className="upper">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------- DASHBOARD COMPONENT ----------------------
function Dashboard() {
  const [file, setFile] = useState(null);
  const [subOrderNo, setSubOrderNo] = useState("");
  const [filterResult, setFilterResult] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState({
    all: 0,
    rto: 0,
    door_step_exchanged: 0,
    delivered: 0,
    cancelled: 0,
    ready_to_ship: 0,
    shipped: 0,
    other: 0,
    totalSupplierListedPrice: 0,
    totalSupplierDiscountedPrice: 0,
    sellInMonth: 0,
    totalProfit: 0,
    deliveredSupplierDiscountedPriceTotal: 0,
    totalDoorStepExchanger: 0,
  });
  const [profitPercent, setProfitPercent] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showFilteredView, setShowFilteredView] = useState(false);
  

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Toggle menu when clicking Shivayom
  const handleToggle = () => {
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownload = () => {
    fetch("https://cloth-backend-yhka.onrender.com/download-pdf", {
      method: "GET",
      headers: { Accept: "application/pdf" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to download");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "dashboard-report.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Download error:", err);
        alert("Failed to download PDF. Please try again.");
      });
  };

  const validateFile = (file) => {
    return (
      file &&
      (file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls"))
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid CSV or Excel file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    } else {
      alert("Only .csv or .xlsx files are supported");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFilter = async () => {
    if (!subOrderNo) {
      alert("Please enter a Sub Order No.");
      return;
    }
    try {
      const res = await axios.get(
        `https://cloth-backend-yhka.onrender.com/filter/${subOrderNo}`
      );
      setFilterResult(res.data);
      const calcProfit = 500 - res.data.discountedPrice;
      const calcProfitPercent = (calcProfit / 500) * 100;
      setProfitPercent(calcProfitPercent.toFixed(2));
      setShowFilteredView(true);
    } catch (err) {
      console.error("Filter failed", err);
      alert("No matching sub order found");
    }
  };

  const handleSubmitAll = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const uploadRes = await axios.post(
        "https://cloth-backend-yhka.onrender.com/upload",
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const result = uploadRes.data;
      const totalListed = result.totals?.totalSupplierListedPrice || 0;
      const totalDiscounted = result.totals?.totalSupplierDiscountedPrice || 0;
      const totalProfit = result.totals?.totalProfit || 0;
      const deliveredTotalDiscounted =
        result.totals?.deliveredSupplierDiscountedPriceTotal || 0;
      const totalDoorStepExchanger =
        result.totals?.totalDoorStepExchanger || 0;
      const sellInMonthProducts = result.totals?.sellInMonthProducts || 0;

      const updatedData = {
        all: result.all?.length || 0,
        rto: result.rto?.length || 0,
        door_step_exchanged: result.door_step_exchanged?.length || 0,
        delivered: result.delivered?.length || 0,
        cancelled: result.cancelled?.length || 0,
        ready_to_ship: result.ready_to_ship?.length || 0,
        shipped: result.shipped?.length || 0,
        other: result.other?.length || 0,
        totalSupplierListedPrice: totalListed,
        totalSupplierDiscountedPrice: totalDiscounted,
        sellInMonth: sellInMonthProducts,
        totalProfit,
        deliveredSupplierDiscountedPriceTotal: deliveredTotalDiscounted,
        totalDoorStepExchanger,
      };

      setData(updatedData);

      const calcProfitPercent =
        sellInMonthProducts > 0
          ? (totalProfit / (sellInMonthProducts * 500)) * 100
          : 0;
      setProfitPercent(calcProfitPercent.toFixed(2));

      if (result.profitByDate) {
        let graphArr = [];
        if (!Array.isArray(result.profitByDate)) {
          graphArr = Object.entries(result.profitByDate).map(
            ([date, profit]) => ({
              date,
              profit,
            })
          );
        } else {
          graphArr = result.profitByDate;
        }
        setGraphData(graphArr);
      }
    } catch (err) {
      console.error("Submit all failed", err);
      alert("Failed to process & store data");
    }
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div
          className="navbar-logo"
          onClick={() => {
            setShowFilteredView(false);
            setProfitPercent(0);
            setSubOrderNo("");
            setFilterResult(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{ cursor: "pointer" }}
        >
          Meesho
        </div>

        <div className="navbar-search">
          <IoSearch  className="search"/>
          <input
            type="search"
            placeholder="Add here Sub Order No"
            value={subOrderNo}
            onChange={(e) => setSubOrderNo(e.target.value)}
          />
         
        </div>

             
         <div>
          <button className="filter-btn" onClick={handleFilter}>
            Filter
          </button>
          {showFilteredView && (
            <button
              className="filter-btn"
              onClick={() => {
                setShowFilteredView(false);
                setProfitPercent(0);
                setSubOrderNo("");
                setFilterResult(null);
              }}
            >
              Back
            </button>
          )}
       </div>

   

     <div className="logo-heading" ref={menuRef}>
      <div onClick={handleToggle} className="logo-container">
        <img src="/Ellipse 2.png" className="shivay" alt="logo" />
        <h1 className="heading1">Shivayom</h1>
      </div>

      {showMenu && (
        <div className="dropdown">
          <Link to="/signup" className="dropdown-item">
            Signup
          </Link>
          <Link to="/login" className="dropdown-item">
            Login
          </Link>
        </div>
      )}
    </div>
        </nav>


      <div className="dashboard-container">
      <h1 className="heading">Product Status Dashboard</h1>
      {!showFilteredView ? (
        <div className="adjust-box">
        <div className="status-boxes">

      <div className="box all">
      <div className="box-content">
      All<br />
    <span>{data.all}</span>
     </div>
    <div className="background-logo">
    <img src="/Vector.png" className="box-symbol" alt="cart" />
    </div>
    </div>

          <div className="box rto">
           <div className="box-content"> 
            RTO<br />
            <span>{data.rto}</span>
            </div>
            <div className="background-logo">
           <img src="/Group.png" className="box-symbol" alt="cart" />
           </div>
          </div>


          <div className="box door_step_exchanged">
           <div className="box-content">
            Door Step Exchanged<br />
            <span>{data.door_step_exchanged}</span>
            <br />
            <small style={{ fontSize: "25px", color: "#222" }}>
              {data.totalDoorStepExchanger.toLocaleString()}
            </small>
            </div>
            <div className="background-logo">
           <img src="/gir.png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box delivered">
            <div className="box-content">
            Delivered<br />
            <span>{data.delivered}</span>
            <br />
            <small style={{ fontSize: "25px", color: "#222" }}>
              ₹{data.deliveredSupplierDiscountedPriceTotal.toLocaleString()}
            </small>
            </div>
            <div className="background-logo">
           <img src="/Vector (2).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box cancelled">
            <div className="box-content">
            Cancelled<br />
            <span>{data.cancelled}</span>
            </div>
            <div className="background-logo">
           <img src="/Group (1).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box ready_to_ship">
            <div className="box-content">
            Pending<br />
            <span>{data.ready_to_ship}</span>
            </div>
           <div className="background-logo">
           <img src="/pending.png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box shipped">
            <div className="box-content">
            Shipped<br />
            <span>{data.shipped}</span>
            </div>
           <div className="background-logo">
           <img src="/Group (2).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Other<br />
            <span>{data.other}</span>
            </div>
            <div className="background-logo">
           <img src="/other.png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Supplier Listed Total Price<br />
            <span>{data.totalSupplierListedPrice.toLocaleString()}</span>
          </div>
           <div className="background-logo">
           <img src="/Group (3).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Supplier Discounted Total Price<br />
            <span>{data.totalSupplierDiscountedPrice.toLocaleString()}</span>
            </div>
            <div className="background-logo">
           <img src="/Group (4).png" className="box-symbol" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Total Profit<br />
            <span>{data.totalProfit.toLocaleString()}</span>
            </div>
            <div className="background-logo">
           <img src="/total profit.png" className="box-img" alt="cart" />
           </div>
          </div>

          <div className="box other">
            <div className="box-content">
            Profit %<br />
            <span>{profitPercent}%</span>
          </div>
            <div className="background-logo">
           <img src="/Group (5).png" className="box-img" alt="cart" />
           </div>
          </div>
        </div>
        </div>
      ) : (
        filterResult && (
          <div className="status-boxes">
            <div className="box other">
              Supplier Listed Price<br />
              <span>{filterResult.listedPrice.toLocaleString()}</span>
            </div>
            <div className="box other">
              Supplier Discounted Price<br />
              <span>{filterResult.discountedPrice.toLocaleString()}</span>
            </div>
            <div className="box other">
              Profit (per product)<br />
              <span>{(500 - filterResult.discountedPrice).toLocaleString()}</span>
            </div>
            <div className="box other">
              Profit %<br />
              <span>{profitPercent}%</span>
            </div>
          </div>
        )
      )} 

      

    {/* Button to toggle graph */}
<div style={{ margin: "20px 0" }}>
  <button
    className="graph-toggle-btn"
    onClick={() => setShowGraph(!showGraph)}
  >
    {showGraph ? "Hide Profit Graph" : "Show Profit Graph"}
  </button>
</div>

{/* Graph */}
{showGraph && graphData.length > 0 && (
  <div className="graph-container" style={{ width: "100%", height: "400px" }}>
    <h2 className="graph-title">📈 Profit Trend (Per Date)</h2>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={graphData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="5 5" stroke="#ddd" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "black" }} />
        <YAxis tick={{ fontSize: 12, fill: "black" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          labelStyle={{ fontWeight: "bold", color: "#333" }}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#fff" // line color for visibility on gradient background
          strokeWidth={3}
          dot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: "#B00087" }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}



      {/* File Upload */}
      <div className="square-box">
         <h1 className="head">Upload File</h1>
      <div
        className={`upload-section ${dragActive ? "drag-active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        >
       
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileChange}
        /> 
        <img src="/Group (6).png" className="cloud-icon" alt="upload" />
        <p className="drag">Drag and drop your CSV or Excel file here</p>
        <p className="drop">Or Browser</p>
        {file && <p className="filename">Selected File: {file.name}</p>}
        <button className="upload-btn">Upload</button>
      </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleSubmitAll}
          disabled={!file}
          style={{
            backgroundImage: "linear-gradient(90deg, #B00087, #E8AED9)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            marginRight: "10px",
          }}
        >
          Submit All (Upload & Save)
        </button>
        <button
          onClick={handleDownload}
          style={{
            backgroundImage: "linear-gradient(90deg, #B00087, #E8AED9)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
    </div>
  );
}



function App() {
const isLoggedIn = localStorage.getItem("user");
  return (
<Router>
      <Routes>
        {/* Default page -> Signup */}
        <Route
          path="/"
          element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;