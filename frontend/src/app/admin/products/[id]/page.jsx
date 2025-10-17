"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    description: "",
    short_description: "",
    price: "",
    compare_price: "",
    cost_price: "",
    weight: "",
    category_id: "",
    brand: "",
    tags: [],
    is_featured: false,
    seo_title: "",
    seo_description: "",
    track_inventory: true,
    stock_quantity: "",
    low_stock_threshold: "5",
    allow_backorders: false,
    requires_shipping: true,
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (id) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5050/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal ambil produk");
      const data = await res.json();

      setProduct({
        name: data.name || "",
        sku: data.sku || "",
        description: data.description || "",
        short_description: data.short_description || "",
        price: data.price || "",
        compare_price: data.compare_price || "",
        cost_price: data.cost_price || "",
        weight: data.weight || "",
        category_id: data.category_id || "",
        brand: data.brand || "",
        tags: data.tags || [],
        is_featured: data.is_featured || false,
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
        track_inventory: data.track_inventory !== false,
        stock_quantity: data.stock_quantity || "",
        low_stock_threshold: data.low_stock_threshold || "5",
        allow_backorders: data.allow_backorders || false,
        requires_shipping: data.requires_shipping !== false,
      });

      if (data.images && data.images.length > 0) {
        setExistingImages(data.images);
        setPreviews(data.images.map(img => `http://localhost:5050/uploads/${encodeURIComponent(img.image_url)}`));
      }

      if (data.attributes) {
        setAttributes(data.attributes);
      }

      if (data.variations) {
        setVariations(data.variations);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memuat produk");
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setProduct(prevProduct => {
      const updatedProduct = {
        ...prevProduct,
        [name]: newValue
      };

      // Auto-fill SEO fields if empty
      if (name === "name" && !prevProduct.seo_title) {
        updatedProduct.seo_title = newValue;
      }
      if (name === "description" && !prevProduct.seo_description) {
        updatedProduct.seo_description = newValue.length > 160 ? newValue.substring(0, 160) + "..." : newValue;
      }

      return updatedProduct;
    });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...existingImages.map(img => `http://localhost:5050/uploads/${encodeURIComponent(img.image_url)}`), ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();

    // Add basic product data
    Object.keys(product).forEach(key => {
      if (product[key] !== null && product[key] !== undefined) {
        formData.append(key, product[key]);
      }
    });

    // Add new images
    images.forEach((image, index) => {
      formData.append("images", image);
    });

    // Add attributes and variations as JSON
    if (attributes.length > 0) {
      formData.append("attributes", JSON.stringify(attributes));
    }
    if (variations.length > 0) {
      formData.append("variations", JSON.stringify(variations));
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

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal update produk");
      }

      alert("Produk berhasil diupdate!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update produk: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">Memuat data produk...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Produk</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Produk *</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SKU *</label>
            <input
              type="text"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi Singkat</label>
            <textarea
              name="short_description"
              value={product.short_description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi Lengkap</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Harga *</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Harga Banding</label>
            <input
              type="number"
              name="compare_price"
              value={product.compare_price}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Harga Pokok</label>
            <input
              type="number"
              name="cost_price"
              value={product.cost_price}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              name="category_id"
              value={product.category_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Stok</label>
            <input
              type="number"
              name="stock_quantity"
              value={product.stock_quantity}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Batas Stok Rendah</label>
            <input
              type="number"
              name="low_stock_threshold"
              value={product.low_stock_threshold}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Berat (kg)</label>
            <input
              type="number"
              step="0.01"
              name="weight"
              value={product.weight}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="track_inventory"
                checked={product.track_inventory}
                onChange={handleChange}
                className="mr-2"
              />
              Lacak Inventori
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="allow_backorders"
                checked={product.allow_backorders}
                onChange={handleChange}
                className="mr-2"
              />
              Izinkan Backorders
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="requires_shipping"
                checked={product.requires_shipping}
                onChange={handleChange}
                className="mr-2"
              />
              Membutuhkan Pengiriman
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={product.is_featured}
                onChange={handleChange}
                className="mr-2"
              />
              Produk Unggulan
            </label>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Gambar Produk (Maksimal 10 gambar)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="w-full"
          />
          {previews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">SEO Title</label>
            <input
              type="text"
              name="seo_title"
              value={product.seo_title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SEO Description</label>
            <textarea
              name="seo_description"
              value={product.seo_description}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Update Produk"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
