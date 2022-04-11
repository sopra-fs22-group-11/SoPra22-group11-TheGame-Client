import { switchSessionToEndingView } from "../simple-view-switcher";
import { toggleSelfVideo, toggleParticipantVideo } from "./video/video-toggler";
import ZoomVideo from "@zoom/videosdk";

/**
 * Initializes the mic and webcam toggle buttons
 * 
 * @param {VideoClient} zoomClient
 * @param {Stream} mediaStream 
 */
const initButtonClickHandlers = async (zoomClient, mediaStream) => {
    const initMicClick = () => {
        console.log("Hello from the start of initMicClick");
        const micButton = document.getElementById('js-mic-button');
        const micIcon = document.getElementById('js-mic-icon');

        let isMuted = true;
        let isButtonAlreadyClicked = false;

        console.log("Hello from the mid of initMicClick before toggleMicButtonStyle");

        const toggleMicButtonStyle = () => {
            micIcon.classList.toggle('fa-microphone');
            micIcon.classList.toggle('fa-microphone-slash');
            micButton.classList.toggle('meeting-control-button__off');
        }

        const toggleMuteUnmute = () => isMuted ? mediaStream.muteAudio() : mediaStream.unmuteAudio();

        const isMutedSanityCheck = () => {
            const mediaStreamIsMuted = mediaStream.isAudioMuted();
            console.log('Sanity check: is muted? ', mediaStreamIsMuted);
            console.log('Does this match button state? ', mediaStreamIsMuted === isMuted);
        }


        const onClick = async (event) => {
            console.log("we are in onCLick")
            event.preventDefault();

            console.log("in onClick function");



            if (!isButtonAlreadyClicked) {
                // Blocks logic from executing again if already in progress
                isButtonAlreadyClicked = true;

                try {

                    console.log("in try function of onClick Method")
                    isMuted = !isMuted;
                    await toggleMuteUnmute();
                    toggleMicButtonStyle();
                    isMutedSanityCheck();
                } catch (e) {
                    console.error('Error toggling mute', e);
                }

                isButtonAlreadyClicked = false;
            } else {
                console.log('=== WARNING: already toggling mic ===');
            }
        }
        console.log("just before onClick will be run")
        micButton.addEventListener("click", onClick);
        console.log("Hello from the end of initMicClick");
    };

    // Once webcam is started, the client will receive an event notifying that a video has started
    // At that point, video should be rendered. The reverse is true for stopping video
    const initWebcamClick = () => {
        console.log("We are just before the webcam button");
        const webcamButton = document.getElementById('js-webcam-button');
        console.log("We are just after the webcam button");

        let isWebcamOn = false;
        let isButtonAlreadyClicked = false;

        const toggleWebcamButtonStyle = () => webcamButton.classList.toggle('meeting-control-button__off');

        const onClick = async (event) => {
            console.log("hello from the onClick side");
            event.preventDefault();
            if (!isButtonAlreadyClicked) {
                // Blocks logic from executing again if already in progress
                isButtonAlreadyClicked = true;

                try {
                    isWebcamOn = !isWebcamOn;
                    console.log("we are before togglerSelfVideo")
                    await toggleSelfVideo(mediaStream, isWebcamOn); //Here we have a problem (somethig with mediastream is not working //changed Mediastream to Zoom video
                    console.log("we are after togglerSelfVideo")
                    toggleWebcamButtonStyle();
                } catch (e) {
                    isWebcamOn = !isWebcamOn;
                    console.error('Error toggling video', e);
                }

                isButtonAlreadyClicked = false;
            } else {
                console.log('=== WARNING: already toggling webcam ===');
            }
        }

        webcamButton.addEventListener("click", onClick);
    }

    const initLeaveSessionClick = () => {
        console.log("we try to leave the session");
        const leaveButton = document.getElementById('js-leave-button');

        const onClick = async (event) => {
            event.preventDefault();
            try {
                console.log("in try to leave session")
                /*await Promise.all([
                    toggleSelfVideo(mediaStream, false),
                    toggleParticipantVideo(mediaStream, false)
                ]);*/
                await zoomClient.leave();
                //switchSessionToEndingView();
            } catch (e) {
                console.error('Error leaving session', e);
            }
        }

        leaveButton.addEventListener("click", onClick);
    }


    initMicClick();
    console.log("initMicClick is finsihed")
    initWebcamClick();
    console.log("initWebcamClick is finsihed")
    initLeaveSessionClick();
    console.log("initLeaveSessionClick is finsihed")
};

export default initButtonClickHandlers;