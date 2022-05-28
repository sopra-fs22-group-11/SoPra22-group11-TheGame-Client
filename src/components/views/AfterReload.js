import {useHistory} from "react-router-dom";
import {connect, isConnected, sock} from "../utils/sockClient";
import {Button} from "../ui/Button";
import HeaderHome from "./HeaderHome";
import BaseContainer from "../ui/BaseContainer";
import client from "./Game"
import {Spinner} from "../ui/Spinner";
import "styles/views/Home.scss";
import "styles/ui/Button.scss";
import React, {useEffect, useState} from "react";

const AfterReload = () => {
    const history = useHistory();


        return (
        <div>
            <HeaderHome height="100"/>
            <BaseContainer className="home container">
                <h2> You are not allowed to reload, click the "x" on the tab or us the arrows during The Game. The Game has ended. </h2>
                <div className="home form">
                    <div>
                        <Button
                            width ="30%"
                            onClick={() => history.push("/startpage")}
                        >
                            Go back to Home<br />
                        </Button>
                    </div>
             </div>
                </BaseContainer>
        </div>
    )

}

export default AfterReload;


