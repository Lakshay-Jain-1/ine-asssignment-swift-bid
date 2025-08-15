import { Route, Routes } from "react-router-dom";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import { useEffect } from "react";
import {useDispatch} from "react-redux"
import { connectSocket, disconnect } from "./store/features/webSocket.js"
function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
      dispatch(connectSocket())
  },[])

  return (

    <Routes>
      <Route path="/signup" Component={SignUp} ></Route>
      <Route path="/signin" Component={SignIn} ></Route>
    </Routes>

  )
}
export default App