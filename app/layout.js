import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="penn-font-400">
        {children}
      </body>
    </html>
  );
};
