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
  const { url, props: pageProps } = usePage();

  // DEBUG: log all props received
  console.log('[WBS DEBUG] Component props:', { affiliation, member, url });
  console.log('[WBS DEBUG] All page props:', pageProps);
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
    burnout: null,
    emotional_hardening: null,
    depressed: null,
    sleep_issue: null,
    bullying: null,
    discomfort: null,
    discomfort_note: null,
  });
  const [result, setResult] = useState(null);
  const [starRating, setStarRating] = useState(0);

  // Sync affiliationData into surveyData whenever it becomes available
  useEffect(() => {
    if (affiliationData?.id) {
      setSurveyData((prev) => ({
        ...prev,
        affiliation_id: affiliationData.id,
        affiliation_code: affiliationData.code,
      }));
    }
  }, [affiliationData]);

  // Fallback: fetch affiliation by code from URL if prop is null
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code && !affiliationData) {
      fetchAffiliationByCode(code);
    }
  }, []);

  const fetchAffiliationByCode = async (code) => {
    try {
      setLoading(true);
      const response = await api.get(`/affiliations/by-code/${code}`);
      if (response.data.status === "success") {
        const aff = response.data.data;
        setAffiliationData(aff);
        setSurveyData((prev) => ({
          ...prev,
          affiliation_id: aff.id,
          affiliation_code: aff.code,
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
      
      // Resolve affiliation_id from all possible sources
      const resolvedAffiliationId = surveyData.affiliation_id || affiliationData?.id || affiliation?.id || null;
      const resolvedAffiliationCode = surveyData.affiliation_code || affiliationData?.code || affiliation?.code || null;
      
      // Update surveyData with resolved values
      if (resolvedAffiliationId) {
        surveyData.affiliation_id = resolvedAffiliationId;
        surveyData.affiliation_code = resolvedAffiliationCode;
      }
      
      // Validate required fields
      if (!resolvedAffiliationId) {
        alert("Affiliation information is missing. Please go back to the verification page and try again.");
        setLoading(false);
        return;
      }

      // Calculate risk level and affirmation message
      const riskData = calculateRiskLevel();
      const affirmationMessage = getAffirmationMessage(riskData.risk_level);

      const submissionData = {
        ...surveyData,
        affiliation_id: resolvedAffiliationId,
        affiliation_code: resolvedAffiliationCode,
        // Ensure boolean fields are never null (unanswered = false)
        burnout: surveyData.burnout === true,
        emotional_hardening: surveyData.emotional_hardening === true,
        depressed: surveyData.depressed === true,
        sleep_issue: surveyData.sleep_issue === true,
        bullying: surveyData.bullying === true,
        discomfort: surveyData.discomfort === true,
        risk_level: riskData.risk_level,
        mental_health_score: riskData.mental_health_score,
        affirmation_message: affirmationMessage,
        survey_type: 'wellbeing',
        survey_period: new Date().toISOString().slice(0, 7)
      };
      
      const response = await api.post("/wellbeing-surveys", submissionData);
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


          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Progress Bar */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-primary mb-6">Our Well-Being Survey</h2>
              <div className="relative">
                {/* Background line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
                {/* Active line */}
                <div
                  className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                  style={{ width: `${((Math.min(currentStep, 4) - 1) / 3) * 100}%` }}
                ></div>

                <div className="relative flex justify-between">
                  {[
                    { step: 1, label: "Well-Being Meter" },
                    { step: 2, label: "Questionnaire" },
                    { step: 3, label: "Discomfort Report" },
                    { step: 4, label: "Result" },
                  ].map(({ step, label }) => {
                    const isCompleted = step < currentStep;
                    const isActive = step === currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center" style={{ width: "25%" }}>
                        <div
                          className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                            isCompleted
                              ? "bg-primary border-primary text-white shadow-md shadow-primary/30"
                              : isActive
                              ? "bg-primary border-primary text-white shadow-lg shadow-primary/40 ring-4 ring-primary/20"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            step
                          )}
                        </div>
                        <span
                          className={`mt-2 text-xs text-center leading-tight font-medium ${
                            isCompleted || isActive ? "text-primary" : "text-gray-400"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
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
