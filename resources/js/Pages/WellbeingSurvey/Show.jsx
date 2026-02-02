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
      
      const response = await api.post("/api/wellbeing-surveys", surveyData);
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Well-Being Survey</h1>
            <p className="text-blue-100">
              Indonesian Orthopaedic & Traumatology Education Dashboard
            </p>
          </div>

          {/* Member Information Card */}
          {memberData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold text-blue-700 mb-4">Verified Member Information</h3>
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
                <h2 className="text-xl font-bold text-blue-700">Our Well-Being Survey</h2>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                        step < currentStep
                          ? "bg-blue-600 text-white"
                          : step === currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {step < currentStep ? "✓" : step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step < currentStep ? "bg-blue-600" : "bg-gray-300"
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
                <Step3DiscomfortReport
                  discomfort={surveyData.discomfort}
                  discomfortNote={surveyData.discomfort_note}
                  onChange={handleStep3Change}
                />
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
