import React from 'react'
import '../css/chat.css';
import '../normal.css'
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { chatbot, addMessage, modelschat,historychat} from '../Redux/ChatSlice';
import { resetChatState } from '../Redux/ChatSlice';
import Avatar from 'react-avatar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { logout } from '../Redux/UserSlice'
const Home = () => {
  const [text, setText] = useState("");
  const [currentModel, setCurrentModel] = useState('gpt-3.5-turbo')

   const showhistory =useSelector(state=> state.ChatReducer.showhistory)

  const chat = useSelector(state => state.ChatReducer.chat)
  const models = useSelector(state => state.ChatReducer.models)
  const navigate = useNavigate()
  const user = useSelector(state => state.UserReducer.user)
 const history=useSelector(state => state.ChatReducer.history)
  const isAuth = localStorage.getItem('isAuth')
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [ischeked, setIscheked] = React.useState(false)
  const handleChange = (event) => {
    setIscheked(event.target.checked);
    if (!ischeked) {
      dispatch(logout())
      navigate('/')
    }

  };

  









  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    dispatch(modelschat());
    dispatch(historychat());

  }, []);






 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (text.trim()) {
      // Add user's message to the Redux store
      dispatch(addMessage({ role: 'user', content: text }));

      // Wait for the chatbot to respond
      setTimeout(async () => {
        dispatch(chatbot({ text, currentModel }));

        setText('');
      }, 1000); // Wait for 1 second
    }
  };


  const handleNewChat = () => {
    dispatch(resetChatState());
  };
  const handlehistory = () => {
    dispatch(resetChatState());
    dispatch(historychat());
  };
  const groupMessagesByDay = (messages) => {
    return messages.reduce((grouped, message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
      return grouped;
    }, {});
  };

  // Group chat history by day
  const groupedHistory = groupMessagesByDay(history);
  return (
    <div className='chathome'>

      <aside className='sidemenu'>
      

        <div className='side-menu-button' onClick={handleNewChat}><span style={{ paddingLeft: '6px', paddingRight: '12px', width: '1rem' }}>+</span> New Chat</div>
        <div className='models'><select
          style={{ width: '100px' }}
          onChange={(e) => {
            setCurrentModel(e.target.value);

          }}
          value={currentModel}
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.id}
            </option>
          ))}
        </select>
        
      
        </div>
        {Object.keys(groupedHistory).map((day) => (
          <div key={day} className='side-menu-button' onClick={handlehistory}>
            <span style={{ paddingLeft: '6px', paddingRight: '12px', width: '1rem' }}>{day}  {groupedHistory[day].length > 0 && groupedHistory[day][0].content }  </span>
          </div>
        ))}
      </aside>






      <section className='chatbox'>
        {isAuth ? <>

          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '1100px',
              marginRight: '0px',
            }}>
              <FormGroup style={{ color: '#747474' }}>
                <FormControlLabel

                  control={
                    <Switch
                      checked={ischeked}
                      onChange={handleChange}
                      aria-label="login switch"
                      style={{ color: '#747474' }}
                    />
                  }
                  label={'Logout'}

                />
              </FormGroup>

              <NotificationsNoneIcon style={{ color: 'black' }} />

              {user.img ? (
                <img style={{ width: '25px', height: '25px', borderRadius: '100%' }}
                  alt={user.username}
                  src={user.img}

                />
              ) : (
                <Avatar
                  name={user.username}
                  size="25"
                  round={true}
                  textSizeRatio={2}
                  color="#000"
                  fgColor="#fff"
                  style={{ backgroundColor: 'grey', color: 'blue' }}
                />
              )}
            </div>
          </>

        </> :

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 'auto',
              marginRight: '20px',
            }}
          >
            <Link to="/signin" style={{ color: 'black', textDecoration: 'none', aligntext: 'center' }}>


              <AccountCircleIcon
                alt='Nouman Ahmed'
                src='https://avatars1.githubusercontent.com/u/35970677?s=60&v=4'
                style={{ color: 'black', marginRight: '0', marginTop: '2px' }}
              />
              se connecter
            </Link>

          </div>}
        <div className='chat-input-holder'>



          <form onSubmit={handleSubmit} ><input className='chat-input-textarea' rows='1' placeholder='type your message' value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}></input></form>
        </div>

        <div className='chat-log'>
    {showhistory ? (
      <div className='chat-message'>

        {chat.map((message, index) => (
          <div key={index} className={`chat-message ${message.role === 'chatbot' && 'chatgpt'}`}>
            <div className='chat-message-center'>
              <div className={`avatar ${message.role === 'chatbot' && 'avatargpt'}`}>
                {message.role === 'chatbot' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width={39} height={39} fill="none" className="icon-sm">
                    <text x={-9999} y={-9999}>{"ChatGPT"}</text>
                    <path fill="currentColor" d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z" />
                  </svg>
                )}
                {message.role === 'user' && !user.img && (
                  <Avatar
                    name={user.username}
                    size="42"
                    round={true}
                    textSizeRatio={2}
                    color="#000"
                    className="icon-sm"
                  />
                )}
              </div>
              <div className='message'>
                {message.role === 'user' && (
                  <div className='user-message'>
                    {message.content}
                  </div>
                )}
                {message.role === 'chatbot' && (
                  <div className='chatbot-message'>
                    {message.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className='chat-message'>
        
        {Object.keys(groupedHistory).map((day) => (
        <div key={day}>
          {/* Render messages for each day */}
          {groupedHistory[day].map((his, index) => (
                  <div className='chat-message-center'>
              <div className={`avatar ${his.role === 'chatbot' && 'avatargpt'}`}>
                {his.role === 'chatbot' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width={39} height={39} fill="none" className="icon-sm">
                    <text x={-9999} y={-9999}>{"ChatGPT"}</text>
                    <path fill="currentColor" d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z" />
                  </svg>
                )}
                {his.role === 'user' && !his.img && (
                  <Avatar
                    name={his.owner.username}
                    size="42"
                    round={true}
                    textSizeRatio={2}
                    color="#000"
                    className="icon-sm"
                  />
                )}
              </div>
              <div className='message'>
                {his.role === 'user' && (
                  <div className='user-message'>
                    {his.content}
                  </div>
                )}
                {his.role === 'chatbot' && (
                  <div className='chatbot-message'>
                    {his.content}
                  </div>
                )}
              </div>
            </div>
            ) )}
          </div>
         ))}
      </div>
      )}
  </div>

</section>
    </div>
  )
}

export default Home