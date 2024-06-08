import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth/authService";
import { cashboxActions } from "../cashbox/cashbox.slice";
import { authActions } from "./auth.slice";



export const loginAction = createAsyncThunk(
  'auth/login',
  async (data, { dispatch }) => {

    
    try {
      const res = await authService.verifyCode(data.sms_id, data.otpCode, data.data)
      console.log("try catch resss===>", res);
      dispatch(authActions.loginSuccess(res))
      // dispatch(cashboxActions.setData(cashboxData))
    } catch (error) {
      throw new Error(error)
      // dispatch(showAlert('Username or password is incorrect'))
    }

  }
)