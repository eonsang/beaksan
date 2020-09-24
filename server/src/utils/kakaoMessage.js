const { config, Group } = require('./kakaoMessageIndex')

require("dotenv").config();
config.init({
  apiKey: process.env.KAKAOMESSAGE_APIKEY,
  apiSecret: process.env.KAKAOMESSAGE_APISECRET,
});

const messageParams = {
  type: 'ATA',
  subject: 'this is ATA',
  text: 'Hello, this is ATA',
  to: '01025734692',
  // https://solapi.com/senderids
  from: '01025734692',
  kakaoOptions: {
    disableSms: true,
    // https://solapi.com/kakao/plus-friends
    pfId: 'KA01PF200924071850285HtBPssDKO10',
    // https://solapi.com/kakao/templates
    templateId: 'KA01TP200924072408084rEeKUFafX1i',
    buttons: [
      {
        buttonName: '홈페이지 바로가기',
        buttonType: 'WL',
        linkMo: 'https://naver.com',
        linkPc: 'https://naver.com',
      }
    ]
  }
}

// send ATA (알림톡)


function send (params, agent = {}) {
  return Group.sendSimpleMessage(params, agent)
}

export async function main () {
  try {
    const response = await send(messageParams);
    console.info(response);
  } catch (error) {
    console.error(error);
  }
}
