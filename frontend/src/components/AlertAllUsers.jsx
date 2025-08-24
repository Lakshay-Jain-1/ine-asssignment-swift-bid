import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
export default function AlertAllUsers() {
  const socket = useSelector((state) => state.socketClient.socket);

  useEffect(() => {
    if (!socket) return;

    const handleBidAlert = (data) => {
      console.log("all alert", data);
      toast(`New bid placed for ${data.itemName} with amount ${data.bid}`);
    };

    socket.on("bid-alert-users", handleBidAlert);

    return () => {
      socket.off("bid-alert-users", handleBidAlert);
    };
  }, [socket]);

  return null;
}
