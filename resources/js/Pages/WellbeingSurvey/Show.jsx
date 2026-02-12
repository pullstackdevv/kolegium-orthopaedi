import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import Step1MentalWellbeing from "../../components/WellbeingSurvey/Step1MentalWellbeing";
import Step2Questionnaire from "../../components/WellbeingSurvey/Step2Questionnaire";
import Step3DiscomfortReport from "../../components/WellbeingSurvey/Step3DiscomfortReport";
import Step4Result from "../../components/WellbeingSurvey/Step4Result";
import CrisisResources from "../../components/WellbeingSurvey/CrisisResources";
import api from "@/api/axios";

export default function WellbeingSurveyShow({ affiliation, crisisResources: initialCrisisResources, member }) {
  const { url } = usePage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [crisisResources, setCrisisResources] = useState(initialCrisisResources);
  const [affiliationData, setAffiliationData] = useState(affiliation);
  const [memberData, setMemberData] = useState(member);
  const [surveyData, setSurveyData] = useState({
    affiliation_id: affiliation?.id,
    affiliation_code: affiliation?.code,
    university: affiliation?.university,
    faculty: affiliation?.faculty,
    study_program_name: affiliation?.study_program_name,
    program_type: affiliation?.program_type,
    member_id: member?.id || null,
    member_code: member?.member_code || null,
    member_name: member?.name || null,
    member_contact: member?.contact || null,
    participant_type: null,
    mood: null,
    burnout: false,
    emotional_hardening: false,
    depressed: false,
    sleep_issue: false,
    bullying: false,
    discomfort: false,
    discomfort_note: null,
  });
  const [result, setResult] = useState(null);
  const [starRating, setStarRating] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code && !affiliationData) {
      fetchAffiliationByCode(code);
    }
  }, [affiliationData]);

  const fetchAffiliationByCode = async (code) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/affiliations/by-code/${code}`);
      if (response.data.status === "success") {
        setAffiliationData(response.data.data);
        setSurveyData((prev) => ({
          ...prev,
          affiliation_id: response.data.data.id,
          affiliation_code: response.data.data.code,
          university: response.data.data.university,
          faculty: response.data.data.faculty,
          study_program_name: response.data.data.study_program_name,
          program_type: response.data.data.program_type,
        }));
      }
    } catch (error) {
      console.error("Error fetching affiliation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStep1Change = (mood) => {
    setSurveyData((prev) => ({
      ...prev,
      mood,
    }));
  };

  const handleStep2Change = (responses) => {
    setSurveyData((prev) => ({
      ...prev,
      ...responses,
    }));
  };

  const handleStep3Change = (discomfort, discomfortNote) => {
    setSurveyData((prev) => ({
      ...prev,
      discomfort,
      discomfort_note: discomfortNote,
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateRiskLevel = () => {
    // Calculate mood risk
    const moodRiskMap = {
      happy: 'low',
      normal: 'low',
      worry: 'mild',
      depressed: 'high',
      help_me: 'high'
    };
    const moodRisk = moodRiskMap[surveyData.mood] || 'low';

    // Calculate questionnaire score
    const questionnaireScore = [
      surveyData.burnout,
      surveyData.emotional_hardening,
      surveyData.depressed,
      surveyData.sleep_issue,
      surveyData.bullying
    ].filter(v => v === true).length;

    let questionnaireRisk = 'low';
    if (questionnaireScore >= 4) {
      questionnaireRisk = 'high';
    } else if (questionnaireScore >= 2) {
      questionnaireRisk = 'moderate';
    }

    // Determine overall risk level
    const riskLevels = { low: 1, mild: 2, moderate: 3, high: 4 };
    const moodValue = riskLevels[moodRisk];
    const questionnaireValue = riskLevels[questionnaireRisk];
    const maxRiskValue = Math.max(moodValue, questionnaireValue);

    const riskLevelMap = { 1: 'low', 2: 'mild', 3: 'moderate', 4: 'high' };
    return {
      risk_level: riskLevelMap[maxRiskValue],
      mental_health_score: questionnaireScore,
      mood_risk: moodRisk
    };
  };

  const getAffirmationMessage = (riskLevel) => {
    const messages = {
      low: "You are a great person and we love you. Keep your spirit high. You can do this! 😊",
      mild: "You are doing well. Keep taking care of yourself and reach out if you need support.",
      moderate: "You are not alone. Support is available and help is near. Please consider reaching out to the resources below.",
      high: "You are not alone. Support is available and help is near. Please consider reaching out to the resources below."
    };
    return messages[riskLevel] || messages.low;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Ensure affiliation_id is set
      if (!surveyData.affiliation_id && affiliationData?.id) {
        surveyData.affiliation_id = affiliationData.id;
      }
      
      // Validate required fields
      if (!surveyData.affiliation_id) {
        alert("Affiliation information is missing. Please reload the page.");
        setLoading(false);
        return;
      }

      // Calculate risk level and affirmation message
      const riskData = calculateRiskLevel();
      const affirmationMessage = getAffirmationMessage(riskData.risk_level);

      const submissionData = {
        ...surveyData,
        risk_level: riskData.risk_level,
        mental_health_score: riskData.mental_health_score,
        affirmation_message: affirmationMessage,
        star_rating: starRating,
        survey_type: 'wellbeing',
        survey_period: new Date().toISOString().slice(0, 7)
      };
      
      const response = await api.post("/api/wellbeing-surveys", submissionData);
      if (response.data.status === "success") {
        setResult(response.data.data);
        setCurrentStep(4);
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      console.error("Survey data:", surveyData);
      alert("Failed to submit survey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !affiliationData) {
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

  return (
    <HomepageLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Well-Being Survey</h1>
            <p className="text-white/80">
              Indonesian Orthopaedic & Traumatology Education Dashboard
            </p>
          </div>

          {/* Member Information Card */}
          {memberData && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold text-primary mb-4">Verified Member Information</h3>
              <div className="grid grid-cols-3 gap-4">
                {memberData.member_code && (
                  <div>
                    <p className="text-xs text-gray-600">Member Code</p>
                    <p className="font-semibold text-gray-900">
                      {memberData.member_code.charAt(0)}{'*'.repeat(Math.max(0, memberData.member_code.length - 2))}{memberData.member_code.charAt(memberData.member_code.length - 1)}
                    </p>
                  </div>
                )}
                {memberData.name && (
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{memberData.name}</p>
                  </div>
                )}
                {memberData.contact && (
                  <div>
                    <p className="text-xs text-gray-600">Contact</p>
                    <p className="font-semibold text-gray-900">{memberData.contact}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary">Our Well-Being Survey</h2>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                        step < currentStep
                          ? "bg-primary text-white"
                          : step === currentStep
                          ? "bg-primary text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {step < currentStep ? "✓" : step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step < currentStep ? "bg-primary" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-4">
                <span>Mental Well-Being Meter</span>
                <span>Questionnaire</span>
                <span>Anonymous Discomfort Report</span>
                <span>Questionnaire</span>
              </div>
            </div>

            {/* Step Content */}
            <div className="my-8">
              {currentStep === 1 && (
                <Step1MentalWellbeing
                  value={surveyData.mood}
                  onChange={handleStep1Change}
                />
              )}
              {currentStep === 2 && (
                <Step2Questionnaire
                  responses={{
                    burnout: surveyData.burnout,
                    emotional_hardening: surveyData.emotional_hardening,
                    depressed: surveyData.depressed,
                    sleep_issue: surveyData.sleep_issue,
                    bullying: surveyData.bullying,
                  }}
                  onChange={handleStep2Change}
                />
              )}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <Step3DiscomfortReport
                    discomfort={surveyData.discomfort}
                    discomfortNote={surveyData.discomfort_note}
                    onChange={handleStep3Change}
                  />
                  
                  {/* Star Rating */}
                  <div className="border-t pt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Rate Your Overall Well-Being
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Please rate your overall well-being on a scale of 1 to 5 stars
                    </p>
                    <div className="flex justify-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setStarRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <svg
                            className={`w-12 h-12 ${
                              star <= starRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    {starRating > 0 && (
                      <p className="text-center mt-4 text-primary font-semibold">
                        You rated: {starRating} out of 5 stars
                      </p>
                    )}
                  </div>
                </div>
              )}
              {currentStep === 4 && result && (
                <Step4Result result={result} />
              )}
            </div>

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between gap-4 mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  onClick={currentStep === 3 ? handleSubmit : handleNext}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 3 ? "Finish" : "Next"}
                </button>
              </div>
            )}
          </div>

          {/* Crisis Resources */}
          <div className="mt-8">
            <CrisisResources resources={crisisResources} />
          </div>
        </div>
      </div>
    </HomepageLayout>
  );
}
