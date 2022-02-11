import { SET_ADDITIONAL_LAYERS, SET_LAYERS, SET_MAP_INFO, SET_BASE_MAPS, SET_SPECIFIC_PROPERTY, SET_MAP_LOADING } from "../actions/actions_share_map"

const initialState = {
    share_map_info: false,
    layers: [],
    additional_layers: [],
    base_maps: [],
    specific_popup: false,
    map_loading: true
}
const shareMap = (state = initialState, action) => {
    switch (action.type) {
        case SET_MAP_INFO:
            return{
                ...state,
                share_map_info: action.payload
            }
        case SET_ADDITIONAL_LAYERS:
            return {
                ...state,
                additional_layers: action.payload
        }
        case SET_LAYERS:
            return {
                ...state,
                layers: action.payload
            }
        case SET_BASE_MAPS:
            return {
                ...state,
                base_maps: action.payload
            }
        case SET_SPECIFIC_PROPERTY:
            return {
                ...state,
                specific_popup: action.payload
            }
        case SET_MAP_LOADING:
            return {
                ...state,
                map_loading: action.payload
            }
        default:
        return state
    }
}
  
export default shareMap
  