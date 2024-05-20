import "./App.css";
import LoginSignup from "./Components/LoginSignup/LoginSignup.js";
import Login from './Components/LoginSignup/Login';
import Signup from './Components/LoginSignup/Signup';
import ResetPassword from './Components/LoginSignup/ResetPassword';
function App() {
  return (
    <div>
      <LoginSignup/>
    </div>
  );
  // return (
  //   <Router>
  //     <Switch>
  //       <Route path="/login" component={Login} />
  //       <Route path="/signup" component={Signup} />
  //       <Route path="/reset-password" component={ResetPassword} />
  //       <Redirect from="/" to="/login" exact />
  //     </Switch>
  //   </Router>
  // );
}

export default App;

// login is done/--> UI CHange
// Sign in -> validate email and password -- integrate API -- JWT token in local storage 
// Forget password -> emailID -- page(route for reset/:token) -- new password --> Submit --> API call --> tokk=en and new pass in API

