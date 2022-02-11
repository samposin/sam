export const SET_LEFT_SIDEBAR = 'SET_LEFT_SIDEBAR';
export const SET_RIGHT_SIDEBAR = 'SET_RIGHT_SIDEBAR';

export function setLeftSidebarState(open) {
    return {
      type : SET_LEFT_SIDEBAR,
      payload : open
    }
}
  
export function setRightSidebarState(open) {
    return {
      type : SET_RIGHT_SIDEBAR,
      payload : open
    }
}

