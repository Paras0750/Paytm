import Balance from "../component/balance";
import Navbar from "../component/navbar";
import Users from "../component/users";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div>
        <Balance />
        <Users />
      </div>
    </>
  );
};

export default Dashboard;
