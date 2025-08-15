import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import AuctionCard from "../components/AuctionCard"
import { supabase } from "../supabase-client"
import AlertHighestBidder from "../components/AlertHighestBidder"
import AlertAllUsers from "../components/AlertAllUsers"


export const Auction = () => {
    const socket = useSelector((state) => state.socketClient.socket)
    const [auctionData, setAuctionData] = useState([])
    
    const fetchAuctionData = async ()=>{
      const {error,data} = await supabase.from("auction").select("*")
      setAuctionData(data)
    }
    
    useEffect(()=>{
        fetchAuctionData()
    },[])

    useEffect(() => {
        if (!socket) return
        socket.on("auction-cards", (data) => {
            setAuctionData((prev) => [...prev, data])
        })
    }, [socket])


    return (
        <>
            {
                auctionData.map((ele) => (
                    <AuctionCard
                        data={ele}
                        key={`${ele.itemName}-${ele.liveDate}`}
                    />
                ))
            }

            <AlertHighestBidder/>
            <AlertAllUsers/>

        </>
    )

}
