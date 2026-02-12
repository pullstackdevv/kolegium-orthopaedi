import { Smile, AlertCircle, Heart, Star } from "lucide-react";

export default function Step4Result({ result }) {
  const isHighRisk = result.risk_level === "high" || result.risk_level === "moderate";
  const Icon = isHighRisk ? AlertCircle : Smile;
  
  const renderStars = (rating) => {
    return (
      <div className="flex gap-2 justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

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

      {/* Star Rating Display */}
      {result.star_rating && (
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-2">Your Well-Being Rating</p>
          {renderStars(result.star_rating)}
          <p className="text-sm text-gray-600">{result.star_rating} out of 5 stars</p>
        </div>
      )}

      {/* Score Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Mental Health Score</p>
          <p className="text-3xl font-bold text-primary">{result.mental_health_score}/5</p>
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
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-primary mb-1">Support Available</p>
              <p className="text-sm text-primary/80">
                Professional support and resources are available to help you. Please don't hesitate to reach out to any of the resources listed below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Confirmation */}
      <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
        <p className="text-sm text-secondary/80">
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
