import { featuresToGet, pricesCast } from "./constants";
import GeoJSON from "ol/format/GeoJSON"
import WKT from "ol/format/WKT"

export const buildQueryString = (county, inputStatus, inputAcresMin, inputAcresMax, inputPriceMin, inputPriceMax, inputPPAMin, inputPPAMax, inputRating, inputCreekWF, inputLakeWF, inputRiverWF, inputNoneWF, inputPPAUsableMin, inputPPAUsableMax, inputSources, inputMaxDistance, inputDistanceCity, inputDays, inputNew, polygon) => {
    var qString = 'SELECT ' + featuresToGet.join(', ');

    pricesCast.forEach(function(toReplace){
        qString=qString.replace(toReplace, 'cast(' + toReplace + ' as numeric)');
    });

    qString += ' FROM market_data.properties' + process.env.REACT_APP_TABLE_SUFFIX  + ' WHERE acres > 0 and matched = 1';

    if(inputStatus){
        var statusReplace ={'Listings':1,'Pendings':-2,'Sales':0}
        qString = qString + ' and status = ' + statusReplace[inputStatus];
    }

    if(county.length>0)
    {
        qString = qString + ' and \'' + county + '\' like CONCAT(\'%\', county, \'%\')';
    }

    if(inputAcresMin){
        qString = qString + ' and acres >= ' + inputAcresMin;
    }

    if(inputAcresMax){
        qString = qString + ' and acres <= ' + inputAcresMax;
    }
    if(inputPriceMin){
        qString = qString + ' and price >= ' + inputPriceMin;
    }
    if(inputPriceMax){
        qString = qString + ' and price <= ' + inputPriceMax;
    }
    if(inputPPAMin){
        qString = qString + ' and price/acres >= ' + inputPPAMin;
    }
    if(inputPPAMax){
        qString = qString + ' and price/acres <= ' + inputPPAMax;
    }
    if(inputRating && inputRating > 0){
        qString = qString + ' and utility > ' + inputRating;
    }
    if(inputCreekWF){
        qString = qString + ' and creek > 0';
    }
    if(inputLakeWF){
        qString = qString + ' and lake > 0';
    }
    if(inputRiverWF){
        qString = qString + ' and river > 0';
    }
    if(inputNoneWF){
        qString = qString + ' and creek + lake + river = 0';
    }
    if(inputPPAUsableMin){
        qString = qString + ' and price/net_acres >= ' + inputPPAUsableMin;
    }
    if(inputPPAUsableMax){
        qString = qString + ' and price/net_acres <= ' + inputPPAUsableMax;
    }
    if(inputSources){
        qString = qString + ' and source in ('+inputSources.map(function(e){return '\''+e+'\''}).toString()+')'
    }
    if(inputMaxDistance && inputDistanceCity){
        let cityDistances = {
          'Austin':'POINT (-97.733330 30.266666)',
          'San Antonio':'POINT (-98.491142 29.424349)',
          'Houston':'POINT (-95.358421 29.749907)',
          'Dallas':'POINT (-96.808891 32.779167)',
          'Fort Worth':'POINT (-97.309341 32.768799)',
        }
        for (const [city, geom] of Object.entries(cityDistances)){
            if(inputDistanceCity.includes(city)){ qString = qString + ` and ST_DISTANCE(ST_GEOGFROMTEXT(\"${geom}\"), ST_GEOGPOINT(long_centroid, lat_centroid))  <= ` + inputMaxDistance*1609;}
        }
    }
    if(inputDays){
        qString = qString + ' and days >= ' + inputDays;
    }
    if(inputNew){
        var daysReplace = {'Day':1, 'Week':7};
        qString = qString + ' and days >=0 and days <= ' + daysReplace[inputNew];
    }
    if(polygon){
        qString = qString + ' and ST_INTERSECTS(SAFE.ST_GEOGFROMTEXT(geometry), ST_GEOGFROMGEOJSON(\'' + JSON.stringify(polygon.geometry) + '\', make_valid => true))';
    }

    qString += ' order by utility desc limit 150;';

    return qString
}

export const getBigQueryRequest = (query) => {
	const gapi = window.gapi;
    const request = gapi.client.bigquery.jobs.query({
		'projectId': process.env.REACT_APP_GOOGLE_PROJECT_ID,
		'timeoutMs': '30000',
		'useLegacySql': false,
		'query': query
	});
    return request
}

export const getSourceTable = (source) => {
    if(source ==='R'){
      return 'Realtor';
    }
    else if(source ==='PCC'){
      return 'PCC';
    }
    else if(source ==='Crexi'){
      return 'Crexi';
    }
    else if(source ==='custom'){
      return 'custom';
    }
    else {
      return 'RML';
    } //EDS
}

export const jsonTowkt = (geom_json) => {
  var geojson_format = new GeoJSON();
  var geom = geojson_format.readGeometry(geom_json);
  var wkt_format = new WKT();
  return wkt_format.writeGeometry(geom)
}

export const wktToJson = (geom_wkt) => {
  var wkt_format = new WKT();
  var geom = wkt_format.readGeometry(geom_wkt);
  var geojson_format = new GeoJSON();
  return geojson_format.writeGeometry(geom)
}

export function numberFormatFromOld(n, price) {
    if(!n){
        return 'N/A'
    }
    var parts = n.toString().split(".");
    if(price) {
        return '$' + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
