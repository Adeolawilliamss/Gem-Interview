import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from './../context/AlertContext';
import axios from "axios";

export default function Signup() {
   const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your backend signup endpoint
      const res = await axios.post("http://localhost:5000/api/users/signup", formData);

       if (res.data.status === 'success') {
        // Save access token to localStorage
        localStorage.setItem('accessToken', res.data.accessToken);
        showAlert('success', 'Account Created!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (err) {
      console.error("Signup failed", err.response?.data || err.message);
    }
  };

  return (
    <div id="Signup" className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row">
        <div className="w-full bg-white md:w-1/2">
            <img src="udemyPhoto.webp" alt="Signup"/>
        </div>
        <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full md:w-1/2"
      >
        <h2 className="text-2xl font-bold mb-6 md:mt-20 text-center">Create an Account</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password Confirm</label>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded mb-10 hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </form>
      </div>
    </div>
  );
}
