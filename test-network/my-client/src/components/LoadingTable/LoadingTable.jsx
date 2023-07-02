import React from "react";
import Skeleton from 'react-loading-skeleton'
import '../../pages/AdminPage/UserList/UserList.css'
import './LoadingTable.css'
import "react-loading-skeleton/dist/skeleton.css";
const LoadingTable = ({ rowCount, columnCount }) => {
    const renderRows = () => {
        const rows = [];
        for (let i = 0; i < rowCount; i++) {
            const cells = [];
            for (let j = 0; j < columnCount; j++) {
                cells.push(<td key={j}><Skeleton duration={1}/></td>);
            }
            rows.push(<tr key={i}>{cells}</tr>);
        }
        return rows;
    };

    return (
            <tbody>{renderRows()}</tbody>
    );
};

export default LoadingTable;
