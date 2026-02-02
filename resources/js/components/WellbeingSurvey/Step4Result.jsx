import { Smile, AlertCircle, Heart } from "lucide-react";

export default function Step4Result({ result }) {
  const isHighRisk = result.risk_level === "high" || result.risk_level === "moderate";
  const Icon = isHighRisk ? AlertCircle : Smile;

  return (
    <div className="text-center">
      <div className="mb-8">
        <Icon className={`w-20 h-20 mx-auto mb-4 ${
          isHighRisk ? "text-orange-500" : "text-yellow-500"
        }`} />
      </div>

      <div className={`p-6 rounded-lg mb-8 ${
        isHighRisk ? "bg-orange-50 border border-orange-200" : "bg-yellow-50 border border-yellow-200"
      }`}>
        <p className={`text-lg font-semibold leading-relaxed ${
          isHighRisk ? "text-orange-900" : "text-yellow-900"
        }`}>
          {result.affirmation_message}
        </p>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Mental Health Score</p>
          <p className="text-3xl font-bold text-blue-600">{result.mental_health_score}/5</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Risk Level</p>
          <p className={`text-2xl font-bold ${
            result.risk_level === "low" ? "text-green-600" :
            result.risk_level === "mild" ? "text-yellow-600" :
            result.risk_level === "moderate" ? "text-orange-600" :
            "text-red-600"
          }`}>
            {result.risk_level.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Support Message */}
      {isHighRisk && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-blue-900 mb-1">Support Available</p>
              <p className="text-sm text-blue-800">
                Professional support and resources are available to help you. Please don't hesitate to reach out to any of the resources listed below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Confirmation */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          ✓ Your survey has been submitted successfully on{" "}
          <span className="font-semibold">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </p>
      </div>
    </div>
  );
}
