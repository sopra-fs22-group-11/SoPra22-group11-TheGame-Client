import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import ZoomVideo from '@zoom/videosdk';
import initClientEventListeners from "../../zoom/js/meeting/session/client-event-listeners";
import initButtonClickHandlers from "../../zoom/js/meeting/session/button-click-handlers";
import state from "../../zoom/js/meeting/session/simple-state";
import sessionConfig from "../../zoom/js/config";
import VideoSDK from "@zoom/videosdk";

const Waitingroom =  () => {
    const client = ZoomVideo.createClient();
    const audioTrack = VideoSDK.createLocalAudioTrack();
    const videoTrack = VideoSDK.createLocalVideoTrack();
    let mediaStream;
    const canvas = document.querySelector('.video-canvas');
/* Eher Experimentell - Bruche mer aber bestimmt öppis i die richtig
    client.on('peer-video-state-change', async (payload) => {
        const { action, userId } = payload;
        if (action === 'Start') {
            await mediaStream.renderVideo(canvas, userId, 1280,640, 50, 50, 2);
        } else if (action === 'Stop') {
            await mediaStream.stopRenderVideo(canvas);
        }
    });

    const captureOptions = {
        cameraId: 'cameraId',
        captureWidth: 640,
        captureHeight: 360,
    };
    // start capture
    stream.startVideo();
    // stop capture
    stream.stopVideo();
*/
    const videoSDKLibDir = '/node_modules/@zoom/videosdk/dist/lib';


    const joinMeeting = async () => {
        console.log("Let's see our client:")
        console.log(client)

        await initAndJoinSession();

        initClientEventListeners(client, mediaStream);
        console.log('======= Initializing client event handlers done =======');
        await startAudioMuted();
        console.log('======= Starting audio muted done =======');
        await initButtonClickHandlers(client, mediaStream);
        console.log('======= Initializing button click handlers done =======');

        console.log('======= Session joined =======');
    }

    const initAndJoinSession = async () => {
        //await client.init('en-US',`${window.location.origin}${videoSDKLibDir}`)
        await client.init('en-US', 'Global');
        const signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZldXbm1JV1hUTHZtc2plV1lFTzViT3JsRVl0dXRHVEtSRDRjIiwidHBjIjoiVGhlIEdhbWU4Iiwicm9sZV90eXBlIjoxLCJ1c2VyX2lkZW50aXR5IjoidXNlcjEyNiIsInNlc3Npb25fa2V5IjoiMTI2IiwiaWF0IjoxNjQ5ODQ5MjgwLCJleHAiOjE2NDk4NTY0ODB9.1m24jssFkGBYNMbmIWGTuL__DO5EUfEiWlVe9IwnDJk"
        try {
            await client.join(
                'The Game8', // It is very important to always (in testing phase) use a new session name or do this: https://devforum.zoom.us/t/meeting-passcode-wrong-but-passcode-is-actual-y-correct/61479/2
                signature,
                'user126',
                '');
            mediaStream = client.getMediaStream();
            state.selfId = client.getSessionInfo().userId;
            console.log("client has joined successfully")
        } catch (e) {
            console.error(e);
        }
    };

    const getClients = () => {
        let participants = client.getAllUser();
        console.log(participants)
    }

    const doChatExample = () => {
        const chat = client.getChatClient();
        chat.sendToAll('hello everyone'); // send message to everyone
        //We don't even plan to support private chats therefore only for completeness: chat.send('hello', userId); // send message to someone
        client.on('chat-on-message', (payload) => {
            const {
                message,
                sender: { name: senderName  },
                receiver: { name: receiverName  },
                timestamp,
            } = payload;
            console.log(
                `Message: ${message}, from ${senderName} to ${receiverName}`
            );
        });
    }


    const startAudioMuted = async () => {

        try{
            await mediaStream.startAudio();
        } catch (e) {
            console.log("We can not start the audio.")
            console.error(e)
        }

        if (!mediaStream.isAudioMuted()) {
            mediaStream.muteAudio();
        }
    }



    // localStorage.setItem('gameId', ); Hier noch herausfinden wie wir schauen, dass leute nur in ihr spiel können
    // siehe gameIdGuard in RouteProtectors


    return (
        <BaseContainer className = "home container">
            <Button
                width="100%"
                onClick={() => joinMeeting()}
            >
                Join
            </Button>
            <Button
                width="100%"
                onClick={() => getClients()}
            >
                get clients
            </Button>

            <Button
                width="100%"
                onClick={() => doChatExample()}
            >
                chat example
            </Button>

            <div id="js-video-view" className="container video-app">
                <canvas id="video-canvas" className="video-canvas" width="1280" height="640"></canvas>
                <div className="container meeting-control-layer">
                    <button id="js-mic-button" className="meeting-control-button">
                        <i id="js-mic-icon" className="fas fa-microphone-slash"></i>
                    </button>
                    <button id="js-webcam-button" className="meeting-control-button">
                        <i id="js-webcam-icon" className="fas fa-video webcam__off"></i>
                    </button>
                    <div className="vertical-divider"></div>
                    <button id="js-leave-button"
                            className="meeting-control-button meeting-control-button__leave-session">
                        <i id="js-leave-session-icon" className="fas fa-phone"></i>
                    </button>
                </div>
            </div>
            <div className="chat-container">
                <div className="chat-wrap">
                    <h2>Chat</h2>
                    <div className="chat-message-wrap" >
                    </div>
                </div>
            </div>
        </BaseContainer>


    ) ;

}

export default Waitingroom;