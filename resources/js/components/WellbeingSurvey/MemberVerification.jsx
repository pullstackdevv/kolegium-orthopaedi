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
  const [nik, setNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // step 1: input NIK, step 2: verify name
  const [inputName, setInputName] = useState("");

  // Mask name: show first and last character, hide middle with asterisks
  const maskName = (name) => {
    if (!name || name.length < 2) return name;
    const first = name.charAt(0);
    const last = name.charAt(name.length - 1);
    const masked = "*".repeat(Math.max(0, name.length - 2));
    return `${first}${masked}${last}`;
  };

  const handleSearchNIK = async () => {
    if (!nik.trim()) {
      setError("Please enter your NIK (Member Code)");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMemberData(null);

      const response = await api.get("/database-members/search", {
        params: {
          search_type: "member_code",
          search_value: nik.trim(),
          affiliation_id: affiliation?.id,
        },
      });

      if (response.data.status === "success" && response.data.data) {
        setMemberData(response.data.data);
        setStep(2); // Move to verification step
      } else {
        setError("NIK tidak ditemukan. Silakan hubungi admin prodi.");
      }
    } catch (err) {
      console.error("Search error:", err);
      console.error("Search error response data:", err.response?.data);
      console.error("Search error response status:", err.response?.status);
      console.error("Search error request URL:", err.config?.baseURL + err.config?.url);
      console.error("Search error request params:", err.config?.params);
      setError("NIK tidak ditemukan. Silakan hubungi admin prodi.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyName = () => {
    if (!inputName.trim()) {
      setError("Please enter your name");
      return;
    }

    // Verify that the input matches the member data (case-insensitive)
    if (inputName.trim().toLowerCase() === memberData.name.toLowerCase()) {
      onVerified({
        ...memberData,
        is_registered: true,
      });
    } else {
      setError("Name does not match. Please try again.");
    }
  };

  const handleBackToNIK = () => {
    setStep(1);
    setMemberData(null);
    setInputName("");
    setError("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-primary mb-2">Member Verification</h2>
      <p className="text-gray-600 mb-6">
        Please verify your membership information before proceeding with the survey.
      </p>

      {/* STEP 1: Input NIK */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter your NIK (Member Code) *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nik}
                onChange={(e) => {
                  setNik(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearchNIK()}
                placeholder="e.g., MEM-2024-001"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSearchNIK}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Verify Name */}
      {/* Privacy Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-semibold text-green-800 mb-2">Privacy Notice</h3>
        <ul className="space-y-1 text-sm text-green-700">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Fully anonymous - no personal identifiers stored
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Used only for aggregated insights and early warning
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Your privacy is protected
          </li>
        </ul>
      </div>

      {step === 2 && memberData && (
        <div className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <div className="flex gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-primary">NIK Found</h3>
                <p className="text-sm text-primary/80">Please enter your name to verify your identity</p>
              </div>
            </div>

            <div className="space-y-4 bg-white rounded p-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">NIK</p>
                <p className="font-semibold text-gray-900">
                  {maskMemberCode(memberData.member_code)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Registered Name (Masked)</p>
                <div className="bg-gray-100 px-3 py-2 rounded text-sm font-semibold text-gray-900">
                  {maskName(memberData.name)}
                </div>
              </div>
              {memberData.contact && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Contact</p>
                  <p className="font-semibold text-gray-900">{memberData.contact}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter your name *
            </label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
                setError("");
              }}
              onKeyPress={(e) => e.key === "Enter" && handleVerifyName()}
              placeholder="Enter your full name as registered"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-2">
              Your input will be encrypted and compared with the registered name
            </p>
          </div>

          {error && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleBackToNIK}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleVerifyName}
              className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Verify & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
