import React, { useState } from 'react'
import { connect } from 'react-redux'
import {Card} from 'semantic-ui-react'
import { allLayers } from '../../utils/shared_constants'
import ChangeBasemap from './ChangeBasemap'
import VisualizationCheckBoxes from './VisualizationCheckBoxes'

function Visualizations({layers}){
    const [activeIndex, setActiveIndex] = useState([])

    const handleClick = (index) => {
       if(activeIndex.includes(index)){
           const newIndexes = JSON.parse(JSON.stringify(activeIndex))
           const indexes = newIndexes.indexOf(index)
           newIndexes.splice(indexes, 1)
           setActiveIndex(newIndexes)
        }
        else {
           setActiveIndex([...activeIndex, index])
       }
    }

    return(
        <>
          <div className='menu-section visualizations'>

            <p className="menu-section-title">Visualizations</p>
            {allLayers.map((layer, index) => (
                <VisualizationCheckBoxes key={index} index={index} handleClick={handleClick} activeIndex={activeIndex} currentLayer={layer}/>
            ))}

            <ChangeBasemap layer={layers} activeIndex={activeIndex} handleClick={handleClick}/>

          </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    layers: state.layers.layers
});

export default connect(mapStateToProps)(Visualizations);
