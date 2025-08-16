export async function handleAuctionCard(socket, io, supabase, data) {
  delete data["liveDateRaw"];
  const { error } = await supabase.from("auction").insert(data);
  if (error) console.error(error);
  io.emit("auction-cards", data);
}

export function handleRegisterUser(socket, userSocketMap, email) {
  console.log("Email", email);
  userSocketMap.set(email, socket.id);
}
