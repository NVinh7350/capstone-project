import moment from "moment";

export const  getAge = (dateOfBirth) => {
  const birthDay =  new Date(moment(dateOfBirth).format('yyyy-MM-DD'));
  
const age = new Date().getFullYear() - birthDay.getFullYear();
    if(!age) {
        return '-'
    }
    return age;
}


export const getDateTime = (dateInput) => {
  const date = moment(dateInput).format('h:mm:ss DD-MM-yyyy');
  if(!date){
    return '-';
  }
  return date;
}

export const getDateTimeLocal = (dateInput) => {
  const formattedDateTime = moment(dateInput).utcOffset('+00:00').format("YYYY-MM-DDTHH:mm");
  if(!formattedDateTime){
    return '-'
  }
  return formattedDateTime;
}

export const getDate = (dateInput) => {
    const date = moment(dateInput).format('DD-MM-yyyy');
    if(!date){
      return '-';
    }
    return date;
  }

export const changeDateForm = (dateInput) => {
  const date = moment(dateInput).format('yyyy-MM-DD');
    if(!date){
      return null;
    }
    return date;
}