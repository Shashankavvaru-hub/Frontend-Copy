import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Landmark, Hash, Save, Info } from "lucide-react";

// Assuming these exist in your project
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { showSuccessToast, showErrorToast } from "../utils/notifications";

const BankDetailsPage = () => {
  const [formData, setFormData] = useState({
    bankAccountHolderName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Pre-fill the form with existing details if they exist
  useEffect(() => {
    if (user && user.artist) {
      setFormData({
        bankAccountHolderName: user.artist.bankAccountHolderName || "",
        bankAccountNumber: user.artist.bankAccountNumber || "",
        bankIfscCode: user.artist.bankIfscCode || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/artists/me/bank-details", formData);
      showSuccessToast("Bank details updated successfully!");
      navigate("/dashboard"); // Go back to dashboard after saving
    } catch (err) {
      showErrorToast(
        "Failed to update bank details. Please check the information and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kalaa-cream flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-kalaa-charcoal">
              Payout Bank Details
            </h1>
            <p className="text-gray-600 mt-2">
              Securely provide your details to receive payments.
            </p>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 mb-6">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Please provide your bank details to receive payments for your
              completed bookings. This information is kept secure.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="bankAccountHolderName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Account Holder Name
              </label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="bankAccountHolderName"
                  name="bankAccountHolderName"
                  value={formData.bankAccountHolderName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                  required
                  placeholder="e.g., John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bankAccountNumber"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Bank Account Number
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="bankAccountNumber"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                  required
                  pattern="\d+" // Basic validation for digits only
                  title="Please enter only numbers"
                  placeholder="e.g., 123456789012"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bankIfscCode"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                IFSC Code
              </label>
              <div className="relative">
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="bankIfscCode"
                  name="bankIfscCode"
                  value={formData.bankIfscCode}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800 uppercase" // IFSC is usually uppercase
                  required
                  pattern="^[A-Z]{4}0[A-Z0-9]{6}$" // Basic IFSC pattern validation
                  title="Please enter a valid IFSC code (e.g., SBIN0001234)"
                  placeholder="e.g., SBIN0001234"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Bank Details
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsPage;
