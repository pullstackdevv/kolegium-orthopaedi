const QUESTIONS = [
  {
    id: "burnout",
    text: "During the past month, have you felt burned out from your work?",
  },
  {
    id: "emotional_hardening",
    text: "During the past month, have you worried that your work is hardening you emotionally?",
  },
  {
    id: "depressed",
    text: "During the past month, have you often been bothered by feeling down, depressed, or hopeless?",
  },
  {
    id: "sleep_issue",
    text: "During the past month, have you fallen asleep while sitting inactive in a public place?",
  },
  {
    id: "bullying",
    text: "During the past month, have you felt that you are being bullied at work?",
  },
];

export default function Step2Questionnaire({ responses, onChange }) {
  const handleChange = (questionId, value) => {
    onChange({
      [questionId]: value,
    });
  };

  const yesCount = Object.values(responses).filter((v) => v === true).length;

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Mental Health Questionnaire
      </h3>
      <p className="text-gray-600 mb-8">Please answer the questionnaires</p>

      <div className="space-y-6">
        {QUESTIONS.map((question, index) => (
          <div key={question.id} className="border-b pb-6 last:border-b-0">
            <p className="text-gray-800 font-semibold mb-4">
              {index + 1}. {question.text}
            </p>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value="yes"
                  checked={responses[question.id] === true}
                  onChange={() => handleChange(question.id, true)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value="no"
                  checked={responses[question.id] === false}
                  onChange={() => handleChange(question.id, false)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Score Display */}
      <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Score</p>
            <p className="text-3xl font-bold text-primary">{yesCount}/5</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Risk Level</p>
            <p className={`text-lg font-semibold ${
              yesCount <= 1 ? "text-green-600" :
              yesCount <= 3 ? "text-orange-600" :
              "text-red-600"
            }`}>
              {yesCount <= 1 ? "Low Risk" :
               yesCount <= 3 ? "Moderate Risk" :
               "High Risk"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
