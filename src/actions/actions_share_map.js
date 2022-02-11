const faunadb = require('faunadb')
const q = faunadb.query
var client = new faunadb.Client({ secret: process.env.REACT_APP_FAUNA_KEY  })

export const SET_MAP_INFO = 'SET_MAP_INFO';
export const SET_ADDITIONAL_LAYERS = 'SET_ADDITIONAL_LAYERS';
export const SET_LAYERS = 'SET_LAYERS';
export const SET_BASE_MAPS = 'SET_BASE_MAPS';
export const SET_SPECIFIC_PROPERTY = 'SET_SPECIFIC_PROPERTY';
export const SET_MAP_LOADING = 'SET_MAP_LOADING';

export function getMapInfo(mapName){
    return (dispatch) =>{
        client.query(
            q.Map(
              q.Paginate(
                q.Match(q.Index("map_by_name"+ process.env.REACT_APP_FAUNA_SUFFIX ), mapName)
              ),
              q.Lambda("X", q.Get(q.Var("X")))
            )
        ).then(function(ret){
          if(ret.data.length > 0){
            const mapInfo = ret.data[0].data.details;
             dispatch(setShareMapInfo(mapInfo))

          }
        });
    }
}


export function setShareMapInfo(mapInfo) {
    return {
      type : SET_MAP_INFO,
      payload : mapInfo
    }
}

export function setAdditionalLayers(layers) {
  return {
    type : SET_ADDITIONAL_LAYERS,
    payload : layers
  }
}

export function setLayers(layers) {
  return {
    type : SET_LAYERS,
    payload : layers
  }
}

export function setBaseMaps(maps){
  return {
    type : SET_BASE_MAPS,
    payload : maps
  }
}

export function setSpecificPopupProperty(property){
  return {
    type : SET_SPECIFIC_PROPERTY,
    payload : property
  }
}

export function setMapLoading(state){
  return {
    type : SET_MAP_LOADING,
    payload : state
  }
}