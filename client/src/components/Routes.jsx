import { useContext } from "react";
import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { UserContext } from "./UserContext";
import Chat from "./Chat";

export default function Routes() {
    const { username, id } = useContext(UserContext);

    /**
     * if user is logged in then it will show this component
     */
    if (username) {
        return <Chat />;
    }

    /**
     * if user is not logged in then it will show this component
     */
    return (
        <RegisterAndLoginForm />
    );
}