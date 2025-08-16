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
import 'react-toastify/dist/ReactToastify.css';
import "./stylesheets/index.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        toastClassName="swiftbid-toast"
        progressClassName="swiftbid-toast-progress"
      />
</>
  )
}
export default App