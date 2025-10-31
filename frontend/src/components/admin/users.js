import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../API/axios_instance";

const Users = () => {
  const [userData, setUserData] = useState([]);

  useEffect(()=>{
     const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err.response?.data || err.message);
      }
    };

    fetchUsers()
  },[])
  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">System Administrator Dashboard</h2>

      {/* ======= Table of Users ======= */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="mb-3 text-primary fw-semibold">User Accounts Overview</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark text-center">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Password</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.id}>
                    <td className="text-center">{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          user.role === "ADMIN"
                            ? "bg-danger"
                            : user.role === "STORE_OWNER"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted">{user.password}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
