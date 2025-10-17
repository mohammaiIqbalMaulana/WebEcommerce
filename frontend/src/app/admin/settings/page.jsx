"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/settings');
      // Convert array to object for easier access
      const settingsObj = {};
      if (data.settings && Array.isArray(data.settings)) {
        data.settings.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
      }
      setSettings(settingsObj);
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      setSaving(true);
      await apiFetch(`/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value })
      });
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (err) {
      console.error('Failed to update setting:', err);
      alert('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key) => {
    updateSetting(key, settings[key]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-600">Configure your store settings and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          {[
            { id: 'general', label: 'General' },
            { id: 'payment', label: 'Payment' },
            { id: 'shipping', label: 'Shipping' },
            { id: 'tax', label: 'Tax & Currency' },
            { id: 'security', label: 'Security' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">General Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.store_name || ''}
                  onChange={(e) => handleInputChange('store_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSave('store_name')}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Email
                </label>
                <input
                  type="email"
                  value={settings.store_email || ''}
                  onChange={(e) => handleInputChange('store_email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSave('store_email')}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Phone
                </label>
                <input
                  type="tel"
                  value={settings.store_phone || ''}
                  onChange={(e) => handleInputChange('store_phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSave('store_phone')}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Address
                </label>
                <textarea
                  value={settings.store_address || ''}
                  onChange={(e) => handleInputChange('store_address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSave('store_address')}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Payment Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="payment_cod"
                  checked={settings.payment_cod === 'true'}
                  onChange={(e) => handleInputChange('payment_cod', e.target.checked.toString())}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="payment_cod" className="ml-2 text-sm text-gray-700">
                  Enable Cash on Delivery (COD)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="payment_bank_transfer"
                  checked={settings.payment_bank_transfer === 'true'}
                  onChange={(e) => handleInputChange('payment_bank_transfer', e.target.checked.toString())}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="payment_bank_transfer" className="ml-2 text-sm text-gray-700">
                  Enable Bank Transfer
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="payment_midtrans"
                  checked={settings.payment_midtrans === 'true'}
                  onChange={(e) => handleInputChange('payment_midtrans', e.target.checked.toString())}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="payment_midtrans" className="ml-2 text-sm text-gray-700">
                  Enable Midtrans Payment Gateway
                </label>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    updateSetting('payment_cod', settings.payment_cod);
                    updateSetting('payment_bank_transfer', settings.payment_bank_transfer);
                    updateSetting('payment_midtrans', settings.payment_midtrans);
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Payment Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Settings */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Shipping Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Shipping Fee (Rp)
                </label>
                <input
                  type="number"
                  value={settings.default_shipping_fee || ''}
                  onChange={(e) => handleInputChange('default_shipping_fee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSave('default_shipping_fee')}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Shipping Threshold (Rp)
                </label>
                <input
                  type="number"
                  value={settings.free_shipping_threshold || ''}
                  onChange={(e) => handleInputChange('free_shipping_threshold', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSave('free_shipping_threshold')}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Shipping Methods</h4>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="shipping_jne"
                  checked={settings.shipping_jne === 'true'}
                  onChange={(e) => handleInputChange('shipping_jne', e.target.checked.toString())}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="shipping_jne" className="ml-2 text-sm text-gray-700">
                  Enable JNE Shipping
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="shipping_pos"
                  checked={settings.shipping_pos === 'true'}
                  onChange={(e) => handleInputChange('shipping_pos', e.target.checked.toString())}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="shipping_pos" className="ml-2 text-sm text-gray-700">
                  Enable POS Indonesia
                </label>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    updateSetting('default_shipping_fee', settings.default_shipping_fee);
                    updateSetting('free_shipping_threshold', settings.free_shipping_threshold);
                    updateSetting('shipping_jne', settings.shipping_jne);
                    updateSetting('shipping_pos', settings.shipping_pos);
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Shipping Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tax & Currency Settings */}
        {activeTab === 'tax' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Tax & Currency Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency || 'IDR'}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="IDR">Indonesian Rupiah (IDR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
                <button
                  onClick={() => handleSave('currency')}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.tax_rate || ''}
                  onChange={(e) => handleInputChange('tax_rate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSave('tax_rate')}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Security Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable_2fa"
                  checked={settings.enable_2fa === 'true'}
                  onChange={(e) => handleInputChange('enable_2fa', e.target.checked.toString())}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable_2fa" className="ml-2 text-sm text-gray-700">
                  Enable Two-Factor Authentication (2FA)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enable_audit_logs"
                  checked={settings.enable_audit_logs === 'true'}
                  onChange={(e) => handleInputChange('enable_audit_logs', e.target.checked.toString())}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable_audit_logs" className="ml-2 text-sm text-gray-700">
                  Enable Audit Logs
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.session_timeout || '60'}
                  onChange={(e) => handleInputChange('session_timeout', e.target.value)}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSave('session_timeout')}
                  disabled={saving}
                  className="mt-2 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    updateSetting('enable_2fa', settings.enable_2fa);
                    updateSetting('enable_audit_logs', settings.enable_audit_logs);
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Security Settings'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
