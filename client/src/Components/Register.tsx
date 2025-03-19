import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
//
//   </div>
export const RegisterForm: React.FC = () => {
  // Step 1: Set up state variables for each input field
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Step 2: Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, // spread the existing state
      [name]: value, // update the specific field
    });
  };
  const navigate = useNavigate();
  // Step 3: Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    console.log("Form submitted:", formData);
    try {
      const response = await axiosInstance.post(
        process.env.REACT_APP_API_AUTH_PATH! + "/register",
        formData
      );
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.log("Error: ", error);
    }

    // You can now send the formData to an API or process it further
  };
  return (
    <form onSubmit={handleSubmit}>
      {/* Name input */}
      <input
        type="email"
        name="email"
        value={formData.email} // Binding the input to state
        onChange={handleChange} // Updating the state when the user types
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

const RegisterPage = () => {
  return (
    <div className="auth-container">
      <h2>Register an account</h2>
      <RegisterForm />
    </div>
  );
};
export default RegisterPage;
