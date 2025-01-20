const MAIN_API = "/api/requests";
export const REQUESTS_ROUTES = {
  ADMIN: {
    FETCH_ALL: {
      URL: MAIN_API + "/admin/list",
      KEY: "REQUESTS:ADMIN:ALL",
    },
    UPDATE:{
      URL: MAIN_API + "/admin/update",
      KEY: "REQUESTS:ADMIN:ALL",
    }
  },
  USER: {
    FETCH_ALL: {
      URL: MAIN_API + "/user/list",
      KEY: "REQUESTS:USER:ALL",
    },
    CREATE: {
      URL: MAIN_API + "/user/create",
      KEY: "REQUESTS:USER:ALL",
    },
  },
};
