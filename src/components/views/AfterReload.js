import {useHistory} from "react-router-dom";
import {Button} from "../ui/Button";
import HeaderHome from "./HeaderHome";
import BaseContainer from "../ui/BaseContainer";
import "styles/views/Home.scss";
import "styles/ui/Button.scss";
import React from "react";
import ErrorChicken from '../../ErrorChicken.png';

const AfterReload = () => {
    const history = useHistory();


        return (
        <div>
            <HeaderHome height="100"/>
            <BaseContainer className="home container">
                <div className="home form">
                <h2> You are not allowed to reload, click the "x" on the tab or us the arrows during The Game. <br/> The Game has ended. </h2>

                    <div>
                        <img src={ErrorChicken} className="home errorChicken"/> <br/>
                        <Button
                            width ="30%"
                            onClick={() => history.push("/startpage")}
                        >
                            Go back to Home<br />
                        </Button>
                    </div>
             </div>
                <a target="_blank" href="https://www.nicepng.com/downpng/u2w7a9y3r5o0a9e6_saying-clipart-chicken-chicken-with-stop-sign/" >Image Credit: Nicepng.com</a>
                </BaseContainer>
        </div>
    )

}

export default AfterReload;


