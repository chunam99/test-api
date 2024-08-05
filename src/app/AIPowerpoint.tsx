import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import axiosInstance from "../api/api";

interface ApiResponse {
  url: string;
}

const AIPowerpoint: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!inputText) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<ApiResponse>(
        "/ppt/gen-by-text",
        {
          text: inputText,
        }
      );
      console.log("API Response:", response.data);
      setDownloadUrl(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiResponse>;
        setError(axiosError.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (downloadUrl?.url) {
      console.log("Download URL:", downloadUrl.url);
      setData(extractFilename(downloadUrl.url));
    }
  }, [downloadUrl]);

  const extractFilename = (url: string | undefined): string => {
    if (!url) return "Không có tên file";
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/public/pptx/";
    const filename = url.replace(baseUrl, "");
    console.log("Extracted Filename:", filename);
    return filename;
  };

  return (
    <div className="p-5 max-w-xl mx-auto border border-[#ccc] mt-10 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Generate Presentation</h1>
      <div className="mb-3">
        <textarea
          rows={15}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text for generation"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <div className="text-red-500 mb-3 text-sm">Error: {error}</div>}

      <button
        onClick={handleFetch}
        className={`px-6 py-2 bg-blue-500 text-white rounded-md w-full flex justify-center ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {data && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Download file:</h2>
          <a
            href={downloadUrl?.url}
            download={data}
            className="text-blue-500 underline"
          >
            {data}
          </a>
        </div>
      )}
    </div>
  );
};

export default AIPowerpoint;
