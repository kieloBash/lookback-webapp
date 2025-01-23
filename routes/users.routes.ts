const MAIN_API = "/api/users";
export const USERS_ROUTES = {
  ADMIN: {
    FETCH_ALL: {
      URL: MAIN_API + "/admin/list",
      KEY: "USERS:ADMIN:ALL",
    },
    DELETE: {
      URL: MAIN_API + "/admin/delete",
    },
    UPDATE: {
      URL: MAIN_API + "/admin/update",
    },
    CREATE: {
      URL: MAIN_API + "/admin/create",
    },
  },
  USER: {
    UPDATE: {
      URL: MAIN_API + "/user/update",
    },
  },
  MANAGEMENT: {
    UPDATE: {
      URL: MAIN_API + "/management/update",
    },
  },
};
