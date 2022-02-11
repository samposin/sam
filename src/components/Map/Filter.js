import React, { useState } from 'react'
import { connect } from 'react-redux'
import Slider, { SliderTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { setAdjustableFilters } from '../../actions/actions_layers';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

const filters = [
  {
    layerID : 'LandCover',
    label : "Developed Land",
    sliderType: 'slider',
    formatData: (value) => value,
    slider : {
      min : 2004,
      max : 2019,
      default : 2019,
      tipFormat : (value) => value,
      marks: {2004: <></>, 2006: <></>, 2008: <></>, 2011: <></>, 2013: <></>, 2016: <></>, 2019: <></>},
    }
  },
  {
    layerID : 'LandCoverChange',
    label : "Developed Land Change",
    sliderType: 'range',
    formatData: (value) => value,
    slider : {
      min : 2004,
      max : 2019,
      default : [2016, 2019],
      tipFormat : (value) => value,
      marks: {2004: <></>, 2006: <></>, 2008: <></>, 2011: <></>, 2013: <></>, 2016: <></>, 2019: <></>},
    }
  },

  {
    layerID : 'MSPD',
    label : "MetroStudy Point Data",
    sliderType: 'slider',
    formatData: (value) => {

      var numToMonth = { 0 : '01', 0.25 : '04', 0.5 : '07', 0.75 : 10}
      const date = parseInt(value) + '-' + numToMonth[(value - Math.floor(value))]
      return date
    },
    slider : {
      min : 2000,
      max : 2021.75,
      startPoint : 2000,
      default : 2021.75,
      singleValue : false,
      tipFormat : (value) => {
        var numToMonth = { 0 : 'Jan.', 0.25 : 'Apr.', 0.5 : 'Jul.', 0.75 : 'Oct.'}
        if(value === 2021.75) { return 'Future' }
        return numToMonth[(value - Math.floor(value))] + ' ' + Math.floor(value);
      },
      step : 0.25
    }
  },
  {
    layerID : 'RecentSales',
    label : "Recent Sales",
    sliderType: 'slider',
    formatData: (value) => {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      today = value + '-' + mm + '-' + dd;
      return today
    },
    slider : {
      min : 2011,
      max : 2021,
      startPoint : 2021,
      singleValue : false,
      tipFormat : (value) => value,
      default : 2019,
      step : 1
    }
  },
  {
    layerID : 'PPAIndex',
    label : "PPA Index",
    sliderType: 'slider',
    slider : {
      min : 2011,
      max : 2021,
      singleValue : true,
      tipFormat : (value) => value,
      default : 2021,
      step : 1
    }
  },
  {
    layerID : 'HexMigrationInflow',
    label : "Hex Migration Inflow",
    sliderType: 'range',
    formatData: (value) => value,
    slider : {
      hasInputs : true,
      min : 0,
      max : 100,
      tipFormat : (value) => value,
      default : [75, 100],
      step : 1
    }
  },
  {
    layerID : 'Ownerships',
    label : "Ownerships",
    sliderType: 'range',
    formatData: (value)=>{
      var mapNum = { 1: 10, 2: 25, 3:50, 4:100, 5: 175, 6:250, 7: 500, 8:1000, 9:5000, 10:10000, 11: 999999999,}
      return [mapNum[value[0]], mapNum[value[1]]]
    },
    slider : {
      min : 1,
      max : 11,
      tipFormat : (value) => {
        var mapNum = { 1: 10, 2: 25, 3:50, 4:100, 5: 175, 6:250, 7: 500, 8:1000, 9:5000, 10:10000, 11: 'Max',}
        return  mapNum[value]

      },
      default : [4, 11],
      // marks: {10: <></>, 25: <></>, 50: <></>, 100: <></>, 175: <></>, 250: <></>, 500: <></>, 1000: <></>, 5000: <></>, 10000: <></>, 10500: <></>},
      step: 1
    }
  }
]

function Filter({layers, adjustable_filters, dispatch }) {

  const [displayValue, setDisplayValue] = useState(null)

  var activeFilters = filters.filter(thisFilter => {
    let isIncluded = false;
    layers.forEach(layer => {
      if(layer === thisFilter.layerID){
        isIncluded = true;
      }
    })
    return isIncluded;
  });

  if(activeFilters.length === 0) {
    return false;
  }

  const setFilters = (e, layerID)=>{
    let formattedData = e
    let doesntContainFilter = true;
    const singleFilter = filters.filter(data => data.layerID === layerID)[0]
    if(singleFilter.formatData){
      formattedData = singleFilter.formatData(e)
    }
    const newFilterDataArray = []

    if(adjustable_filters && adjustable_filters.length > 0){
      const adjustableFiltersClone = JSON.parse(JSON.stringify(adjustable_filters))
      adjustableFiltersClone.forEach(filterData => {
        if(filterData.layerID === layerID){
          //update value
          newFilterDataArray.push({layerID: layerID, sliderValue: formattedData, sliderValueRaw: e})
        }
        else {
          //preserve value
          newFilterDataArray.push(filterData)
        }
      });
    }
    dispatch(setAdjustableFilters(newFilterDataArray))
  }

  const getDefaultValue = (layerID, defaultValue, type)=>{
    let valueToReturn = defaultValue
    if(adjustable_filters){
      adjustable_filters.forEach(filter =>{
        if(filter.layerID === layerID && filter.sliderValueRaw){
          valueToReturn = filter.sliderValueRaw
        }
      })
    }
    if(layerID === "HexMigrationInflow" && displayValue){
      valueToReturn = displayValue
    }
    return valueToReturn
  }

  const handle = props => {
    const { value, dragging, index, tipFormat,formatValue, ...restProps } = props;
    return (
      <SliderTooltip
        prefixCls="rc-slider-tooltip"
        overlay={`${tipFormat(value)}`}
        visible={true}
        placement="left"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </SliderTooltip>
    );
  };

  const handleChange = (e, layer) => {
    setFilters(e, layer)
    if(layer === 'HexMigrationInflow'){
      setDisplayValue(e)
    }
  }

  return (
      <>
        <div className='map-filter'>
          {activeFilters.map((thisFilter, index) => {
            return (
              <div key={index} className="single-slider">
                 <h4>{thisFilter.label}</h4>
                 <div className="legend-content">
                     {thisFilter.sliderType === "range" ?
                       <div>
                         {thisFilter.slider.hasInputs ?
                           <div className="slider-inputs">
                            <input type="text" onChange={(e) => handleChange([e.target.value, displayValue ? displayValue[1] : ''], thisFilter.layerID)} value={displayValue ? displayValue[0] : getDefaultValue(thisFilter.layerID, thisFilter.slider.default)[0]}  />
                            <input type="text" onChange={(e) => handleChange([displayValue? displayValue[0] : '', e.target.value], thisFilter.layerID)} value={displayValue ? displayValue[1] : getDefaultValue(thisFilter.layerID, thisFilter.slider.default)[1]} />
                           </div>
                         : false}
                         <Range
                            min={thisFilter.slider.min}
                            max={thisFilter.slider.max}
                            value={getDefaultValue(thisFilter.layerID, thisFilter.slider.default)}
                            onChange={(e)=> handleChange(e, thisFilter.layerID)}
                            marks={thisFilter.slider.marks ? thisFilter.slider.marks : false}
                            step={thisFilter.slider.step ? thisFilter.slider.step : null}
                            tipFormatter={thisFilter.slider.tipFormat}
                            defaultValue={getDefaultValue(thisFilter.layerID, thisFilter.slider.default)}
                        />
                       </div>
                      : false}
                   {thisFilter.sliderType === "slider" ?
                      <Slider
                        onChange={(e)=> handleChange(e, thisFilter.layerID)}
                        min={thisFilter.slider.min}
                        max={thisFilter.slider.max}
                        included={!thisFilter.slider.singleValue}
                        startPoint={thisFilter.slider.startPoint}
                        marks={thisFilter.slider.marks ? thisFilter.slider.marks : false}
                        step={thisFilter.slider.step ? thisFilter.slider.step : null}
                        handle={(props) => handle({ ...props, tipFormat : thisFilter.slider.tipFormat })}
                        defaultValue={getDefaultValue(thisFilter.layerID, thisFilter.slider.default)}

                      />
                    : false}
                     <div className="label-row">
                      <div className="start-label">
                        {thisFilter.slider.tipFormat(thisFilter.slider.min)}
                      </div>
                      <div className="end-label">
                        {thisFilter.slider.tipFormat(thisFilter.slider.max)}
                      </div>
                     </div>
                  </div>
              </div>
            )
          })}
        </div>
      </>
  )

}

const mapStateToProps = (state) => ({
    layers: state.layers.layers,
    adjustable_filters: state.layers.adjustable_filters
});

export default connect(mapStateToProps)(Filter);
