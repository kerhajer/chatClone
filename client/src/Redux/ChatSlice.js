import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const createConfig = () => {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        headers: {
          token
        }
      };
    } else {
      return {};
    }
  }
  
  
  
  
  export const chatbot = createAsyncThunk(
    'chat/chatbot',
    async ({ text, currentModel }, { rejectWithValue }) => {
      const config = createConfig();
  
      try {
        const response = await axios.post('http://localhost:5000/api/chat/chatbot', { text, currentModel }, config);
        const generatedContent = response.data.generatedContent;
  
        const newMessage = { role: 'user', content: text, model: currentModel };
        const botMessage = { role: 'chatbot', content: generatedContent };
  
        return { newMessage, botMessage };
      } catch (error) {
        console.error('Error fetching chatbot data:', error);
  
        // Handle the error by rejecting the promise with a custom payload
        return rejectWithValue({ message: error.message, name: error.name, code: error.code });

      }
    }
  );
  
 

 
  export const modelschat= createAsyncThunk('chat/modelschat', async (_, { rejectWithValue }) => {
    const config = createConfig();
  
  
    try {
  
  
      const { data } = await axios.get('http://localhost:5000/api/chat/models', config);
  

    return data ;
    } catch (error) {
      // Log the error message
      console.error('Error', error);
  
      return rejectWithValue(error.response.data.message);
    }
  });

  export const historychat= createAsyncThunk('chat/historychat', async (_, { rejectWithValue }) => {
    const config = createConfig();
  
  
    try {
  
  
      const { data } = await axios.get('http://localhost:5000/api/chat/chatbot/history', config);
  

    return data ;
    } catch (error) {
      // Log the error message
      console.error('Error', error);
  
      return rejectWithValue(error.response.data.message);
    }
  });










const initialState = {

  isLoading: false,
  registerErrors: null,
  msg: null,
  chat: JSON.parse(localStorage.getItem('chat')) || [],
  showhistory: Boolean(localStorage.getItem('showhistory')),

  messageuser:{ },
  models:[],
  history:[]

};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
  
    resetChatState: (state) => {
        state.isLoading = false;
        state.registerErrors = null;
        state.chat = [];
        state.showhistory=true
      },

      
        addMessage: (state, action) => {
          state.chat.push(action.payload);
        },
        addChatbotMessage: (state, action) => {
          state.chat.push(action.payload.botMessage );
        },
      },
  
  extraReducers: (builder) => {
    builder
      .addCase(chatbot.pending, (state) => {
        state.isLoading = true;



      })
      .addCase(chatbot.fulfilled, (state, { type, payload }) => {
        state.isLoading = false;
        state.messageuser=payload.newMessage

        state.chat.push( payload.botMessage );

        localStorage.setItem('chat', JSON.stringify(state.chat));

       
      })
  
     
      .addCase(modelschat.pending, (state) => {
        state.isLoading = true;



      })
      .addCase(modelschat.fulfilled, (state, { type, payload }) => {
        state.isLoading = false;

        state.models= payload
        localStorage.setItem('models', JSON.stringify(state.models));


       
      })
  
      .addCase(historychat.pending, (state) => {
        state.showhistory = true;



      })
      .addCase(historychat.fulfilled, (state, { type, payload }) => {
        state.showhistory = false;

        state.history= payload
        localStorage.setItem('history', JSON.stringify(state.history));

        localStorage.setItem('showhistory', JSON.stringify(state.showhistory));

      })



      
  }

});

export const { resetChatState,addChatbotMessage,addMessage } = chatSlice.actions;

export default chatSlice.reducer;