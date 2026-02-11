import "./globals.css";

export const metadata = {
  title: "Saloni's My Valentine 💖",
  description: "You already know the answer.",
  openGraph: {
    title: "Saloni's My Valentine 💖",
    description: "You already know the answer.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Be My Valentine",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
