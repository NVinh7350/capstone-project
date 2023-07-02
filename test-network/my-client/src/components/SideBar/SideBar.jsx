import './SideBar.css'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import { AiFillHome } from 'react-icons/ai'
import { MouseEventHandler, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { loginSelector, onLogout } from '../../pages/LoginPage/LoginSlice';
import { useDispatch, useSelector } from 'react-redux';
import {BiLogOut} from 'react-icons/bi'

const SideBar = ({sideItemList}) => {
    const loginSelect = useSelector(loginSelector);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(onLogout())
    }
    const [closeMenu, setCloseMenu] = useState(false);
    const handleCloseMenu = () => {
        setCloseMenu(!closeMenu)
    }
    useEffect(()=> {
        console.log(loginSelect?.token?.accessToken)
        if(!loginSelect?.token?.accessToken){
            navigate('/login')
        }
    }, [loginSelect?.token?.accessToken])
    return (
        <nav className={closeMenu ? 'sidebar close' : 'sidebar'}>
            <header>
                <i className='toggle' onClick={handleCloseMenu}>
                    {closeMenu? <BsChevronRight ></BsChevronRight> : <BsChevronLeft ></BsChevronLeft>}
                </i>
            </header>
            <div className='menu-bar'>
                <div className='menu'>
                    <ul className="menu-links">
                        {
                            sideItemList?.map((sideItem , index) => (
                                <li className="nav-link" key={index}>
                                    <NavLink to={sideItem.link} className={({isActive}) => (isActive ? "link-active" : "" )}>
                                        <i className='icon'>
                                            <sideItem.icon></sideItem.icon>
                                        </i>
                                        <span className="text nav-text">{sideItem.label}</span>
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <div className="footer-bar">
                <li className="nav-link">
                        <Link to={'/login'} onClick={handleLogout}>
                                <i className='icon'>
                                    <BiLogOut></BiLogOut>
                                </i>
                                <span className="text nav-text">Đăng xuất</span>
                        </Link>
                </li>
            </div>
        </nav>
    )
};

export default SideBar;