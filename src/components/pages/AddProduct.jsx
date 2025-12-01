import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ImageIcon, ArrowLeft } from "lucide-react";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    category: "Men",
    price: "",
    description: "",
  });
  const [imageBase64, setImageBase64] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Convert image to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedAdmin = JSON.parse(localStorage.getItem("loggedInUser"));
    const adminId = storedAdmin?._id;

    if (!imageBase64) {
      alert("Please upload an image!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://ecombackend-5p7z.onrender.com/api/addproduct", {
        ...product,
        adminId,
        image: imageBase64,
      });
      alert("✅ Product added successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center text-purple-700 hover:text-purple-900 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-extrabold text-purple-800">
          Add New Product
        </h1>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left Side - Product Info */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              >
                <option>Men</option>
                <option>Women</option>
                <option>Kids</option>
                <option>Accessories</option>
                <option>Footwear</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter price"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter product details"
                className="w-full border rounded-lg px-4 py-2 h-28 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Right Side - Image Upload */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-6 bg-purple-50/40 hover:bg-purple-100 transition">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-56 h-56 object-cover rounded-xl shadow-md border mb-4"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400 mb-4">
                <ImageIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">No image selected</p>
              </div>
            )}

            <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </label>
          </div>
        </form>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
