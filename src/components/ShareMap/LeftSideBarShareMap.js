import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Button, Card, Checkbox, Icon, Image, Loader, Menu, Sidebar } from 'semantic-ui-react';
import { deleteMapQuery } from '../../actions/actions_properties';
import { setAdditionalLayers, setBaseMaps, setLayers } from '../../actions/actions_share_map';
import { shareMapPossibleLayers } from '../../utils/components/Maps/ShareMap/constants';
import ShareMapPropertyCard from './ShareMapPropertyCard';

function LeftSideBarShareMap({ dispatch, share_map_info, layers, additional_layers, base_maps, map_loading }) {
  const [leftSideBarOpen, setLeftSideBarOpen] = useState(true);

  const handleLayerChange = (layer) => {
    const layerName = layer.name
    const checked = !layer.checked
    const layerClone = JSON.parse(JSON.stringify(layers))
    const updatedClone = layerClone.map(layer =>{
      if(layer.name === layerName){
        layer.checked = checked
      }
      return layer
    })
    dispatch(setLayers(updatedClone))
  }
  const handleAdditionalLayerChange = (layer) => {
    const layerName = layer.name
    const checked = !layer.checked
    const additionalLayersClone = JSON.parse(JSON.stringify(additional_layers))
    const updatedClone = additionalLayersClone.map(layer =>{
      if(layer.name === layerName){
        layer.checked = checked
      }
      return layer
    })
    dispatch(setAdditionalLayers(updatedClone))

  }
  const handleBasemapChange = (map) => {
    const layerName = map.name
    const checked = !map.checked
    if(checked){
      const basemapsClone = JSON.parse(JSON.stringify(base_maps))
      const updatedClone = basemapsClone.map(layer =>{
        if(layer.name === layerName){
          layer.checked = true
        }
        else {
          layer.checked = false
        }
        return layer
      })
      dispatch(setBaseMaps(updatedClone))
    }
  }

  return (
      <>
        <div>
            <Sidebar as={Menu} animation='push' icon='labeled' vertical visible={leftSideBarOpen} width='wide' id="sidebar-left">
                <Menu.Item>
                    <Menu.Header style={{ flexDirection: 'column' }}>
                      <div style={{display:"flex", alignItems:'center'}}>
                        <Image size='small' src='../img/logo-peregrine-black.png' />
                        <Loader active={map_loading} inline size="mini"/>
                      </div>
                    <div style={{ color: '#999', margin : 8, fontWeight : 600 }}>
                      {new window.URLSearchParams(window.location.search).get('name').replaceAll('_',' ')}
                    </div>
                    </Menu.Header>
                </Menu.Item>
                {share_map_info? null: <h3 style={{fontSize: 'larger', fontWeight: 700, color: 'darkgray', textAlign: 'center', marginTop: 10}}>Map does not exist</h3>}

                <div style={{'height': '100%', 'overflowY': 'scroll', paddingBottom:'100px'}}>
                {
                  layers.length > 0 ?
                    <>
                      <div className='menu-section visualizations'>
                        <p className="menu-section-title">Highlighted</p>
                          <div className="layer-toggle-container active">
                              {layers.length > 0 ? layers.map((layer, index) => (
                                  <div
                                    key={layer.name}
                                    className={`layer-toggle ${layer.checked ? 'active' : ''}`}
                                    onClick={() => handleLayerChange(layer)}
                                  >
                                    {shareMapPossibleLayers[layer.name]}
                                  </div>
                              )): null}
                          </div>
                      </div>
                    </>: null
                }
                {
                  additional_layers.length > 0 ?
                    <>
                      <div className='menu-section visualizations'>
                        <p className="menu-section-title">Visualizations</p>
                          <div className="layer-toggle-container active">
                            {additional_layers.length > 0 ? additional_layers.map((layer, index) => (
                                  <div
                                    key={layer.name}
                                    className={`layer-toggle ${layer.checked ? 'active' : ''}`}
                                    onClick={() => handleAdditionalLayerChange(layer)}
                                  >
                                    {shareMapPossibleLayers[layer.name]}
                                  </div>
                            )): null}
                          </div>
                        </div>
                    </> : null
                }
                {
                  base_maps.length > 1 ?
                    <>
                      <div className='menu-section visualizations'>
                        <p className="menu-section-title">Basemaps</p>
                          <div className="layer-toggle-container active">
                            {
                              base_maps.length > 1 ? base_maps.map(map => (
                                  <div
                                    key={map.name}
                                    className={`layer-toggle ${map.checked ? 'active' : ''}`}
                                    onClick={() => handleBasemapChange(map)}
                                  >
                                    {map.name}
                                  </div>
                              )): null
                            }
                          </div>
                        </div>
                    </> : null
                }
                {
                  share_map_info ? share_map_info.marketData.map((layer, index) => {
                    return <ShareMapPropertyCard key={index} property={layer}/>
                  }): null
                }
                </div>
                <Button id="button-close" className="left" onClick={() => setLeftSideBarOpen(!leftSideBarOpen)}><Icon name={leftSideBarOpen? 'chevron left' : 'chevron right'} /></Button>
            </Sidebar>
        </div>
      </>
  );
}

const mapStateToProps = (state) => ({
  share_map_info: state.shareMap.share_map_info,
  layers: state.shareMap.layers,
  additional_layers: state.shareMap.additional_layers,
  base_maps: state.shareMap.base_maps,
  map_loading: state.shareMap.map_loading

});

export default connect(mapStateToProps)(LeftSideBarShareMap);

