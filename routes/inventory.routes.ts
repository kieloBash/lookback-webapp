const MAIN_API = "/api/inventory";
export const INVENTORY_ROUTES = {
  ADMIN: {
    FETCH_ALL: {
      URL: MAIN_API + "/admin/list",
      KEY: "INVENTORY:ADMIN:ALL",
    },
    FETCH_SINGLE: {
      URL: "",
      KEY: "",
    },
    CREATE: {
      ITEM: {
        URL: MAIN_API + "/admin/create/item",
        KEY: "",
      },
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
  STAFF: {
    FETCH_ALL: {
      URL: MAIN_API + "/staff/list",
      KEY: "INVENTORY:STAFF:ALL",
    },
    FETCH_SINGLE: {
      URL: "",
      KEY: "",
    },
    CREATE: {
      ITEM: {
        URL: MAIN_API + "/staff/create/item",
        KEY: "",
      },
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
