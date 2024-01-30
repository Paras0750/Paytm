import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Dashboard from "./pages/dashboard";
import SendMoney from "./pages/sendMoney";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Signin} />
        <Route path="/signin" Component={Signin} />
        <Route path="/signup" Component={Signup} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/sendMoney" Component={SendMoney} />
      </Routes>
    </Router>
  );
};

export default App;
