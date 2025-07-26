import { DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#007bff",
    secondary: "#28a745",
    error: "#dc3545",
    warning: "#ffc107",
    success: "#28a745",
    background: "#f0f2f5",
    surface: "#ffffff",
    text: "#333333",
    placeholder: "#666666",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};
