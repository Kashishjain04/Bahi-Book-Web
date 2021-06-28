import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
  devTools: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
});
