import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { googleVerification } from '../store/seller/authSlice';
import { useNavigate } from 'react-router-dom';
import SignupCart from './SignupCart';
import { toast } from 'react-toastify';
import { isAction } from '@reduxjs/toolkit';

const SuccessfullLogin = () => {
    console.log("Successful login ");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const authToken = getCookie('authToken');
        
        console.log("authToken is ", authToken);

        const fetchUserData = async () => {
            try {
                const result = await dispatch(googleVerification());
                console.log("result is : ", result);
                if (result?.payload?.success) {
                    const user = result.payload.data;
                    var isActive = result.payload.isActive;
                    console.log("user UID", user.UID);
                    if (user.UID === 999999) {
                        setUserData(user);
                    }
                    else if (isActive) {
                        // console.log("inside");
                        if (authToken) {
                        localStorage.setItem('authToken', JSON.stringify(authToken));
        }
                        navigate('/seller/orders');
                        // setTimeout(()=>{
                        //     window.location.reload();
                        // }, 5000)
                        
                    }
                    else {
                        toast.error("Your account is not active");
                        navigate('/auth');
                    }
                } else {
                    console.log("else");
                    navigate('/auth');
                }
            } catch (err) {
                console.error('Error verifying Google login:', err);
                navigate('/auth');
            } finally {
                // if(!isActive){
                //     localStorage.removeItem('authToken');
                // }
                // console.log(isActive);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [dispatch, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-gray-700">Logging you in...</p>
            </div>
        );
    }

    return (
        <>
            {userData ? (
                <SignupCart userDetails={userData} />
            ) : (
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-lg font-semibold text-gray-700">Redirecting...</p>
                </div>
            )}
        </>
    );
};

export default SuccessfullLogin;
