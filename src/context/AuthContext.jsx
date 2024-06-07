import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(false);
    const [role,setRole] = useState('')
    const [user,setUser] = useState('')
    //const navigate = useNavigate(); // Para redireccionar al usuario


    const login = () => {
        setAuthData(true);
    };

    const logout = () => {
        localStorage.removeItem('token')
        setAuthData(false);
        //setRole('')
        //setUser('')
        //navigate('/')
        

    };

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};
