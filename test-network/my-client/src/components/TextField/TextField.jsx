import React, { useState } from 'react'
import './TextField.css'
const TextField = ({readOnly, error ,handleChange, containerStyle, label,value, required = true, type = 'text', name}) => {
    const [showPW, setShowPW] = useState(false);
    
    return (
    <div className={type === 'text' || type === 'password' ? (value ? "valid text-field-container" : "text-field-container") : "valid text-field-container"} style={containerStyle}>
        <input
            type={type}
            required={required}
            onChange={(e) => handleChange(e)}
            value={value}
            readOnly={readOnly}
            name={name}
        />
        <label>{label}</label>
        { !error ? (
            <></>
        ) : (
            <span className='error-text'>
                {`${error}`}
            </span>
        )}
        { required && !value && !error ? (
            <span className='star'>
            *
        </span>
        ) : (
            <></>
        )}
    </div>
  )
}

export default TextField