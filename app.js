var mysql = require('mysql2');
const { Telegraf, session, Scenes, Markup, Composer } = require('telegraf')
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
let databot = JSON.parse(rawdata);
const bot = new Telegraf(databot.token)

const StateProps = {};
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "miemis",
  charset: 'utf8mb4'
});

const startWizard = new Composer()
startWizard.on('text', (ctx, args) => {
ctx.wizard.state.data = {};
    
const da =new Date();
const y = da.getFullYear();
const d = da.getDate();
const m = da.getMonth()+1;
const h =da.getHours();
const M =da.getMinutes();
const datet =""+y+"-0"+m+"-"+d+" 0"+h+":"+M+":00";
    ctx.wizard.state.data.message =ctx.message.text;
    ctx.wizard.state.data.id = ctx.from.id;
    ctx.wizard.state.data.user = ctx.from.first_name;
    ctx.wizard.state.data.username = ctx.from.username;
    ctx.wizard.state.data.date = datet;
ctx.reply(`Чтобы добавить ответ напишите 'Да' `)
   return ctx.wizard.next() 
})


const messenger = new Composer()
messenger.on('text', async(ctx, args) => {
        
        const data = ['' + ctx.wizard.state.data.message + '', '' + ctx.wizard.state.data.date + ''];
        
  
  qadd(ctx,data)
        await ctx.reply('Ваш ответ ' + ctx.wizard.state.data.message + ' записан')
        
        return ctx.scene.leave()

    })
    //////////Сцены

const menuScene = new Scenes.WizardScene('sceneWizard', startWizard, messenger)
const stage = new Scenes.Stage([menuScene])
bot.use(session())
bot.use(stage.middleware())






bot.command('start', async(ctx) => {
start(ctx)
})



bot.action('del', (ctx)=>{
  qdel(ctx)
  ctx.deleteMessage()
ctx.reply(`Удалено`)

})
bot.action('add', (ctx)=>{
  qadd(ctx)
   ctx.deleteMessage()
})

bot.action('max', (ctx)=>{
  ctx.reply(`Введите ваш ответ на вопрос`)
   
  
  ctx.scene.enter('sceneWizard')
  ctx.editMessageText('ахахахааха')
   ctx.deleteMessage()
  
})


bot.action('right', (ctx)=>{
 
  
  ctx.editMessageText(`право`, {
    reply_markup: {
        inline_keyboard: [
            [{ text: "<", callback_data: "left" },{ text: "Удалить", callback_data: "del" }, { text: "Ответить", callback_data: "max" },{ text: ">", callback_data: "right" }]
        ]
    }
})
})

function qdel(ctx){
  pool.query("select wp_posts.ID,wp_posts.post_title, wp_posts.post_author,wp_posts.post_content,wp_posts.post_date from wp_posts inner join wp_postmeta on wp_posts.ID = wp_postmeta.post_id WHERE wp_postmeta.meta_value='open';;", function(err, results) {
    if (err) console.log(err);
    const qwid = results[0]?.ID;

    pool.query(`DELETE FROM wp_posts WHERE ID =${qwid};`, function(err, results) {
        if (err) console.log(err);        
    });
});
}

function qadd(ctx,data){
  pool.query("select wp_posts.ID,wp_posts.post_title, wp_posts.post_author,wp_posts.post_content,wp_posts.post_date from wp_posts inner join wp_postmeta on wp_posts.ID = wp_postmeta.post_id WHERE wp_postmeta.meta_value='open';;", function(err, results) {
    if (err) console.log(err);
    const qwid = results[0]?.ID;
console.log(data);
    pool.query(`INSERT INTO wp_posts(post_date,  post_content, post_title,  post_parent,  post_type,post_date_gmt,post_modified,post_modified_gmt,post_excerpt,to_ping,pinged,post_content_filtered) VALUES ('${data[1]}',N'${data[0]}',N'Вопрос','${qwid}','dwqa-answer','${data[1]}','${data[1]}','${data[1]}','','','','')`, function(err, results) {
        if (err) console.log(err);        
    });
});
  
}
function start(ctx){
  
    pool.query("select wp_posts.ID,wp_posts.post_title, wp_posts.post_author,wp_posts.post_content,wp_posts.post_date from wp_posts inner join wp_postmeta on wp_posts.ID = wp_postmeta.post_id WHERE wp_postmeta.meta_value='open';;", function(err, results) {
        if (err) console.log('err');
        
      if(results[0]?.post_title == undefined){
          ctx.reply(`Вопросов больше нет`)
         }
      else{
           const title = results[0]?.post_title;
        const qwtext =results[0]?.post_content; 
        const qwdate =results[0]?.post_date; 
        ctx.reply(`Вопрос: ${title} \n ${qwtext} \n В ${qwdate} `, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "<", callback_data: "left" },{ text: "Удалить", callback_data: "del" }, { text: "Ответить", callback_data: "max" },{ text: ">", callback_data: "right" }]
                ]
            }
        })
      } 
    });
}

bot.launch()
