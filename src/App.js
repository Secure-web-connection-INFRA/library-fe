import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import Login from "./Components/LoginSignup/Login";
import Signup from "./Components/LoginSignup/Signup";
import ResetPassword from "./Components/LoginSignup/ResetPassword";
function App() {
  return <Login />;
  return (
    <Router>
      <Routes>
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup} />
        <Route path='/reset-password' component={ResetPassword} />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}

export default App;

// login is done/--> UI CHange
// Sign in -> validate email and password -- integrate API -- JWT token in local storage 
// Forget password -> emailID -- page(route for reset/:token) -- new password --> Submit --> API call --> tokk=en and new pass in API

