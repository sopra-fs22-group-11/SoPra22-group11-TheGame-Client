import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import {RegistrationGuard} from "components/routing/routeProtectors/RegistrationGuard";
import Registration from "components/views/Registration";
import {CheckLoggedIn} from "../routeProtectors/CheckLoggedIn";
import Scoreboard from "../../views/Scoreboard";
import RulePage from "../../views/RulePage";
import Startpage from "../../views/Startpage";
import ProfileSettings from "../../views/ProfileSettings";
import Game from "../../views/Game";
import WaitingroomOverview from "../../views/WaitingroomOverview";
import {GameIdGuard} from "../routeProtectors/GameIdGuard";
import Waitingroom from "../../views/Waitingroom";
import {StartpageGuard} from "../routeProtectors/StartpageGuard";
import LandingPage from "../../views/LandingPage";
import {WaitingRoomGuard} from "../routeProtectors/WaitingRoomGuard";
import {CheckLoggedInForWaitingroom} from "../routeProtectors/CheckLoggedInForWaitingroom";
import AfterReload from "../../views/AfterReload";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>

        <Route exact path="/">
          <Redirect to="/landingpage"/>
        </Route>
        <Route path="/landingpage">
          <LoginGuard>
            <LandingPage/>
          </LoginGuard>
        </Route>

        <Route path="/startpage">
          <StartpageGuard>
            <Startpage/>
          </StartpageGuard>
        </Route>

        <Route path="/reload">
          <CheckLoggedIn>
            <AfterReload/>
          </CheckLoggedIn>
        </Route>

        <Route exact path="/registration">
          <RegistrationGuard>
            <Registration/>
          </RegistrationGuard>
        </Route>

        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>

        <Route exact path ="/scoreboard">
          <CheckLoggedIn>
            <Scoreboard/>
          </CheckLoggedIn>
        </Route>

        <Route exact path ="/rulePage">
          <CheckLoggedIn>
            <RulePage/>
          </CheckLoggedIn>
        </Route>

        <Route exact path ="/editUser/">
          <CheckLoggedIn>
            <ProfileSettings/>
          </CheckLoggedIn>
        </Route>

        <Route exact path ="/waitingroomOverview">
          <CheckLoggedInForWaitingroom>
          <CheckLoggedIn>
            <WaitingroomOverview/>
          </CheckLoggedIn>
          </CheckLoggedInForWaitingroom>
        </Route>

        <Route exact path ="/waitingroom/:gameId">
            <WaitingRoomGuard>
            <Waitingroom/>
            </WaitingRoomGuard>
        </Route>

        <Route exact path ="/game">
          <CheckLoggedIn>
          <GameIdGuard>
            <Game/>
          </GameIdGuard>
          </CheckLoggedIn>
        </Route>


        <Route path="*">
          <CheckLoggedIn>
          <Startpage/>
          </CheckLoggedIn>
        </Route>

      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
