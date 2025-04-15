import "./globals.css";

export const metadata = {
  title: "Turrani Esports",
  description: "Exproling a new world!!!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
