import { SET_DEFAULT_MAPS, SET_PROPERTIES_LIST, SET_QUERY_POLYGON, SET_SINGLE_PROPERTY_STATE, SET_DEFAULT_LISTS, SET_PROPERTY_TO_ADD_POLYGON, ADD_QUERIED_PROPERTY_TO_LIST, SET_SUBMIT_PROPERTIES_LOADING, SET_MODIFIED_PROPERTIES, SET_PROPERTY_COMMENTS } from "../actions/actions_properties";

const initialState = {
  properties_list: false,
  active_property: false,
  active_property_comments: false,
  query_polygon: false,
  add_property_polygon: false,
  default_maps: false,
  default_list: false,
  submit_properties_loading: false,
  modified_properties: [],
  deleted_properties: []

}
const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROPERTIES_LIST:
      return {
        ...state,
        properties_list : action.payload,
        active_property: false
      };
    case SET_SINGLE_PROPERTY_STATE:
      return {
        ...state,
        active_property: action.payload
      };
    case SET_QUERY_POLYGON:
      return {
        ...state,
        query_polygon: action.payload
      }
    case SET_PROPERTY_TO_ADD_POLYGON:
      return {
        ...state,
        add_property_polygon: action.payload
      }

    case SET_DEFAULT_MAPS:
      return {
        ...state,
        default_maps: action.payload
      }
    case SET_DEFAULT_LISTS:
      return {
        ...state,
        default_list: action.payload
      }
    case ADD_QUERIED_PROPERTY_TO_LIST:
      let newRows = state.properties_list
      let newActiveProperty = action.payload[0]
      return {
        ...state,
        active_property: newActiveProperty
      }
    case SET_SUBMIT_PROPERTIES_LOADING:
        return {
          ...state,
          submit_properties_loading: action.payload
        }
    case SET_MODIFIED_PROPERTIES:
      return {
        ...state,
        modified_properties: action.payload.modified,
        deleted_properties: action.payload.deleted
      }
    case SET_PROPERTY_COMMENTS:
      return {
        ...state,
        active_property_comments: action.payload
      }
    default:
      return state
  }
}

export default user
