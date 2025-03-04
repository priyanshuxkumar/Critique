'use client';

import axios, { AxiosError } from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
    id : number
    name : string
    avatar : string
}

interface UserContextType {
    user : User | null
    setUser : React.Dispatch<React.SetStateAction<User | null>>;
    isAuthenticated : boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserProviderProps {
    children : ReactNode;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error('useUser must be used with in a UserProvider');
    }
    return context;
}

export const UserProvider : React.FC<UserProviderProps> = ({children}) => {
    const [user , setUser] = useState<User | null>(null);
    const [isAuthenticated , setIsAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        (async() => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/auth`, {withCredentials: true});
                if(response.status == 200){
                   setUser(response.data);
                   setIsAuthenticated(true);
                }
            } catch (error) {
                if(error instanceof AxiosError){
                    toast(error.response?.data.message || 'Something went wrong');
                }else {
                    toast('Failed to fetch user details!');
                }
            }
        })()
    },[]);
    return (
        <UserContext.Provider value={{user , setUser , isAuthenticated , setIsAuthenticated}}>
            {children}
        </UserContext.Provider>
    )
}