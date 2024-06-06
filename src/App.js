import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import RoleChangeForm from "./pages/Role";
import BookUploadForm from "./pages/Upload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
        <Route path='/reset/:token' element={<ResetPassword />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/access' element={<RoleChangeForm />} />
        <Route path='/upload' element={<BookUploadForm />} />
        <Route path='*' element={<Navigate to='/dashboard' />} />
      </Routes>
    </Router>
  );
}

export default App;
