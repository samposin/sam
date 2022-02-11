import { Button, Dropdown, Icon, Table, Label, Loader } from "semantic-ui-react";
import ReactDOM from 'react-dom';
import { clickPopupLayers, hoverPopupLayers } from "./constants";
import { ownershipSources, parcelSources } from "./sources";
import { featuresToGet, pricesCast } from '../../../utils/actions/constants';
import { buildQueryString, getBigQueryRequest } from '../../../utils/actions/helpers';
const languageOptions = [
  { key: 'Arabic', text: 'Arabic', value: 'Arabic' },
  { key: 'Chinese', text: 'Chinese', value: 'Chinese' },
  { key: 'Danish', text: 'Danish', value: 'Danish' },
  { key: 'Dutch', text: 'Dutch', value: 'Dutch' },
  { key: 'English', text: 'English', value: 'English' },
  { key: 'French', text: 'French', value: 'French' },
  { key: 'German', text: 'German', value: 'German' },
  { key: 'Greek', text: 'Greek', value: 'Greek' },
]

 const numberFormat = (n, price) => {
	if(n){
		var parts=n.toString().split(".");
		if(price) {return '$' + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	else {
		return "x"
	}
}

export const getPopupProperties = (layerName, properties) => {
  var toReturn = {
    openable : false,
    highlightable : false,
    highlightID : false,
    popupTable : {}
  }
  if(layerName == "Listings" || layerName == "Results" || layerName === "modified_Listings" || layerName === "modified_Results"){
    toReturn.openable=true;
    toReturn.highlightable=true;
    toReturn.highlightID=properties.ID;
    toReturn.popupTable['ID'] = `${properties.url && properties.url!="null" ? '<a target="_blank" href=\"'+properties.url+'\">'+properties.ID+'</a>':properties.ID}`;
    toReturn.popupTable['Price'] = `${properties.price ? numberFormat(properties.price, true) : 'No Price'}`;
    toReturn.popupTable['Acres'] = `${numberFormat(properties.acres, false)}`;
    toReturn.popupTable['Price / Acre'] = `${properties.price ? '$'+numberFormat(properties.price/properties.acres):'No Price'}`;
    toReturn.popupTable['Price / Sq Ft'] = `${properties.price ? '$'+(properties.price/(properties.acres*43560)).toFixed(2):'No Price'}`;
  }
  else if(layerName == "PCC_inactive"){
    toReturn.openable=true;
    toReturn.highlightable=true;
    toReturn.highlightID=properties.ID;
    toReturn.popupTable['ID'] = `${properties.url ? '<a target="_blank" href=\"'+properties.url+'\">'+properties.ID+'</a>':properties.ID}`;
    toReturn.popupTable['Price'] = `${properties.price ? numberFormat(properties.price, true) : 'No Price'}`;
    toReturn.popupTable['Acres'] = `${numberFormat(properties.acres, false)}`;
    toReturn.popupTable['Price / Acre'] = `${properties.price ? '$'+numberFormat(properties.price/properties.acres):'No Price'}`;
    toReturn.popupTable['Price / Sq Ft'] = `${properties.price ? '$'+(properties.price/(properties.acres*43560)).toFixed(2):'No Price'}`;
    toReturn.popupTable['Date Listed'] = `${properties.date_sold ? properties.date_sold:'No Data'}`;
  }
  else if(layerName.includes("Projects") || layerName.includes("PerformingProjects")){
    toReturn.highlightable=true;
    toReturn.highlightID=properties.Subdivisio.replace('\'', '\\\'');
    toReturn.popupTable['Name'] = `${properties.Subdivisio}`;
    toReturn.popupTable['Total Units'] = `${properties.TotalUnits}`;
    toReturn.popupTable['Annual Closing'] = `${properties.AnnClosing}`;
    toReturn.popupTable['Annual Starts'] = `${properties.AnnStarts}`;
    toReturn.popupTable['Developer'] = `${properties.Developer}`;
    toReturn.popupTable['Active Builder'] = `${properties.ActBuilder}`;
    toReturn.popupTable['Future Units'] = `${properties.FutureUnit}`;
  }
  else if(layerName == "Sales" || layerName == "RecentSales" || layerName == "modified_Sales" || layerName == "modified_RecentSales"){
    toReturn.openable=true;
    toReturn.highlightable=true;
    toReturn.highlightID=properties.ID;
    toReturn.popupTable['ID'] = `${properties.ID}`;
    toReturn.popupTable['Sold Price'] = `${numberFormat(properties.sold, true)}`;
    toReturn.popupTable['Acres'] = `${numberFormat(properties.acres, false)}`;
    toReturn.popupTable['Sold Price / Acre'] = `${numberFormat(properties.sold/properties.acres, true)}`;
    toReturn.popupTable['Date Sold'] = `${properties.date_sold? properties.date_sold.substring(0, 7): null}`;
  }
  else if(layerName.includes("OrigOwner") || layerName.includes("ownerships")){
    toReturn.highlightable=true;
    toReturn.highlightID=properties.rmlid;
    toReturn.popupTable['Owner'] = `${properties.owner}`;
    toReturn.popupTable['Acres'] = `${numberFormat(properties.acres? properties.acres : properties.ll_gisacre, false)}`;
  }
  else if(layerName.includes("tx_") && !layerName.includes("ownerships")){
    toReturn.highlightable=true;
    toReturn.highlightID=properties.parcelnumb;
    toReturn.popupTable['Parcel Number'] = `${properties.parcelnumb}`;
    toReturn.popupTable['Owner'] = `${properties.owner}`;
    toReturn.popupTable['Acres'] = `${numberFormat(properties.acres? properties.acres : properties.ll_gisacre, false)}`;
  }
  else if(layerName.includes("UtilityDistricts")){
    toReturn.popupTable['Name'] = `${properties.NAME}`;
    toReturn.popupTable['Type'] = `${properties.TYPE}`;
  }
  else if(layerName.includes("Cities")){
    toReturn.popupTable['City Name'] = `${properties.CITY_NM}`;
    toReturn.popupTable['Is County Seat?'] = `${properties.CNTY_SEAT}`;
    toReturn.popupTable['POP 2010'] = `${properties.POP2010}`;
    toReturn.popupTable['POP 2000'] = `${properties.POP2000}`;
    toReturn.popupTable['POP 1990'] = `${properties.POP1990}`;
  }
  else if(layerName == "Pending" || layerName === "modified_Pending"){
    toReturn.openable=true;
    toReturn.highlightable=true;
    toReturn.highlightID=properties.ID;
    toReturn.popupTable['ID'] = `${properties.url && properties.url!="null" ? '<a target="_blank" href=\"'+properties.url+'\">'+properties.ID+'</a>':properties.ID}`;
    toReturn.popupTable['Price'] = `${properties.price ? numberFormat(properties.price, true) : 'No Price'}`;
    toReturn.popupTable['Acres'] = `${numberFormat(properties.acres, false)}`;
    toReturn.popupTable['Price / Acre'] = `${properties.price ? numberFormat(properties.price/properties.acres, true):'No Price'}`;
    toReturn.popupTable['Price / Sq Ft'] = `${properties.price ? '$'+(properties.price/(properties.acres*43560)).toFixed(2):'No Price'}`;
  }
  else if(layerName.includes("Government")){
    toReturn.highlightable=true;
    // toReturn.highlightID=tag;
    toReturn.popupTable['Name'] = `${properties.NAME}`;
    toReturn.popupTable['Type'] = `${properties.TYPE}`;
  }
  else if(layerName.includes("ETJ")){
    toReturn.popupTable['City Name'] = `${properties.city_name}`;
  }
  else if(layerName=="WaterCCN" || layerName=="SewerCCN"){
    toReturn.popupTable['Utility'] = `${properties.UTILITY}`;
  }
  else if(layerName=="SchoolZones"){
    toReturn.highlightable=true;
    toReturn.highlightID=properties.NAME;
    toReturn.popupTable['Name'] = `${properties.NAME}`;
  }
  else if(layerName=="HomeSales"){
    toReturn.popupTable['Close Price']=properties['Close Price'];
    toReturn.popupTable['Square Feet']=properties['SqFt'];
    toReturn.popupTable['Close Date']=properties['Close Date'];
    toReturn.hoverPopup=true;
  }
  else if(layerName=="Creeks"){
    toReturn.popupTable['Name']=properties['GNIS_NAME'];
    toReturn.hoverPopup=true;
  }
  else if(layerName=="MSPD"){
    toReturn.popupTable['Name']=properties['Subdivisio'];
    toReturn.popupTable['Status']=properties['Status'];
    toReturn.popupTable['Total Units']=properties['Total'];
    toReturn.hoverPopup=true;
  }
  const keys = Object.keys(toReturn.popupTable)
  return toReturn;
}

export const closePopup = (popup) => {
  popup.remove();
}

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

export const changeOpenTable = (e, openTableIndex) => {
  var openTablesDiv = findAncestor(e.target, "parent-popup")
  openTablesDiv = openTablesDiv.children[1];

  for(var i = 0; i < openTablesDiv.children.length; i++) {
    if(i === parseInt(openTableIndex)) {
      openTablesDiv.children[i].classList.add('table-open');
    } else {
      openTablesDiv.children[i].classList.remove('table-open')
    }
  }
}

export const updateFeatureStateToHover = (feature, map, popup) => {
  if(popup){
    closePopup(popup)
  }
  const hoverState = map.getFeatureState({ source: feature.layer.source, id: feature.id, sourceLayer: feature.layer['source-layer'] })
  if(!hoverState.hover){
      map.setFeatureState({ source: feature.layer.source, id: feature.id, sourceLayer: feature.layer['source-layer'] },{ hover: true });
      if(feature.layer.source === "projects_merge"){
        map.setFeatureState({ source: 'project_labels_tim', id: feature.id, sourceLayer: 'project_labels_tim' },{ hover: true });
      }
      if(feature.isModifiedLayer){
        map.setFeatureState({ source: 'modified_properties', id: feature.id},{ hover: true });
      }
  }
  else {
      map.setFeatureState({ source: feature.layer.source, id: feature.id, sourceLayer: feature.layer['source-layer'] },{ hover: false });
      if(feature.layer.source === "projects_merge") {
        map.setFeatureState({ source: 'project_labels_tim', id: feature.id, sourceLayer: 'project_labels_tim' },{ hover: false });
      }
      if(feature.isModifiedLayer){
        map.setFeatureState({ source: 'modified_properties', id: feature.id},{ hover: false });
      }
  }
}

const doPropertyFetch = (feature, pinned) => {
  let qString = 'SELECT ' + featuresToGet.join(', ');
  pricesCast.forEach(function(toReplace){
      qString=qString.replace(toReplace, 'cast(' + toReplace + ' as numeric)');
  });
  qString += ' FROM market_data.properties' + process.env.REACT_APP_TABLE_SUFFIX  + ' WHERE ID = "' + feature.id + '";';
  var request = getBigQueryRequest(qString);
  request.execute(resp => {
    if(resp.code) {
      alert('Property query failed.');
    } else {
      const formatted = []
      // console.log(resp);
      if(parseInt(resp.totalRows) > 0){
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
        returnPropertyHTML(formatted[0], feature, false, true)
      } else {
        returnPropertyHTML(false, feature, false, true)
      }
    }
  });
}

const formatNumber =(number, decimalPoint)=>{
    const fixedNum = number && number !== NaN && decimalPoint? number.toFixed(decimalPoint) : Math.round(number)
    return new Intl.NumberFormat().format(fixedNum)
}

const returnPropertyHTML = (featureData, mapboxFeature, pinned, fetched) => {
  const id = mapboxFeature.id;
  const newHTML = (
    <div id={`popup-feature-${id}`}>
      <div className="property-popup-image" style={{backgroundImage: `url(https://storage.googleapis.com/popup_images/${mapboxFeature.id}_c.jpeg)`, backgroundRepeat: "no-repeat", backgroundSize: 'cover', backgroundPosition: "50% 50%"}}>
        <div className="property-image-details" style={{color: 'white' }}>
          <p>List Price</p>
          <p className="property-popup-price">{
              !mapboxFeature.properties.price ? 'No Price' : (mapboxFeature.properties.status == 0 ? numberFormat(mapboxFeature.properties.sold/mapboxFeature.properties.acres, true) : numberFormat(mapboxFeature.properties.price/mapboxFeature.properties.acres, true))+'/acre'
          }</p>
          <p>{mapboxFeature.properties.price ? '$' + formatNumber(mapboxFeature.properties.price) : 'No Price'}</p>
        </div>
      </div>
      <div className="property-details">
        {featureData.url ?
          <a className="property-details-link" target="_blank" href={featureData.url}>
            <img src="./img/icons/popout.png" style={{filter: "sepia(100%) hue-rotate(190deg) saturate(500%)"}} />
          </a>
        :
          <div className="property-details-link">
            <img src="./img/icons/popout.png" />
          </div>
        }
        <h4>{formatNumber(parseFloat(mapboxFeature.properties.acres))} acres in {mapboxFeature.properties.county}</h4>
        <p>{featureData ? featureData.address : 'xxx, xxx'}</p>
        <div className="property-details-table">
          <div>
            <p className="property-details-table-title">Usable Acres</p>
            {featureData ?
              <p>{featureData.net_acres ? ((parseFloat(featureData.net_acres)/parseFloat(featureData.acres))*100).toFixed(0) : ''}%</p>
            :
              <div className="loading-popup" >
                {fetched ?
                  <p>TBC</p>
                :
                  <div>
                    <img src="/img/loading-rect.png" /><br />
                    <img src="/img/loading-rect.png" />
                  </div>
                }
              </div>
            }
          </div>
          <div>
            <p className="property-details-table-title">Road Frontage</p>
            {featureData ?
              <p>{featureData.road_gis && featureData.perimeter ? ((featureData.road_gis/featureData.perimeter)*100).toFixed(0) : ''}%</p>
            :
              <div className="loading-popup" >
                {fetched ?
                  <p>TBC</p>
                :
                  <div>
                    <img src="/img/loading-rect.png" /><br />
                    <img src="/img/loading-rect.png" />
                  </div>
                }
              </div>
            }
          </div>
          <div>
            <p className="property-details-table-title">Improvements</p>
            {featureData ?
              featureData.beds > 0 || (featureData.improvval/featureData.price) > 0.15 ? <img src="./img/icons/checkmark.png" /> : <img src="./img/icons/icon-x-circle.svg" />
            :
              <div className="loading-popup" >
                {fetched ?
                  <p>TBC</p>
                :
                  <div>
                    <img src="/img/loading-rect.png" /><br />
                    <img src="/img/loading-rect.png" />
                  </div>
                }
              </div>
            }
          </div>
          <div>
            <p className="property-details-table-title">Live Water</p>
            {featureData ?
              featureData.creek + featureData.lake + featureData.river > 0 ? <img src="./img/icons/checkmark.png" /> : <img src="./img/icons/icon-x-circle.svg" />
            :
              <div className="loading-popup" >
                {fetched ?
                  <p>TBC</p>
                :
                  <div>
                    <img src="/img/loading-rect.png" /><br />
                    <img src="/img/loading-rect.png" />
                  </div>
                }
              </div>
            }
          </div>
          <div>
            <p className="property-details-table-title">DOM</p>
            {featureData ?
              featureData.days ? parseInt(featureData.days) : 'N/A'
            :
              <div className="loading-popup" >
                {fetched ?
                  <p>TBC</p>
                :
                  <div>
                    <img src="/img/loading-rect.png" /><br />
                    <img src="/img/loading-rect.png" />
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
  const popupContent = document.createElement('div');
  ReactDOM.render(newHTML, popupContent)
  let htmlElement = document.getElementById(`popup-feature-${id}`);
  if(htmlElement && !pinned) {
    htmlElement.replaceWith(popupContent);
  } else {
    return newHTML;
  }
}

export const getPropertyPopup = (feature, thisPopupTemplate, pinned, findPropertyAndOpenIt, highlightFeature) => {
  doPropertyFetch(feature, pinned);
  return (
    <div className="property-popup">
      <div>
        {returnPropertyHTML(false, feature, pinned, false)}
      </div>
      <div className="button-container">
        <Button onClick={() => findPropertyAndOpenIt(feature.id)}  className="btn atd-button js-sidepanel-all btn--open btn--sm" style={{width: thisPopupTemplate.highlightable ? '48%' : '100%',fontSize: '.78571429rem', padding: '0.78571429em 1.5em 0.78571429em' }}>
          Open
        </Button>
        <Button onClick={()=> highlightFeature(feature)} className="btn atd-button highlight" style={{width: thisPopupTemplate.openable && feature.layer.id !== 'PCC_inactive' ? '48%' : '100%',fontSize: '.78571429rem', padding: '0.78571429em 1.5em 0.78571429em' }}>
          Highlight
        </Button>
      </div>
    </div>
  )
}

export const getSingleDisplay = (feature, thisPopupTemplate, pinned, findPropertyAndOpenIt, highlightFeature, showTitle = true) => {
  const showOpenButton = thisPopupTemplate.openable && findPropertyAndOpenIt;
  const showHighlightButton = thisPopupTemplate.highlightable && highlightFeature;
  let contentToDisplay = false
  let title = feature.layer.id === 'OrigOwner' ? 'Ownerships' : feature.layer.id ===  "modified_Listings" ? "Listings" : feature.layer.id ===  "modified_RecentSales" ? "RecentSales" : feature.layer.id ===  "modified_Sales" ? "Sales" : feature.layer.id ===  "modified_Pending" ? "Pending"  : feature.layer.id ===  "modified_Results" ? "Results" : feature.layer.id
  if(feature.layer.id === 'Listings') {
    return getPropertyPopup(feature, thisPopupTemplate, pinned, findPropertyAndOpenIt, highlightFeature);
  }
  return (
    <div>
      { showTitle ?
          <h1>{title}</h1>
      : '' }
      <div className="table-wrap" style={{maxWidth: '240px'}}>
        <Table singleLine>
            <Table.Body>
                {
                Object.keys(thisPopupTemplate.popupTable).map((key,index) => {
                    if(thisPopupTemplate.popupTable[key] !== 'undefined'){
                      contentToDisplay = true
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>{key}</Table.Cell>
                          <Table.Cell>
                            <div dangerouslySetInnerHTML={{__html : thisPopupTemplate.popupTable[key]}} />
                          </Table.Cell>
                        </Table.Row>
                      );
                    }
                  })
                }
                {
                  !contentToDisplay && <p style={{textAlign: 'center'}}>No properties found.</p>
                }
            </Table.Body>
        </Table>
      </div>

      { showOpenButton || showHighlightButton ?
          <div className="button-container">
              {
                showOpenButton && feature.layer.id !== 'PCC_inactive' &&
                <Button onClick={() => findPropertyAndOpenIt(feature.properties.ID)}  className="btn atd-button js-sidepanel-all btn--open btn--sm" style={{width: thisPopupTemplate.highlightable ? '48%' : '100%',fontSize: '.78571429rem', padding: '0.78571429em 1.5em 0.78571429em' }}>
                  Open
                </Button>
              }
              {
                showHighlightButton &&
                <Button onClick={()=> highlightFeature(feature)} className="btn atd-button highlight" style={{width: thisPopupTemplate.openable && feature.layer.id !== 'PCC_inactive' ? '48%' : '100%',fontSize: '.78571429rem', padding: '0.78571429em 1.5em 0.78571429em' }}>
                  Highlight
                </Button>
              }
          </div>
      : false }
    </div>
  )
}

export const getPopupHTML = (hoverPopup, pinned, popup, features, findPropertyAndOpenIt, highlightFeature, pinPopup) => {

  const selOpts = features.map((feature, i) => {
    let displayName = feature.layer.id;
    if(displayName === 'OrigOwner') {
      displayName = 'Ownerships';
    }
    if(displayName === 'Listings') {
      displayName = 'Listings ('+feature.id+')'
    }
    return {
        key : feature.layer.id,
        value : i,
        text : feature.layer.id === 'OrigOwner' ? 'Ownerships' : feature.layer.id ===  "modified_Listings" ? "Listings" : feature.layer.id ===  "modified_RecentSales" ? "Recent Sales" : feature.layer.id ===  "modified_Sales" ? "Sales" : feature.layer.id ===  "modified_Pending" ? "Pending"  : feature.layer.id ===  "modified_Results" ? "Results" : feature.layer.id
    }
  })

  return (
    <div className="popup">
      {
        !hoverPopup &&
        <div>
          <button type="button" className={`popup-icon pin ${pinned ? 'active' : ''}`} onClick={() => pinPopup(popup, features, pinned)}>
            <img src="../img/icons/red/pin-red.svg" style={{filter: pinned? 'brightness(0) invert(1)' : 'invert(0)'}} />
          </button>
          <button type="button" className="popup-icon close" onClick={() => closePopup(popup)}>
              <img src="../img/icons/red/x-red.svg" />
          </button>
        </div>
      }
      {
        features.length === 1 || features[0].layer.id === 'MSPD' || features[0].layer.id === 'HomeSales'
        ?
        features.map((feature, i) => {
          if(i === 0){
            const thisPopupTemplate = getPopupProperties(feature.layer.id, feature.properties)
            return (
              <div key={i}>
                {getSingleDisplay(feature, thisPopupTemplate, pinned, findPropertyAndOpenIt, highlightFeature)}
              </div>
            )

          }
        })
        :
        <div className="parent-popup" style={{display: 'flex', flexDirection: 'column' }}>
          <Dropdown
            defaultValue={selOpts[0].value}
            onChange={(e, opts) => changeOpenTable(e, opts.value)}
            options={selOpts}
            icon="chevron down"
            style={{marginBottom: '10px'}}
          />

          <div className="popup-tables" id="popup-tables">
            {features.map((feature, i) => {
                const thisPopupTemplate = getPopupProperties(feature.layer.id, feature.properties)
                return (
                  <div className={`table-display ${i === 0 ? 'table-open' : ''}`} key={i}>
                    {getSingleDisplay(feature, thisPopupTemplate, pinned, findPropertyAndOpenIt, highlightFeature, false)}
                  </div>
                )
            })}
          </div>
        </div>
      }
    </div>
  )
}

export const getActiveLayers = (map, event_type) => {
  var layerToFilter = clickPopupLayers;
  if(event_type === 'hover') {
    layerToFilter = hoverPopupLayers;
  }
  const activeLayers = layerToFilter.filter(layer => map.getLayer(layer));

  if(event_type !== 'hover') {
    //queries active layers for ownerships
    const ownerShipKeys = Object.keys(ownershipSources);
    ownerShipKeys.forEach(layerKey => {
      ownershipSources[layerKey].forEach(layer =>{
          const mapLayer = map.getLayer(layer)
          if(mapLayer){
            activeLayers.push(layer)
          }
        })
    })
     //queries active layers for parcels
     const parcelKeys = Object.keys(parcelSources);
      parcelKeys.forEach(layerKey => {
        parcelSources[layerKey].forEach(layer =>{
         const mapLayer = map.getLayer(layer)
         if(mapLayer){
           activeLayers.push(layer)
         }
      })
   })

  }
 return activeLayers
}
