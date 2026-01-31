import { Smile, Meh, AlertCircle, Frown, HeartHandshake } from "lucide-react";

const MOOD_OPTIONS = [
  {
    id: "happy",
    label: "Happy",
    icon: Smile,
    color: "text-yellow-400",
    bgColor: "bg-yellow-50 hover:bg-yellow-100",
    borderColor: "border-yellow-300",
  },
  {
    id: "normal",
    label: "Normal",
    icon: Meh,
    color: "text-gray-400",
    bgColor: "bg-gray-50 hover:bg-gray-100",
    borderColor: "border-gray-300",
  },
  {
    id: "worry",
    label: "Worry",
    icon: AlertCircle,
    color: "text-orange-400",
    bgColor: "bg-orange-50 hover:bg-orange-100",
    borderColor: "border-orange-300",
  },
  {
    id: "depressed",
    label: "Depressed",
    icon: Frown,
    color: "text-red-400",
    bgColor: "bg-red-50 hover:bg-red-100",
    borderColor: "border-red-300",
  },
  {
    id: "help_me",
    label: "Help Me",
    icon: HeartHandshake,
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
    borderColor: "border-red-300",
  },
];

export default function Step1MentalWellbeing({ value, onChange }) {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        How are you feeling today?
      </h3>
      <p className="text-gray-600 mb-8">Please choose your smile / emotion</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {MOOD_OPTIONS.map((mood) => {
          const Icon = mood.icon;
          const isSelected = value === mood.id;

          return (
            <button
              key={mood.id}
              onClick={() => onChange(mood.id)}
              className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${mood.bgColor} border-blue-600 shadow-lg scale-105`
                  : `${mood.bgColor} ${mood.borderColor} border-opacity-50`
              }`}
            >
              <Icon className={`w-12 h-12 ${mood.color} mb-2`} />
              <span className="text-sm font-semibold text-gray-700">
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {value && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            You selected: <span className="font-semibold">{value.toUpperCase()}</span>
          </p>
        </div>
      )}
    </div>
  );
}
