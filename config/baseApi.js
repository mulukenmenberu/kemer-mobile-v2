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
// export const rootURL = "http://127.0.0.1/examapp_api/"
// http://188.245.177.26/examapp_api/question_packages/packages.php?course_id=2