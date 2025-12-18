import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  return (
    <div className="small mb-2">
      <Link to="/admin">Home</Link>
      {parts.map((p, i) => {
        const path = "/" + parts.slice(0, i + 1).join("/");
        return (
          <span key={i}>
            {" / "}
            <Link to={path}>{p}</Link>
          </span>
        );
      })}
    </div>
  );
}
