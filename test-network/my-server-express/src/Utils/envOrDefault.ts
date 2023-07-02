import dotenv from "dotenv";
dotenv.config();

const envOrDefault = (key: string, defaultValue: any): any => {
    return process.env[key] || defaultValue;
};

export default envOrDefault;