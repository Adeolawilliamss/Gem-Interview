import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from './../context/AlertContext';
import axios from "axios";

export default function Login() {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", formData);
      if (res.data.status === 'success') {
        // Save access token to localStorage
        localStorage.setItem('accessToken', res.data.accessToken);
        showAlert('success', 'Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
       showAlert('error', error.response?.data?.message || 'Login failed');
      console.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div id="Login" className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row">
        <div className="bg-white w-full md:w-1/2">
          <img src="udemyPhoto.webp" alt="Login" className="hidden md:block"/>
          <img src="Signup.webp" alt="Login" className="block md:hidden"/>
        </div>
        <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full md:w-1/2"
      >
        <h2 className="text-2xl font-bold md:mt-20 mb-6 text-center">Login</h2>

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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 mb-10 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
      </div>
    </div>
  );
}
