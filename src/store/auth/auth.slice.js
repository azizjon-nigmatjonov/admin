import { createSlice } from "@reduxjs/toolkit";
// import { listToMap } from "../../utils/listToMap";

const initialState = {
  isAuth: false,
  token: null,
  refreshToken: null,
  userInfo: null,
  roleInfo: null,
  permissions: {},
  loginTableSlug: "",
  userId: "",
  clientType: null,
  branchId: "",
  app_permissions: null,
  settings_permissions: null
};

export const { actions: authActions, reducer: authReducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, { payload }) {
      state.isAuth = true;
      state.token = payload.token.access_token;
      state.refreshToken = payload.token.refresh_token;
      state.userInfo = payload.user;
      state.roleInfo = payload.role;
      state.loginTableSlug = payload.login_table_slug;
      state.userId = payload.user_id;
      state.clientType = payload.client_type;
      state.branchId = payload.tables;
      state.app_permissions = payload.app_permissions;
      state.settings_permissions = payload.settings_permissions;

      // // state.permissions = listToMap(payload.permissions?.map(el => ({...el, name: el.name?.replace('ROOT/', '')})), "name")
      // state.permissions = payload?.permissions
      //   ? payload?.permissions?.reduce((acc, curr) => {
      //       acc[curr.table_slug] = {
      //         // there is 3 cases ['Yes', 'No', 'Dynamic (Connection name)']
      //         read: curr.read !== "No",
      //         write: curr.write !== "No",
      //         update: curr.update !== "No",
      //         delete: curr.delete !== "No",
      //       };
      //       return acc;
      //     }, {})
      //   : [];
      // state.loading = false;
    },
    setTokens(state, { payload }) {
      state.token = payload.token.access_token;
      state.refreshToken = payload.token.refresh_token;
    },
    setPermission(state, { payload }) {
      state.app_permissions = payload.app_permissions;
      state.settings_permissions = payload.settings_permissions;
      state.permissions =
        payload?.permissions?.reduce((acc, curr) => {
          acc[curr.table_slug] = {
            // there is 3 cases ['Yes', 'No', 'Dynamic (Connection name)']
            read: curr.read !== "No",
            write: curr.write !== "No",
            update: curr.update !== "No",
            delete: curr.delete !== "No",
          };
          return acc;
        }, {}) || [];
    },
    logout: (state) => initialState,
  },
});
