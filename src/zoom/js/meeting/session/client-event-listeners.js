import state from './simple-state';

const PARTICIPANT_CHANGE_TYPE = {
    ADD: 'add', 
    REMOVE: 'remove',
};


const handleParticipantChange = (payloadEntry, addRemoveType) => {
    const { userId } = payloadEntry;

    // For this demo, only a single participant is handled to keep things simple
    // and succinct. This can be extended into a participant array/set here 
    if (userId === undefined) {
        return;
    }
    
    switch (addRemoveType) {
        case PARTICIPANT_CHANGE_TYPE.ADD:
            if (userId !== state.selfId && !state.hasParticipant) {
                state.participantId = userId;
                state.hasParticipant = !state.hasParticipant;
            } else {

            }
            break;
        case PARTICIPANT_CHANGE_TYPE.REMOVE:
            if (userId !== state.selfId && state.hasParticipant) {
                state.resetParticipantId();
                state.hasParticipant = !state.hasParticipant;
            } else {

            }
            break;
        default:
            console.log('Unexpected ADD_REMOVE_TYPE');
            break;
    }
    
}

const onUserAddedListener = (zoomClient) => {
    zoomClient.on('user-added', (payload) => {


        payload?.forEach((payloadEntry) => handleParticipantChange(payloadEntry, PARTICIPANT_CHANGE_TYPE.ADD));
    });
};

const onUserRemovedListener = (zoomClient) => {
    zoomClient.on('user-removed', (payload) => {

        payload?.forEach((payloadEntry) => handleParticipantChange(payloadEntry, PARTICIPANT_CHANGE_TYPE.REMOVE));
    });
};



const initClientEventListeners = (zoomClient, mediaStream) => {
    onUserAddedListener(zoomClient);
    onUserRemovedListener(zoomClient);

};

export default initClientEventListeners;
