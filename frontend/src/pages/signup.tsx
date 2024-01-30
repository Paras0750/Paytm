import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("Paras3");
  const [lastName, setLastName] = useState("Nauriyal3");
  const [email, setEmail] = useState("e21cseu0049@bennett.edu.innn");
  const [password, setPassword] = useState("abc@123");

  const navigate = useNavigate();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      firstName,
      lastName,
      password,
      username: email,
    };

    await axios
      .post("http://localhost:3000/api/v1/user/signup", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        if (response.status == 200) {
          navigate("/dashboard");
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="flex flex-col my-auto justify-center md:w-[50%] border py-4 gap-4 rounded-xl bg-white">
        <h1 className="text-4xl text-center font-extrabold">Sign Up</h1>
        <h2 className="text-center">
          Enter your information to create an account
        </h2>
        <form className="flex flex-col gap-2  m-4 p-4" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            value={firstName}
            className="border px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-opacity-50"
            onChange={(e) => setFirstName(e.target.value)}
            id="firstName"
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            value={lastName}
            className="border px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-opacity-50"
            onChange={(e) => setLastName(e.target.value)}
            id="lastName"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            className="border px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-opacity-50"
            onChange={(e) => setEmail(e.target.value)}
            id="email"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            className="border px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-opacity-50"
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
          <button
            type="submit"
            className="bg-[#1F2937] text-white py-3 rounded-2xl"
          >
            Sign Up
          </button>
          <div className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/signin" className="underline">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;
