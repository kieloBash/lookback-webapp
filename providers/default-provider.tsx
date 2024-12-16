"use client";
import * as React from "react";

export type DefaultContextType = {
  toggleDelete: boolean;
  setToggleDelete: (temp: boolean) => void;
  toggleEdit: boolean;
  setToggleEdit: (temp: boolean) => void;
  toggleView: boolean;
  setToggleView: (temp: boolean) => void;
  selected: any;
  setSelected: (temp: any) => void;
};

export const DefaultContext = React.createContext<DefaultContextType>({
  toggleDelete: false,
  setToggleDelete: (temp: boolean) => { },
  toggleEdit: false,
  setToggleEdit: (temp: boolean) => { },
  toggleView: false,
  setToggleView: (temp: boolean) => { },
  selected: undefined,
  setSelected: (temp: any) => { },
});
