import React from 'react'
import { connect } from 'react-redux'

const legends = [{
  layerID : "PerformingProjects",
  steps : [{
    label : '72-99',
    color : '#fff90f'
  },{
    label : '100-249',
    color : '#ff830f'
  },{
    label : '250+',
    color : '#FF0F0F'
  }]
},{
  layerID : "HomeSales",
  steps : [{
    label : '$100k - $200k',
    color : '#0e59fb'
  },{
    label : '$200k - $300k',
    color : '#A2C362'
  },{
    label : '$300k - $400k',
    color : '#edfd12'
  },{
    label : '$400k - $500k',
    color : '#E5903C'
  },{
    label : '$500k+',
    color : '#FA2929'
  }]
},{
  layerID : "Projects",
  steps : [{
    label : 'Active',
    color : '#1B1F24'
  },{
    label : 'Future',
    color : '#B4B8BE'
  }]
}]

const hex2rgba = (hex, alpha = 1) => {
  if (alpha > 1 || alpha < 0) {
    throw new Error('alpha is not correct!');
  }

  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

function Legend({ layers }) {

  var activeLegends = legends.filter(legend => layers.indexOf(legend.layerID) > -1);

  if(activeLegends.length === 0) {
    return false;
  }

  return (
      <>
        <div className='map-legend'>
          {activeLegends.map((legend, index) => {
            return (
              <div key={index} className="legend-container">
                <h4>{legend.layerID}</h4>
                <div className="legend-content">
                  <div className="legend-row">
                    {legend.steps.map((step,i) => {
                      return (
                        <div key={i} className="legend-column" style={{width : (100/legend.steps.length) + '%'}}>
                          <div className="legend-key" style={{backgroundColor : legend.layerID === 'Projects' ? '#f7f7f7' : hex2rgba(step.color, 0.2)}}>{step.label}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="legend-row">
                    {legend.steps.map((step,i) => {
                      return (
                        <div key={i} className="legend-column" style={{width : (100/legend.steps.length) + '%'}}>
                          <div className="legend-color" style={{backgroundColor : step.color}}></div>
                        </div>
                      )
                    })}
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
    layers: state.layers.layers
});

export default connect(mapStateToProps)(Legend);

// <div class="collapse" id="recents-legend">
//   <div id="sliderDateSold" style="margin-top:10rem"></div>
// </div>
//
// var sliderDateSold = document.getElementById("sliderDateSold");
//
// noUiSlider.create(sliderDateSold, {
//   start: 2019,
//   step: 1,
//   tooltips: [wNumb({decimals: 0})],
//   decimals: 0,
//   connect: [false, true],
//   range: {
//     min: 2011,
//     max: 2021,
//   },
//   format: wNumb({
//     decimals: 0,
//   }),
// });
//
// sliderDateSold.noUiSlider.on("update", function (values, handle) {
//   var today = new Date();
//   var dd = String(today.getDate()).padStart(2, '0');
//   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//   var yyyy = values[handle];
//
//   today = yyyy + '-' + mm + '-' + dd;
//   map.setFilter('RecentSales', [">=", ["to-string", ["get", "date_sold"]],["to-string", today]])
//   map.setFilter('RecentSales_outline', [">=", ["to-string", ["get", "date_sold"]],["to-string", today]])
//   map.setFilter('RecentSales_labels', [">=", ["to-string", ["get", "date_sold"]],["to-string", today]])
// });
// sliders.push(sliderDateSold);
//
//
// <div class="collapse" id="mspd-legend">
//   <div id="sliderMSPD" style="margin-top:10rem"></div>
// </div>
//
//   var sliderMSPD = document.getElementById("sliderMSPD");
//
//   noUiSlider.create(sliderMSPD, {
//     start: 2021.75,
//     step: 0.25,
//     tooltips: [{to: function(value){
//       return (value==2021.75? 'Future':numToMonth[(value - Math.floor(value))] + ' ' + Math.floor(value))
//     },
//     from: function(value){
//       return value;
//     }}],
//     decimals: 0,
//     connect: [false, false],
//     range: {
//       min: 2000,
//       max: 2021.75,
//     }
//   });
//
//   sliderMSPD.noUiSlider.on("update", function (values, handle) {
//     var value = values[handle];
//     var date = Math.floor(value) + '-' + ((1+(value - Math.floor(value))*12) < 10 ? '0'+(1+(value - Math.floor(value))*12):(1+(value - Math.floor(value))*12))
//     if (date=="2021-10"){
//       map.setFilter('MSPD', null)
//       map.setPaintProperty('MSPD', 'circle-color', ["case",["match",["get", "Status"],["Future"],true,false],"#ffffff",["match",["get", "act_end_q"],["2021-07-01T00:00:00"],true,false],"#ff2e2e","#878787"])
//     } else {
//       map.setFilter('MSPD', ['all', ['!=', 'Status', 'Future'], ['<', 'act_start_q', date]])
//       map.setPaintProperty('MSPD', 'circle-color', ["case",[">=",["get", "act_end_q"],date+"-01T00:00:00"],"#ff2e2e","#878787"])
//     }
//   });
//   sliders.push(sliderMSPD);
