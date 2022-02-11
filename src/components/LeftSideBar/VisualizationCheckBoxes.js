import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Accordion, Checkbox, Label, Segment, Icon } from "semantic-ui-react";
import { setLayers } from "../../actions/actions_layers";

function VisualizationCheckBoxes({ activeIndex, handleClick, layers, dispatch, currentLayer, current_tool, index }) {
  const [childCheckBoxArray, setChildCheckBoxArray] = useState([]);
  const [parentCheckBoxChecked, setParentCheckBoxChecked] = useState(false);
  const [accordionActive, setAccordionActive] = useState(false);

  useEffect(() => {
    if (parentCheckBoxChecked || activeIndex.includes(index)) {
      setAccordionActive(true);
    } else {
      setAccordionActive(false);
    }
  }, [parentCheckBoxChecked, activeIndex]);

  const handleCheckBox = (e, checkbox) => {
    if (checkbox.checked) {
      dispatch(setLayers([...layers, checkbox.value]));
    } else if (layers.includes(checkbox.value)) {
      const newLayers = JSON.parse(JSON.stringify(layers));
      const index = newLayers.indexOf(checkbox.value);
      newLayers.splice(index, 1);
      dispatch(setLayers(newLayers));
    }
  };

  const ownershipParentCheckToggle = () => {
    if (!parentCheckBoxChecked && childCheckBoxArray.length === 0) {
      setChildCheckBoxArray([...currentLayer.defaultChecked]);
    }
    const mapLayersWithoutChildren = removeLayersFromMap();

    if (!parentCheckBoxChecked) {
      dispatch(setLayers([...mapLayersWithoutChildren, ...childCheckBoxArray]));
    } else {
      dispatch(setLayers([...mapLayersWithoutChildren]));
    }
    setParentCheckBoxChecked(!parentCheckBoxChecked);
  };

  const removeLayersFromMap = () => {
    const mapLayersWithoutChildren = [];
    const layerClone = JSON.parse(JSON.stringify(layers));
    layerClone.forEach((layer) => {
      let dontInclude = false;
      currentLayer.children.forEach((child) => {
        if (layer === child.layerID) {
          dontInclude = true;
        }
      });
      if (!dontInclude) {
        mapLayersWithoutChildren.push(layer);
      }
    });
    return mapLayersWithoutChildren;
  };

  const handleChildrenClick = (layer, parentLayer) => {
    const checked = childCheckBoxArray.includes(layer);
    if (parentLayer === currentLayer.layerID) {
      if (!checked) {
        setChildCheckBoxArray([...childCheckBoxArray, layer]);
        if (!layers.includes(currentLayer.layerID)) {
          dispatch(setLayers([...layers, currentLayer.layerID]));
        }
      } else {
        const newChildrenCheckedArray = JSON.parse(JSON.stringify(childCheckBoxArray));
        const index = newChildrenCheckedArray.indexOf(layer);
        newChildrenCheckedArray.splice(index, 1);
        setChildCheckBoxArray(newChildrenCheckedArray);

        if (newChildrenCheckedArray.length === 0) {
          setParentCheckBoxChecked(false);
          const mapLayersWithoutChildren = removeLayersFromMap();
          dispatch(setLayers([...mapLayersWithoutChildren]));
        }
      }
    }
  };

  useEffect(() => {
    if (layers && childCheckBoxArray.length > 0) {
      //remove all ownerships and add updated array
      setParentCheckBoxChecked(true);
      const mapLayersWithoutChildren = removeLayersFromMap();
      dispatch(setLayers([...mapLayersWithoutChildren, ...childCheckBoxArray]));
    }
  }, [childCheckBoxArray]);

  useEffect(() => {
    if (layers && layers.includes("Results") && !childCheckBoxArray.includes("Results")) {
      //mimic checkbox click for results
      handleChildrenClick("Results", "MarketData");
    }
  }, [layers]);

  useEffect(() => {
    if (current_tool === "Clear") {
      setChildCheckBoxArray([]);
      setParentCheckBoxChecked(false);
    }
  }, [current_tool]);

  return (
    <>
      {!currentLayer.children ? (
        <Checkbox
          onChange={handleCheckBox}
          className="visualization-item"
          label={currentLayer.label}
          key={currentLayer.layerID}
          value={currentLayer.layerID}
          checked={layers.some((e) => e === currentLayer.layerID)}
        />
      ) : (
        <Accordion className={`visualization-item ${accordionActive ? "checked" : ""}`}>
          <Accordion.Title active={activeIndex.includes(index)} index={index}>
            <label onClick={ownershipParentCheckToggle} className="noselect" style={{ letterSpacing: 0 }}>
              {currentLayer.label}
            </label>

            {/* { currentLayer.layerID === 'Regional Development' ? */}
            <span className="parent-check" style={{ display: "inline-flex" }}>
              <Label circular size="mini" as="a" className={parentCheckBoxChecked ? "active" : ""}>
                {" "}
                {parentCheckBoxChecked ? childCheckBoxArray.length : 0}{" "}
              </Label>
              <Icon name="chevron down" onClick={() => handleClick(index)} />
              {/* <Checkbox onChange={ownershipParentCheckToggle} checked={parentCheckBoxChecked} value={currentLayer.layerID} /> */}
            </span>
            {/* :
                            <span style={{ display : 'inline-flex'}}>
                                <Label circular size="mini" as='a' className={childCheckBoxArray.length ? 'active' : ''} > { parentCheckBoxChecked ? childCheckBoxArray.length : 0 } </Label>
                                <Icon name="chevron down" onClick={()=>handleClick(index)} />
                            </span>
                        } */}
          </Accordion.Title>
          <Accordion.Content active={activeIndex.includes(index)} className="layer-toggle-container">
            {currentLayer.children.map((child, index) => (
              <div
                key={index}
                className={`layer-toggle ${
                  parentCheckBoxChecked && childCheckBoxArray.includes(child.layerID) ? "active" : ""
                }`}
                onClick={() => handleChildrenClick(child.layerID, currentLayer.layerID)}
              >
                {child.label}
              </div>
            ))}
          </Accordion.Content>
        </Accordion>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  layers: state.layers.layers,
  current_tool: state.tools.current_tool,
});

export default connect(mapStateToProps)(VisualizationCheckBoxes);
