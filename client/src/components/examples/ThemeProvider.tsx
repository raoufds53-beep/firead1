import { ThemeProvider } from "../ThemeProvider";

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4">
        <p>Theme provider is active</p>
      </div>
    </ThemeProvider>
  );
}
