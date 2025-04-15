"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function PaymentPopup({ onClose }) {
  const fileInputRef = useRef();
  const [upiId, setUpiId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // UPI validation
  const validateUpi = (upi) => {
    const regex = /^[\w.-]+@[\w.-]+$/;
    return regex.test(upi);
  };

  // Drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setScreenshot(file);
      setError("");
    } else {
      setError("Please drop a valid image file.");
    }
  };

  // File select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setScreenshot(file);
      setError("");
    } else {
      setError("Please select a valid image file.");
    }
  };

  // Submit handler
  const handlePayment = async () => {
  if (!upiId || !screenshot) {
    alert("Please enter UPI ID and upload a screenshot.");
    return;
  }
  if (!validateUpi(upiId)) {
    setError("Please enter a valid UPI ID.");
    return;
  }

  setIsUploading(true);

  try {
    // Get existing registration data from localStorage
    const existing = JSON.parse(localStorage.getItem("registeredTeam"));

    // Ensure 'existing' is defined and contains necessary properties
    if (!existing) {
      alert("No team registered in localStorage.");
      return;
    }

    // Upload the screenshot to the server
    const formData = new FormData();
    formData.append("file", screenshot, existing.teamName);

    const uploadRes = await fetch("/api/upload-screenshot", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) throw new Error("Image upload failed");
    const { imageUrl } = await uploadRes.json();

    // Create the payment data object
    const paymentData = {
      upi: upiId,
      screenshot: imageUrl,
      payment: "successful",
      teamName: existing.teamName || "", // Ensure teamName is available
    };

    // Send the payment data to the server to update teams.json
    const res = await fetch("/api/update-payment/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    if (!res.ok) throw new Error("Failed to register team on server");

    const result = await res.json();
    console.log("Backend registration result:", result);

    // Update localStorage after successful registration
    existing.payment = "successful";
    existing.upi = upiId;
    existing.screenshot = imageUrl;
    localStorage.setItem("registeredTeam", JSON.stringify(existing));

    alert("Payment data saved successfully!");
    setScreenshot(null);
    fileInputRef.current.value = "";
    onClose();
  } catch (err) {
    console.error(err);
    alert("Payment processing failed. Please try again.");
  } finally {
    setIsUploading(false);
  }
};
  return (
    <div className="popup-overlay">
      <div className="popup-box" onDragOver={handleDragOver} onDrop={handleDrop}>
        <button className="close-button" onClick={onClose}>✕</button>
        <h2>Pay Entry Fee</h2>
        <p className="price">Prize: ₹50</p>
        <img src="/qr-code.svg" alt="QR Code" className="qr-image" />
        <br />
        <a
          href="upi://pay?pa=7091681946-2@ibl&pn=Turrani%20Esports&am=50&tn=TURRANI%20ESPORTS%20||%20entry%20fees%20rupees%2050/-%20Only&cu=INR"
          target="_blank"
          rel="noopener noreferrer"
        >
          Scan QR Or, Click here!!
        </a>
        <div className="form__group">
          <input
            type="text"
            id="upi"
            required
            placeholder="Enter your UPI ID"
            value={upiId}
            onChange={(e) => {
              setUpiId(e.target.value);
              setError("");
            }}
            className="upi-input form__field"
            aria-label="Enter your UPI ID"
          />
          <label htmlFor="upi" className="form__label">UPI ID</label>
        </div>

        <div
          className="custom-file-upload"
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          aria-label="Upload Payment Screenshot"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {screenshot ? screenshot.name.slice(0, 30) + "..." : "Click or Drag & Drop Payment Screenshot"}
        </div>

        {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}

        <button
          className="pay-button"
          onClick={handlePayment}
          disabled={isUploading}
        >
          {isUploading ? "Processing..." : "Complete Payment"}
        </button>
      </div>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .popup-box {
          background: var(--background);
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          text-align: center;
          position: relative;
        }

        .qr-image {
          width: 150px;
          margin: 1rem auto;
        }

        .price {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .pay-button {
          background: linear-gradient(to right, #85dadc, #48a6a8);
          color: white;
          padding: 0.6rem 1rem;
          border: none;
          border-radius: 8px;
          margin-top: 1rem;
          cursor: pointer;
        }

        .close-button {
          background: transparent;
          border: none;
          color: white;
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .form__group {
          position: relative;
          padding: 15px 0 0;
          margin: 10px auto;
          width: 80%;
        }

        .form__field {
          font-family: inherit;
          width: 100%;
          border: 0;
          border-bottom: 2px solid #9b9b9b;
          outline: 0;
          font-size: 1rem;
          color: #fff;
          padding: 7px 0;
          background: transparent;
          transition: border-color 0.2s;
        }

        .form__field::placeholder {
          color: transparent;
        }

        .form__field:placeholder-shown ~ .form__label {
          font-size: 1rem;
          top: 20px;
        }

        .form__label {
          position: absolute;
          top: 0;
          transition: 0.2s;
          font-size: 0.7rem;
          color: #9b9b9b;
        }

        .form__field:focus {
          padding-bottom: 6px;
          font-weight: 700;
          border-width: 3px;
          border-image: linear-gradient(to right, #85dadc, #48a6a8);
          border-image-slice: 1;
        }

        .form__field:focus ~ .form__label {
          font-size: 0.7rem;
          color: #85dadc;
          font-weight: 700;
        }

        .custom-file-upload {
          display: inline-block;
          padding: 0.6rem 1rem;
          color: #9b9b9b;
          cursor: pointer;
          margin-top: 1rem;
          border: 2px dashed #9b9b9b;
          transition: background 0.3s ease;
          width: 80%;
        }

        .custom-file-upload:hover {
          color: #48a6a8;
          border-color: #48a6a8;
        }

        .custom-file-upload input[type="file"] {
          display: none;
        }
        
        a{
        color: cyan;
        }
      `}</style>
    </div>
  );
}