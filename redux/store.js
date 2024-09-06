import { configureStore } from "@reduxjs/toolkit";
import departmentsSlice from "./reducers/departmentsSlice";
import coursesSlice from "./reducers/coursesSlice";
import questionsSlice from "./reducers/questionsSlice";
import questionPackagesSlice from "./reducers/questionPackagesSlice";
import newsSlice from "./reducers/newsSlice";
export default configureStore ({
    reducer:{
        departments:departmentsSlice,
        courses:coursesSlice,
        questions:questionsSlice,
        question_packages:questionPackagesSlice,
        news: newsSlice
    }
})