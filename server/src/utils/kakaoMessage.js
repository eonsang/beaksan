const { config, Group } = require("./kakaoMessageIndex");

require("dotenv").config();
config.init({
  apiKey: process.env.KAKAOMESSAGE_APIKEY,
  apiSecret: process.env.KAKAOMESSAGE_APISECRET,
});

const messageParams = {
  type: "ATA",
  subject: "subject",
  text: "이언상님 문의해주셔서 감사합니다.\n이른 시일 내에 연락드리겠습니다.",
  to: "01094923109",
  // https://solapi.com/senderids
  from: "01025734692",
  kakaoOptions: {
    disableSms: true,
    // https://solapi.com/kakao/plus-friends
    pfId: "KA01PF200924071850285HtBPssDKO10",
    // https://solapi.com/kakao/templates
    templateId: "KA01TP200924072408084rEeKUFafX1i",
    buttons: [
      {
        buttonName: "홈페이지 바로가기",
        buttonType: "WL",
        linkMo: "http://baeksanmall.com",
        linkPc: "http://baeksanmall.com",
      },
    ],
  },
};

// send ATA (알림톡)

function send(params, agent = {}) {
  return Group.sendSimpleMessage(params, agent);
}

export async function main() {
  try {
    const response = await send(messageParams);
    console.info(response);
  } catch (error) {
    console.error(error);
  }
}
