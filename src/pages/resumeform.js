import React, { useState } from "react";
import Swal from "sweetalert2";
import Navbar from "./navbar";

export default function ResumeForm() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    year: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type and size (max 2MB)
    if (selectedFile.type !== "application/pdf") {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Only PDF files are allowed.",
      });
      e.target.value = ""; // Clear the input field
      setFile(null);
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Max file size is 2MB.",
      });
      e.target.value = ""; // Clear the input field
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const validateInputs = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.college ||
      !formData.department ||
      !formData.year ||
      !file
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "All fields are required.",
      });
      return false;
    }
    if (!emailPattern.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Enter a valid email address.",
      });
      return false;
    }
    if (!phonePattern.test(formData.phone)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number must be 10 digits.",
      });
      return false;
    }
    return true;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64File = reader.result.split(",")[1];
      const data = new URLSearchParams();
      data.append("file", base64File);
      data.append("fileName", file.name);
      data.append("mimeType", file.type);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("college", formData.college);
      data.append("department", formData.department);
      data.append("year", formData.year);

      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbwqWM5U11ZydG1s-_00AZbk_EP8-IW7rarqh4fDgZtDuzSST-cxt67fuOBs1dnTRBw/exec",
          {
            method: "POST",
            body: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );
        const result = await response.json();
        if (result.success) {
          setFileUrl(result.fileUrl);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Application Submitted Successfully",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: result.error,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Please try again!",
        });
      }
      setIsLoading(false);
    };
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="card p-4 shadow">
          <h3 className="text-primary mb-4">Junior Web developer</h3>
          <div class="alert alert-primary" role="alert">
            <div class="alert-message">
              <p className="text-muted">
                A web developer is a technical professional responsible for
                designing, coding, and maintaining websites and web
                applications, utilizing programming languages like HTML, CSS,
                and JavaScript to create functional and visually appealing user
                interfaces, while collaborating with designers and stakeholders
                to ensure the website meets business requirements and delivers a
                seamless user experience across different devices.
              </p>
              <h5>Key Responsibilities:</h5>
              <ul>
                <li>
                  Develop and maintain front-end and back-end components of web
                  applications.
                </li>
                <li>Ensure website responsiveness and optimal performance.</li>
                <li>
                  Collaborate with designers and stakeholders for effective
                  UI/UX implementation.
                </li>
                <li>Test, debug, and troubleshoot web applications.</li>
              </ul>
              <h5>Skills Required:</h5>
              <ul>
                <li>
                  Proficiency in HTML, CSS, JavaScript, and frameworks like
                  React or Angular.
                </li>
                <li>
                  Experience with back-end technologies like Node.js, PHP, or
                  Python.
                </li>
                <li>Understanding of database management (MySQL, MongoDB).</li>
                <li>Familiarity with Git version control.</li>
              </ul>
              <h5>Stipend Details:</h5>
              <ul>
                <li>
                  <strong>Amount:</strong> ₹10,000 per month
                </li>
                <li>
                  <strong>Duration:</strong> 6 months
                </li>
                <li>
                  <strong>Additional Perks:</strong> Certificate, Letter of
                  Recommendation, Flexible Work Hours
                </li>
              </ul>
            </div>
          </div>
          <form onSubmit={handleUpload}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">College</label>
              <input
                type="text"
                name="college"
                className="form-control"
                value={formData.college}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="department" className="form-label">
                Select Department
              </label>
              <select
                className="form-control"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Choose...</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="CIVIL">CIVIL</option>
                <option value="MECHANICAL">MECANICAL</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="year" className="form-label">
                Select Year
              </label>
              <select
                className="form-control"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
              >
                <option value="">Choose...</option>
                <option value="3rd year">3rd year</option>
                <option value="4th year">4th year</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="resumeUpload" className="form-label">
                Upload Resume (PDF, max 2MB)
              </label>
              <input
                type="file"
                className="form-control"
                id="resumeUpload"
                onChange={handleFileChange}
                accept="application/pdf"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="col-12 btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
        {isLoading && (
          <div
            className="loading-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
            }}
          >
            <svg
              version="1.1"
              id="L5"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              enableBackground="new 0 0 100 100"
              xmlSpace="preserve"
              style={{
                width: "50px",
                height: "50px",
              }}
            >
              <circle fill="#fff" stroke="none" cx="6" cy="50" r="6">
                <animateTransform
                  attributeName="transform"
                  dur="1s"
                  type="translate"
                  values="0 15 ; 0 -15; 0 15"
                  repeatCount="indefinite"
                  begin="0.1"
                />
              </circle>
              <circle fill="#fff" stroke="none" cx="30" cy="50" r="6">
                <animateTransform
                  attributeName="transform"
                  dur="1s"
                  type="translate"
                  values="0 10 ; 0 -10; 0 10"
                  repeatCount="indefinite"
                  begin="0.2"
                />
              </circle>
              <circle fill="#fff" stroke="none" cx="54" cy="50" r="6">
                <animateTransform
                  attributeName="transform"
                  dur="1s"
                  type="translate"
                  values="0 5 ; 0 -5; 0 5"
                  repeatCount="indefinite"
                  begin="0.3"
                />
              </circle>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
