import Header from "./Header";
import React from "react";

export default function AdminLayout({ children }) {
  return (
    <div className="flex-1">
      <Header />
      <div className="container">{children}</div>
    </div>
  );
}
