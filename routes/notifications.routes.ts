const MAIN_API = "/api/notifications";
export const NOTIFICATIONS_ROUTES = {
  MANAGEMENT: {
    FETCH_ALL: {
      URL: MAIN_API + "/management/list",
      KEY: "NOTIFICATIONS:MANAGEMENT:ALL",
    },
  },
  USER: {
    FETCH_ALL: {
      URL: MAIN_API + "/user/list",
      KEY: "NOTIFICATIONS:USER:ALL",
    },
  },
};
