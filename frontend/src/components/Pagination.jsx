import React from "react";
export default function Pagination({ limit, offset, total, onChange }) {
  const curPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return (
    <div style={{display:"flex",gap:8,alignItems:"center",justifyContent:"space-between",marginTop:12}}>
      <div className="small">Page {curPage} of {totalPages}</div>
      <div style={{display:"flex",gap:8}}>
                <button className="btn secondary" onClick={() => onChange(0)} disabled={offset===0}>First</button>
                        <button className="btn secondary" onClick={() => onChange(Math.max(0, offset - limit))} disabled={offset===0}>Prev</button>
        <button className="btn" onClick={() => onChange(offset + limit)} disabled={offset + limit >= total}>Next</button>
                        <button className="btn" onClick={() => onChange(Math.floor((total - 1) / limit) * limit)} disabled={offset + limit >= total}>Last</button>
      </div>
    </div>
  );
}
