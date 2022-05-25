import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import {useEffect} from 'react';
import {logout} from "./components/views/HeaderHome";


/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {

    return (
    <div>

      <AppRouter/>
    </div>
  );
};

export default App;
