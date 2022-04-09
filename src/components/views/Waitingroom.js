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

const Waitingroom =  () => {
    const [client, setClient] = useState(null);
    let mediaStream;

    const joinMeeting = () => {
        joinMeetingAndEventListeners();
        /*const signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZldXbm1JV1hUTHZtc2plV1lFTzViT3JsRVl0dXRHVEtSRDRjIiwidHBjIjoiVGhlIEdhbWU0Iiwicm9sZV90eXBlIjowLCJ1c2VyX2lkZW50aXR5IjoidGVzdE5hbWUiLCJzZXNzaW9uX2tleSI6IiIsImlhdCI6MTY0OTQ5MjQ5MiwiZXhwIjoxNjQ5NDk5NjkyfQ.EfydnuAodvD8g155Z0dOesjzIJSRycy_l7WIwdX8yJs"
        client.join(
            'The Game4', // It is very important to always (in testing phase) use a new session name or do this: https://devforum.zoom.us/t/meeting-passcode-wrong-but-passcode-is-actual-y-correct/61479/2
            signature,
            'testName',
            '',
        ).then(() => {
            console.log('Join meeting success');
        }).catch((error) => {
            console.error(error);
        });*/
    }

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

    async function joinMeetingAndEventListeners (){
        /*const signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZldXbm1JV1hUTHZtc2plV1lFTzViT3JsRVl0dXRHVEtSRDRjIiwidHBjIjoiVGhlIEdhbWU0Iiwicm9sZV90eXBlIjowLCJ1c2VyX2lkZW50aXR5IjoidGVzdE5hbWUiLCJzZXNzaW9uX2tleSI6IiIsImlhdCI6MTY0OTQ5MjQ5MiwiZXhwIjoxNjQ5NDk5NjkyfQ.EfydnuAodvD8g155Z0dOesjzIJSRycy_l7WIwdX8yJs"
        try{
            client.join(
            'The Game4', // It is very important to always (in testing phase) use a new session name or do this: https://devforum.zoom.us/t/meeting-passcode-wrong-but-passcode-is-actual-y-correct/61479/2
            signature,
            'testName',
            '')
            mediaStream = client.getMediaStream();
            state.selfId = client.getSessionInfo().userId;

        } catch (e) {
            console.error(e);
        } finally {
            console.log('Join meeting success');
        }*/
        joinBeginning();

        initClientEventListeners(client, mediaStream);
        console.log('======= Initializing client event handlers =======');
        await startAudioMuted();
        console.log('======= Starting audio muted =======');
        await initButtonClickHandlers(client, mediaStream);
        console.log('======= Initializing button click handlers =======');

        console.log('======= Session joined =======');
    }

   const joinBeginning = () => {
        const signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZldXbm1JV1hUTHZtc2plV1lFTzViT3JsRVl0dXRHVEtSRDRjIiwidHBjIjoiVGhlIEdhbWUiLCJyb2xlX3R5cGUiOjEsInVzZXJfaWRlbnRpdHkiOiJ1c2VyMTIzIiwic2Vzc2lvbl9rZXkiOiIxMjMiLCJpYXQiOjE2NDk1MTAxMzcsImV4cCI6MTY0OTUxNzMzN30.1pZxCBOLgTTJYDh5dXP-1mtjoGL9ZCW6eWu-b1HgJf4"
        try{
            client.join(
                'The Game4', // It is very important to always (in testing phase) use a new session name or do this: https://devforum.zoom.us/t/meeting-passcode-wrong-but-passcode-is-actual-y-correct/61479/2
                signature,
                'testName',
                '')
            mediaStream = client.getMediaStream();
            state.selfId = client.getSessionInfo().userId;
        } catch (e) {
            console.error(e);
            console.log("we got a error when joining")
        }  finally {
        console.log('Join meeting success');
    }
       mediaStream = client.getMediaStream();
       state.selfId = client.getSessionInfo().userId;
    };



    const startAudioMuted = () => {
        //await mediaStream.startAudio();
        try{
            mediaStream.startAudio()
        } catch (e) {
            console.log("houston we have a problem with the audio")
           console.error(e)
        }

        if (!mediaStream.isAudioMuted()) {
            mediaStream.muteAudio();
        }
    };

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function setUpClient() {
            try {
                const client = ZoomVideo.createClient();
                await client.init('en-US', 'Global');
                setClient(client);

                console.log("Let's see our client:")
                console.log(client)


            } catch (error) {
                console.error(`Something went wrong while joining the meeting: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        setUpClient();
    }, []);




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

            <button id="js-mic-button" className="meeting-control-button">
                <i id="js-mic-button" className="fas fa-microphone-slash"></i>
            </button>
            <button id="js-webcam-button" className="meeting-control-button">
                <i id="js-webcam-button" className="fas fa-video webcam__off"></i>
            </button>
            <button id="js-leave-button"
                    className="meeting-control-button meeting-control-button__leave-session">
                <i id="js-leave-session-icon" className="fas fa-phone"></i>
            </button>
        </BaseContainer>


    ) ;

}

export default Waitingroom;