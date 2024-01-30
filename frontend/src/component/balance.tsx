import axios from "axios";
import { useEffect, useState } from "react";

const Balance = () => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setBalance(response.data.balance);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);
  return (
    <>
      <div className="px-4 my-4 text-2xl">Your Balance: $ {`${balance}`}</div>
    </>
  );
};

export default Balance;
