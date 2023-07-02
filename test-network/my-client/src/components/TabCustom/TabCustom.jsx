import React, { useState } from 'react'
import './TabCustom.css'
const TabCustom = ({childrenList}) => {
  const [focus, setFocus] = useState(0);
  return (
    <div className='contain-tab'>
      <div className='header-tab'>
        {
          childrenList?.map((e, index) => (
            <div key={index} className={index === focus ? 'tab-focus element-header-tab' : 'element-header-tab'} onClick={() => setFocus(index)}>
              <label>{e?.name}</label>
            </div>
          ))
        }
      </div>
      <div className='body-tab' style={{ boxSizing:'border-box'}}>
        {
          childrenList?.[focus]?.children
        }
      </div>
    </div>
  )
}

export default TabCustom