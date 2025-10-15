"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5050/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal ambil produk");
        const data = await res.json();

        setProduct({
          name: data.name || "",
          price: data.price || "",
          category: data.category || "",
          description: data.description || "",
          stock: data.stock || "",
        });

        if (data.image) {
          setPreview(`http://localhost:5050/uploads/${encodeURIComponent(data.image)}`);
        }
      } catch (err) {
        console.error(err);
        alert("Gagal memuat produk");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

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
    formData.append("description", product.description);
    formData.append("stock", product.stock);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5050/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal update produk");
      alert("Produk berhasil diupdate!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update produk.");
    }
  };

  if (loading) return <p className="text-center py-10">Memuat data produk...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Produk</h1>

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
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Update Produk
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
