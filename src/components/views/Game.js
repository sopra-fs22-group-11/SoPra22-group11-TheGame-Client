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
import HeaderGame from "./HeaderGame";
import {generateSessionToken} from "../../zoom/js/tool";
import user from "../../models/User";

const Game =  () => {
    const history = useHistory();

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
        //const signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZldXbm1JV1hUTHZtc2plV1lFTzViT3JsRVl0dXRHVEtSRDRjIiwidHBjIjoiVGhlIEdhbWUxNCIsInJvbGVfdHlwZSI6MSwidXNlcl9pZGVudGl0eSI6InVzZXIxMiIsInNlc3Npb25fa2V5IjoiMTIiLCJpYXQiOjE2NTAxNzU3NjIsImV4cCI6MTY1MDE4Mjk2Mn0.9LDb64dU9n7NXKSdKUsi8ZYD9fDy5YGWAbTnjpTtZgM";
        const signature = generateSessionToken(
            sessionConfig.sdkKey,
            sessionConfig.sdkSecret,
            sessionConfig.topic,
            sessionConfig.password,
            sessionConfig.sessionKey,
            localStorage.getItem('username')
        );
        try {
            await client.join(
                sessionConfig.topic,
                signature,
                localStorage.getItem('username'),
                sessionConfig.password
            );
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
    const myfun = async ()=>{
        try{
            await client.leave();
        } catch (e){
            console.log("was not in a meeting");
        }
        console.log('hello');
    }

    window.onbeforeunload = function(){
       // myfun();
        return 'Are you sure you want to leave?';
    };

    window.onunload = function() {
        myfun();
        alert('Bye.');
    }

    const goToHome = async () => {
        try{
            await client.leave();
        }catch (e) {
            alert("can not leave te meeting")
        }
        history.push('/startpage');
    }
    //Comment the next line, when working on the game
    //joinMeeting();

    return (
        <div>
            <HeaderGame height="100"/>
        <BaseContainer className = "left">
            <Button className ="game-button"
                onClick={() => joinMeeting()}
            >
                Stack 1
            </Button>
            <Button className ="game-button"
                    onClick={() => getClients()}
            >
                Stack 2
            </Button>
            <Button className ="game-button"
                    onClick={() => doChatExample()}
            >
                Stack 3
            </Button>
            <Button className ="game-button"
                    onClick={() => doChatExample()}
            >
                Stack 4
            </Button>
        </BaseContainer>
            <BaseContainer className = "right">
            <div id="js-video-view" className="container video-app">
                <canvas id="video-canvas" className="video-canvas" width="320" height="160"></canvas>
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
        </BaseContainer>
        </div>

    ) ;

}

export default Game;