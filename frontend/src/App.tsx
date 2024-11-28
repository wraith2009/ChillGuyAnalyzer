import { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const ChillDeveloperCard = () => {
  const [username, setUsername] = useState("");
  const [chillResult, setChillResult] = useState<{
    chillnessLevel: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!username) return;

    setChillResult(null);
    setIsLoading(true);

    try {
      const response = await axios.get(`${apiUrl}${username}`);
      setChillResult(response.data);
    } catch (error) {
      console.error(error);
      setChillResult({
        chillnessLevel: "Error",
        description: "Oops! Could not fetch chill level. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-purple-600 p-4">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center mb-6 md:mb-0 md:mr-6">
        <img
          src="/chillguytransparent.webp"
          alt="Chill Developer"
          className="max-w-full h-auto max-h-64 md:max-h-96 object-contain"
        />
        <div className="mt-4 text-center text-white max-w-xs">
          <h2 className="text-xl font-bold mb-2">Wannabe Chill Developer</h2>
          <p className="text-sm opacity-80">
            🤖 AI-Powered Chill Meter: An innovative web application that uses
            advanced AI algorithms to analyze your GitHub profile and determine
            your developer chill level. This project is entirely AI-generated,
            showcasing the creative potential of artificial intelligence in
            building fun, interactive web experiences. Just enter your GitHub
            username and discover how cool you are in the coding world!
          </p>
          <p className="text-xs mt-2 italic opacity-60">
            * Disclaimer: Results are generated for entertainment purposes and
            should be taken with a grain of salt. 😎
          </p>
        </div>
      </div>

      <div className="relative w-full max-w-md bg-white shadow-lg rounded-3xl p-6 md:p-8 transform md:rotate-3 overflow-hidden">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 font-mono">
          Wannabe Chill Developer
        </h1>

        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub Username"
            className="flex-grow p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm md:text-base"
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="bg-purple-500 text-white p-2 md:p-3 rounded-lg hover:bg-purple-600 transition font-mono text-sm md:text-base disabled:opacity-50"
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </button>

        {isLoading && (
          <div className="mt-6 text-center">
            <div className="bg-gray-100 p-4 md:p-6 rounded-xl border border-gray-200 font-mono">
              <p className="text-gray-700 text-sm md:text-base">
                Putting on our analyzing goggles and scrutinizing your chill
                level...
              </p>
            </div>
          </div>
        )}

        {chillResult && (
          <div className="mt-6 text-center">
            <div className="bg-gray-100 p-4 md:p-6 rounded-xl border border-gray-200 font-mono">
              <p className="text-gray-700 text-sm md:text-base">
                {chillResult.description}
              </p>
            </div>
          </div>
        )}

        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tr from-blue-400 to-pink-400 rounded-full opacity-30 blur-xl"></div>
      </div>
    </div>
  );
};

export default ChillDeveloperCard;
