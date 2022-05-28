const TelegramBot = require('node-telegram-bot-api')
const token = '5151154189:AAGA_I9INaT4j0IigdRLuAuSAb-S6NBe6Qg'

const bot = new TelegramBot(token, {polling: true})

bot.setMyCommands([
{command: '/start',description:'приветсвие'},
{command: '/help',description:'ага'},


])

const chats ={}
const option = {
reply_markup:JSON.stringify({
inline_keyboard:[
[{text: '1',callback_data:"1"},{text: '2',callback_data:"2"}],
[{text: '3',callback_data:"3"},{text: '4',callback_data:"4"}],
[{text: ' Какое нахуй число ITILA перечитал??? ',callback_data:"11"}]
]
})
}

const start = ()=>{

bot.on('message', (msg) => {
const text = msg.text;
const chatid =msg.chat.id
console.log(msg)
if(text==='/start')
{
bot.sendMessage(chatid,'Велкам ту зе клаб бади '+msg.from.first_name+' дон')
bot.sendMessage(chatid,'Ты можешь писать тут свой вопрос, его обязательно посмотрят')
bot.on('message', (msg1) => {
const text1 = msg1.text;
const chatid1 =msg1.chat.id
bot.sendMessage(chatid,'твой вопрос '+text1+' записан ')
console.log(text1)


})
