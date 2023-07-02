import React from 'react'
import {BsSearch} from 'react-icons/bs'
import './Search.css'
const Search = ({planceHolder, onClick, handleChange, name}) => {
  return (
    <div className='search-container'>
            <input name={name} type='text' onChange={handleChange} placeholder={planceHolder}></input>
            <button onClick={onClick}>
                <i>
                    <BsSearch></BsSearch>
                </i>
            </button>
    </div>
  )
}

export default Search