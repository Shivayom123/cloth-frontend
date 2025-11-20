// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom"; // import Link

// import "./Signup.css";

// function Signup() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     gst: "",
//     city: "",
//     country: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       const payload = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         mobileNumber: formData.phone,
//         gstNumber: formData.gst,
//         city: formData.city,
//         country: formData.country,
//         createPassword: formData.password,
//         confirmPassword: formData.confirmPassword
//       };

//       const res = await axios.post(
//         "https://product-backend-2-6atb.onrender.com/signup",
//         payload
//       );

//       if (res.data.success) {
//         alert("Signup successful!");
//         setFormData({
//           firstName: "",
//           lastName: "",
//           email: "",
//           phone: "",
//           gst: "",
//           city: "",
//           country: "",
//           password: "",
//           confirmPassword: ""
//         });
//       } else {
//         alert(res.data.message || "Signup failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-box">
//         <h2>Sign Up</h2>
//         <div className="signup-left">Meesho</div>
        
//         <div className="underline" />

//         <form onSubmit={handleSignup} className="signup-form">
//           <div className="field half">
//             <label>First Name *</label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder="First Name"
//               required
//             />
//           </div>

//           <div className="field half">
//             <label>Last Name *</label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder="Last Name"
//               required
//             />
//           </div>

//           <div className="field full">
//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email"
//               required
//             />
//           </div>

//           <div className="field half">
//             <label>Mobile Number</label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="Mobile Number"
//               required
//             />
//           </div>

//           <div className="field half">
//             <label className="label-de">GST Number</label>
//             <input
//               type="text"
//               name="gst"
//               value={formData.gst}
//               onChange={handleChange}
//               placeholder="GST Number"
//             />
//           </div>

//           <div className="field half">
//             <label>City</label>
//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               placeholder="City"
//             />
//           </div>

//           <div className="field half">
//             <label>Country</label>
//             <input
//               type="text"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               placeholder="Country"
//             />
//           </div>

//           <div className="field half">
//             <label>Create Password </label>
//             <div className="input-wrap">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Create Password"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((s) => !s)}
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           <div className="field half">
//             <label>Confirm Password </label>
//             <div className="input-wrap">
//               <input
//                 type={showConfirm ? "text" : "password"}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Confirm Password"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirm((s) => !s)}
//               >
//                 {showConfirm ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           <label className="checkbox-row">
//             <input type="checkbox" required /> I agree to the terms and
//             conditions
//           </label>

//           <div className="field full">
//             <button type="submit" className="btn-primary">
//               Sign Up
//             </button>
//           </div>

//           {/* Bottom login link */}
//           <p style={{ marginTop: "15px", textAlign: "center" }}>
//             Already have an account?{" "}
//             <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
//               Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Signup;
