import { configureStore } from "@reduxjs/toolkit";
import TenantConfigSlice from "./reducers/TenantConfigSlice";
import appConfigSlice from "./reducers/appConfigSlice";

export const store = configureStore({
  reducer: {
    tenant: TenantConfigSlice,
    appConfig:appConfigSlice,
  }
})