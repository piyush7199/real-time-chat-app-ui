import { Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";

import "./App.css";
import ChatProvider from "./context/ChatProvider";

function App() {
  return (
    <ChatProvider>
      <div className="App">
        <Route exact path="/" component={HomePage} />
        <Route exact path="/chats" component={ChatPage} />
      </div>
    </ChatProvider>
  );
}

export default App;
