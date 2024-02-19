import { TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { StringSession } from "telegram/sessions";
import nodeReadline, { Interface, promises } from 'node:readline';
import { stdin, stdout } from "node:process";
import { ITelegramArgs } from "../types/types";


class Telegram {

    private readline : Interface;
    private apiId: number;
    private apiHash:string;
    private session:StringSession;
    public client: TelegramClient;

    constructor (telegramArgs : ITelegramArgs) {
        this.apiId = telegramArgs.apiId;
        this.apiHash = telegramArgs.apiHash;
        this.session = new StringSession(telegramArgs.session);
        this.readline = nodeReadline.createInterface({
            input:stdin,
            output:stdout
        });
        this.client = new TelegramClient(this.session, this.apiId, this.apiHash, {connectionRetries:5});
    };

    
    async input(question: string){
        return new Promise<string>((resolve) =>this.readline.question(question, (ans:string)=> resolve(ans)));
    }


    async start () {
       await this.client.start({
            phoneNumber: async ()=> await this.input("Please enter your number: "),
            password: async () => await this.input("Please enter your password: "),
            phoneCode: async () => await this.input("Please enter the code you received: "),
            onError: (err) => console.log(err),
        })
        this.client.session.save();
    }

    async listen (callBack: (event :NewMessageEvent)=>Promise<void>) {
        await this.start();
        this.client.addEventHandler(callBack, new NewMessage({}))
        // this.client.connect();
    }

}

export default Telegram;