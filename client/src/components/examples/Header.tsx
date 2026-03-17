import Header from "../Header";
import { ThemeProvider } from "../ThemeProvider";

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <Header userLocation="Mumbai, Maharashtra" notificationCount={3} />
    </ThemeProvider>
  );
}
