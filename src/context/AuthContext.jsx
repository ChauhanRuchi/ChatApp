import { createContext, useCallback, useEffect, useState } from "react";
import { createUser, loginUser } from "../utils/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    let [user, setUser] = useState(null);
    let [registerInfo, setRegisterInfo] = useState({
        full_name: "tyy",
        user_name: '',
        mobile_number: '234567890',
        email: '',
        password: '',
        device_name: 'andriddrttt'
    });
    let [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
        device_name: 'andriddrttt'
    });
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
    }, [])
    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        try {

            const response = await createUser(registerInfo);
            localStorage?.setItem('token', response?.data?.data?.access_token)
            if (response?.data?.statusCode === 201)
                setUser(response?.data?.data)
            localStorage.setItem('User', JSON.stringify(response?.data?.data))
            return true

        } catch (err) {
            console.error('Error registering user:', err);
        }
    }, [registerInfo])

    useEffect(() => {
        const data = localStorage.getItem('User')
        setUser(JSON.parse(data))
    }, [])

    const logoutUser = useCallback(() => {
        localStorage.removeItem('User')
        setUser(null)
    }, [])
    const LoginUser = useCallback(async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(loginInfo);
            if (response?.data?.statusCode === 200)

            setUser(response?.data?.data)
            localStorage?.setItem('token', response?.data?.data?.access_token)
            localStorage.setItem('User', JSON.stringify(response?.data?.data))
            return true

        } catch (err) {
            console.error('Error registering user:', err);
        }
    }, [loginInfo])
    return (
        <AuthContext.Provider value={{ user, registerInfo, updateRegisterInfo, registerUser, logoutUser, LoginUser, updateLoginInfo, loginInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
