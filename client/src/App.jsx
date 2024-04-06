import Register from './components/Register';
import axios from "axios";

function App() {

  // adding the base url
  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.withCredentials = true;

  return (
    <div>
      <Register />
    </div>
  );
}

export default App;
