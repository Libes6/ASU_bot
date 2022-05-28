var mysql = require('mysql2');
const { Telegraf, session, Scenes, Markup, Composer } = require('telegraf')
const fs = require('fs');
const { title } = require('process');
let rawdata = fs.readFileSync('config.json');
let databot = JSON.parse(rawdata);
const bot = new Telegraf(databot.token)

var klava =[[{ text: "Обновить список вопросов", callback_data: "ref" }]];
var list=[];
var qwid =''




const startWizard = new Composer()
startWizard.on('text', (ctx, args) => {
ctx.wizard.state.data = {};
    
const da =new Date();
const datet =`${da.getFullYear()}-0${da.getMonth()+1}-${da.getDate()} ${da.getHours()}:${da.getMinutes()}`;
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
  ctx.reply(`${qwid} сообщение`)
        await ctx.reply(`Ваш ответ '${ctx.wizard.state.data.message}' \nна вопрос  '${textqw}' записан `)
        await start(ctx)
        return ctx.scene.leave()

    })
    //////////Сцены

const menuScene = new Scenes.WizardScene('sceneWizard', startWizard, messenger)
const stage = new Scenes.Stage([menuScene])
bot.use(session())
bot.use(stage.middleware())


function qadd(ctx,data){
  pool.query("select wp_posts.ID,wp_posts.post_title, wp_posts.post_author,wp_posts.post_content,wp_posts.post_date from wp_posts inner join wp_postmeta on wp_posts.ID = wp_postmeta.post_id WHERE wp_postmeta.meta_value='open';;", function(err, results) {
    if (err) console.log(err); 
console.log(data);
    pool.query(`INSERT INTO wp_posts(post_author,post_date,  post_content, post_title,  post_parent,  post_type,post_date_gmt,post_modified,post_modified_gmt,post_excerpt,to_ping,pinged,post_content_filtered) VALUES ('3','${data[1]}',N'${data[0]}',N'Вопрос','${qwid}','dwqa-answer','${data[1]}','${data[1]}','${data[1]}','','','','')`, function(err, results) {
        if (err) console.log(err);        
    });
});
  
}


let button = [{ text: "Вернуться к вопросам", callback_data: "left" }]

const pool = mysql.createPool({
  connectionLimit: 1,
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "miemis",
  charset: 'utf8mb4'
});


function  selectqw(ctx,cq){
  pool.query("select wp_posts.ID,wp_posts.post_title, wp_posts.post_author,wp_posts.post_content,wp_posts.post_date from wp_posts inner join wp_postmeta on wp_posts.ID = wp_postmeta.post_id WHERE wp_postmeta.meta_value='open';;", function(err, results) {
    if (err) console.log(err); 
   klava =[[{ text: "         Обновить список вопросов      ", callback_data: "ref" }]];
  list=[]
   
  for(let i=0;i<results.length;i++){
    if(results[i].post_title.length>34){
let errmessage = results[i].post_title;
let noerr = errmessage.slice(0,34);
klava.push([{ text: `${noerr}`, callback_data: `${noerr}` }]);
         }
         else{
          klava.push([{ text: `${results[i].post_title}`, callback_data: `${results[i].post_title}` }]);
          
         }
         list.push(results)
         console.table(results)
  }


if(cq==undefined){
  ctx.replyWithHTML(`<b>Cписок вопросов</b>  `, {
    reply_markup: {      
        inline_keyboard: klava       
                  }
})
}
else{
  for(let j=0;j<results.length;j++){
    if(cq==results[j].post_title.slice(0,34)){
      qwid = results[j].ID
       titleqw = results[j].post_title
       textqw = results[j].post_content
       dateqw = results[j].post_date
       const datem =new Date(dateqw);
       const datetmes =`${datem.getFullYear()}-0${datem.getMonth()+1}-${datem.getDate()} в ${datem.getHours()}:${datem.getMinutes()}`;
       ctx.reply(`Вопрос: ${titleqw} \nТекст вопроса:  '${textqw}' \n ${datetmes}`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Назад", callback_data: "назад" },{ text: "Удалить", callback_data: "del" }, { text: "Ответить", callback_data: "add" }]
            ]
        }
    })
    }

  }
}
  });
}

// selectqw()



async function start(ctx){
  await selectqw(ctx)

  //setTimeout(, 1000);

   
}
function notify(ctx){
  pool.query("select wp_posts.ID,wp_posts.post_title, wp_posts.post_author,wp_posts.post_content,wp_posts.post_date from wp_posts inner join wp_postmeta on wp_posts.ID = wp_postmeta.post_id WHERE wp_postmeta.meta_value='open';;", function(err, results) 
  {
    if (err) console.log(err);
    if(results.length !=list.length){
      ctx.reply(`У вас ${results.length-list.length} новых вопроса`)
      start(ctx)
    }
    else{
    
    }
  
  
  });

  

}
bot.command('start', async(ctx,next) => {
  try{
    // await selectqw(ctx)
    await start(ctx)
    i=0
    setTimeout(function run() {
    notify(ctx)
      setTimeout(run, 10000);
    }, 100);
  }
  catch(e){
    ctx.reply('В приложении произошла ошибка')
  }
 

})

function del(qwid){
  try{
    pool.query(`DELETE FROM wp_posts WHERE ID =${qwid};`, function(err, results) {
      if (err) console.log(err);      
       
      console.log(klava)
  });
  }
  catch(e){
    ctx.reply(`Ошибка в обновлении вопросов\n вы можете спокойно продолжить работу`)
  }


}

 function add(ctx,qwid){
  
  ctx.reply(`Введите ваш ответ на вопрос`)  
  ctx.scene.enter('sceneWizard')
  
}

bot.action('назад',async(ctx)=>{
  try{
    await ctx.deleteMessage();
    await start(ctx)
  }
  catch(e){
    await ctx.reply(`Ошибка в обновлении вопросов\n вы можете спокойно продолжить работу`)
  }
  
})

bot.action('del',async(ctx)=>{
  try{
    await ctx.reply(`Вопрос удален '${titleqw}'`)
    await ctx.deleteMessage();
    await del(qwid)
    // await selectqw(ctx)
    await start(ctx)
  }
  catch(e){
    await ctx.reply(`Ошибка в обновлении вопросов\n вы можете спокойно продолжить работу`)
  }
  
})

bot.action('add',async(ctx)=>{
  await ctx.reply(`Добавить ответ на '${titleqw}'`)
  await ctx.deleteMessage();
  await add(ctx,qwid)
 
})

bot.action('ref',async(ctx)=>{

  try{
   
    await ctx.deleteMessage();
    await start(ctx)
    await ctx.reply(`Вопросы обновлены`)
    
  }
  catch(e){
    await ctx.reply(`Ошибка в обновлении вопросов\n вы можете спокойно продолжить работу`)
  }
 
})

bot.on('callback_query', async(ctx,next) => {
  try{
    await ctx.answerCbQuery();
    await ctx.deleteMessage(); 
    await selectqw(ctx,ctx.callbackQuery.data)
    
  }
  catch(e){
    
    await ctx.reply(`Ошибка в обновлении вопросов\n вы можете спокойно продолжить работу`)
  }
 
});
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
