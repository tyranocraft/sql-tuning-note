import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Tuning Note",
  description: "SQL query performance optimization guide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
