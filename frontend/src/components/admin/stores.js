import React, { useState, useEffect } from 'react'
import axiosInstance from '../../API/axios_instance'

export default function Stores() {
    const [userData, setUserData] = useState([]);
    const [storeData, setStoreData] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get("/admin/stores", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setStoreData(res.data);
            } catch (err) {
                console.error("Failed to fetch stats:", err.response?.data || err.message);
            }
        };

        fetchUsers()
    }, [])
    return (
        <div className="container my-5">
            <h2 className="text-center fw-bold mb-5">System Administrator Dashboard</h2>

            {/* ======= Stores Table ======= */}
            <div className="card shadow-sm border-0 mb-5">
                <div className="card-body">
                    <h4 className="mb-3 text-primary fw-semibold">Stores Overview</h4>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle">
                            <thead className="table-dark text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Store Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Owner ID</th>
                                    <th>Average Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {storeData.map((store) => (
                                    <tr key={store.id}>
                                        <td className="text-center">{store.id}</td>
                                        <td>{store.name}</td>
                                        <td>{store.email}</td>
                                        <td>{store.address}</td>
                                        <td className="text-center">{store.owner_id}</td>
                                        <td className="text-center">
                                            <span
                                                className={`badge ${parseFloat(store.average_rating) >= 4
                                                    ? "bg-success"
                                                    : parseFloat(store.average_rating) >= 2
                                                        ? "bg-warning text-dark"
                                                        : "bg-danger"
                                                    }`}
                                            >
                                                {store.average_rating}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
