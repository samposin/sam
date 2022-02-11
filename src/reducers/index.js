import { combineReducers } from 'redux';

import user from './reducer_user';
import sidebar from './reducer_sidebar';
import properties from './reducer_properties';
import layers from './reducer_layers';
import tools from './reducer_tools';
import shareMap from './reducer_share_map';

const rootReducer = combineReducers({
  user,
  sidebar,
  properties,
  layers,
  tools,
  shareMap
});

export default rootReducer;
