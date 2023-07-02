import React from 'react'
import './SelectCustom.css'
import {MdArrowDropDown} from 'react-icons/md'
const SelectCustom = ({ options, handleChange, label, name, value }) => {
  return (
    <div class="dropdown">
      <div class="dropbtn">
        <div>{value}</div>
        <MdArrowDropDown fontSize={25}></MdArrowDropDown>
      </div>
      
      <div class="dropdown-content">
        {
          options?.map((e, index) => (
            <button key={index} value={e.value} name={name} onClick={handleChange}>{e.label}</button>
          ))
        }
      </div>
    </div>
  )
}

export default SelectCustom