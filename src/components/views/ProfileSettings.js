import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Home.scss";
import HeaderHome from "./HeaderHome";


const PlayerInformationField = props => {
    return (
        <div className="entry field">
            <label className="entry label">
                {props.label}
            </label>
            <input
                className="entry input"
                // All the other displayed attributes (expect password) are not nullable and therefore always displayed
                placeholder= "Reset your password"

                type = {props.type}
                value={props.value}
                disabled = {props.disabled}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};


const ProfileSettings = () => {
    const [user, setUser] = useState(null)
    const [isDisabled, setIsDisabled] = useState(true); // We are currently not editing
    const [updatedUsername, setUpdatedUsername] = useState("")
    const [updatedPassword, setUpdatedPassword] = useState("");
    const [score, setScore] = useState("")
    const id = localStorage.getItem('loggedInUser')


    const editUser = (user) =>{
        // Change state to editable
        setIsDisabled(!isDisabled);

        //Change updated Username
        setUpdatedUsername(user.username)
    }




    async function saveChanges()  {
        // We make sure the username is not empty
        if(!updatedUsername){
            alert("Username cannot be empty") //This should never be reachable
        }
        else {

            try {
                //Apply changes
                user.username = updatedUsername
                if(updatedPassword){
                    user.password = updatedPassword
                }

                //console.log(user)
                // Put the updated user to the server
                await api.put('/users/' + id, user);
                if(updatedPassword){
                    alert("Password successfully updated")
                }
                await new Promise(resolve => setTimeout(resolve, 400));


            } catch (error) {
                // Handle errors

                console.error(`Something went wrong while editing the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert(`Something went wrong during the editing: \n${handleError(error)}`);

            } finally {
                // Change the state of editable back
                setUpdatedUsername("")
                setUpdatedPassword("")
                setIsDisabled(!isDisabled);
            }
        }
    }



    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchUser() {
            try {

                // Get a single users data and store it
                const response = await api.get('/users/'+ id);
                const score = await api.get('/users/'+ id + '/score')

                //await new Promise(resolve => setTimeout(resolve, 1000));

                setUser(response.data);
                setScore(score.data)
                //console.log(user)
                //console.log(score)

            } catch (error) {
                // Handle occuring errors
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchUser();

    });



    let content = <Spinner/>;

    if (user) {
        content = (
            <div className="entry">
                <PlayerInformationField
                    label="Username"
                    disabled={isDisabled}
                    value={isDisabled ? user.username : updatedUsername}
                    onChange={un =>setUpdatedUsername(un)}
                />
                <PlayerInformationField
                    type = "text"
                    label="password"
                    disabled={isDisabled}
                    value = {updatedPassword}
                    onChange ={pw =>setUpdatedPassword(pw)}
                />
                <PlayerInformationField
                    type = "text"
                    label="Status"
                    disabled={true}
                    value={user.status}
                />
                <PlayerInformationField
                    type = "text"
                    label="Score"
                    disabled={true}
                    value={score}
                />


                <Button
                    disabled= {!isDisabled && !updatedUsername}
                    width="20%"
                    onClick={isDisabled ? () => editUser(user): () => saveChanges()}

                >
                    {isDisabled ? "Edit User" : "Save changes"}
                </Button>

            </div>
        );
    }

    return (
    <div>
        <HeaderHome height="100"/>
        <BaseContainer className="home container">
            <div className="home form">
                <h1>Profile Page</h1>

                {content}
            </div>
        </BaseContainer>
    </div>



    );

}

export default ProfileSettings;