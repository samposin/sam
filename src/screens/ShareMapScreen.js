import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { getMapInfo, setAdditionalLayers, setBaseMaps, setLayers } from '../actions/actions_share_map';
import LeftSideBarShareMap from '../components/ShareMap/LeftSideBarShareMap';
import ShareMap from '../components/ShareMap/ShareMap';

function ShareMapScreen({ dispatch, share_map_info }) {
  const [mainLayers, setMainLayers] = useState([]);
  const [mainLayersData, setMainLayersData] = useState({});

  useEffect(()=>{
    //get map info
    const queryString = new window.URLSearchParams(window.location.search)
    let mapName = queryString.get('name')
    mapName = mapName.replaceAll('_',' ')
    dispatch(getMapInfo(mapName))

  }, [])

  useEffect(() => {
    if(share_map_info){
      formatLayers()
    }
  }, [share_map_info]);

  const statusToLayer = {'-2':'Pending', '0':'Sales', '1':'Listings'}
  const fullParcelDict = {
  	'Parcels-HighPlains': ['tx_donley', 'tx_dickens', 'tx_garza', 'tx_cochran', 'tx_hansford', 'tx_crosby', 'tx_moore', 'tx_roberts', 'tx_dallam', 'tx_lamb', 'tx_lubbock', 'tx_potter', 'tx_motley', 'tx_floyd', 'tx_hale', 'tx_yoakum', 'tx_castro', 'tx_carson', 'tx_parmer', 'tx_king', 'tx_bailey', 'tx_hall', 'tx_wheeler', 'tx_collingsworth', 'tx_sherman', 'tx_lynn', 'tx_armstrong', 'tx_childress', 'tx_deaf-smith', 'tx_hartley', 'tx_briscoe', 'tx_lipscomb', 'tx_oldham', 'tx_randall', 'tx_swisher', 'tx_gray', 'tx_hockley', 'tx_hutchinson', 'tx_terry', 'tx_hemphill', 'tx_ochiltree', 'tx_cochran_less', 'tx_roberts_less', 'tx_floyd_less', 'tx_collingsworth_less', 'tx_dickens_less', 'tx_parmer_less', 'tx_childress_less', 'tx_moore_less', 'tx_swisher_less', 'tx_carson_less', 'tx_motley_less', 'tx_lamb_less', 'tx_crosby_less', 'tx_yoakum_less', 'tx_hall_less', 'tx_hartley_less', 'tx_hutchinson_less', 'tx_hockley_less', 'tx_terry_less', 'tx_lubbock_less', 'tx_randall_less', 'tx_hale_less', 'tx_wheeler_less', 'tx_king_less', 'tx_donley_less', 'tx_briscoe_less', 'tx_gray_less', 'tx_dallam_less', 'tx_hemphill_less', 'tx_oldham_less', 'tx_ochiltree_less', 'tx_garza_less', 'tx_armstrong_less', 'tx_lipscomb_less', 'tx_bailey_less', 'tx_lynn_less', 'tx_deaf-smith_less', 'tx_sherman_less', 'tx_potter_less', 'tx_hansford_less', 'tx_castro_less'],
  	'Parcels-Northwest': ['tx_fisher', 'tx_scurry', 'tx_taylor', 'tx_throckmorton', 'tx_archer', 'tx_shackelford', 'tx_brown', 'tx_wilbarger', 'tx_knox', 'tx_foard', 'tx_stephens', 'tx_runnels', 'tx_wichita', 'tx_callahan', 'tx_cottle', 'tx_kent', 'tx_haskell', 'tx_jones', 'tx_mitchell', 'tx_coleman', 'tx_baylor', 'tx_montague', 'tx_eastland', 'tx_stonewall', 'tx_hardeman', 'tx_jack', 'tx_comanche', 'tx_nolan', 'tx_young', 'tx_clay', 'tx_wichita_less', 'tx_stonewall_less', 'tx_taylor_less', 'tx_knox_less', 'tx_callahan_less', 'tx_wilbarger_less', 'tx_shackelford_less', 'tx_throckmorton_less', 'tx_jack_less', 'tx_hardeman_less', 'tx_fisher_less', 'tx_clay_less', 'tx_coleman_less', 'tx_jones_less', 'tx_foard_less', 'tx_cottle_less', 'tx_archer_less', 'tx_young_less', 'tx_comanche_less', 'tx_baylor_less', 'tx_kent_less', 'tx_eastland_less', 'tx_scurry_less', 'tx_montague_less', 'tx_nolan_less', 'tx_stephens_less', 'tx_haskell_less', 'tx_mitchell_less', 'tx_brown_less', 'tx_runnels_less'],
  	'Parcels-Metroplex': ['tx_fannin', 'tx_kaufman', 'tx_navarro', 'tx_hood', 'tx_wise', 'tx_somervell', 'tx_parker', 'tx_cooke', 'tx_tarrant', 'tx_rockwall', 'tx_denton', 'tx_palo-pinto', 'tx_hunt', 'tx_collin', 'tx_grayson', 'tx_erath', 'tx_ellis', 'tx_johnson', 'tx_dallas', 'tx_wise_less', 'tx_dallas_less', 'tx_fannin_less', 'tx_parker_less', 'tx_erath_less', 'tx_cooke_less', 'tx_palo-pinto_less', 'tx_navarro_less', 'tx_grayson_less', 'tx_ellis_less', 'tx_hunt_less', 'tx_johnson_less', 'tx_somervell_less', 'tx_denton_less', 'tx_kaufman_less', 'tx_rockwall_less', 'tx_collin_less', 'tx_hood_less', 'tx_tarrant_less'],
  	'Parcels-UpperEast': ['tx_rusk', 'tx_titus', 'tx_cass', 'tx_harrison', 'tx_smith', 'tx_red-river', 'tx_wood', 'tx_delta', 'tx_rains', 'tx_camp', 'tx_lamar', 'tx_anderson', 'tx_upshur', 'tx_bowie', 'tx_henderson', 'tx_marion', 'tx_hopkins', 'tx_gregg', 'tx_franklin', 'tx_morris', 'tx_van-zandt', 'tx_panola', 'tx_cherokee', 'tx_marion_less', 'tx_franklin_less', 'tx_morris_less', 'tx_gregg_less', 'tx_rains_less', 'tx_hopkins_less', 'tx_titus_less', 'tx_henderson_less', 'tx_smith_less', 'tx_wood_less', 'tx_panola_less', 'tx_rusk_less', 'tx_lamar_less', 'tx_van-zandt_less', 'tx_harrison_less', 'tx_delta_less', 'tx_red-river_less', 'tx_cass_less', 'tx_bowie_less', 'tx_camp_less', 'tx_anderson_less', 'tx_cherokee_less', 'tx_upshur_less'],
  	'Parcels-SouthEast': ['tx_orange', 'tx_trinity', 'tx_san-jacinto', 'tx_jasper', 'tx_tyler', 'tx_angelina', 'tx_hardin', 'tx_newton', 'tx_sabine', 'tx_shelby', 'tx_polk', 'tx_houston', 'tx_san-augustine', 'tx_nacogdoches', 'tx_jefferson', 'tx_san-jacinto_less', 'tx_shelby_less', 'tx_angelina_less', 'tx_houston_less', 'tx_jefferson_less', 'tx_polk_less', 'tx_newton_less', 'tx_san-augustine_less', 'tx_hardin_less', 'tx_sabine_less', 'tx_nacogdoches_less', 'tx_tyler_less', 'tx_orange_less', 'tx_trinity_less', 'tx_jasper_less'],
  	'Parcels-GulfCoast': ['tx_galveston', 'tx_harris', 'tx_matagorda', 'tx_austin', 'tx_waller', 'tx_chambers', 'tx_montgomery', 'tx_colorado', 'tx_wharton', 'tx_walker', 'tx_brazoria', 'tx_liberty', 'tx_fort-bend', 'tx_matagorda_less', 'tx_colorado_less', 'tx_walker_less', 'tx_fort-bend_less', 'tx_galveston_less', 'tx_waller_less', 'tx_liberty_less', 'tx_austin_less', 'tx_brazoria_less', 'tx_wharton_less', 'tx_chambers_less', 'tx_harris_less', 'tx_montgomery_less'],
  	'Parcels-Central': ['tx_llano', 'tx_lampasas', 'tx_hamilton', 'tx_washington', 'tx_grimes', 'tx_robertson', 'tx_freestone', 'tx_coryell', 'tx_travis', 'tx_hill', 'tx_burleson', 'tx_caldwell', 'tx_bosque', 'tx_lee', 'tx_san-saba', 'tx_mills', 'tx_hays', 'tx_limestone', 'tx_falls', 'tx_fayette', 'tx_bastrop', 'tx_mclennan', 'tx_leon', 'tx_madison', 'tx_blanco', 'tx_bell', 'tx_milam', 'tx_williamson', 'tx_burnet', 'tx_brazos', 'tx_williamson_less', 'tx_fayette_less', 'tx_travis_less', 'tx_mills_less', 'tx_lee_less', 'tx_falls_less', 'tx_bell_less', 'tx_limestone_less', 'tx_freestone_less', 'tx_bastrop_less', 'tx_lampasas_less', 'tx_coryell_less', 'tx_bosque_less', 'tx_san-saba_less', 'tx_burnet_less', 'tx_milam_less', 'tx_brazos_less', 'tx_caldwell_less', 'tx_hays_less', 'tx_robertson_less', 'tx_blanco_less', 'tx_hamilton_less', 'tx_mclennan_less', 'tx_hill_less', 'tx_madison_less', 'tx_leon_less', 'tx_washington_less', 'tx_burleson_less', 'tx_llano_less', 'tx_grimes_less', 'tx_llano_merged', 'tx_lampasas_merged', 'tx_hamilton_merged', 'tx_washington_merged', 'tx_grimes_merged', 'tx_robertson_merged', 'tx_freestone_merged', 'tx_coryell_merged', 'tx_travis_merged', 'tx_hill_merged', 'tx_burleson_merged', 'tx_caldwell_merged', 'tx_bosque_merged', 'tx_lee_merged', 'tx_san-saba_merged', 'tx_mills_merged', 'tx_hays_merged', 'tx_limestone_merged', 'tx_falls_merged', 'tx_fayette_merged', 'tx_bastrop_merged', 'tx_mclennan_merged', 'tx_leon_merged', 'tx_madison_merged', 'tx_blanco_merged', 'tx_bell_merged', 'tx_milam_merged', 'tx_williamson_merged', 'tx_burnet_merged', 'tx_brazos_merged'],
  	'Parcels-Alamo': ['tx_gonzales', 'tx_la-salle', 'tx_kinney', 'tx_lavaca', 'tx_bandera', 'tx_calhoun', 'tx_zavala', 'tx_guadalupe', 'tx_dimmit', 'tx_atascosa', 'tx_val-verde', 'tx_gillespie', 'tx_real', 'tx_edwards', 'tx_wilson', 'tx_maverick', 'tx_goliad', 'tx_bexar', 'tx_karnes', 'tx_dewitt', 'tx_jackson', 'tx_uvalde', 'tx_frio', 'tx_kendall', 'tx_comal', 'tx_victoria', 'tx_kerr', 'tx_medina', 'tx_gillespie_less', 'tx_kendall_less', 'tx_maverick_less', 'tx_bandera_less', 'tx_wilson_less', 'tx_calhoun_less', 'tx_karnes_less', 'tx_jackson_less', 'tx_lavaca_less', 'tx_victoria_less', 'tx_kinney_less', 'tx_atascosa_less', 'tx_medina_less', 'tx_real_less', 'tx_la-salle_less', 'tx_zavala_less', 'tx_val-verde_less', 'tx_frio_less', 'tx_dimmit_less', 'tx_goliad_less', 'tx_edwards_less', 'tx_uvalde_less', 'tx_comal_less', 'tx_dewitt_less', 'tx_guadalupe_less', 'tx_kerr_less', 'tx_gonzales_less', 'tx_bexar_less'],
  	'Parcels-West': ['tx_gaines', 'tx_irion', 'tx_upton', 'tx_winkler', 'tx_howard', 'tx_martin', 'tx_dawson', 'tx_mcculloch', 'tx_coke', 'tx_crane', 'tx_schleicher', 'tx_sterling', 'tx_loving', 'tx_reagan', 'tx_mason', 'tx_ector', 'tx_tom-green', 'tx_crockett', 'tx_reeves', 'tx_kimble', 'tx_pecos', 'tx_borden', 'tx_andrews', 'tx_menard', 'tx_midland', 'tx_terrell', 'tx_glasscock', 'tx_ward', 'tx_sutton', 'tx_concho', 'tx_reagan_less', 'tx_terrell_less', 'tx_glasscock_less', 'tx_loving_less', 'tx_kimble_less', 'tx_andrews_less', 'tx_reeves_less', 'tx_howard_less', 'tx_dawson_less', 'tx_mcculloch_less', 'tx_winkler_less', 'tx_ector_less', 'tx_borden_less', 'tx_sterling_less', 'tx_tom-green_less', 'tx_upton_less', 'tx_schleicher_less', 'tx_crane_less', 'tx_pecos_less', 'tx_ward_less', 'tx_midland_less', 'tx_crockett_less', 'tx_martin_less', 'tx_menard_less', 'tx_sutton_less', 'tx_gaines_less', 'tx_concho_less', 'tx_irion_less', 'tx_mason_less', 'tx_coke_less'],
  	'Parcels-RioGrande': ['tx_brewster', 'tx_presidio', 'tx_el-paso', 'tx_hudspeth', 'tx_culberson', 'tx_jeff-davis', 'tx_jeff-davis_less', 'tx_culberson_less', 'tx_brewster_less', 'tx_hudspeth_less', 'tx_el-paso_less', 'tx_presidio_less'],
  	'Parcels-South': ['tx_duval', 'tx_kenedy', 'tx_bee', 'tx_refugio', 'tx_mcmullen', 'tx_webb', 'tx_jim-hogg', 'tx_willacy', 'tx_live-oak', 'tx_brooks', 'tx_nueces', 'tx_zapata', 'tx_san-patricio', 'tx_kleberg', 'tx_starr', 'tx_jim-wells', 'tx_aransas', 'tx_cameron', 'tx_hidalgo', 'tx_jim-hogg_less', 'tx_bee_less', 'tx_kleberg_less', 'tx_aransas_less', 'tx_refugio_less', 'tx_willacy_less', 'tx_kenedy_less', 'tx_webb_less', 'tx_brooks_less', 'tx_starr_less', 'tx_live-oak_less', 'tx_hidalgo_less', 'tx_mcmullen_less', 'tx_san-patricio_less', 'tx_duval_less', 'tx_nueces_less', 'tx_cameron_less', 'tx_jim-wells_less', 'tx_zapata_less']
  }
  const sourceToTriggers = {
    'properties':['Sales', 'Pending', 'Listings'],
    'projects_merge':['PerformingProjects', 'Projects'],
    'govt':['Government'],
    'ownerships_merge':['OrigOwner'],
    'PCC_inactive':['PCC_inactive']
  }
  for (const region in fullParcelDict){
    fullParcelDict[region].forEach(function(county){
      if (!(county in sourceToTriggers)){
        sourceToTriggers[county] = [region]
        sourceToTriggers[county + '_ownerships'] = [region.replace('Parcels', 'Ownerships')]
      }
    });
  }

  const formatLayers = ()=>{
    const mapInfoClone = JSON.parse(JSON.stringify(share_map_info))
    if(!('properties' in mapInfoClone.highlightLayers)){
      mapInfoClone.highlightLayers['properties'] = [];
    }

    let layerOrder=[];
    let counties=[];
    let parcelDict={}
    let layerIDs = {}
    for (const layer in mapInfoClone.highlightLayers){
      if (mapInfoClone.highlightLayers[layer]){

        let layerTriggersToAdd = []

        if(layer === "properties"){

          mapInfoClone.marketData.forEach((property) => {
            const propertyStatus = parseInt(property.status).toString()
            if(statusToLayer[propertyStatus] && !(layerTriggersToAdd.includes(statusToLayer[propertyStatus]))){
              layerTriggersToAdd.push(statusToLayer[propertyStatus])
            }
          })

        } else if(sourceToTriggers[layer]) {
          // layerTriggersToAdd.push(layer)
          layerTriggersToAdd = sourceToTriggers[layer]
        }
        layerTriggersToAdd.forEach(layerTrigger => {
          if(!layerOrder.includes(layerTrigger)){
            if(layer === "properties"){
              const listing = mapInfoClone.marketData.map(e => parseInt(e.status) === 1 ? e.ID.toString() : null)
              const pending = mapInfoClone.marketData.map(e => parseInt(e.status) === -2? e.ID.toString(): null)
              const sales = mapInfoClone.marketData.map(e =>  parseInt(e.status) === 0? e.ID.toString() : null)
              layerIDs['Pending'] = pending
              layerIDs['Listings'] = listing
              layerIDs['Sales'] = sales
            }
            else {
              layerIDs[layerTrigger] = mapInfoClone.highlightLayers[layer].toString().split(',')
            }
            if(layerIDs[layerTrigger] && layerIDs[layerTrigger].length !== 0){
              layerOrder.unshift(layerTrigger)
            }
          }
        })
      }

      if (layer.includes('tx_') && mapInfoClone.highlightLayers[layer]){

        if(!(counties.includes(layer))){
          counties.push(layer)
        }

        let parcelTrigger = sourceToTriggers[layer]

        if (!(parcelTrigger in parcelDict)){
          parcelDict[parcelTrigger] = []
        }
        if (!(parcelDict[parcelTrigger].includes(layer))){

          parcelDict[parcelTrigger].push(layer)

        }
      }
    }
    const formattedLayers = []
    layerOrder.forEach(layer =>{
      formattedLayers.push({data: parcelDict[layer], name: layer, checked: true, showIds: layerIDs})
    })
    const formattedAdditionalLayers = []
    share_map_info.otherLayers.forEach(layer => {
      formattedAdditionalLayers.push({name:layer, checked: false})
    })
    const baseMaps = [] 
    share_map_info.baseMaps.forEach((layer, i) => {
      baseMaps.push({name:layer, checked: i === 0 ? true : false})
    })
    dispatch(setAdditionalLayers(formattedAdditionalLayers))
    dispatch(setLayers(formattedLayers))
    dispatch(setBaseMaps(baseMaps))
  }

  return (
    <>
      <LeftSideBarShareMap />
      <ShareMap/>
    </>
  );
}


const mapStateToProps = (state) => ({
  share_map_info: state.shareMap.share_map_info
});

export default connect(mapStateToProps)(ShareMapScreen);
