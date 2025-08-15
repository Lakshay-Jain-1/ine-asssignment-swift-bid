import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ToastContainer, toast } from 'react-toastify';
export default function AlertHighestBidder(){

    const [alertMessage,setAlertMessage] = useState("")
    const socket = useSelector((state)=>state.socketClient.socket)
    useEffect(()=>{
            socket.on("bid-alert-highest-bidder",function (data){
                    setAlertMessage(data)
                    toast(alertMessage)
            })
    },[socket])


    return (
        <>
        <ToastContainer autoClose={1000} />
        </>
    )


}