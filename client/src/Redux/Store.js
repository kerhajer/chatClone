import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserSlice";
import ChatReducer from './ChatSlice'
  export const  Store=configureStore ({
    reducer:{
      UserReducer,ChatReducer
  }
})