import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from 'react-toastify';
export default function AlertHighestBidder(){

    const socket = useSelector((state)=>state.socketClient.socket)
    useEffect(()=>{
        if(!socket) return
            socket.on("bid-alert-highest-bidder",function ({auctionItemName}){
                    toast(`You have been outbid for this item ${auctionItemName}`)
            })
    },[socket])


    return (
       null
    )


}