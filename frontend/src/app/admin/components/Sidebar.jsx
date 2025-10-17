"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-5 flex flex-col">
      <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-3">
        <Link href="/admin" className="hover:bg-gray-700 p-2 rounded">
          📊 Dashboard
        </Link>
        <Link href="/admin/products" className="hover:bg-gray-700 p-2 rounded">
          📦 Produk
        </Link>
        <Link href="/admin/orders" className="hover:bg-gray-700 p-2 rounded">
          📋 Pesanan
        </Link>
        <Link href="/admin/customers" className="hover:bg-gray-700 p-2 rounded">
          👥 Pelanggan
        </Link>
        <Link href="/admin/analytics" className="hover:bg-gray-700 p-2 rounded">
          📈 Analytics
        </Link>
        <Link href="/admin/settings" className="hover:bg-gray-700 p-2 rounded">
          ⚙️ Pengaturan
        </Link>
      </nav>
    </aside>
  );
}
