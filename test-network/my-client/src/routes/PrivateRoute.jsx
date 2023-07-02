import { Link, Navigate } from "react-router-dom";
import { getAccessToken, getUser } from "../utils/LocalStorage";

export const PrivateRoute = ({ children, role}) => {
    const isAuthenticated = getAccessToken();
    
    if (isAuthenticated && role === JSON.parse( getUser()).role) {
      return children
    }
      
    return <Navigate to='/login'></Navigate>
  }