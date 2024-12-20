const MAIN_API = "/api/categories";
export const CATEGORIES_ROUTES = {
  ADMIN: {
    FETCH_ALL: {
      URL: MAIN_API + "/admin/list",
      KEY: "CATEGORIES:ADMIN:ALL",
    },
    FETCH_SINGLE: {
      URL: MAIN_API + "/admin/single",
      KEY: "CATEGORIES:ADMIN:SINGLE",
    },
    CREATE: {
      URL: MAIN_API + "/admin/create",
      KEY: "",
    },
    DELETE: {
      URL: MAIN_API + "/admin/delete",
      KEY: "",
    },
    UPDATE: {
      URL: MAIN_API + "/admin/update",
      KEY: "",
    },
  },
};
