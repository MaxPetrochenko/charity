import React, { useState } from "react";
import axios from "axios";
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

  // Step 3: Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    console.log("Form submitted:", formData);
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL! +
          process.env.REACT_APP_API_AUTH_PATH! +
          "register",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
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
