import useSpeechRecognition, {
  CharacterState,
} from "../../apis/speechRecognition";
import useLanguageModel from "../../apis/languageModel";
import { useEffect, useRef, useState } from "react";
import useTextToSpeech from "../../apis/textToSpeech";
import * as talkingHead from "../../apis/talkingHead";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TranscriptModalDialog from "./transcriptModal";
import { Button } from "@mui/material";
import { MdSend } from 'react-icons/md'; 



interface ChildComponentProps {
  transcript: string;
}

const ResponsiveGrid = () => {
  const {
    characterState,
    bars,
    setCharacterState,
    onMicButtonPressed,
    setOnSpeechFoundCallback,
  } = useSpeechRecognition();
  
  const shouldHandleInputRef = useRef<boolean>(false);
  const [response, setResponse] = useState("");
  const userEmail = localStorage.getItem("email");
  const mainURL="https://api.avatarx.live"
  const [messages, setMessages] = useState<Array<{ type: string, content: string }>>([]);
  const { convert, setOnProcessCallback, volumeDown, volumeUp } =
    useTextToSpeech();

  const useZepetoModel = false;
  const messagesEndRef = useRef(null);


  const { sendMessage } = useLanguageModel();
  talkingHead.runBlendshapesDemo(useZepetoModel);
  const [conversation, setConversation] = useState<Array<{user_text: string, bot_text: string}>>([]);
  const [transcript, setTranscript] = useState<String[]>(["You", ""]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isVisible, setIsVisible] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [volumeDownState, setVolumeDownState] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [touchedIdx, setTouchedIdx] = useState(null);
  const sampleQuestions = [
    "Learn English - Basic",
    "Learn English - Intermediate",
    "Learn English - Advanced"
  ];

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  useEffect(() => {
      if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
  }, [messages]);
  

  useEffect(() => {
    setOnProcessCallback((audioData: Float32Array) => {
      talkingHead.registerCallback(audioData);
    });
      setOnSpeechFoundCallback((transcription: string) => {
        setTranscript(["You", transcription]);
        addMessage("You", transcription);
        sendMessage(transcription).then((result) => {
          addMessage("Buddy", result);
          sendPostRequest(userEmail, transcription, result)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok for POST request');
              }
              return response.json();
            })
            .catch(error => {
              console.error('There was a problem with the request:', error);
            });

          convert(result).then(() => {
            // setCharacterState(CharacterState.Idle);
          });
        });
      });

  }, []);


  const sendPostRequest = (userEmail, transcription, result) => {
    return fetch(`${mainURL}/api/conversations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        user_text: transcription,
        bot_text: result
      })
    });
  };

  const addMessage = (type: string, content: string) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, { type, content }];
      return updatedMessages.slice(-21);
    });
  };

  const handleInput = (e: any) => {
    e.preventDefault();
    const bigForm = document.getElementById(
      "standard-basic"
    ) as HTMLInputElement;
    const smallForm = document.getElementById(
      "outlined-basic"
    ) as HTMLInputElement;

    if (bigForm) {
      bigForm.disabled = true;
    }

    if (smallForm) {
      smallForm.disabled = true;
    }
    try {
      e.preventDefault();
    } catch (error) {}

    setTranscript(["You", inputValue]);
    addMessage("You", inputValue);
    sendMessage(inputValue).then((result) => {
      setTranscript(["Buddy", result]);
      sendPostRequest(userEmail, inputValue, result)
      addMessage("Buddy", result);
      convert(result).then(() => {
        setInputValue("");
        setCharacterState(CharacterState.Idle);

        if (bigForm) {
          bigForm.disabled = false;
        }

        if (smallForm) {
          smallForm.disabled = false;
        }
      });
    });
  };


  useEffect(() => {
    if (shouldHandleInputRef.current) {
      const simulatedEvent = {
        preventDefault: () => {},
      } as any;
      handleInput(simulatedEvent);
      shouldHandleInputRef.current = false; // Reset the ref value after handling
    }
  }, [inputValue]);
  
  const triggerHandleInput = (value: string) => {
      console.log(value);
      setInputValue(value);
      shouldHandleInputRef.current = true; // Indicate that the next change should trigger handleInput
  };
 
  const characterStateIcon = {
    [CharacterState.Idle]: (
      <button
        id="mute-icon"
        color="primary"
        className="un-mute mat-focus-indicator microphone mat-fab mat-button-base mat-primary"
        style={{
          borderRadius: "50%",
          height: "56px",
          width: "56px",
          border: "1px solid #fff",
          marginRight: "20px",
          marginLeft: "20px",
          cursor: "pointer",
        }}
        onClick={onMicButtonPressed}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z"></path>
          <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"></path>
        </svg>
      </button>
    ),
    [CharacterState.Listening]: (
      <button
        id="mute-icon"
        color="primary"
        className="un-mute mat-focus-indicator microphone mat-fab mat-button-base mat-primary"
        style={{
          borderRadius: "50%",
          height: "56px",
          width: "56px",
          border: "1px solid #fff",
          marginRight: "20px",
          marginLeft: "20px",
          cursor: "pointer",
        }}
        onClick={onMicButtonPressed}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="24"
          height="24"
          fill="#3C3C3C"
        >
          <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"></path>
          <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"></path>
        </svg>
        <span className="mat-button-wrapper"></span>
        <span className="mat-ripple mat-button-ripple mat-button-ripple-round"></span>
        <span className="mat-button-focus-overlay"></span>
      </button>
    ),
  };

  const characterStateBits = {
    [CharacterState.Idle]: (
      <div
        id="speech-indicator"
        className={`speech-indicator mute`}
        style={{ marginRight: "20px" }}
      >
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
      </div>
    ),
    [CharacterState.Listening]: (
      <div
        id="speech-indicator"
        className={`speech-indicator`}
        style={{ marginRight: "20px" }}
      >
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
      </div>
    ),
    [CharacterState.Speaking]: (
      <div
        id="speech-indicator"
        className={`speech-indicator mute`}
        style={{ marginRight: "20px" }}
      >
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
        <span className="speech-indicator-span"></span>
      </div>
    ),
  };

  return (
    <div>
      <div className="form-container-sm">
      <div style={{
                position: 'fixed',
                bottom: '3px',
                left: '1px',
                right: '1px',
                display: 'flex',
                alignItems: 'center', 
                }}>
          <form
            onSubmit={(e) => {
                handleInput(e)
            }}
            style={{
                flex: '0 0 85%', 
            }}
          >
        <TextField
          id="outlined-basic"
          label="Type your question here .. "
          variant="outlined"
          size="small" 
          value={inputValue}
          onChange={handleChange}
        />
    </form>
      <Button
        type="submit"
        variant="outlined"
        style={{
            minWidth: '5px', 
            border: "1px solid #fff",
        }}
        onClick={handleInput}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2em"
            width='2em'
            viewBox="0 0 448 512"
            fill="#fff"
        >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
        </svg>
    </Button>
</div>


      </div>
      {
    isVisible ? (
        <div style={{
            width: '100%',
            maxWidth: isMobile ? '70%' : '400px',
            maxHeight:isMobile ? '40%' :'auto',
            overflowY: 'scroll',
            scrollbarWidth: 'none',  
            position: isMobile ? 'fixed' : 'absolute',
            right: '55px',
            left:isMobile ? '90':'auto',
            bottom: isMobile ? '103px' : '80px',
            top: isMobile ? '350px' : '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 1000,
        }}>
            {messages.map((message, index) => (
                <div key={index} style={{
                    display: 'flex',
                    justifyContent: message.type === 'You' ? 'flex-end' : 'flex-start',
                    margin: isMobile?'2px 0':'10px 0'
                }}>
                    <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '100%'  
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            marginBottom: isMobile?'2px':'5px',
                            color: 'white',
                            textAlign: message.type==='You'? 'left':'right',
                            font:'exo',
                            fontSize:'10px',
                        }}>
                            {message.type}
                        </div>
                        <div style={{
                            padding: isMobile?'10px':'30px',
                            borderRadius: '20px 20px 20px 0px',
                            backgroundColor: message.type === 'You' ? '#E9EBF8' : '#2c2c2c',
                            filter: message.type === 'You' ? 'none' : 'brightness(1.4)',
                            color: message.type === 'You' ? 'black' : 'white',
                            lineHeight: isMobile?'20px':'27px',
                            margin:'0px',

                        }}>
                            <div>{message.content}</div>
                        </div>
                    </div>
                </div>
            ))}
            {messages.length > 0 && 
            <button 
            style={{
                position: 'fixed', 
                bottom: isMobile ? '50px' : '20px', 
                right: '20px', 
                background: "#10c1cb",
                color: 'white', 
                border: 'none', 
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '20px',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.2)',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#38ACEC'} 
            onMouseOut={(e) => e.currentTarget.style.background = '#10c1cb'}   
            onClick={() => setIsVisible(false)}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
        <path d="M6 6l12 12M18 6L6 18"></path>  
            </svg>
        </button>
        
      
            }
            <div ref={messagesEndRef}></div>
            <style>
        {`
            div::-webkit-scrollbar {
                display: none;
            }
        `}
    </style>
        </div>

        
    ) : (
      <button 
    style={{
        position: 'fixed', 
        bottom: isMobile ?'50px':'20px', 
        right: isMobile? '20px': '20px', 

        background: '#10c1cb', 
        color: 'white', 
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '20px',
        width: '50px',  // Set explicit width and height for consistency
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.2)',  // Gentle shadow
    }}
    onMouseOver={(e) => e.currentTarget.style.background = '#38ACEC'} 
    onMouseOut={(e) => e.currentTarget.style.background = '#10c1cb'}
    onClick={() => setIsVisible(true)}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFFFFF"  // White stroke color
        strokeWidth="2.5"  // Slightly bolder stroke for visibility
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 4h18v12H5.7L3 21v-3H3z"></path>
        <circle cx="8" cy="10" r="1"></circle>
        <circle cx="12" cy="10" r="1"></circle>
        <circle cx="16" cy="10" r="1"></circle>
    </svg>
</button>

    )
}


<div>
{messages.length == 0 && 
<div
style={{
  marginLeft:isMobile?'0px':'350px',
  textAlign:isMobile?'center':'left',
  alignContent:'center',
  marginRight:isMobile?'0px':'250px'
}}>
{sampleQuestions.map((question, idx) => (
        <button  key={idx} 
        // onClick={() => handleQuestionClick(question)}
        style={{
          margin:isMobile?'2px 0px':'5px 10px',
          width:isMobile?'200px':'250px',
          height:isMobile?'35px':'50px',
          backgroundColor: hoveredIdx === idx || touchedIdx === idx ? '#454545' : '#1b1d23',
          border:'1px solid #454545',
          color:'white',
          borderRadius: '10px',

        }}
        onClick={() =>{
          triggerHandleInput(question);
          }}
        onMouseOver={(e) =>setHoveredIdx(idx)}
        onMouseOut={(e) => setHoveredIdx(null)}
        onTouchStart={() => setTouchedIdx(idx)}
        onTouchEnd={() => setTouchedIdx(null)}
        >
          {question}
          {hoveredIdx === idx && (
            <MdSend
              size={15}
              style={{ 
                cursor: 'pointer',
                float:'right' 
            
            }}
             
            />
          )}
        </button>
      ))}
      </div>
      }
      </div>

      <div
        className={"action-wrapper action-btns"}
        style={{
          alignItems: "center",
          bottom: isMobile ? '47px' : '20px',
          display: "flex",
          left: "15px",
          position: "absolute",
        }}
      >
        {characterStateIcon[characterState]}
        {characterStateBits[characterState]}
         {/* <button
          id="mute-icon"
          color="primary"
          className="un-mute mat-focus-indicator microphone mat-fab mat-button-base mat-primary"
          style={{
            borderRadius: "50%",
            height: "56px",
            width: "56px",
            border: "1px solid #fff",
            marginRight: "20px",
            cursor: "pointer",
          }}
          onClick={() => {
            if (!volumeDownState) {
              volumeDown();
            } else {
              volumeUp();
            }
            setVolumeDownState(!volumeDownState);
          }}
        >
          <span className="mat-button-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="24"
              height="24"
              fill="#3C3C3C"
            >
              <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"></path>
              <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"></path>
              <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"></path>
            </svg>
          </span>
          <span className="mat-ripple mat-button-ripple mat-button-ripple-round"></span>
          <span className="mat-button-focus-overlay"></span>
        </button> */}

        <div className="form-container">
        
        
    <form
        onSubmit={(e) => {
        handleInput(e)    
       }}
    >
    <TextField

        id="outlined-basic"
        label="Type your question here .. "
        variant="outlined"
        value={inputValue}
        onChange={handleChange}
        style={{ width: "500px",
        height:"4px",}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
              onClick={handleInput} 
              edge="end">
                <MdSend size={20} />
              </IconButton>
            </InputAdornment>
          ),
        }}
         
    
    />
    

    
      </form>
        </div>
      </div>
      <TranscriptModalDialog
        open={open}
        setOpen={setOpen}
        user={"Hello"}
        avatar={"Hi"}
      />
    </div>
  );
};

export default ResponsiveGrid;