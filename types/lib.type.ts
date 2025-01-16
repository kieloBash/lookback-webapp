export type SortOrder = "asc" | "desc";

export interface Region {
  regCode: string;
  regDesc: string;
}

export type Province = {
  regCode: string;
  provCode: string;
  provDesc: string;
};

export type CityMunicipality = {
  regCode: string;
  provCode: string;
  citymunCode: string;
  citymunDesc: string;
};

export type Barangay = {
  regCode: string;
  provCode: string;
  citymunCode: string;
  brgyCode: string;
  brgyDesc: string;
};
