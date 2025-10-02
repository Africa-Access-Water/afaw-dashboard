import { Button, Label, TextInput, Select, Alert } from "flowbite-react";
import { useNavigate } from "react-router";
import { useState } from "react";

import { API_BASE_URL } from '../../../config';
const BASE_URL = API_BASE_URL;

const AuthRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const role = (form.elements.namedItem("role") as HTMLSelectElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, role, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration request sent successfully! Your request is pending approval.");
        navigate("/auth/login"); // redirect to login page
      } else {
        setError(data.error || "Registration request failed");
      }
    } catch (error: any) {
      setError("Error: " + error.message);
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
          <Label htmlFor="name" value="Name" />
          <TextInput
            id="name"
            name="name"
            type="text"
            sizing="md"
            required
            className="form-control form-rounded-xl"
            placeholder="Test User"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="email" value="Email Address" />
          <TextInput
            id="email"
            name="email"
            type="email"
            sizing="md"
            required
            className="form-control form-rounded-xl"
            placeholder="test@email.com"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="role" value="Role" />
          <Select
            id="role"
            name="role"
            required
            className="form-control form-rounded-xl"
            defaultValue="contributor"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="contributor">Contributor</option>
          </Select>
        </div>

        <div className="mb-6">
          <Label htmlFor="password" value="Password" />
          <TextInput
            id="password"
            name="password"
            type="password"
            sizing="md"
            required
            className="form-control form-rounded-xl"
            placeholder="123456"
          />
        </div>

        <Button
          color={"primary"}
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Sending request..." : "Request Access"}
        </Button>
      </form>
    </>
  );
};

export default AuthRegister;
