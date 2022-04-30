import {isProduction} from "../../helpers/isProduction";
//import sessionKey from "../../zoom/js/zoom_key";

export default {
    sdkKey: JSON.stringify(process.env.ZOOM_Key),
    sdkSecret: JSON.stringify(process.env.ZOOM_Secret),
    topic: "marinja at keine lust mehr",
    password: '',
    name: 'Display Name',
    sessionKey: '128',
    user_identity: 'user128'
};
/*sdkKey: isProduction()? process.env.ZOOM_Key :sessionKey.Zoom_Key,
    sdkSecret: isProduction()?process.env.ZOOM_Secret: sessionKey.Zoom_Secret,*/

//to generateSessionTopic above
/*const generateSessionTopic = () => {
    const date = new Date().toDateString();
    const sessionTopic = "theGame" + JSON.stringify(date);
    console.log(sessionTopic);
    return sessionTopic;

}*/
/*sdkKey: false ? process.env.ZOOM_KEY : Zoom_Key,
    sdkSecret: false? process.env.ZOOM_SECRET: Zoom_Secret,*/