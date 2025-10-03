import { useState } from "react";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import { API_BASE_URL } from '../../../config';

const gradientStyle = {
  background: "linear-gradient(45deg, rgb(238, 119, 82,0.2), rgb(231, 60, 126,0.2), rgb(35, 166, 213,0.2), rgb(35, 213, 171,0.2))",
  backgroundSize: "400% 400%",
  animation: "gradient 15s ease infinite",
  height: "100vh",
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    console.log("Submitting forgot password for email:", email);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail(""); // Clear the email field
      } else {
        // If the response is not ok, show the error message from the server
        setError(data.error || "Failed to process request. Please try again.");
      }
    } catch (error) {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={gradientStyle} className="relative overflow-hidden h-screen">
      <div className="flex h-full justify-center items-center px-4">
        <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 w-full md:w-96 border-none">
          <div className="flex flex-col gap-2 p-0 w-full">
            <div className="mx-auto">
              <FullLogo />
            </div>
            <p className="text-sm text-center text-dark my-3">Forgot Password</p>
            
            {success ? (
              <div className="text-center">
                <div className="text-green-600 mb-4">
                  <p className="font-medium mb-2">Check your email!</p>
                  <p>If an account exists for {email}, you will receive password reset instructions at this email address.</p>
                  <p className="mt-2 text-sm">Please also check your spam folder if you don't see the email in your inbox.</p>
                </div>
                <button
                  onClick={() => window.location.href = '/auth/login'}
                  className="text-primary hover:text-primary/90"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white rounded-md py-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Send Reset Link"}
                </button>
              </form>
            )}
            {!success && (<div className="flex gap-2 text-base font-small mt-6 items-center justify-center">
              <small>Remember your password?</small>
              <a href="/auth/login" className="text-primary text-xs">
                Login here
              </a>
            </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;