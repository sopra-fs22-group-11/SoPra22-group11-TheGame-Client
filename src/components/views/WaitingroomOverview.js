import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";
import {connect} from "../utils/sockClient";


const WaitingroomOverview = () => {

    const history = useHistory();

    const joinWaitingroom = async () => {
        connect(()=> {
        history.push('/waitingroom/1'); //for the start we need the waitingroom 1
        })
    }


    return (
        <div>
            <HeaderHome height="100"/>
        <BaseContainer className = "home container">
            <div className="home form">
                <div className="home title">
                    Game Room Overview
                </div>
                <Button
                    width="100%"
                    height="50%"
                    onClick={() => joinWaitingroom()}
                >
                    Game Room 1
                </Button>
            </div>
        </BaseContainer>
        </div>


    ) ;

}

export default WaitingroomOverview;