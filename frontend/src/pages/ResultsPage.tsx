// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Button from "../components/common/Button";
// import { AlertTriangle, Check, Info, Download, Share2 } from "lucide-react";

// const ResultsPage = () => {
//   const [result, setResult] = useState<any | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

// useEffect(() => {
//   const generateReport = async () => {
//     const imageData = localStorage.getItem("uploadedImage");
//     if (!imageData) return;

//     const blob = await (await fetch(imageData)).blob();
//     const formData = new FormData();
//     formData.append("file", blob, "skin.jpg");

//     try {
//       const response = await fetch("http://localhost:8000/predict-and-generate-report", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       localStorage.setItem("predictionResult", JSON.stringify(data.result));

//       // Start PDF download but don’t wait
//       fetch(`http://localhost:8000/download-report/${data.reportId}`)
//         .then(res => res.blob())
//         .then(pdfBlob => {
//           const pdfUrl = URL.createObjectURL(pdfBlob);
//           const a = document.createElement("a");
//           a.href = pdfUrl;
//           a.download = "Skin_Report.pdf";
//           document.body.appendChild(a);
//           a.click();
//           a.remove();
//         });

//       // Immediately redirect
//       navigate("/results");

//     } catch (err) {
//       console.error("Failed to generate report:", err);
//     }
//   };

//   generateReport();
// }, []);


//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-600 dark:text-gray-300">Loading analysis results...</p>
//       </div>
//     );
//   }

//   if (error || !result) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
//           <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             Error Loading Results
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
//           <Link to="/upload">
//             <Button variant="primary">Try Another Upload</Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const confidence = Math.round(result.confidence);

//   return (
//     <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
//       <div className="text-center mb-10">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Analysis Result</h1>
//         <p className="text-gray-600 dark:text-gray-300 mt-2">
//           Based on your uploaded image
//         </p>
//       </div>

//       <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
//         <div className="flex justify-between items-start">
//           <div>
//             <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
//               {result.disease}
//             </h2>
//             <p className="text-gray-700 dark:text-gray-300 mt-1">
//               {result.description}
//             </p>
//           </div>
//           <div className="text-right">
//             <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{confidence}%</div>
//             <div className="text-sm text-gray-600 dark:text-gray-300">Confidence</div>
//           </div>
//         </div>

//         <div>
//           <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Symptoms</h3>
//           <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
//             {result.symptoms.map((symptom: string, index: number) => (
//               <li key={index}>{symptom}</li>
//             ))}
//           </ul>
//         </div>

//         <div>
//           <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Care Tips</h3>
//           <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
//             {result.care_tips.map((tip: string, index: number) => (
//               <li key={index}>{tip}</li>
//             ))}
//           </ul>
//         </div>

//         <div className="flex space-x-4 mt-4">
//           <Button variant="outline" fullWidth onClick={() => window.print()}>
//             <Download className="h-4 w-4 mr-2" />
//             Save as PDF
//           </Button>
//           <Button variant="outline" fullWidth>
//             <Share2 className="h-4 w-4 mr-2" />
//             Share
//           </Button>
//         </div>

//         <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 text-sm text-gray-600 dark:text-gray-300 mt-6">
//           <Info className="h-4 w-4 inline-block mr-1 text-blue-500" />
//           <span>
//             This report is AI-generated and should not be used as a medical diagnosis. Please consult a licensed dermatologist for confirmation and treatment.
//           </span>
//         </div>

//         <div className="mt-6 text-center">
//           <Link to="/upload">
//             <Button variant="primary">Analyze Another Image</Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultsPage;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { AlertTriangle, Check, Info, Download, Share2 } from "lucide-react";

const ResultsPage = () => {
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem("predictionResult");

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (err) {
        console.error("Failed to parse prediction result from localStorage", err);
        setError("Corrupted prediction data.");
      }
    } else {
      setError("No prediction result found.");
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading analysis results...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Results
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link to="/upload">
            <Button variant="primary">Try Another Upload</Button>
          </Link>
        </div>
      </div>
    );
  }

  const confidence = Math.round(result.confidence);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Analysis Result</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Based on your uploaded image
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
              {result.disease}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {result.description}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{confidence}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Confidence</div>
          </div>
        </div>

        {result.symptoms?.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Symptoms</h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              {result.symptoms.map((symptom: string, index: number) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>
        )}

        {result.care_tips?.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Care Tips</h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              {result.care_tips.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex space-x-4 mt-4">
          <Button variant="outline" fullWidth onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Save as PDF
          </Button>
          <Button variant="outline" fullWidth>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 text-sm text-gray-600 dark:text-gray-300 mt-6">
          <Info className="h-4 w-4 inline-block mr-1 text-blue-500" />
          <span>
            This report is AI-generated and should not be used as a medical diagnosis. Please consult a licensed dermatologist for confirmation and treatment.
          </span>
        </div>

        <div className="mt-6 text-center">
          <Link to="/upload">
            <Button variant="primary">Analyze Another Image</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;


