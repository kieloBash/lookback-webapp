const MAIN_API = "/api/invoice";
export const INVOICE_ROUTES = {
  ADMIN: {
    FETCH_ALL: {
      URL: MAIN_API + "/admin/list",
      KEY: "INVOICE:ADMIN:ALL",
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
      URL: MAIN_API + "/admin/delete",
      KEY: "",
    },
    UPDATE: {
      URL: "",
      KEY: "",
    },
  },
  STAFF: {
    FETCH_ALL: {
      URL: MAIN_API + "/staff/list",
      KEY: "INVOICE:STAFF:ALL",
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
      URL: MAIN_API + "/admin/delete",
      KEY: "",
    },
    UPDATE: {
      URL: "",
      KEY: "",
    },
  },
};
