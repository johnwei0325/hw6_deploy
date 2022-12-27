import { createContext, useContext, useState } from 'react';

const ADD_MESSAGE_COLOR = '#3d84b8';
const REGULAR_MESSAGE_COLOR = '#2b2e4a';
const ERROR_MESSAGE_COLOR = '#fb3640';

const ScoreCardContext = createContext({
  messages0: [],
  messages1:[],
  addCardMessage: () => {},
  addRegularMessage: () => {},
  addErrorMessage: () => {},
  clearMessage: ()=>{},
});

const makeMessage = (message, color) => {
  return { message, color };
};

const ScoreCardProvider = (props) => {
  const [messages0, setMessages0] = useState([]);
  const [messages1, setMessages1] =useState([]);
  const [tabelmsg, setTabelmsg] = useState([]);
  const addCardMessage = (message) => {
      setMessages0([...messages0, makeMessage(message, ADD_MESSAGE_COLOR)]);
  };

  const addRegularMessage = (...ms) => {
    setMessages1([
      ...messages1,
      ...ms.map((m) => makeMessage(m, REGULAR_MESSAGE_COLOR)),
    ]);
    console.log("add");
  };

  const addErrorMessage = (message) => {
    setMessages1([...messages1, makeMessage(message, ERROR_MESSAGE_COLOR)]);
  };
  const clearMessage =(message)=>{
    setMessages0([makeMessage(message,REGULAR_MESSAGE_COLOR)]);
    setMessages1([makeMessage(message,REGULAR_MESSAGE_COLOR)]);
    console.log('clear');
  };
  return (
    <ScoreCardContext.Provider
      value={{
        messages0,
        messages1,
        addCardMessage,
        addRegularMessage,
        addErrorMessage,
        clearMessage,
      }}
      {...props}
    />
  );
};

function useScoreCard() {
  return useContext(ScoreCardContext);
}

export { ScoreCardProvider, useScoreCard };
