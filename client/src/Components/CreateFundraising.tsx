import React, { useState } from "react";

export const CreateFundraisingForm: React.FC = () => {
  // Step 1: Set up state variables for each input field
  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    description: "",
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
        type="text"
        name="title"
        value={formData.name} // Binding the input to state
        onChange={handleChange} // Updating the state when the user types
        placeholder="Fundraising Title"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="goal"
        placeholder="Fundraising Goal"
        value={formData.goal}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
};

const CreateFundraisingPage = () => {
  return (
    <div className="fundraising-form">
      <h2>Create New Fundraising</h2>
      <CreateFundraisingForm />
    </div>
  );
};
export default CreateFundraisingPage;
