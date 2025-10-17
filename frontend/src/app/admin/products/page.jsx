"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5050/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal ambil produk");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5050/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus produk");
      alert("Produk berhasil dihapus");
      fetchProducts(); // Refresh data
    } catch (err) {
      alert("Gagal menghapus produk");
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length ? [] : products.map(p => p.id)
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedProducts.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      let updates = {};

      switch (bulkAction) {
        case "activate":
          updates = { is_active: true };
          break;
        case "deactivate":
          updates = { is_active: false };
          break;
        case "feature":
          updates = { is_featured: true };
          break;
        case "unfeature":
          updates = { is_featured: false };
          break;
        default:
          return;
      }

      const res = await fetch("http://localhost:5050/api/products/bulk/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_ids: selectedProducts, updates }),
      });

      if (!res.ok) throw new Error("Gagal melakukan bulk action");
      alert(`Berhasil update ${selectedProducts.length} produk`);
      setSelectedProducts([]);
      setBulkAction("");
      fetchProducts();
    } catch (err) {
      alert("Gagal melakukan bulk action");
    }
  };

  if (loading) return <p className="text-center py-10">Memuat data produk...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Daftar Produk ({products.length})</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/products/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tambah Produk
          </Link>
          <button
            onClick={fetchProducts}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="font-medium">{selectedProducts.length} produk dipilih</span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="">Pilih aksi...</option>
              <option value="activate">Aktifkan</option>
              <option value="deactivate">Nonaktifkan</option>
              <option value="feature">Jadikan Featured</option>
              <option value="unfeature">Hapus Featured</option>
            </select>
            <button
              onClick={handleBulkAction}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Terapkan
            </button>
            <button
              onClick={() => setSelectedProducts([])}
              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3">Gambar</th>
              <th className="p-3">Nama & SKU</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(p.id)}
                      onChange={() => handleSelectProduct(p.id)}
                    />
                  </td>
                  <td className="p-3">
                    {p.images && p.images.length > 0 && p.images[0].image_url ? (
                      <img
                        src={`http://localhost:5050/uploads/${encodeURIComponent(p.images[0].image_url)}`}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center" style={{ display: (!p.images || p.images.length === 0 || !p.images[0].image_url) ? 'flex' : 'none' }}>
                      📦
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-500">SKU: {p.sku || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="p-3">{p.category_name || 'Uncategorized'}</td>
                  <td className="p-3">
                    <div>Rp {p.price?.toLocaleString()}</div>
                    {p.compare_price && (
                      <div className="text-sm text-gray-500 line-through">
                        Rp {p.compare_price.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={p.stock_quantity <= p.low_stock_threshold ? 'text-red-600 font-medium' : ''}>
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      p.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {p.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                    {p.is_featured && (
                      <span className="ml-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="px-3 py-1 bg-yellow-400 rounded text-white hover:bg-yellow-500 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="px-3 py-1 bg-red-500 rounded text-white hover:bg-red-600 text-sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Tidak ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
