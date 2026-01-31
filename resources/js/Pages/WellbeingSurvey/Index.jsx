import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomepageLayout from "../../Layouts/HomepageLayout";

export default function WellbeingSurveyIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/wellbeing-survey");
  }, [navigate]);

  return (
    <HomepageLayout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    </HomepageLayout>
  );
}
