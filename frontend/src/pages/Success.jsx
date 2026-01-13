// import { CheckCircle } from 'lucide-react';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Success() {
//   const navigate = useNavigate();

// useEffect(() => {
//   const generateReport = async () => {
//     try {
//       const imageData = localStorage.getItem("uploadedImage");
//       if (!imageData) {
//         console.error("No uploaded image found");
//         return;
//       }

//       const res = await fetch(imageData);
//       const blob = await res.blob();

//       const formData = new FormData();
//       formData.append("file", blob, "skin.jpg");

//       const response = await fetch("http://localhost:8000/predict-and-generate-report", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         console.error("Failed to generate report");
//         return;
//       }

//    const data = await response.json();
// localStorage.setItem("predictionResult", JSON.stringify(data.result));

// const pdfRes = await fetch(`http://localhost:8000/download-report/${data.reportId}`);
// const pdfBlob = await pdfRes.blob();
// const pdfUrl = window.URL.createObjectURL(pdfBlob);
// const a = document.createElement("a");
// a.href = pdfUrl;
// a.download = "Skin_Report.pdf";
// document.body.appendChild(a);
// a.click();
// a.remove();


//       localStorage.removeItem("uploadedImage");
//       navigate("/results");

//     } catch (err) {
//       console.error("Error generating report:", err);
//     }
//   };

//   generateReport();
// }, [navigate]);


//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-green-900/20 text-center px-4">
//       <CheckCircle className="text-green-600 dark:text-green-400 w-16 h-16 mb-4" />
//       <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-2">
//         Payment Successful!
//       </h2>
//       <p className="text-gray-700 dark:text-gray-300 text-lg">
//         Your payment has been processed. We’re now analyzing your image.
//       </p>
//       <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
//         Generating your report...
//       </p>
//     </div>
//   );
// }

import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const generateReport = async () => {
      try {
        const imageData = localStorage.getItem("uploadedImage");

        if (!imageData) {
          console.error("No uploaded image found in localStorage");
          return;
        }

        // Convert base64 to blob
        const res = await fetch(imageData);
        const blob = await res.blob();

        const formData = new FormData();
        formData.append("file", blob, "skin.jpg");

        // Send image to FastAPI
        const response = await fetch("http://localhost:8000/predict-and-generate-report", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Failed to generate report");
          return;
        }

        const data = await response.json();

        // Save prediction result to localStorage
        localStorage.setItem("predictionResult", JSON.stringify(data.result));

        // Fetch and trigger PDF download
        const pdfRes = await fetch(`http://localhost:8000/download-report/${data.reportId}`);
        const pdfBlob = await pdfRes.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.download = "Skin_Report.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Clean up
        localStorage.removeItem("uploadedImage");

        // Navigate to results page
        navigate("/results");
      } catch (err) {
        console.error("Error generating report:", err);
      }
    };

    generateReport();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-green-900/20 text-center px-4">
      <CheckCircle className="text-green-600 dark:text-green-400 w-16 h-16 mb-4" />
      <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-2">
        Payment Successful!
      </h2>
      <p className="text-gray-700 dark:text-gray-300 text-lg">
        Your payment has been processed. We’re now analyzing your image and generating your report.
      </p>
      <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
        Please wait...
      </p>
    </div>
  );
}
