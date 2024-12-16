const MAIN_API = "/api/categories";
export const CATEGORIES_ROUTES = {
  ADMIN: {
    FETCH_ALL: {
      URL: MAIN_API + "/admin/list",
      KEY: "CATEGORIES:ADMIN:ALL",
    },
    FETCH_SINGLE: {
      URL: "",
      KEY: "",
    },
    CREATE: {
      URL: MAIN_API + "/admin/create",
      KEY: "",
    },
    DELETE: {
      URL: "",
      KEY: "",
    },
    UPDATE: {
      URL: "",
      KEY: "",
    },
  },
};
