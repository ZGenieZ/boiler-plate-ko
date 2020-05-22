import { combineReducers } from "redux";
import user from "./user_reducer";

//기능별 reducer를 합쳐서 관리하기 위해 combineReducers를 사용하여 rootReducer 생성
const rootReducer = combineReducers({
  user,
});

export default rootReducer;
