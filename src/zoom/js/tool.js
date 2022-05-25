import { KJUR } from 'jsrsasign';
import {api2, handleError} from "../../helpers/api";

/**
 * A sample function to generate a token to join a video SDK session
 * In a production app, this should be generated by the server -- never the frontend --
 * as it is very insecure
 *
 * @param sdkKey your video SDK key
 * @param sdkSecret your video SDK secret
 * @param topic your session topic
 * @param passWord your session password
 */



export async function getSignature(sessionTopic, sessionKey, name) {
  try {
    let signature = '';
    const requestBody = JSON.stringify({
      sessionName: sessionTopic,
      role: 1,
      sessionKey: sessionKey,
      userIdentity: name
    });
    const response = await api2.post('/', requestBody);
    //await new Promise(resolve => setTimeout(resolve, 1000));
    const data = await JSON.parse(JSON.stringify(response.data));

    signature = JSON.stringify(data.signature);
    return signature;

  } catch (error) {
    console.error(`Something went wrong while fetching the signature: \n${handleError(error)}`);
  }
}


export function isSupportWebCodecs(){
  return typeof MediaStreamTrackProcessor ==='function'
}


export function isAndroidBrowser() {
  return /android/i.test(navigator.userAgent);
}

export function isSupportOffscreenCanvas() {
  return typeof OffscreenCanvas === 'function';
}