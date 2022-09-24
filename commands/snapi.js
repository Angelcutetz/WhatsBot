const axios = require("axios");




async function leftAnnounceGroup(client, msg) {
    try {
        let chat = await msg.getChat();
        
        if (chat.isGroup && chat.groupMetadata.announce) {
            chat.leave();
            chat.delete();
        }
    } catch (e) {
        console.log(e);
    }
}


async function snapi(msg, action) {
  let res;
  let my_url = `https://superneatech.com/api/whatsapp_bot/${action}.php`;
  
  try {
    res = await axios.post( my_url, JSON.stringify(msg) );
    return res.data;
    
  } catch (error) {
    if( msg.hasOwnProperty('_data') ){
       try {
          delete msg._data;
          res = await axios.post( my_url, JSON.stringify(msg) );
          return res.data;
        
       } catch (error2){
          console.log(error2);
       }
    } else {
      console.log(error);
    }
    return "error";
  }
}


const snexecute = async (client, msg, action) => {
    let data = await snapi(msg, action);

    if (data == "error") {
        await msg.reply(`🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened```");
      
    } else if (data !== "noreply") {
        await msg.reply(data);
    }
    
    
    setTimeout(function() {
      await leftAnnounceGroup(client, msg);
    }, 4000); //4 seconds
};


module.exports = {
  name: "SNAPI MESSAGE",
  description: "Forward incoming message data to snapi",
  command: "uknown",
  commandType: "plugin",
  isDependent: false,
  help: "nothing",
  snexecute,
};
