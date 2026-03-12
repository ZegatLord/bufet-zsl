import "../styles/components/header.css";
import logo from "../assets/zsllogo.ico";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { FaPhone } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

const Header = () => {
    const { cart } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const copyTel = () => {
        navigator.clipboard.writeText("730379195");
        alert("Numer telefonu został skopiowany!");
    }
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity,0);
    return (
        <header>
            <address onClick={copyTel}>
                <p className="telnum"><FaPhone className="telnum" /> 730 379 195</p>
            </address>
            <img src={logo}/>
            <div className="shopacc">
                {user && <Link to="/cart" className="cart"><FaShoppingCart />{totalQuantity > 0 && <span className="cart-quantity">{totalQuantity > 9 ? "+9" : totalQuantity}</span>}</Link>}
                {!user ? (
                    <Link to="/login"><MdAccountCircle/></Link>
                ) : (
                    <div className="account-menu">
                        <MdAccountCircle className="account-icon" onClick={() => setDropdownOpen((o) => !o)}/>
                            {dropdownOpen && (
                                <>
                                    <div className="dropdown-overlay" onClick={() => setDropdownOpen(false)}/>
                                        <div className="dropdown">
                                            <span className="dropdown-email">{user.email}</span>
                                            <Link to="/orders" onClick={() => setDropdownOpen(false)}>Moje zamówienia</Link>
                                            <Link to="/account" onClick={() => setDropdownOpen(false)}>Ustawienia konta</Link>
                                            {user.role === "admin" && (
                                                <Link to="/admin" onClick={() => setDropdownOpen(false)}>Panel admina</Link>
                                            )}
                                            <button onClick={() => {
                                                logout();
                                                setDropdownOpen(false);
                                            }}>Wyloguj</button>
                                        </div>
                                </>
                            )}
                    </div>
                )}
                
            </div>

        </header>
    )
}

export default Header;