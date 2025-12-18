import React from "react";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card col-span-2">
        <h3 className="mb-2">Dashboard</h3>

        <table align="center" className="table">
          <tbody>
            <tr>
              <td>Accounts</td>
              <td>
                <a href="/admin/users">Manage</a>
              </td>
            </tr>
            <tr>
              <td>Products</td>
              <td>
                <a href="/admin/products">Manage</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* <div className="card">
        <h3>Recent actions</h3>
        <p className="small">No recent actions</p>
      </div> */}
    </div>
  );
}
