import env from 'dotenv';
import Telegram from './telegram/telegram'
import {NewMessageEvent } from 'telegram/events';

env.config();


// handle environment variables
const ENV_REQUIRED = ["BOT_TOKEN","API_HASH","API_ID"];
const allEnv = new Set(Object.keys(process.env));
const existsEnv =  ENV_REQUIRED.every(e => allEnv.has(e));
if(!existsEnv) {
    console.log("Environment variable missing");
    process.exit(1);
}

if(existsEnv) console.log("Environment variable Loaded successfully");


// handle telegram 
const telegram = new Telegram({apiHash:process.env.API_HASH!, apiId:parseInt(process.env.API_ID!), session:""})

export default async function main () {


    // listen to telegram
    telegram.listen(async (data:NewMessageEvent )=> { await processTask(); console.log(data.message.message); })

}

const processTask  = async ()=> { }