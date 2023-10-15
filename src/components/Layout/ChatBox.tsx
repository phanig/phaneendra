import React, { useState } from "react";

interface Data {
  sender: User;
  receiver: User;
  messages: Message[];
}

interface User {
  id: number;
  username: string;
}

interface Message {
  sender: number;
  message: string;
}

interface SingleMessageProps {
  sender: number;
  message: string;
}

interface MessagesProps {
  messages: Message[];
}

const data: Data = {
  sender: {
    id: 1,
    username: "Kai",
  },
  receiver: {
    id: 2,
    username: "Snowball",
  },
  messages: [
    {
      sender: 1,
      message: "Bro, my hooman is weird!",
    },
    {
      sender: 2,
      message: "Yours too?!",
    },
    {
      sender: 1,
      message: "My hooman betrayed me :(",
    },
    {
      sender: 2,
      message: "Bork?",
    },
  ],
};

const ChatBox: React.FC = () => {
  const [state, setState] = useState<Data>(data);

  return (
    <div className="app_container">
      <div className="messages">
        <Messages messages={state.messages} />
      </div>
    </div>
  );
};

const SingleMessage: React.FC<SingleMessageProps> = ({ sender, message }) => {
  const classNames = sender === 1 ? "msg sender" : "msg receiver";

  return (
    <div className={classNames}>
      <span>{message}</span>
    </div>
  );
};

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <>
      {messages.map((m, i) => (
        <SingleMessage key={i} message={m.message} sender={m.sender} />
      ))}
    </>
  );
};

export default ChatBox;
