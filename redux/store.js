import { configureStore } from "@reduxjs/toolkit";
import departmentsSlice from "./reducers/departmentsSlice";
import coursesSlice from "./reducers/coursesSlice";
import questionsSlice from "./reducers/questionsSlice";
import questionPackagesSlice from "./reducers/questionPackagesSlice";
import newsSlice from "./reducers/newsSlice";
import examModeSlice from "./reducers/examModeSlice";
import  notesSlice  from "./reducers/notesSlice";
import worksheetSlice from "./reducers/worksheetSlice";
export default configureStore ({
    reducer:{
        departments:departmentsSlice,
        courses:coursesSlice,
        questions:questionsSlice,
        question_packages:questionPackagesSlice,
        news: newsSlice,
        examMode: examModeSlice,
        subjects:notesSlice,
        worksheets:worksheetSlice
    }
})