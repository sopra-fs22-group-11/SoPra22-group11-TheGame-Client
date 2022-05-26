
import "styles/ui/Zoom.scss";

/**
 * Initializes the mic and webcam toggle buttons
 * 
 * @param {VideoClient} zoomClient
 * @param {Stream} mediaStream 
 */
const initButtonClickHandlers = async (zoomClient, mediaStream) => {
    const initMicClick = () => {
        const micButton = document.getElementById('js-mic-button');
        const micIcon = document.getElementById('js-mic-icon');

        let isMuted = true;
        let isButtonAlreadyClicked = false;





        const toggleMicButtonStyle = () => {
            if (isMuted){
                //document.getElementById('js-mic-icon').className = 'fas fa-microphone-slash"';
                document.getElementById('js-mic-button').className = "meeting-control-button meeting-control-button__off";
                document.getElementById('zoom-mic').className = 'mic-image hidden';
                document.getElementById('zoom-mic-off').className = 'mic-image';
                //micIcon.classList.toggle('fa-microphone-slash')
            } else {
                //document.getElementById('js-mic-icon').className = 'fas fa-microphone';
                document.getElementById('js-mic-button').className = "meeting-control-button";
                document.getElementById('zoom-mic').className = 'mic-image';
                document.getElementById('zoom-mic-off').className = 'mic-image hidden';
                //micIcon.classList.toggle('fa-microphone');

            }


            ;
            //micButton.classList.toggle('meeting-control-button__off');
            //document.getElementById('js-mic-button').className = "meeting-control-button meeting-control-button__off";
        }

        const toggleMuteUnmute = () => isMuted ? mediaStream.muteAudio() : mediaStream.unmuteAudio();

        const isMutedSanityCheck = () => {
            const mediaStreamIsMuted = mediaStream.isAudioMuted();
            //console.log('Sanity check: is muted? ', mediaStreamIsMuted);
            //console.log('Does this match button state? ', mediaStreamIsMuted === isMuted);
        }


        const onClick = async (event) => {
            event.preventDefault();
            if (!isButtonAlreadyClicked) {
                // Blocks logic from executing again if already in progress
                console.log("mute button was clicked and we are" + isMuted? "muted": "unmuted")
                isButtonAlreadyClicked = true;

                try {
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
        micButton.addEventListener("click", onClick);
    };


    // Once webcam is started, the client will receive an event notifying that a video has started
    // At that point, video should be rendered. The reverse is true for stopping video


    const initLeaveSessionClick = () => {
        console.log("we try to leave the session");
        const leaveButton = document.getElementById('js-leave-button');

        const onClick = async (event) => {
            event.preventDefault();
            try {
                await zoomClient.leave();
            } catch (e) {
                console.error('Error leaving session', e);
            }
        }

        leaveButton.addEventListener("click", onClick);
    }


    initMicClick();
    //console.log("initMicClick is finsihed");
    initLeaveSessionClick();
    //console.log("initLeaveSessionClick is finsihed")
};

export default initButtonClickHandlers;