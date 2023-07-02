import React, {useState} from "react";
export function validateHook () {
    const [error, setError] = useState({
    })
    const checkValidate = (input, requiredFields, action) => {
        let x = {};
        let y = true;

        for (const key in requiredFields) {
            if(input?.[key]) {
                x[key] = requiredFields[key]?.check(input[key])
            } else {
                x[key] = requiredFields[key]?.req ? 'Không được bỏ trống' : null
            }
            if(x[key] !== null){
                y = false;
            }
        }

        if(y === true){
            action()
        } 
        setError(x);
    };
    
    return {
        error,
        checkValidate
    }
}