import { Route, Routes } from "react-router-dom";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { connectSocket, disconnect } from "./store/features/webSocket.js"
import { Auction } from "./pages/Auction.jsx";
import { Seller } from "./pages/Seller.jsx";
import NavBar from "./components/NavBar.jsx";
import Lander from "./pages/Lander.jsx";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(connectSocket())
  }, [])

  return (
    <>
    <NavBar/> 
    <Routes>
      <Route path="/" Component={Lander} ></Route>
      <Route path="/seller" Component={Seller} ></Route>
      <Route path="/auction" Component={Auction} ></Route>
      <Route path="/signup" Component={SignUp} ></Route>
      <Route path="/signin" Component={SignIn} ></Route>
    </Routes>
</>
  )
}
export default App