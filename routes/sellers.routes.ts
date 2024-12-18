const MAIN_API = "/api/sellers";
export const SELLERS_ROUTES = {
  ADMIN: {
    FETCH_ALL: {
      URL: MAIN_API + "/admin/list",
      KEY: "SELLERS:ADMIN:ALL",
    },
    FETCH_SINGLE: {
      URL: "",
      KEY: "",
    },
    CREATE: {
      USER: {
        URL: MAIN_API + "/admin/create/user",
        KEY: "",
      },
    },
    DELETE: {
      USER: {
        URL: MAIN_API + "/admin/delete/user",
        KEY: "",
      },
    },
    UPDATE: {
      URL: "",
      KEY: "",
    },
  },
};
