import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import {RegistrationGuard} from "components/routing/routeProtectors/RegistrationGuard";
import Registration from "components/views/Registration";
import {CheckLoggedIn} from "../routeProtectors/CheckLoggedIn";
import Scoreboard from "../../views/Scoreboard";
import RulePage from "../../views/RulePage";
import Startpage from "../../views/Startpage";
import Profile from "../../views/Profile";
import {SettingsGuard} from "../routeProtectors/SettingsGuard";
import ProfileSettings from "../../views/ProfileSettings";
import Game from "../../views/Game";
import GameResult from "../../views/GameResult";
import WaitingroomOverview from "../../views/WaitingroomOverview";
import {GameIdGuard} from "../routeProtectors/GameIdGuard";
import Waitingroom from "../../views/Waitingroom";
import {StartpageGuard} from "../routeProtectors/StartpageGuard";

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
          <Redirect to="/startpage"/>
        </Route>

        <Route path="/startpage">
          <StartpageGuard>
            <Startpage/>
          </StartpageGuard>
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

        <Route exact path ="/user/:userId">
          <CheckLoggedIn>
            <Profile/>
          </CheckLoggedIn>
        </Route>

        <Route exact path ="/user/:userId/settings/:userId">
          <SettingsGuard userId>
            <ProfileSettings/>
          </SettingsGuard>
        </Route>

        <Route exact path ="/waitingroomOverview">
          <CheckLoggedIn>
            <WaitingroomOverview/>
          </CheckLoggedIn>
        </Route>

        <Route exact path ="/waitingroom/:gameId">
          <CheckLoggedIn>
            <Waitingroom/>
          </CheckLoggedIn>
        </Route>

        <Route exact path ="/game">
          <CheckLoggedIn>
          <GameIdGuard>
            <Game/>
          </GameIdGuard>
          </CheckLoggedIn>
        </Route>

        <Route exact path ="/gameResults">
          <CheckLoggedIn>
          <GameIdGuard>
            <GameResult/>
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
