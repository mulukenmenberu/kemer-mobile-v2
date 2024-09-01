import axios from "axios";

export const baseURL = axios.create({
    baseURL:'https://mule.xn--0xd7ay2b6f.com/exam_api/',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
})

export const rootURL = "https://mule.xn--0xd7ay2b6f.com/exam_api/"