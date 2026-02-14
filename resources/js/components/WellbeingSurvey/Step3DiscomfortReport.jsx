export default function Step3DiscomfortReport({
  discomfort,
  discomfortNote,
  onChange,
}) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Anonymous Discomfort Report
      </h3>
      <p className="text-gray-600 mb-8">
        Do you feel any discomforting condition within the past one month?
      </p>

      <div className="mb-8">
        <div className="flex gap-8 mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="discomfort"
              value="yes"
              checked={discomfort === true}
              onChange={() => onChange(true, discomfortNote)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700 font-semibold">Yes</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="discomfort"
              value="no"
              checked={discomfort === false}
              onChange={() => onChange(false, null)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-gray-700 font-semibold">No</span>
          </label>
        </div>

        {discomfort && (
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <label className="block mb-3">
              <span className="text-gray-700 font-semibold mb-2 block">
                Please describe your discomfort:
              </span>
              <textarea
                value={discomfortNote || ""}
                onChange={(e) => onChange(discomfort, e.target.value)}
                placeholder="Write your reason here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="6"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              {discomfortNote?.length || 0}/1000 characters
            </p>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
        <h4 className="font-semibold text-secondary mb-2">Privacy Notice</h4>
        <ul className="text-sm text-secondary/80 space-y-1">
          <li>✓ Fully anonymous - no personal identifiers stored</li>
          <li>✓ Used only for aggregated insights and early warning</li>
          <li>✓ Your privacy is protected</li>
        </ul>
      </div>
    </div>
  );
}
