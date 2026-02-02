import { useState } from "react";
import { Search, AlertCircle, CheckCircle } from "lucide-react";
import api from "@/api/axios";

const maskMemberCode = (code) => {
  if (!code || code.length < 2) return code;
  const first = code.charAt(0);
  const last = code.charAt(code.length - 1);
  const masked = "*".repeat(Math.max(0, code.length - 2));
  return `${first}${masked}${last}`;
};

export default function MemberVerification({ affiliation, onVerified }) {
  const [searchType, setSearchType] = useState("member_code"); // member_code, name, contact
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [error, setError] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualData, setManualData] = useState({ name: "", contact: "" });

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError("Please enter a search value");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMemberData(null);

      console.log("Search params:", {
        search_type: searchType,
        search_value: searchValue.trim(),
        affiliation_id: affiliation?.id,
      });

      const response = await api.get("/database-members/search", {
        params: {
          search_type: searchType,
          search_value: searchValue.trim(),
          affiliation_id: affiliation?.id,
        },
      });

      console.log("Search response:", response);

      if (response.data.status === "success" && response.data.data) {
        setMemberData(response.data.data);
        setShowManualInput(false);
      } else {
        const errorMsg = response.data.message || "Member not found. You can fill in your information manually.";
        console.log("Search not found:", response.data);
        setError(errorMsg);
        setShowManualInput(true);
      }
    } catch (err) {
      console.error("Search error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          params: err.config?.params,
        },
      });
      
      const errorMsg = err.response?.data?.message || "Error searching member. You can fill in your information manually.";
      setError(errorMsg);
      setShowManualInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (!manualData.name.trim() || !manualData.contact.trim()) {
      setError("Please fill in both name and contact");
      return;
    }

    const verifiedData = {
      id: null,
      nik: null,
      member_code: null,
      name: manualData.name,
      contact: manualData.contact,
      is_registered: false,
    };

    onVerified(verifiedData);
  };

  const handleVerifyMember = () => {
    if (memberData) {
      onVerified({
        ...memberData,
        is_registered: true,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Member Verification</h2>
      <p className="text-gray-600 mb-6">
        Please verify your membership information before proceeding with the survey.
      </p>

      {!memberData && !showManualInput && (
        <div className="space-y-6">
          {/* Search Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Search by:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "member_code", label: "Member Code" },
                { value: "nama", label: "Name" },
                { value: "contact", label: "Contact" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSearchType(option.value);
                    setSearchValue("");
                    setError("");
                  }}
                  className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                    searchType === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {searchType === "member_code"
                ? "Enter your Member Code"
                : searchType === "nama"
                ? "Enter your Name"
                : "Enter your Contact"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  searchType === "member_code"
                    ? "e.g., MEM-2024-001"
                    : searchType === "nama"
                    ? "e.g., John Doe"
                    : "e.g., 08123456789 or john@email.com"
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800">{error}</p>
                {error.includes("not found") && (
                  <button
                    onClick={() => {
                      setShowManualInput(true);
                      setError("");
                    }}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold mt-2"
                  >
                    Fill in manually instead
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Member Found */}
      {memberData && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">Member Found</h3>
                <p className="text-sm text-green-700">Your information has been verified</p>
              </div>
            </div>

            <div className="space-y-3 bg-white rounded p-4">
              {memberData.member_code && (
                <div>
                  <p className="text-xs text-gray-600">Member Code</p>
                  <p className="font-semibold text-gray-900">
                    {maskMemberCode(memberData.member_code)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">{memberData.name}</p>
              </div>
              {memberData.contact && (
                <div>
                  <p className="text-xs text-gray-600">Contact</p>
                  <p className="font-semibold text-gray-900">{memberData.contact}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleVerifyMember}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Continue with Survey
          </button>

          <button
            onClick={() => {
              setMemberData(null);
              setSearchValue("");
              setError("");
            }}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Search Again
          </button>
        </div>
      )}

      {/* Manual Input */}
      {showManualInput && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Since your information was not found in our system, please fill in your details below.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={manualData.name}
              onChange={(e) => {
                setManualData({ ...manualData, name: e.target.value });
                setError("");
              }}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Information *
            </label>
            <input
              type="text"
              value={manualData.contact}
              onChange={(e) => {
                setManualData({ ...manualData, contact: e.target.value });
                setError("");
              }}
              placeholder="Enter your contact (phone/email/address)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleManualSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Continue with Survey
          </button>

          <button
            onClick={() => {
              setShowManualInput(false);
              setManualData({ name: "", email: "" });
              setError("");
            }}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Search
          </button>
        </div>
      )}
    </div>
  );
}
