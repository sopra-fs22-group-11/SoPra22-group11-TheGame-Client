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
import HeaderHome from "./HeaderHome";
import sockClient from "../utils/sockClient";

const Player = ({user}) => (
    <div className="player container">
        <div className="player username">{user.username}</div>
    </div>
);




const Waitingroom =   () => {
    const history = useHistory();

    const client = ZoomVideo.createClient();
    const audioTrack = VideoSDK.createLocalAudioTrack();
    const videoTrack = VideoSDK.createLocalVideoTrack();
    let mediaStream;
    const canvas = document.querySelector('.video-canvas');
    const videoSDKLibDir = '/node_modules/@zoom/videosdk/dist/lib';
    const [users, setUsers] = useState(null);
    const[registered, setRegistered]=useState(false);

    //to show users

    const sendName = () => {
        //TODO delete if not necesary
        //const userId = localStorage.getItem('loggedInUser');
        //const response1 = await api.get('/users/' + userId);
        //await new Promise(resolve => setTimeout(resolve, 1000));
        //
        //setUser(response1.data);

        if(!registered){
            setRegistered(true);
            console.log("vor sockClient send name");
            sockClient.sendName(localStorage.getItem('username'));
        }

    }
    //SockClient.connect();
    //sendName();

    /*useEffect(() => {
        async function fetchData() {
            try {
                SockClient.connect();
                console.log("HelloHere")
                sendName();
                console.log("Hello");
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);*/

    //setUsers(localStorage.getItem('playerlist'));

    const generateSessionTopic = () => {
        const date = new Date().toDateString();
        const sessionTopic = "theGame" + date;
        console.log(sessionTopic);
        return sessionTopic;

    }


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


    const [signature, setSignature] = useState(null);

    async function createSignature() {
        try {

            const response = await api.get('/signature');

            // delays continuous execution of an async operation for 1 second.
            // This is just a fake async call, so that the spinner can be displayed
            // feel free to remove it :)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the returned users and update the state.
            setSignature(response.data);

            // This is just some data for you to see what is available.
            // Feel free to remove it.
            console.log('request to:', response.request.responseURL);
            console.log('status code:', response.status);
            console.log('status text:', response.statusText);
            console.log('requested data:', response.data);

            // See here to get more data.
            console.log(response);
            return response.data;

        } catch (error) {
            console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the Zoom signature! See the console for details.");
        }
    }

    const initAndJoinSession = async () => {
        //await client.init('en-US',`${window.location.origin}${videoSDKLibDir}`)
        await client.init('en-US', 'Global');
        const signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZldXbm1JV1hUTHZtc2plV1lFTzViT3JsRVl0dXRHVEtSRDRjIiwidHBjIjoiVGhlIEdhbWUxMiIsInJvbGVfdHlwZSI6MSwidXNlcl9pZGVudGl0eSI6InVzZXIxMiIsInNlc3Npb25fa2V5IjoiMTIiLCJpYXQiOjE2NTAxMDQzMjQsImV4cCI6MTY1MDExMTUyNH0.Y-Moa8AJCO9vp-cNR3MG-vEso2Kh3Z0oLvYdGFjcgWM";
        try {
            await client.join(
                'The Game12', // It is very important to always (in testing phase) use a new session name or do this: https://devforum.zoom.us/t/meeting-passcode-wrong-but-passcode-is-actual-y-correct/61479/2
                signature,
                'user12',
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
                sender: {name: senderName},
                receiver: {name: receiverName},
                timestamp,
            } = payload;
            console.log(
                `Message: ${message}, from ${senderName} to ${receiverName}`
            );
        });
    }


    const startAudioMuted = async () => {

        try {
            await mediaStream.startAudio();
        } catch (e) {
            console.log("We can not start the audio.")
            console.error(e)
        }

        if (!mediaStream.isAudioMuted()) {
            mediaStream.muteAudio();
        }
    }

    const goToGame = () => {
        history.push('/game');
    }

    const goToHome = () => {
        history.push('/startpage');
    }


    // localStorage.setItem('gameId', ); Hier noch herausfinden wie wir schauen, dass leute nur in ihr spiel können
    // siehe gameIdGuard in RouteProtectors

    /*<ul className="home user-list">
        {users.map(user => (
            <Player user={user} key={user.id}/>
        ))}
    </ul>*/



    return (
        <div>
            <HeaderHome height="100"/>
            <BaseContainer className="home container">
                <h2> Hear you can find all Participants</h2>

                <Button
                    width="100%"
                    onClick={() => goToGame()}
                >
                    Start the Game!
                </Button>
                <Button
                    width="100%"
                    onClick={() => joinMeeting()}
                >
                    Join
                </Button>
                <Button
                    width="100%"
                    onClick={() => sendName()}
                >
                    get clients
                </Button>

                <Button
                    width="100%"
                    onClick={() => doChatExample()}
                >
                    chat example
                </Button>
                <Button
                    width="100%"
                    onClick={() => generateSessionTopic()}
                >
                    chat example
                </Button>
                <Button
                    width="100%"
                    onClick={() => sendName()}
                >
                    Register in this WaitingRoom (do not delete)
                </Button>

            </BaseContainer>
        </div>


    );

}

export default Waitingroom;