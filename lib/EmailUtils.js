const sgMail = require("@sendgrid/mail");

const userMailId = "malaypatel4444@gmail.com";
const userName = "Tombraider";

sgMail.setApiKey(
  "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"
);

function send() {
  const msg = {
    to: "malaypatel4444@gmail.com",
    // to: mails.mails,
    from: "ahmedabaduni.events@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: "hellooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
    html: '<text>hellooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo</text><img alt="My Image" src="https://source.unsplash.com/C6oPXOatFD8" />',
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
      return response[0].statusCode;
    })
    .catch((error) => {
      console.error(error);
    });
}
//-----mail send after registeration-----//
function send_confirmation() {
  const confirmation = {
    to: userMailId,
    from: "ahmedabaduni.events@gmail.com",
    subject: "Registered  sucessfully",
    text: `${userName} thank you for registring`,
    html: `<text>${userName} thank you for registring<text/><img alt="My Image" src="https://source.unsplash.com/C6oPXOatFD8" />`,
  };

  sgMail
    .send(confirmation)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
      return response[0].statusCode;
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports.send_confirmation = send_confirmation;
module.exports.send = send;
