"use client";

import { useState } from "react";

export default function AddProductPage() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("category", product.category);
    formData.append("stock", product.stock);
    formData.append("description", product.description);
    if (image) formData.append("image", image); // file upload

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5050/api/products", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal menyimpan produk");
      alert("Produk berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan produk.");
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-medium mb-1">Nama Produk</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Harga */}
        <div>
          <label className="block text-sm font-medium mb-1">Harga</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Stok */}
        <div>
          <label className="block text-sm font-medium mb-1">Stok</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Gambar Produk */}
        <div>
          <label className="block text-sm font-medium mb-1">Gambar Produk</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Simpan Produk
        </button>
      </form>
    </div>
  );
}
