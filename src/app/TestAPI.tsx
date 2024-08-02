"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import axiosInstance from "../api/axios";

interface ApiResponse {
  result: string;
}

const TestAPI: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [data, setData] = useState<ApiResponse | null>(null);
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
        "ppt/gen-by-text",
        {
          text: inputText,
        }
      );
      console.log({ response });

      setData(response.data);
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

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Generate Presentation</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text for generation"
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            color: "#333",
          }}
        />
      </div>

      <button
        onClick={handleFetch}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "4px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        className="px-6 py-4 bg-[#0070f3] text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>Error: {error}</div>
      )}

      {data && (
        <div style={{ marginTop: "20px" }}>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI;
