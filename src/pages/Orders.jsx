import "../styles/pages/orders.css";
import { useState, useEffect } from "react";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const loadOrders = () => {
            const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
            const currentUser = JSON.parse(localStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentUser"));

            if (!currentUser) {
                setOrders([]);
                return;
            }

            const userOrders = savedOrders.filter((order) => String(order.userId) === String(currentUser.id));

            const sorted = [...userOrders].sort((a, b) => {
                return parseInt(b.number.split("-")[1]) - parseInt(a.number.split("-")[1]);
            });
            setOrders(sorted);
        };

        loadOrders();

        const handleStorageChange = (event) => {
            if (event.key === "orders") {
                const newOrders = JSON.parse(event.newValue) || [];
                const currentUser = JSON.parse(localStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentUser"));
                const userOrders = newOrders.filter((order) => order.userId === currentUser?.id);

                userOrders.forEach((order) => {
                    if (order.status === "Gotowe do odbioru") {
                        setToast(`Zamówienie ${order.number} jest gotowe do odbioru!`);
                    }
                });
                loadOrders();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const getStatusClass = (status) => {
        switch (status) {
            case "Nowe": return "status status--new";
            case "W trakcie przygotowania": return "status status--progress";
            case "Gotowe do odbioru": return "status status--ready";
            default: return "status";
        }
    };

    return (
        <div className="orders-page">
            <h1 className="orders-title">Historia zamówień</h1>

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <span>📋</span>
                    <p>Nie masz jeszcze żadnych zamówień</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order, index) => (
                        <div key={index} className="order-card">
                            <div className="order-card-header">
                                <span className="order-number">{order.number}</span>
                                <span className={getStatusClass(order.status)}>{order.status}</span>
                            </div>
                            <div className="order-card-body">
                                <div className="order-meta">
                                    <span>📅 {order.date}</span>
                                    <span>⏰ Odbiór: {order.pickupTime}</span>
                                </div>
                                <ul className="order-items">
                                    {order.items.map((item) => (
                                        <li key={item.id}>
                                            <span>{item.name}</span>
                                            <span className="order-item-qty">×{item.quantity}</span>
                                            <span className="order-item-price">{item.price * item.quantity} zł</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="order-total">
                                    Suma: <strong>{order.total} zł</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {toast && (
                <div className="toast">
                    ✅ {toast}
                </div>
            )}
        </div>
    );
};

export default Orders;
