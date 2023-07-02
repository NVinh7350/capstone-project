import React from 'react'
import {TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled} from 'react-icons/tb'
import './Pagination.css'
export const Pagination = ({totalPage, page, limit, siblings, setPage}) => {
    
    let array = returnPaginationRange(totalPage, page, limit, siblings)
  return (
    <div className='pagination-container'>
        <button className='pagination-element'>
            <TbPlayerTrackPrevFilled onClick={() => {
                if(page > 1) {
                    setPage(page - 1)
                }
            }}></TbPlayerTrackPrevFilled>
        </button>
        {
            array.map((e, index) => 
                <button key={index} className= {page == e ? 'pagination-element current' : 'pagination-element'} onClick={() => {
                    if(page != e) {
                        setPage(e)
                    }
                }}><label>{e}</label></button>
            )
        }
        <button className='pagination-element'>
            <TbPlayerTrackNextFilled onClick={() => {
                if(page < totalPage) {
                    setPage(page + 1)
                }
            }}></TbPlayerTrackNextFilled>
        </button>
    </div>
  )
}

export const returnPaginationRange = (totalPage, page, limit, siblings) => {

    const range = (first, last) => {
        let range = [];
        for(let i = first; i< last ; i++) {
            range.push(i);
        }
        return range;
    } 

    let totalPageNoInArray = 7 + siblings;

    if(totalPageNoInArray >= totalPage) {
        return range(1, totalPage + 1)
    }
    let leftSiblingIndex = Math.max(page - siblings, 1);
    let rigthSiblingIndex = Math.min(page + siblings, totalPage);

    let showLeftDots = leftSiblingIndex > 2;
    let showRightDots = rigthSiblingIndex < totalPage -2;

    if(!showLeftDots && showRightDots) {
        let leftItemCount = 3 + 2 * siblings;
        let leftRange = range(1, leftItemCount + 1);
        return  [...leftRange, "...", totalPage ]
    } else if (showLeftDots && !showRightDots) {
        let rightItemCount = 3 + 2 * siblings;
        let rightRange = range(totalPage - rightItemCount + 1, totalPage + 1);
        return  [1, "...", ...rightRange ]
    } else {
        let middleRange = range(leftSiblingIndex, rigthSiblingIndex + 1);
        return [1,"...", ...middleRange, "...", totalPage];
    }

}

