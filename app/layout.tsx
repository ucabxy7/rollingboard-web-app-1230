import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import AwsAmpliferProvider from "@/components/providers/awsAmplifyProvider";
import BugsnagProvider from "@/components/providers/bugsnagProvider";

const openSans = Open_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The rolling board app",
  description: "A simple and straightforward kanban project mangement app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased`}>
        <AwsAmpliferProvider />
        <NextIntlClientProvider>
          <BugsnagProvider>{children}</BugsnagProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
