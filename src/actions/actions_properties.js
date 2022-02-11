import { commentRows, featuresToGet, modifiedRows, pricesCast, shareMapFeatures } from '../utils/actions/constants';
import { createHighlightMemory } from '../utils/components/Maps/highlight';
import { setHighlightedFeaturesMemory } from './actions_layers';
import { buildQueryString, getBigQueryRequest, jsonTowkt, wktToJson, getSourceTable, numberFormatFromOld } from '../utils/actions/helpers';
export const SET_PROPERTIES_LIST = 'SET_PROPERTIES_LIST';
export const SET_SINGLE_PROPERTY_STATE = 'SET_SINGLE_PROPERTY_STATE';
export const SET_QUERY_POLYGON = 'SET_QUERY_POLYGON';
export const SET_DEFAULT_MAPS = 'SET_DEFAULT_MAPS';
export const SET_DEFAULT_LISTS = 'SET_DEFAULT_LISTS';
export const SET_PROPERTY_TO_ADD_POLYGON = 'SET_PROPERTY_TO_ADD_POLYGON';
export const ADD_QUERIED_PROPERTY_TO_LIST = 'ADD_QUERIED_PROPERTY_TO_LIST';
export const SET_SUBMIT_PROPERTIES_LOADING = 'SET_SUBMIT_PROPERTIES_LOADING';
export const SET_MODIFIED_PROPERTIES = 'SET_MODIFIED_PROPERTIES';
export const SET_PROPERTY_COMMENTS = 'SET_PROPERTY_COMMENTS';
const faunadb = require('faunadb')

const q = faunadb.query
var client = new faunadb.Client({ secret: process.env.REACT_APP_FAUNA_KEY })

export function getProperties(county, inputStatus, inputAcresMin, inputAcresMax, inputPriceMin, inputPriceMax, inputPPAMin, inputPPAMax, inputRating, inputCreekWF, inputLakeWF, inputRiverWF, inputNoneWF, inputPPAUsableMin, inputPPAUsableMax, inputSources, inputMaxDistance, inputDistanceCity, inputDays, inputNew, polygon, setLoading) {
  return (dispatch) => {
    const qString = buildQueryString(county, inputStatus, inputAcresMin, inputAcresMax, inputPriceMin, inputPriceMax, inputPPAMin, inputPPAMax, inputRating, inputCreekWF, inputLakeWF, inputRiverWF, inputNoneWF, inputPPAUsableMin, inputPPAUsableMax, inputSources, inputMaxDistance, inputDistanceCity, inputDays, inputNew, polygon)
    // console.log(qString)
    var request = getBigQueryRequest(qString);
    return request.execute(resp => {
      if(resp.code) {
        alert('Property query failed.');
      }
      else {
        const formatted = []
        if(resp.rows){
          resp.rows.forEach(row => {
            const formattedRow = {}
            row.f.forEach((column, i) => {
              if (column.v != "null"){
                formattedRow[featuresToGet[i]] = column.v;
              } else {
                formattedRow[featuresToGet[i]] = null;
              }
            })
            formatted.push(formattedRow)
          })
          dispatch(setPropertiesList(formatted))
        }
        else {
          alert('No results found! Please expand your query.');
          setLoading(false)
        }
      }
    });
  }
}

export function loadQueryMap(mapName, setLoadingMap){
  return (dispatch) => {
    client.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index("map_by_name" + process.env.REACT_APP_FAUNA_SUFFIX ), mapName)
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    ).then((ret) => {
        var mapInfo = ret.data[0].data.details;
        let noData = false;
        console.log(mapInfo.highlightLayers)
        const highlightMemory = mapInfo.highlightLayers;
        let memory = {}
        const keys = Object.keys(highlightMemory);

        keys.forEach((key, index) => {
          highlightMemory[key].forEach(propID => {
            const newFeatureMemory = createHighlightMemory(memory, {
              "state": true,
              "data": {
                  "source": key,
                  "id": parseInt(propID)
              }
            })
            memory = newFeatureMemory
          })
        });
        console.log(memory)
        dispatch(setHighlightedFeaturesMemory(memory))


        if (!('properties' in highlightMemory)) {
          alert('There is no market information in this map.');
          setLoadingMap(false)
          noData = true;
        }

        if(!noData){
          var query = 'select ' + featuresToGet.join(', ') + ' from market_data.properties' + process.env.REACT_APP_TABLE_SUFFIX + ' where ID in (\'' + highlightMemory['properties'].join('\',\'') + '\') order by utility desc;';
          pricesCast.forEach(function(toReplace){
            query = query.replace(toReplace, 'cast(' + toReplace + ' as numeric)');
          });

          // console.log(query)

          const request = getBigQueryRequest(query)

          return request.execute(resp => {
            if(resp.code) {
              alert('Property query failed.');
              setLoadingMap(false)

            }
            else {
              const formatted = []
              if(resp.rows){
                resp.rows.forEach(row => {
                  const formattedRow = {}
                  row.f.forEach((column, i) => {
                    if (column.v != "null"){
                      formattedRow[featuresToGet[i]] = column.v;
                    } else {
                      formattedRow[featuresToGet[i]] = null;
                    }
                  })
                  formatted.push(formattedRow)
                })
                // dispatch(setHighlightedFeaturesMemory(memory))
                dispatch(setPropertiesList(formatted.reverse()))
              }
              else {
                setLoadingMap(false)
                alert('No results found! Please expand your query.');

              }
            }
          });
        }
    }).catch(res =>{
      console.log(res)
    });
  }
}

export function getDefaultMaps(){
  return (dispatch) => {
    var sMaps = []
    client.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index("all_maps" + process.env.REACT_APP_FAUNA_SUFFIX )),
          {size:100000}
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    ).then((ret) => {
        ret.data.map(x => sMaps.push({key: x.data.name, value: x.data.name, text: x.data.name, detail: x.data.details}));
        dispatch(setDefaultMaps(sMaps.reverse()))

    })
  }
}

export function addNewMap(mapName, memoryToUse, defaultMaps){
  //var query = 'select ' + shareMapFeatures.join(', ') + ' from land.properties  where \'' + memoryToUse['properties'] + '\' like CONCAT(\'%\', ID, \'%\');';
  var idin = (memoryToUse['properties']) ? (memoryToUse['properties'].join('\',\'')) : (memoryToUse['properties']);
  var query = 'select ' + shareMapFeatures.join(', ') + ' from market_data.properties'+ process.env.REACT_APP_TABLE_SUFFIX + ' where ID in (\'' + idin + '\') order by price desc;';
  pricesCast.forEach(function(toReplace){
      query = query.replace(toReplace, 'cast(' + toReplace + ' as numeric)');
  });
  // console.log(query)
  var request = getBigQueryRequest(query);

  var marketData = [];

  return (dispatch) =>{
    return request.execute(response => {
      if('rows' in response){
        response.result.rows.forEach(function(row){
          var property = {};
          shareMapFeatures.forEach(function(item, index){
            const featureValue = row.f[index].v
            if (featureValue != "null"){
               property[item] = featureValue;
            } else {
               property[item]=null;
            }

          });
          marketData.push(property);
        });
      }
      let shareMapObj = {name:mapName, details:{otherLayers:[], baseMaps:['Default'], marketData:marketData, highlightLayers:memoryToUse}}

      client.query(
        q.Create(
          q.Collection("shareMap"+ process.env.REACT_APP_FAUNA_SUFFIX ),
          {
            data: shareMapObj
          }
        )
      ).then(response =>{
        const mapList = JSON.parse(JSON.stringify(defaultMaps))
        mapList.push({key: response.data.name, value: response.data.name, text: response.data.name})
        dispatch(setDefaultMaps(mapList))
      })
    })

  }
}

export function deleteMapQuery(mapName, defaultMaps){
  return (dispatch) =>{
    client.query(q.Delete(
      q.Select(
        "ref",
        q.Get(
          q.Match(q.Index("map_by_name" +  process.env.REACT_APP_FAUNA_SUFFIX), mapName)
        )
      )
    )).then((resp)=>{
      const defaultMapsClone = JSON.parse(JSON.stringify(defaultMaps))
      const newMapsList = defaultMapsClone.filter(map => map.value !== mapName)
      dispatch(setDefaultMaps(newMapsList))
    });
  }
}

export function overwriteMapQuery(mapName, memoryToUse, setLoadingOverwrite, newBaseMaps, newLayers){
  return (dispatch) => {
    client.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index("map_by_name"+ process.env.REACT_APP_FAUNA_SUFFIX ), mapName)
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    ).then((ret) => {

      const mapInfo = ret.data[0].data.details;
      const layers = newLayers ? newLayers : mapInfo.otherLayers
      const baseMaps = newBaseMaps? newBaseMaps : mapInfo.baseMaps

      //var query = 'select ' + shareMapFeatures.join(', ') + ' from land.properties  where \'' + memoryToUse['properties'] + '\' like CONCAT(\'%\', ID, \'%\');';
      var idin = (memoryToUse['properties']) ? (memoryToUse['properties'].join('\',\'')) : (memoryToUse['properties']);
      var query = 'select ' + shareMapFeatures.join(', ') + ' from market_data.properties'+ process.env.REACT_APP_TABLE_SUFFIX + ' where ID in (\'' + idin + '\') order by price desc;';
      pricesCast.forEach(function(toReplace){
          query = query.replace(toReplace, 'cast(' + toReplace + ' as numeric)');
      });
      // console.log(query)

      var request = getBigQueryRequest(query);

      var marketData = [];

      request.execute(response => {
        if('rows' in response){
          response.result.rows.forEach(function(row){
            var property = {};
            shareMapFeatures.forEach(function(item, index){
              const featureValue = row.f[index].v
              if (featureValue != 'null'){
                property[item] = featureValue;
              } else {
                property[item] = null;
              }

            });
            marketData.push(property);
          });
        }

        let shareMapObj = {name:mapName, details:{otherLayers:layers, baseMaps: baseMaps, marketData:marketData, highlightLayers:memoryToUse}}
        client.query(
          q.Update(
            q.Select("ref",
              q.Get(
                q.Match(q.Index("map_by_name"+ process.env.REACT_APP_FAUNA_SUFFIX ), mapName)
              )
            ),
            {
              data: shareMapObj
            }
          )
        ).then(resp =>{
          if(setLoadingOverwrite){
            setLoadingOverwrite(false)
          }
        }).catch(resp => console.log(resp))

      })
    }).catch(err => {
      console.log(err)
    })
  }
}

export function deleteListingQuery(propertyInfo){
  return (dispatch) => {
    var query = ' WHERE ID = \'' + propertyInfo.ID+'\'';

    var merged_query = 'DELETE FROM `market_data.properties'+ process.env.REACT_APP_TABLE_SUFFIX + "` " + query
    var modified_table_query = `INSERT INTO \`market_data.properties_modified${process.env.REACT_APP_TABLE_SUFFIX}\` (ID, type, date_modified) VALUES (${propertyInfo.ID}, 'delete', CURRENT_TIMESTAMP() )`
    // console.log(source_query)
    // console.log(merged_query)
    // console.log(modified_table_query)

    var modified_table_request = getBigQueryRequest(modified_table_query);
    modified_table_request.execute(function(response) {
      if(response.code){
          alert('An error has occurred when pushing to the modified merged table.');
          return;
      }
      else {
        // console.log(response)
      }
    });

    var merged_request = getBigQueryRequest(merged_query);
    merged_request.execute(function(response) {
        if(response.code){
            alert('An error has occurred when pushing to the merged table.');
            return;
        }
        else {
            alert('Successfully deleted listing.')///should update stuff now
            dispatch(setSinglePropertyState(false))
            dispatch(getModifiedProperties())
        }
    });
  }
}

export function getDefaultList(){
  return (dispatch) =>{
    var request = getBigQueryRequest('SELECT values FROM `land.lists'+ process.env.REACT_APP_TABLE_SUFFIX + '` limit 1;');
    // console.log('SELECT values FROM `land.lists'+ process.env.REACT_APP_TABLE_SUFFIX + '` limit 1;')
    request.execute(function(response) {
      var listString = response.result.rows[0].f[0].v;
      let lists = {}
      if (!listString) {
        lists = {};
      }
      else {
        lists = JSON.parse(response.result.rows[0].f[0].v);
      }
      const sLists = []
      for (const list in lists) {
        if (Object.hasOwnProperty.call(lists, list)) {
          sLists.push({key: list, value: list, text: list, data: lists[list]})

        }
      }
      dispatch(setDefaultLists(sLists))
    });
  }
}

export function loadInList(listInfo, setLoadingList){
  return (dispatch) => {
      var query = 'select ' + featuresToGet.join(', ') + ' from market_data.properties' + process.env.REACT_APP_TABLE_SUFFIX + ' where ID in (\'' + listInfo.data.join('\',\'') + '\') order by utility desc;';
      pricesCast.forEach(function(toReplace){
          query = query.replace(toReplace, 'cast(' + toReplace + ' as numeric)');
      });

      var request = getBigQueryRequest(query);

      return request.execute(resp => {
        if(resp.code) {
          alert('Property query failed.');
          setLoadingList(false)
        }
        else {
          const formatted = []
          if(resp.rows){
            resp.rows.forEach(row => {
              const formattedRow = {}
              row.f.forEach((column, i) => {
                if (column.v != "null"){
                  formattedRow[featuresToGet[i]] = column.v;
                } else {
                  formattedRow[featuresToGet[i]] = null;
                }
              })
              formatted.push(formattedRow)
            })
            dispatch(setPropertiesList(formatted))
          }
          else {
            alert('No results found! Please expand your query.');
            setLoadingList(false)
          }
        }
      })

  }
}

export function updateList(updatedList){
  return (dispatch) => {
    //reformat list to look like {listName: [ids]}
    const reformattedList = {}
    updatedList.forEach(list =>{
      reformattedList[list.value] = list.data
    })

    const jsonstring = JSON.stringify(reformattedList);
    var queryUpdate = 'UPDATE `land.lists'+ process.env.REACT_APP_TABLE_SUFFIX +'` SET values = \'' + jsonstring + '\' WHERE name LIKE \'%rmlmap%\';';
    // console.log(queryUpdate)
    var request = getBigQueryRequest(queryUpdate);

    return request.execute(function(response) {
      if(response.code){
        alert('Authentication failed. Please refresh.')
      }
      else{
        dispatch(setDefaultLists(updatedList))
      }
    })

  }
}

export function addProperty(selectedCounty, selectedStatus, acres, price, url, add_property_polygon, centroid, sold, dateSold){
  // query (county, status, acres, sold, date_sold, geometry, geom_json, ID, source, matched, lat_centroid, long_centroid, ppa_map) VALUES ('Anderson', -2, 6, 12343, '2021-11-25', 'POLYGON ((-106.75178954466587 52.12049209935128, -106.74984192135305 52.12066289403853, -106.74984188440584 52.122095418291735, -106.75104056327778 52.122147948857446, -106.75181105902445 52.12179308117416, -106.75219626436406 52.12147767277196, -106.75204639725472 52.12092574466445, -106.75178954466587 52.12049209935128))', '{"coordinates":[[[-106.75178954466587,52.12049209935128],[-106.74984192135305,52.12066289403853],[-106.74984188440584,52.122095418291735],[-106.75104056327778,52.122147948857446],[-106.75181105902445,52.12179308117416],[-106.75219626436406,52.12147767277196],[-106.75204639725472,52.12092574466445],[-106.75178954466587,52.12049209935128]]],"type":"Polygon"}', '8882908663944', 'custom', 1, 52.12137069416422, -106.75122394776369, 'N/A')
  // (ID, status, county, date_sold, geom_json, geometry, lat_centroid, long_centroid, matched, sold, ppa_map, source) VALUES ('8881551406345', -2, 'Anderson', '2021-11-25', '{"coordinates":[[[-106.75745846250915,52.122198618986744],[-106.75587486662081,52.1212131762033],[-106.75450563536745,52.12187020431327],[-106.7550835391428,52.12243524979513],[-106.75527620179258,52.122711209609236],[-106.75602516546962,52.1228294389943],[-106.75720197558071,52.12282936815811],[-106.75752284704134,52.122684802779844],[-106.75790790024541,52.12256651964179],[-106.75745846250915,52.122198618986744]]],"type":"Polygon"}', 'POLYGON ((-106.75745846250915 52.122198618986744, -106.75587486662081 52.1212131762033, -106.75450563536745 52.12187020431327, -106.7550835391428 52.12243524979513, -106.75527620179258 52.122711209609236, -106.75602516546962 52.1228294389943, -106.75720197558071 52.12282936815811, -106.75752284704134 52.122684802779844, -106.75790790024541 52.12256651964179, -106.75745846250915 52.122198618986744))', 52.122370954275745, -106.75631739930776, 1, 12343, 'N/A', 'custom')
  const listingToAdd = {
    ID: (888).toString() + Math.floor(Math.random() * 10000000000).toString(),
    status: selectedStatus,
    acres,
    county: selectedCounty,
    date_sold: dateSold,
    geometry: jsonTowkt(add_property_polygon.geometry),
    lat_centroid: centroid.geometry.coordinates[1],
    long_centroid: centroid.geometry.coordinates[0],
    matched: 1,
    clipped: 0,
    modeled: 0,
    edited: 0,
    price,
    sold,
    source: 'custom',
    url: url
  }

  var query = '('
  for (const key in listingToAdd){
    if (listingToAdd[key]){
      query = query + key +', ';
    }
  }
  query = query.slice(0, -2);
  query += ') VALUES (';
  for (const key in listingToAdd){
    if (listingToAdd[key]){
      if (key === 'url' || key ==='date_sold' || key === 'county' || key === "ID" || key === "source" || key === 'geometry'){
        query = query + '\'' + listingToAdd[key] + '\', ';
      } else {
        query = query + listingToAdd[key] + ', ';
      }
    }
  }
  query = query.slice(0, -2);
  query+=')'

  var merged_query = 'INSERT INTO market_data.properties'+process.env.REACT_APP_TABLE_SUFFIX+' ' + query
  var modification_query =  'INSERT INTO `market_data.properties_modified' + process.env.REACT_APP_TABLE_SUFFIX + '` (ID, type, date_modified) VALUES ( '+ '' + listingToAdd.ID + ', ' + '\'new\', ' + 'CURRENT_TIMESTAMP())';

  // INSERT INTO land.hand_match_testing (ID, status, county, geom_json, geometry, lat_centroid, long_centroid, matched, ppa_map, source) VALUES ('8883686373819', 1, 'Anderson', '{"coordinates":[[[-106.74869396980854,52.121444642444544],[-106.7485910325057,52.12116419761267],[-106.7474790914673,52.12129863886719],[-106.74765270790843,52.12153544608012],[-106.74869396980854,52.121444642444544]]],"type":"Polygon"}', 'POLYGON ((-106.74869396980854 52.121444642444544, -106.7485910325057 52.12116419761267, -106.7474790914673 52.12129863886719, -106.74765270790843 52.12153544608012, -106.74869396980854 52.121444642444544))', 52.12136073125113, -106.74810420042249, 1, 'N/A', 'custom')

  // console.log(source_query)
  // console.log(merged_query)
  // console.log(modification_query)
  return (dispatch) => {
    var request = getBigQueryRequest(merged_query);
    return request.execute(resp => {
      if(resp.code){
        dispatch(setSubmitPropertyLoadingState(false))
        alert('Request Failed. Please insure your input is correct.');
      }
      else{
        var modification_request = getBigQueryRequest(modification_query)
        modification_request.execute(function(response) {
          if(response.code){
            dispatch(setSubmitPropertyLoadingState(false))
            alert('Request Failed. Please insure your input is correct.');
          }
          else{
            dispatch(setSubmitPropertyLoadingState(false))
            dispatch(getModifiedProperties())
            alert('Successfully added listing.');
          }
        });
      }
    });
  }
}
export function addPropertyToList(propertyID){
  return (dispatch) => {
    var query = 'SELECT ' + featuresToGet.join(', ') +  ' FROM market_data.properties' + process.env.REACT_APP_TABLE_SUFFIX + ' WHERE ID = \'' + propertyID+'\'';
    pricesCast.forEach(function(toReplace){
        query = query.replace(toReplace, 'cast(' + toReplace + ' as numeric)');
    });
    // console.log(query)
    var request = getBigQueryRequest(query);
    return request.execute(function(response) {
      if(response.code){
        alert('An error has occured. Please refresh and re-authenticate.');
        return;
      }
      if(!('rows' in response.result)){
        alert('This property is not in the database.');
        return;
      };


        // var property = {}
        let results = []
        let newRows = []
        let resultsIDs= []
        let featureValue
        response.result.rows.forEach(function(row){
          var rowID = row.f[0].v;
          results[rowID] = {}
          resultsIDs.push(rowID);
          featuresToGet.forEach(function(item, index){
            if (index > 0){
              featureValue = row.f[index].v
              if (featureValue != "null"){
                results[rowID][item] = featureValue;
              } else {
                results[rowID][item] = null;
              }
            }
          });
          results[rowID].ID = rowID
          newRows.push(results[rowID])
        });
        dispatch(addQueriedPropertiesToList(newRows))


    });
  }
}

export function updateActiveProperty(listingPrice, soldPrice, soldDate, acres, new_edit_property_poly, propertyStat, active_property, setLoadingSubmit){
  var query = '` SET edited=1, ';

  if(listingPrice && listingPrice !== 'No Data'){
      query = query + 'price = ' + listingPrice.replace(/\$|,/g, '') + ', '
  }
  if(soldPrice && soldPrice !== 'No Data'){
      query = query + 'sold = ' + soldPrice.replace(/\$|,/g, '') + ', '
  }
  if(soldDate && soldDate !== 'No Data'){
      query = query + 'date_sold = \'' + soldDate + '\', '
  }
  if(acres && acres !== 'No Data'){
      query = query + 'acres = ' + acres.replace(/\$|,/g, '') + ', '
  }

  if(new_edit_property_poly){
    query = query + 'clipped=0, modeled=0, geometry = \'' + jsonTowkt(new_edit_property_poly.geometry) + '\', ';
  }
  query = query + 'status = ' + parseInt(propertyStat)
  query += ' WHERE ID = \'' + active_property.ID +'\'';


  var merged_query = 'UPDATE `market_data.properties'+ process.env.REACT_APP_TABLE_SUFFIX + query
  var merged_request = getBigQueryRequest(merged_query);
  // console.log(source_query)
  // console.log(merged_query)
  return (dispatch) => {
    return merged_request.execute(function(response) {
      if(response.code){
        alert('An error has occurred. Please confirm all data was entered in a valid format.');
        setLoadingSubmit(false)
        return;
      }
      else {
        const modified_query = `INSERT INTO \`market_data.properties_modified${process.env.REACT_APP_TABLE_SUFFIX}\` (ID, type, date_modified) VALUES (${active_property.ID}, 'modified', CURRENT_TIMESTAMP() )`
        const modified_request = getBigQueryRequest(modified_query);
        modified_request.execute((response) => {
          if(response.code){
            alert('An error has occurred when trying to push new data into modified merged table.');
            setLoadingSubmit(false)
            return;
          }
          else {
            alert('Successfully edited data.')
            dispatch(getModifiedProperties())
            dispatch(addPropertyToList(active_property.ID))
          }
        })
      }
    });
  }
}

export function saveMapSettings(mapName, baseMaps, layers, setLoadingSaveSettings){
  // console.log(mapName, baseMaps, layers, setLoadingSaveSettings)
  return (dispatch) => {
    client.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index("map_by_name"+ process.env.REACT_APP_FAUNA_SUFFIX ), mapName)
          ),
          q.Lambda("X", q.Get(q.Var("X")))
          )
          ).then((ret) => {
            // console.log(ret);
            let savedMemory = ret.data[0].data.details
            dispatch(overwriteMapQuery(mapName, savedMemory.highlightLayers, setLoadingSaveSettings, baseMaps, layers))
      })
    }
}

export function badMatchQuery(selectedListingID){
   var query = 'UPDATE `market_data.properties' + process.env.REACT_APP_TABLE_SUFFIX + '` SET matched=-1, clipped=0, modeled=0, geometry = null WHERE ID = \'' + selectedListingID + '\'';
    var request = getBigQueryRequest(query);
  return (dispatch) => {
    return request.execute(response => {
      if(response.code){
        alert('An error has occured. Please refresh and re-authenticate.');
        return;
      }
      else {
        alert('Successfully labeled as bad match.')
      }
    });
  }
}

export function getModifiedProperties(){
  const hour = 1000 * 60 * 60;
  const anHourAgo = Date.now() - hour;
  const query = `SELECT  modified_table.ID, modified_table.type, UNIX_MILLIS(date_modified) as date_modified FROM \`market_data.properties_modified${process.env.REACT_APP_TABLE_SUFFIX}\` as modified_table WHERE ${anHourAgo} < UNIX_MILLIS(date_modified)`
  // console.log(query)
  var request = getBigQueryRequest(query);
  return (dispatch) => {
    return request.execute(response => {
      if(response.code){
        alert('An error has occured. Please refresh and re-authenticate.');
        return;
      }
      else {
        const formatted = []
        if(response.rows){
          response.rows.forEach(row => {
            const formattedRow = {}
            row.f.forEach((column, i) => {
              formattedRow[modifiedRows[i]] = column.v
            })
            formatted.push(formattedRow)
          })
        }
        //separate into two columns one for deleted and another for "add" and "modified"
        const modified = formatted.filter(row => row.type === "new" || row.type === "modified")
        const deleted = formatted.filter(row => row.type === "delete").map(row => row.ID)
        //get data for the modified rows

        const arrayModID = modified.map(row => row.ID)
        var newQuery = `SELECT ${featuresToGet.join(', ')} FROM market_data.properties${process.env.REACT_APP_TABLE_SUFFIX} WHERE ID IN UNNEST([${arrayModID.map(id => `'${id}'`)}])`;
        pricesCast.forEach(function(toReplace){
            newQuery = newQuery.replace(toReplace, 'cast(' + toReplace + ' as numeric)');
        });
        // console.log(newQuery)
        const newRequest = getBigQueryRequest(newQuery);

        return newRequest.execute(response => {

          let results = []
          let newRows = []
          let resultsIDs= []
          let featureValue
          if(response.code){
            alert('An error has occured. Please refresh and re-authenticate.');
            return;
          }
          if(!('rows' in response.result)){
            console.log('no rows have been modified in the past hour')
          }
          else {
            response.result.rows.forEach(function(row){
              var rowID = row.f[0].v;
              results[rowID] = {}
              resultsIDs.push(rowID);
              featuresToGet.forEach(function(item, index){
                if (index > 0){
                  featureValue = row.f[index].v
                  if (featureValue != 'null'){
                    results[rowID][item] = featureValue;
                  } else {
                    results[rowID][item] = null;
                  }

                }
              });
              results[rowID].ID = rowID
              newRows.push(results[rowID])

            });
          }
          //heres our final rows that we need to populate the map properly
          dispatch(setModifiedProperties(newRows, deleted))

        })
      }
    });
  }
}

export function getPropertyComments(propertyID){

  const commentsQuery = `SELECT  ID, username, STRING(date), content, section, image FROM \`market_data.properties_comments${process.env.REACT_APP_TABLE_SUFFIX}\` WHERE CAST(ID as STRING) = '${propertyID}'`
  const commentsRequest = getBigQueryRequest(commentsQuery);
  return (dispatch) => {
    return commentsRequest.execute(function(commentsResponse) {
      if(commentsResponse.code){
        alert('An error has occured. Please refresh and re-authenticate.');
        return;
      }
      // console.log('commentsResponse', commentsResponse)
      if(!('rows' in commentsResponse.result)){
        console.log('no comments for this property. ' + propertyID)
        dispatch(setPropertyComments([]))

        return
      }
      const commentResults = []
      const commentNewRows = []
      const commentResultsIDs= []
      let commentFeatureValue
      // console.log(commentsResponse)
      commentsResponse.result.rows.forEach(function(row){
        var rowID = row.f[0].v;
        commentResults[rowID] = {}
        commentResultsIDs.push(rowID);
        commentRows.forEach(function(item, index){
          if (index > 0){
            commentFeatureValue = row.f[index].v
            commentResults[rowID][item] = commentFeatureValue;
            if(index==3){
              commentResults[rowID][item]=commentResults[rowID][item].replace(/\\n/g, "\n")
            }
          }
        });
        commentResults[rowID].ID = rowID
        commentNewRows.push(commentResults[rowID])

      });
      // console.log(commentNewRows)
      dispatch(setPropertyComments(commentNewRows))
    })

  }
}

export function postPropertyComment(propertyID, comment, email, isMoreSection, imageURL){
  // console.log('isMoreSection', isMoreSection)
  const query = `INSERT INTO \`market_data.properties_comments${process.env.REACT_APP_TABLE_SUFFIX}\` (ID, username, date, content, section, image) VALUES(${propertyID}, '${email}', CURRENT_TIMESTAMP(), '${comment.replace(/\n/g, "\\n")}', '${isMoreSection? "more": "details"}', '${imageURL}')`;
  // console.log(query)
  var request = getBigQueryRequest(query);
  return (dispatch) => {
    return request.execute(response => {
      if(response.code){
        alert('An error has occured. Please refresh and re-authenticate.');
        return;
      }
      else {
        dispatch(getPropertyComments(propertyID))
      }
    });
  }
}

export function deletePropertyNote(content, email, propertyID, date){
  const query = `DELETE FROM \`market_data.properties_comments${process.env.REACT_APP_TABLE_SUFFIX}\` WHERE ID = ${propertyID} AND username ='${email}' AND date = TIMESTAMP('${date}') AND content = '${content}'`;
  // console.log(query)
  var request = getBigQueryRequest(query);
  return (dispatch) => {
    return request.execute(response => {
      if(response.code){
        alert('An error has occured. Please refresh and re-authenticate.');
        return;
      }
      else {
        dispatch(getPropertyComments(propertyID))

      }
    });
  }
}

export function setSubmitPropertyLoadingState(state) {
  return {
    type : SET_SUBMIT_PROPERTIES_LOADING,
    payload : state
  }
}

export function addQueriedPropertiesToList(list) {
  return {
    type : ADD_QUERIED_PROPERTY_TO_LIST,
    payload : list
  }
}

export function setDefaultLists(list) {
  return {
    type : SET_DEFAULT_LISTS,
    payload : list
  }
}

export function setPropertiesList(list) {
  return {
    type : SET_PROPERTIES_LIST,
    payload : list
  }
}

export function setDefaultMaps(maps) {
  return {
    type : SET_DEFAULT_MAPS,
    payload : maps
  }
}


export function setSinglePropertyState(property) {
  return {
    type : SET_SINGLE_PROPERTY_STATE,
    payload : property
  }
}

export function setQueryPolygonFeature(polygon){
  return{
    type: SET_QUERY_POLYGON,
    payload : polygon
  }
}

export function setPropertyToAddFeature(polygon){
  return{
    type: SET_PROPERTY_TO_ADD_POLYGON,
    payload : polygon
  }
}

export function setModifiedProperties(modified, deleted){
  return{
    type: SET_MODIFIED_PROPERTIES,
    payload : {modified, deleted}
  }
}

export function setPropertyComments(comments){
  return{
    type: SET_PROPERTY_COMMENTS,
    payload : comments
  }
}
