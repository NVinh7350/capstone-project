import "./LoginPage.css";
import { useDispatch, useSelector } from "react-redux";
import loginSlice, { getUser, loginSelector, onLogin } from "./LoginSlice";
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useEffect, useState } from "react";
import ReactLoading from "react-loading"
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginSelect = useSelector(loginSelector);
    const [errorEmpty, setErrorEmpty] = useState({
        citizenId: {
            isError: false,
            message: ''
        },
        password: {
            isError: false,
            message: ''
        }
    })

    const [showPW, setShowPW] = useState(false);

    const handleInputChange = (event) => {
        dispatch(loginSlice.actions.setLoginInfo({
            ...loginSelect.loginInfo,
            [event.target.name]: event.target.value
        }))
        setErrorEmpty({
            ...errorEmpty,
            [event.target.name]: {
                isError: false,
                message: ''
            }
        })
    };

    const handleSubmit = () => {

        const errorPassword = !Boolean(loginSelect.loginInfo.password);
        const errorCitizenId = !Boolean(loginSelect.loginInfo.citizenId);
        if (errorPassword || errorCitizenId) {
            
            setErrorEmpty({
                citizenId: {
                    isError: errorCitizenId,
                    message: 'Hãy nhập số CMND'
                },
                password: {
                    isError: errorPassword,
                    message: 'Hãy nhập mật khẩu'
                },
            })
        }
        else {
            dispatch(onLogin());
        }

    };
    const handleDisplayPW = () => {
        setShowPW(!showPW)
    }


    useEffect(() => {
        if(loginSelect.error){
            toast.error(loginSelect.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        }
        if(loginSelect.user?.role === 'ADMIN') {
            navigate('/admin/user-list')
        } else if (loginSelect.user?.role === 'DOCTOR') {
            navigate('/doctor/access-list')
        } else if (loginSelect.user?.role === 'PATIENT') {
            navigate('/patient/access-list')
        }
    }, [loginSelect.error, loginSelect.user?.role])
    return (
        <div className="login-page">
            <ToastContainer/>
            <div className="login-container">
                <div className="logo">
                    <h2>Đăng nhập</h2>
                </div>
                <form className="login-form">
                    <div className="text-field">
                        <input
                            type="text"
                            value={loginSelect.loginInfo.citizenId}
                            required={true}
                            name= 'citizenId'
                            onChange={(e) => handleInputChange(e)}
                        />
                        <label>Số CMND</label>
                        {
                            !errorEmpty.citizenId.isError ?
                                <></> :
                                <span style={{ color: 'red', fontSize: '13px' }}>{errorEmpty.citizenId.message}</span>
                        }
                    </div>
                    <div className="text-field">
                        <span className="icon">
                            {
                                showPW ?
                                    <BsFillEyeFill onClick={handleDisplayPW}></BsFillEyeFill>
                                    :
                                    <BsFillEyeSlashFill onClick={handleDisplayPW}></BsFillEyeSlashFill>
                            }
                        </span>
                        <input
                            type={showPW ? "text" : "password"}
                            value={loginSelect.loginInfo.password}
                            required={true}
                            name="password"
                            onChange={(e) => handleInputChange(e)}
                        />
                        <label>Mật khẩu</label>
                        {
                            !errorEmpty.password.isError ?
                                <></> :
                                <span style={{ color: 'red', fontSize: '13px' }}>{errorEmpty.password.message}</span>
                        }
                    </div>
                        <div className="radio-login-container">
                            <div className="radio-login-column">
                                <label>Admin</label>
                                <input type="radio" name="role" value={'ADMIN'} checked={loginSelect?.loginInfo?.role==='ADMIN'} onChange={(e) => handleInputChange(e)}></input>
                            </div>
                            <div className="radio-login-column">
                                <label>Bác sĩ</label>
                                <input type="radio" name="role" value={'DOCTOR'} checked={loginSelect?.loginInfo?.role==='DOCTOR'} onChange={(e) => handleInputChange(e)}></input>
                            </div>
                            <div className="radio-login-column">
                                <label>Bệnh nhân</label>
                                <input type="radio" name="role" value={'PATIENT'} checked={loginSelect?.loginInfo?.role==='PATIENT'} onChange={(e) => handleInputChange(e)}></input>
                            </div>
                        <label className="label">Truy cập với tư cách</label>
                        </div>
                    
                    <button type="button" onClick={handleSubmit}>
                        {loginSelect.isLoading ? <ReactLoading color="#fff" height='40px' width='40px' type={"spinningBubbles"}></ReactLoading> : 'Đăng nhập'}
                    </button>
                    {/* <div className="forgot-password">
                        <a href="#">Quên mật khẩu?</a>
                    </div> */}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
