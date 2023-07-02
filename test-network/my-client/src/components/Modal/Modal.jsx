import React, { useState } from "react";
import "./Modal.css";
import {GrClose} from 'react-icons/gr'

export default function Modal({children, openModal, handleOpenModal, modalStyle}) {


  if(openModal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>

      {openModal && (
        <div className="modal" style={modalStyle}>
          <div className="modal-content" >
            {
                children
            }
            <div className="close-modal" onClick={handleOpenModal}>
             <GrClose ></GrClose>
            </div>
          </div>
        </div>
      )}
      
    </>
  );
}