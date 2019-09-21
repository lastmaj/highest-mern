import React from "react";
import { ThemeProvider } from "emotion-theming";
import theme from "@rebass/preset";
export default props => (
  <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
);
