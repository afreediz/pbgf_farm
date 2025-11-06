import React, { useState } from 'react';
import { Sprout, Package, Calendar, FileText, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function AddRequirement() {
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    deliveryDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.product.trim()) {
      newErrors.product = 'Product name is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    } else {
      const selectedDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.deliveryDate = 'Delivery date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          farmers: data.notifiedFarmers
        });
        setFormData({ product: '', quantity: '', deliveryDate: '', notes: '' });
      } else {
        setResult({
          success: false,
          message: data.message || 'Failed to submit requirement'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to connect to server. Please ensure the backend is running on port 5000.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Sprout className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">PBF Marketplace</h1>
              <p className="text-green-100 text-sm mt-1">Connecting Buyers with Local Farmers</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6" />
              Add Product Requirement
            </h2>
            <p className="text-green-50 mt-2">Tell us what you need, and we'll notify matching farmers</p>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-green-600" />
                Product Name
              </label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="e.g., Fresh Potato, Organic Tomato"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.product 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-green-200 focus:border-green-500 focus:ring-green-200'
                }`}
              />
              {errors.product && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.product}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-green-600" />
                Quantity (kg)
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 500"
                min="1"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.quantity 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-green-200 focus:border-green-500 focus:ring-green-200'
                }`}
              />
              {errors.quantity && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                Delivery Date
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.deliveryDate 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-green-200 focus:border-green-500 focus:ring-green-200'
                }`}
              />
              {errors.deliveryDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.deliveryDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific requirements, quality standards, or delivery instructions..."
                rows="4"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Requirement
                </>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className={`mt-6 rounded-xl shadow-lg overflow-hidden border-2 ${
            result.success 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="p-6">
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Success!' : 'Notice'}
                  </h3>
                  <p className={`mb-3 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </p>
                  
                  {result.success && result.farmers && result.farmers.length > 0 && (
                    <div className="mt-4 bg-white rounded-lg p-4 border border-green-200">
                      <p className="font-semibold text-green-800 mb-2">Notified Farmers:</p>
                      <ul className="space-y-2">
                        {result.farmers.map((farmer, index) => (
                          <li key={index} className="flex items-center gap-2 text-green-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium">{farmer.name}</span>
                            <span className="text-green-600">({farmer.email})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-8 mt-12">
        <div className="text-center text-gray-600 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Sprout className="w-4 h-4 text-green-600" />
            PBF Marketplace - Supporting Local Agriculture
          </p>
        </div>
      </footer>
    </div>
  );
}