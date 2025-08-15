import { Route, Routes } from "react-router-dom";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";

function App() {
  
  return (

    <Routes>
      <Route path="/signup" Component={SignUp} ></Route>
      <Route path="/signin" Component={SignIn} ></Route>
    </Routes>

  )
}
export default App