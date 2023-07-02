import moment from "moment";
export function validateName(name) {
    const regex = /^[a-zA-Z\s]+$|^[\p{L}\s]+$/u;
    if (!regex.test(name)) {
        return "Tên không hợp lệ";
    }
    return null;
}

export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return "Email không hợp lệ";
    }
    return null;
}

export function validatePhoneNumber(phoneNumber) {
    const regex = /^\d{10}$/;
    if (!regex.test(phoneNumber)) {
        return "Số điện thoại không hợp lệ";
    }
    return null;
}

export function validateCitizenId(phoneNumber) {
    const regex = /^\d{12}$/;
    if (!regex.test(phoneNumber)) {
        return "Số chứng minh không hợp lệ";
    }
    return null;
}

export function validateDateOfBirth(birthDay) {
    const dateOfBirth = moment(birthDay, "YYYY-MM-DD", true);
    if (!dateOfBirth.isValid()) {
        return "Ngày sinh không hợp lệ";
    }

    const currentDate = moment();
    if (dateOfBirth.isAfter(currentDate)) {
        return "Ngày sinh không hợp lệ";
    }
    return null;
}

export function convertToUTC(dateString) {
    const date = moment.utc(dateString).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return date;
  }

export function validateAddress(address) {
        const addressRegex = /^[\p{L}0-9\s,\/-]+$/u;
      
        if (!addressRegex.test(address)) {
          return 'Địa chỉ hợp lệ';
        } 
        return null;
}

export function validateHICNumber(HICNumber) {
    const bhytRegex = /^[A-Za-z]{2}\d{1}[0-9]{2}\d{10}$/;
  
    if (!bhytRegex.test(HICNumber)) {
      return 'Số BHYT hợp lệ';
    }
    return null;
}

export function validateNumber(number) {
    if(isNaN(number)){
        return 'Giá trị phải là số'
    }
    return null;
}