var mysql = require('mysql2');
const { Telegraf, session, Scenes, Markup, Composer } = require('telegraf')
const fs = require('fs');
const { title } = require('process');
let rawdata = fs.readFileSync('config.json');
let databot = JSON.parse(rawdata);
const bot = new Telegraf(databot.token)

var klava =[];
var list=[];




let button = [{ text: "<", callback_data: "left" }]

let StateProps = [{id:'0',title:'Привет, макс',qwtext:'Это тест',qwdate:'06.04.2000'},
{id:'1',title:'Второе сообщение',qwtext:'Это тест',qwdate:'06.04.2000'}];

const pool = mysql.createPool({
  connectionLimit: 1,
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "miemis",
  charset: 'utf8mb4'
});






bot.command('start', async(ctx,next) => {

  ctx.reply(`Вопрос:  `)

})


bot.launch()























// pool.query("select wp_posts.ID,wp_posts.post_title, wp_posts.post_author,wp_posts.post_content,wp_posts.post_date from wp_posts inner join wp_postmeta on wp_posts.ID = wp_postmeta.post_id WHERE wp_postmeta.meta_value='open';;", function(err, results) {
//   if (err) console.log(err);
//   const qwid = results[0]?.ID;
//  StateProps.push(results)

//  setValue(results);
// });

// function setValue(value) {
//   someVar = value;
//   console.log(someVar);
// }
