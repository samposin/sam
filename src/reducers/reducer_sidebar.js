import { SET_LEFT_SIDEBAR, SET_RIGHT_SIDEBAR } from "../actions/actions_sidebar";

const initialState = {
  left_side_bar_open: false,
  right_side_bar_open: false,
    
}
  const sidebar = (state = initialState, action) => {
    switch (action.type) {
      case SET_LEFT_SIDEBAR:
      return {
        ...state,
        left_side_bar_open : action.payload
      };

      case SET_RIGHT_SIDEBAR:
      return {
        ...state,
        right_side_bar_open : action.payload
      };

      default:
        return state
    }
  }
  
  export default sidebar
  