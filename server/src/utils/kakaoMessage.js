const { config, Group } = require("./kakaoMessageIndex");

require("dotenv").config();
config.init({
  apiKey: process.env.KAKAOMESSAGE_APIKEY,
  apiSecret: process.env.KAKAOMESSAGE_APISECRET,
});

function send(params, agent = {}) {
  return Group.sendSimpleMessage(params, agent);
}

export async function sendTalk(templateId, text, to, buttons = []) {
  try {
    const response = await send({
      type: "ATA",
      subject: "subject",
      text,
      to,
      from: "01093856710",
      kakaoOptions: {
        disableSms: true,
        pfId: "KA01PF200924071850285HtBPssDKO10",
        templateId,
        buttons,
      },
    });
    console.info(response);
  } catch (error) {
    console.error(error);
  }
}
