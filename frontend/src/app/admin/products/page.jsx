"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchProducts();
  }, []);

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
      // Refresh data setelah delete
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Gagal menghapus produk");
    }
  };

  if (loading) return <p className="text-center py-10">Memuat data produk...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Daftar Produk</h1>
        <Link
          href="/admin/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Produk
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Gambar</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Stok</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={p.image ? `http://localhost:5050/uploads/${encodeURIComponent(p.image)}` : "/no-image.png"}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">Rp {p.price.toLocaleString()}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="px-3 py-1 bg-yellow-400 rounded text-white hover:bg-yellow-500"
                    >
                      Edit
                    </Link>
                    <button
                      className="px-3 py-1 bg-red-500 rounded text-white hover:bg-red-600"
                      onClick={() => handleDelete(p.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
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
