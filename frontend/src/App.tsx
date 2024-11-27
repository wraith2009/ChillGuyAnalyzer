import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import "./index.css";
const ChillAnalyzer = () => {
  const [username, setUsername] = useState("");
  const [chillResult, setChillResult] = useState<{
    chillnessLevel: string;
    description: string;
  } | null>(null);

  const handleSubmit = async () => {
    var response = await axios.get(
      `https://my-app.rbh97995.workers.dev/analyze/${username}`
    );
    console.log(response);
    setChillResult(response?.data?.responseFromAPi);
  };

  console.log(chillResult);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Wannabe Chill People
        </h1>

        <div className="flex mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub Username"
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            onClick={handleSubmit}
            className="bg-gray-800 text-white p-2 rounded-r-lg hover:bg-gray-700 transition"
          >
            <Search size={24} />
          </button>
        </div>

        {chillResult && (
          <div className="mt-6 text-center">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {chillResult.chillnessLevel}
              </h2>
              <p className="text-gray-700 mb-4">{chillResult.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChillAnalyzer;
