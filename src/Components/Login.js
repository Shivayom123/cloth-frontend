// import React, { useState } from "react";
// import axios from "axios";
// import "./Login.css";

// function Login() {
//   const [mode, setMode] = useState("login"); // login | signup | otp
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     gst: "",
//     city: "",
//     country: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [otp, setOtp] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   // Forgot password states
//   const [showForgot, setShowForgot] = useState(false);
//   const [forgotValue, setForgotValue] = useState("");
//   const [showOtpModal, setShowOtpModal] = useState(false); // Step 1 OTP
//   const [resetOtp, setResetOtp] = useState("");
//   const [showNewPassModal, setShowNewPassModal] = useState(false); // Step 2 new password
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [showSuccessModal, setShowSuccessModal] = useState(false); // Step 3 success
//   const [showNewPassword, setShowNewPassword] = useState(false); // toggle eye
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false); // toggle eye

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // Signup / login
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // ... existing signup/login logic
//   };

//   // OTP verification (Step 1)
//   const handleVerifyOtp = async () => {
//     try {
//       const res = await axios.post(
//         "https://product-backend-2-6atb.onrender.com/reset-password",
//         {
//           value: forgotValue,
//           otp: resetOtp,
//           newPassword: "temp", // temporary, we just validate OTP first
//         }
//       );
//       if (res.data.success || res.data.message.includes("Invalid or expired OTP") === false) {
//         setShowOtpModal(false);
//         setShowNewPassModal(true); // open new password modal
//       } else {
//         alert(res.data.message || "Invalid OTP");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   // Update new password (Step 2)
//   const handleUpdatePassword = async () => {
//     if (newPassword !== confirmNewPassword) {
//       alert("Passwords do not match");
//       return;
//     }
//     try {
//       const res = await axios.post(
//         "https://product-backend-2-6atb.onrender.com/reset-password",
//         {
//           value: forgotValue,
//           otp: resetOtp,
//           newPassword,
//         }
//       );
//       if (res.data.success) {
//         setShowNewPassModal(false);
//         setShowSuccessModal(true);
//       } else {
//         alert(res.data.message || "Failed to reset password");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   // Step 0: Request OTP
//   const handleForgotPassword = async () => {
//     try {
//       const res = await axios.post(
//         "https://product-backend-2-6atb.onrender.com/forgot-password",
//         { value: forgotValue }
//       );
//       if (res.data.success) {
//         alert("OTP sent to your email/phone");
//         setShowForgot(false);
//         setShowOtpModal(true); // Step 1
//       } else {
//         alert(res.data.message || "Reset failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   // Resend OTP
//   const handleResend = async () => {
//     try {
//       const res = await axios.post(
//         "https://product-backend-2-6atb.onrender.com/resend-otp",
//         { value: forgotValue }
//       );
//       if (res.data.success) {
//         alert("OTP resent successfully");
//       } else {
//         alert(res.data.message || "Failed to resend OTP");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="loginpage-container">
//       <div className="loginpage-box">
//         <div className="loginpage-left">Meesho</div>
//         <div className="loginpage-right">
//           <h2>{mode === "login" ? "Login" : mode === "signup" ? "Sign up" : "Verify OTP"}</h2>
//           <div className="underline" />

//           {mode !== "otp" && (
//             <form onSubmit={handleSubmit} className="loginpage-form">
//               {mode === "login" && (
//                 <>
//                   <div className="field full">
//                     <label className="field-label">E-mail ID</label>
//                     <input
//                       name="email"
//                       type="email"
//                       placeholder="Email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <div className="field full">
//                     <label className="field-label">Password</label>
//                     <div className="input-wrap">
//                       <input
//                         className="input-design"
//                         name="password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                       />
//                       <button
//                         type="button"
//                         className="eye-btn"
//                         onClick={() => setShowPassword((s) => !s)}
//                       >
//                         {showPassword ? "🙈" : "👁️"}
//                       </button>
//                     </div>
//                   </div>
//                   <p className="forgot-link">
//                     <a href="#" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>
//                       Forgot Password?
//                     </a>
//                   </p>
//                 </>
//               )}

//               <div className="field full">
//                 <button type="submit" className="btn-primary">
//                   {mode === "signup" ? "Sign up" : "Sign in"}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>

//       {/* Step 0: Forgot Password Modal */}
//       {showForgot && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>Forgot Password</h3>
//             <label>Email or Mobile Number</label>
//             <input
//               type="text"
//               placeholder="Enter email or mobile"
//               value={forgotValue}
//               onChange={(e) => setForgotValue(e.target.value)}
//             />
//             <button className="btn-primary" onClick={handleForgotPassword}>
//               Send OTP
//             </button>
//             <button className="close-btn" onClick={() => setShowForgot(false)}>
//               ✖ Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 1: Enter OTP Modal */}
//       {showOtpModal && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>Enter OTP</h3>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={resetOtp}
//               onChange={(e) => setResetOtp(e.target.value)}
//             />
//             <button className="btn-primary" onClick={handleVerifyOtp}>
//               Verify OTP
//             </button>
//             <p className="resend-text">
//               Didn't get OTP?{" "}
//               <a href="#" onClick={(e) => { e.preventDefault(); handleResend(); }}>
//                 Resend
//               </a>
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Step 2: New Password Modal */}
//       {showNewPassModal && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>Reset Password</h3>
//             <label>New Password</label>
//             <div className="input-wrap">
//               <input
//                 type={showNewPassword ? "text" : "password"}
//                 placeholder="Enter new password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="eye-btn"
//                 onClick={() => setShowNewPassword((s) => !s)}
//               >
//                 {showNewPassword ? "🙈" : "👁️"}
//               </button>
//             </div>

//             <label>Confirm Password</label>
//             <div className="input-wrap">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm new password"
//                 value={confirmNewPassword}
//                 onChange={(e) => setConfirmNewPassword(e.target.value)}
//               />
//               <button
//                 type="button"
//                 className="eye-btn"
//                 onClick={() => setShowConfirmPassword((s) => !s)}
//               >
//                 {showConfirmPassword ? "🙈" : "👁️"}
//               </button>
//             </div>

//             <button className="btn-primary" onClick={handleUpdatePassword}>
//               Update Password
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Step 3: Success Modal */}
//       {showSuccessModal && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>Success!</h3>
//             <p>Congratulations! You have been successfully authenticated.</p>
//             <button className="btn-primary" onClick={() => setShowSuccessModal(false)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;
