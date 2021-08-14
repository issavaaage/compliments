const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '1471182053:AAHzQPMAd6fYbrKKrKkaP8aEAFHYvhb4MRs';

const bot = new TelegramBot(TOKEN, {
    polling: true
});

let data = fs.readFileSync('./123.json');
let comp = JSON.parse(data);
let chats = [];

let getCurrentTime = () => {
    let date = new Date();
    return {
        hours: date.getHours(),
        minutes: date.getMinutes()
    }
}

let getRandomCompl = (name, pre = 'Здравствуй') => {
    return `${pre}, ${name}\n\n${comp.data[parseInt(Math.random()*comp.data.length)]}`
}

let autoSendTimes = [{
    hours: 8,
    minutes: 30,
    pre: 'С добрым утром, '
}, {
    hours: 22,
    minutes: 30,
    pre: 'Сладких снов, '
}]

bot.on('message', (msg) => {
    chats.push({
        id: msg.chat.id,
        name: msg.from.first_name
    });
    bot.sendMessage(msg.chat.id, getRandomCompl(msg.from.first_name));
});

(() => {
    let currentTime = getCurrentTime();
    setTimeout(() => {
        setInterval(() => {
            let timeNow = getCurrentTime();
            autoSendTimes.forEach((el) => {
                if(el.hours === timeNow.hours) {
                    chats.forEach((chat) => {
                        bot.sendMessage(chat.id, getRandomCompl(chat.name, el.pre))
                    })
                }
            })
        }, 1 * 60 * 60 * 1000);
    }, Math.abs(currentTime.minutes - 30) * 60 * 1000);
})()
