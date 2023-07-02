import React, { useState, useRef } from 'react'
import './Avatar.css'
import Modal from '../Modal/Modal';
import "react-loading-skeleton/dist/skeleton.css";
import {BsCameraFill} from 'react-icons/bs' ;
import avatarDefault from '../../../public/pictures/avatar.jpg'
import imageCompression from 'browser-image-compression'
const Avatar = ({width, height, isLoading = false, base64String, handleUpload}) => {
    const fileInputRef = useRef(null);
    const [openModal, setOpenModal] = useState(false);
    
    const openImage = () => {
        setOpenModal(!openModal)
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        console.log('up')
        if (file) {
            // const render = new FileReader();
            // render.onloadend = () => {
            //     const base64 = render.result;
            //     console.log('up')
            //     handleUpload(base64);
            // }
            // render.readAsDataURL(file);
            const options = {
                maxSizeMB: 1, // Kích thước tệp nén tối đa (1MB ở đây)
                maxWidthOrHeight: 800, // Kích thước tối đa của chiều rộng hoặc chiều cao
                useWebWorker: true, // Sử dụng Web Worker để nén hình ảnh (tùy chọn)
                fileType: 'base64', // Định dạng hình ảnh sau khi nén thành base64
                maxIteration: 10, // Số lần lặp tối đa để nén hình ảnh (tùy chọn)
                minRatio: 0.6 // Tỷ lệ nén tối thiểu (0.6 = 60% kích thước gốc),
            
              };
            
              try {
                  const image = await imageCompression(file, options);
                  const imgB64 = await imageCompression.getDataUrlFromFile(image);
                handleUpload(imgB64);
                console.log(`compressedFile size ${image.size / 1024 / 1024} MB`)
                console.log(imgB64.toString())
                // Tiếp tục xử lý hình ảnh đã nén
              } catch (error) {
                console.error('Lỗi nén hình ảnh:', error);
              }
        }
    }

    return (
    <div style={{maxWidth:width, maxHeight:height, aspectRatio:1}} className={'avatar-container'} >
        {
            isLoading ?
            <Skeleton duration={1}/>:
            <img style={{borderRadius:'100%', width:'100%', maxWidth:'200px',aspectRatio:1 , border: '3px solid var(--prima--color)'}} src={base64String ? base64String : avatarDefault} alt='avatar' onClick={openImage}></img>
        }
        {
            handleUpload ? 
            <div className='avatar-upload-button' onClick={() => fileInputRef.current.click()}> 
                <BsCameraFill></BsCameraFill>
            </div> : <></>
         }
        <input type='file' accept='image/*' ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}></input>
        <Modal openModal={openModal} handleOpenModal={openImage} children={<img style={{maxHeight:'100%', maxWidth:'100%'}} src={base64String} alt='avatar'></img>}></Modal>
    </div>
  )
}

export default Avatar