"use client";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard Admin</h1>
      <div className="flex gap-4">
        <Link href="/admin/products" className="p-4 bg-white shadow rounded">
        📦 Lihat Produk
        </Link>
        <Link href="/admin/products/add" className="p-4 bg-white shadow rounded">
          Tambah Produk
        </Link>
      </div>
    </div>
  );
}
