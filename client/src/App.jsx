import axios from "axios";
import { UserContextProvider } from './components/UserContext';
import Routes from './components/Routes';

function App() {

  // adding the base url
  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true;

  return (
    <div>
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </div>
  );
}

export default App;
