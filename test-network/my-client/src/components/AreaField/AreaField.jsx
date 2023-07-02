import React, { useState } from 'react'
import './TextField.css'
const TextField = ({rows,readOnly, pro,error ,setValue, containerStyle, label,value, required = true, type = 'text'}) => {
    // check giúp animation cho label 
    const [empty, setEmpty] = useState(value)
    const handleChange = (e) => {
        setValue(pro, e.target.value);
        setEmpty(e.target.value);
    }
  return (
    <div className={type === 'text' ? (empty ? "valid text-field-container" : "text-field-container") : "valid text-field-container"} style={containerStyle}>
        <textarea
            className='notes'
            type={type}
            required={required}
            onChange={handleChange}
            value={value}
            readOnly={readOnly}
            rows={rows}
        />
        { !error ? (
            <></>
        ) : (
            <span style={{ color: "red", fontSize: "13px", width:'100px' }}>
                {error}
            </span>
        )}
        { required && !empty && !error ? (
            <span style={{ color: "red", fontSize: "18px", width:'100px' }}>
            *
        </span>
        ) : (
            <></>
        )}
    </div>
  )
}

export default TextField