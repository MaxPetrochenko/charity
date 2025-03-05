import React, { useState } from "react";

//
//   </div>
export const LoginForm: React.FC = () => {
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    console.log("Form submitted:", formData);
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
        Don't have an account? <a href="register.html">Register here</a>
      </p>
    </div>
  );
};
export default LoginPage;
