import sendGridMail from "@sendgrid/mail";
async function sendMail(emailId, { subject, html, text }) {
  const msg = {
    to: emailId,
    from: "lakshayjain@orbitalnotes.info",
    subject,
    text,
    html,
  };

  console.log("sendMail", emailId);

  try{
  await sendGridMail.send(msg)
  console.log('Email sent')
  }catch(error){
    console.log("error",error)
  }
}

export default sendMail