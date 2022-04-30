import {isProduction} from "../../helpers/isProduction";
import Zoom_Key from "./zoom_key";
import Zoom_Secret from "./zoom_key";

export default {
    sdkKey: process.env.ZOOM_KEY,
    sdkSecret: process.env.ZOOM_SECRET,
    topic: 'generateSessionTopic',
    password: '',
    name: 'Display Name',
    sessionKey: '123',
    user_identity: 'user123'
};
/*sdkKey: isProduction() ? process.env.ZOOM_KEY : Zoom_Key,
    sdkSecret: isProduction()? process.env.ZOOM_SECRET: Zoom_Secret,*/

//to generateSessionTopic above
const generateSessionTopic = () => {
    const date = new Date().toDateString();
    const sessionTopic = "theGame" + date;
    console.log(sessionTopic);
    return sessionTopic;

}
/*sdkKey: false ? process.env.ZOOM_KEY : Zoom_Key,
    sdkSecret: false? process.env.ZOOM_SECRET: Zoom_Secret,*/