const MAIN_API = "/api/history";
export const HISTORY_ROUTES = {
  MANAGEMENT: {
    FETCH_ALL: {
      URL: MAIN_API + "/management/list",
      KEY: "HISTORY:MANAGEMENT:ALL",
    },
  },
  USER: {
    FETCH_ALL: {
      URL: MAIN_API + "/user/list",
      KEY: "HISTORY:USER:ALL",
    },
  },
};
