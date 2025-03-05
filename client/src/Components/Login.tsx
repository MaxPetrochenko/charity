import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export const LoginForm: React.FC = () => {
  // Step 1: Set up state variables for each input field
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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

  const { login } = useAuth();
  // Step 3: Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    console.log("Form submitted:", formData);
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL! + "api/auth/login",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
      await login();
      navigate("/");
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

const LoginPage = () => {
  return (
    <div className="auth-container">
      <h2>Login to Your Account</h2>
      <LoginForm />
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};
export default LoginPage;
