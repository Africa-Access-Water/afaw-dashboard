import { Button, Checkbox, Label, TextInput, Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { login } from "../../../utils/api/authService";

const AuthLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      await login({ email, password });
      // The login service already handles storing in localStorage
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.error || "Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            id="email"
            name="email"
            type="email"
            sizing="md"
            required
            className="form-control form-rounded-xl"
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="userpwd" value="Password" />
          </div>
          <TextInput
            id="password"
            name="password"
            type="password"
            sizing="md"
            required
            className="form-control form-rounded-xl"
          />
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remember this Device
            </Label>
          </div>
          <Link to={"/auth/forgot-password"} className="text-primary text-sm font-medium">
            Forgot Password?
          </Link>
        </div>  
        <Button
          type="submit"
          color={"primary"}
          className="w-full bg-primary text-white rounded-xl"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
