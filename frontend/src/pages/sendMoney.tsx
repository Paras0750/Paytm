import axios from "axios";
import { MouseEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../component/navbar";

export const SendMoney = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const firstName = queryParams.get("firstName");
  const lastName = queryParams.get("lastName");

  const [amount, setAmount] = useState<string>("0");
  const navigate = useNavigate();
  const handleSubmit = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();
    if (amount && Number(amount) < 10) {
      return alert("Minimum amount is Rs 10");
    }
    const data = {
      amount,
      to: id,
    };

    axios
      .post("http://localhost:3000/api/v1/account/transfer", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("Money sent successfully");
        navigate("/dashboard");
      })
      .catch((err) => {
        alert(err.response.data.message || err.response.data || err);
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
          <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
            <div className="flex flex-col space-y-1.5 p-6">
              <h2 className="text-3xl font-bold text-center">Send Money</h2>
            </div>
            <div className="px-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-2xl text-white">A</span>
                </div>
                <h3 className="text-2xl font-semibold">{`${firstName} ${lastName}`}</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="amount"
                  >
                    Amount (in Rs)
                  </label>
                  <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    id="amount"
                    placeholder="Enter amount"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                >
                  Initiate Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendMoney;
