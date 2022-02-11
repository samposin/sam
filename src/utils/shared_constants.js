export const propertyStatus = [
  { key: 1, value: 1, text: "Listing" },
  { key: -2, value: -2, text: "Pending" },
  { key: -1, value: -1, text: "Off-Market & No Sale Info" },
  { key: 0, value: 0, text: "Historical Sale" },
];

export const sourceReplace = {
  R: "Realtor",
  PCC: "LoT",
  RML: "RML",
  custom: "Custom",
  Crexi: "Crexi",
  MLS: "MLS",
};

export const trainType = [
  {
    key: "Spec",
    value: "Spec",
    text: "Spec",
  },
  {
    key: "SFR",
    value: "SFR",
    text: "SFR",
  },
  {
    key: "CRE",
    value: "CRE",
    text: "CRE",
  },
  {
    key: "Ranch",
    value: "Ranch",
    text: "Ranch",
  },
  {
    key: "AG",
    value: "AG",
    text: "AG",
  },
  {
    key: "MH",
    value: "MH",
    text: "MH",
  },
  {
    key: "Splittable",
    value: "Splittable",
    text: "Splittable",
  },
  {
    key: "REC",
    value: "REC",
    text: "REC",
  },
  {
    key: "NT", // Property Type Choice
    value: "NT", // Property Type Choice,
    text: "NT", // Property Type Choice
  },
];

export const trainRate = [
  {
    key: "1 Star",
    value: "1 Star",
    text: "1 Star",
  },
  {
    key: "2 Star",
    value: "2 Star",
    text: "2 Star",
  },
  {
    key: "3 Star",
    value: "3 Star",
    text: "3 Star",
  },
  {
    key: "4 Star",
    value: "4 Star",
    text: "4 Star",
  },
  {
    key: "5 Star", // Property Rating Choice
    value: "5 Star", // Property Rating Choice,
    text: "5 Star", // Property Rating Choice
  },
];

export const additionalLayers = [
  {
    key: "SchoolZones",
    value: "SchoolZones",
    text: "School Districts",
  },
  {
    key: "Cities",
    value: "Cities",
    text: "Cities",
  },
  {
    key: "ETJ",
    value: "ETJ",
    text: "ETJ",
  },
  {
    key: "UtilityDistricts",
    value: "UtilityDistricts",
    text: "Utility Districts",
  },
  {
    key: "OpportunityZones",
    value: "OpportunityZones",
    text: "Opportunity Zones",
  },
  {
    key: "Railroads",
    value: "Railroads",
    text: "Railroads",
  },
  {
    key: "PowerLines",
    value: "PowerLines",
    text: "Power Lines",
  },
  {
    key: "Counties",
    value: "Counties",
    text: "Counties",
  },
  {
    key: "Water",
    value: "Water",
    text: "Water",
  },
  {
    key: "WaterExtent",
    value: "WaterExtent",
    text: "Water Extent",
  },
  {
    key: "WasteWater",
    value: "WasteWater",
    text: "Waste Water",
  },
  {
    key: "WasteWaterExtent",
    value: "WasteWaterExtent",
    text: "Waste Water Extent",
  },
  {
    key: "WaterCCN",
    value: "WaterCCN",
    text: "Water CCN",
  },
  {
    key: "SewerCCN",
    value: "SewerCCN",
    text: "Sewer CCN",
  },
  {
    key: "Unacast",
    value: "Unacast",
    text: "Migration Inflow",
  },
  {
    key: "Traffic",
    value: "Traffic",
    text: "Traffic",
  },
  {
    key: "FEMA100yr",
    value: "FEMA100yr",
    text: "FEMA 100yr",
  },
  {
    key: "FEMA500yr",
    value: "FEMA500yr",
    text: "FEMA 500yr",
  },
  {
    key: "Creeks",
    value: "Creeks",
    text: "Creeks",
  },
  {
    key: "CWQ",
    value: "CWQ",
    text: "CWQ",
  },
  {
    key: "ContourLines",
    value: "ContourLines",
    text: "Topography",
  },
  {
    key: "Slope",
    value: "Slope",
    text: "Over 15% Slope",
  },
  {
    key: "Pipelines",
    value: "Pipelines",
    text: "Pipelines",
  },
  {
    key: "Wells",
    value: "Wells",
    text: "Wells",
  },
  {
    key: "OGWells",
    value: "OGWells",
    text: "Oil/Gas Wells",
  },
  {
    key: "EdwardsRecharge",
    value: "EdwardsRecharge",
    text: "Edwards Recharge",
  },
  {
    key: "EdwardsContributing",
    value: "EdwardsContributing",
    text: "Edwards Contributing",
  },
  {
    key: "GCWH",
    value: "GCWH",
    text: "GCWH",
  },
  {
    key: "Perennial",
    value: "Perennial",
    text: "Perennial",
  },
  {
    key: "Intermittent",
    value: "Intermittent",
    text: "Intermittent",
  },
  {
    key: "Waterbody",
    value: "Waterbody",
    text: "Waterbody",
  },
  {
    key: "Whiteout",
    value: "Whiteout",
    text: "Unusable Land",
  },
];

export const basemapsToShare = [
  {
    key: "Default",
    value: "Default",
    text: "Default",
  },
  {
    key: "Satellite",
    value: "Satellite",
    text: "Satellite",
  },
  {
    key: "Streets",
    value: "Streets",
    text: "Streets",
  },
  {
    key: "Outdoors",
    value: "Outdoors",
    text: "Outdoors",
  },
  {
    key: "Monochrome",
    value: "Monochrome",
    text: "Monochrome",
  },
];

export const allLayers = [
  {
    label: "Projects",
    layerID: "Projects",
    defaultChecked: ["Projects"],
    children: [
      {
        label: "All Projects",
        layerID: "Projects",
        children: false,
      },
      {
        label: "Performing",
        layerID: "PerformingProjects",
        children: false,
      },
    ],
  },
  {
    label: "Ownerships",
    layerID: "OwnershipsCounties",
    defaultChecked: ["Ownerships-Central"],
    children: [
      {
        label: "Original",
        layerID: "OrigOwner",
        children: false,
      },
      {
        label: "Central",
        layerID: "Ownerships-Central",
      },
      {
        label: "Alamo",
        layerID: "Ownerships-Alamo",
      },
      {
        label: "High Plains",
        layerID: "Ownerships-HighPlains",
      },
      {
        label: "Northwest",
        layerID: "Ownerships-Northwest",
      },
      {
        label: "Metroplex",
        layerID: "Ownerships-Metroplex",
      },
      {
        label: "Upper East",
        layerID: "Ownerships-UpperEast",
      },
      {
        label: "South East",
        layerID: "Ownerships-SouthEast",
      },
      {
        label: "Gulf Coast",
        layerID: "Ownerships-GulfCoast",
      },
      {
        label: "West",
        layerID: "Ownerships-West",
      },
      {
        label: "Rio Grande",
        layerID: "Ownerships-RioGrande",
      },
      {
        label: "South",
        layerID: "Ownerships-South",
      },
    ],
  },
  {
    label: "Market Data",
    layerID: "MarketData",
    defaultChecked: ["Listings"],
    children: [
      {
        label: "Results",
        layerID: "Results",
      },
      {
        label: "Listings",
        layerID: "Listings",
      },
      {
        label: "Sales",
        layerID: "Sales",
      },
      {
        label: "Recent Sales",
        layerID: "RecentSales",
      },
      {
        label: "Pending Sales",
        layerID: "Pending",
      },
      {
        label: "PCC Inactive",
        layerID: "PCC_inactive",
      },
      {
        label: "Unmatched",
        layerID: "Unmatched",
      },
      {
        label: "Home Sales",
        layerID: "HomeSales",
      },
    ],
  },
  {
    label: "Parcels",
    layerID: "Parcels",
    defaultChecked: ["Parcels-Central"],
    children: [
      {
        label: "Central",
        layerID: "Parcels-Central",
      },
      {
        label: "Alamo",
        layerID: "Parcels-Alamo",
      },
      {
        label: "High Plains",
        layerID: "Parcels-HighPlains",
      },
      {
        label: "Northwest",
        layerID: "Parcels-Northwest",
      },
      {
        label: "Metroplex",
        layerID: "Parcels-Metroplex",
      },
      {
        label: "Upper East",
        layerID: "Parcels-UpperEast",
      },
      {
        label: "South East",
        layerID: "Parcels-SouthEast",
      },
      {
        label: "Gulf Coast",
        layerID: "Parcels-GulfCoast",
      },
      {
        label: "West",
        layerID: "Parcels-West",
      },
      {
        label: "Rio Grande",
        layerID: "Parcels-RioGrande",
      },
      {
        label: "South",
        layerID: "Parcels-South",
      },
    ],
  },
  {
    label: "Regional Development",
    layerID: "Regional Development",
    defaultChecked: [],
    children: [
      {
        label: "School Districts",
        layerID: "SchoolZones",
      },
      {
        label: "Cities",
        layerID: "Cities",
      },
      {
        label: "ETJ",
        layerID: "ETJ",
      },
      {
        label: "Utility Districts",
        layerID: "UtilityDistricts",
      },
      {
        label: "Opportunity Zones",
        layerID: "OpportunityZones",
      },
      {
        label: "Wells",
        layerID: "Wells",
      },
      {
        label: "Oil/Gas Wells",
        layerID: "OGWells",
      },
      {
        label: "Railroads",
        layerID: "Railroads",
      },
      {
        label: "Power Lines",
        layerID: "PowerLines",
      },
      {
        label: "Counties",
        layerID: "Counties",
      },
      {
        label: "Water",
        layerID: "Water",
      },
      {
        label: "Water Extent",
        layerID: "WaterExtent",
      },
      {
        label: "Waste Water",
        layerID: "WasteWater",
      },
      {
        label: "Waste Water Extent",
        layerID: "WasteWaterExtent",
      },
      {
        label: "Water CCN",
        layerID: "WaterCCN",
      },
      {
        label: "Sewer CCN",
        layerID: "SewerCCN",
      },
      {
        label: "Migration Inflow",
        layerID: "Unacast",
      },
      {
        label: "Traffic",
        layerID: "Traffic",
      },
      {
        label: "MetroStudy Point Data",
        layerID: "MSPD",
      },
      {
        label: "Developed Land",
        layerID: "LandCover",
      },
      {
        label: "Developed Land Change",
        layerID: "LandCoverChange",
      },
      {
        label: "Unusable Land",
        layerID: "Whiteout",
      },
    ],
  },
  {
    label: "Government",
    layerID: "Government",
    children: false,
  },
  {
    label: "Land Features",
    layerID: "LandFeatures",
    defaultChecked: [],
    children: [
      {
        label: "FEMA 100yr",
        layerID: "FEMA100yr",
      },
      {
        label: "FEMA 500yr",
        layerID: "FEMA500yr",
      },
      {
        label: "Creeks",
        layerID: "Creeks",
      },
      {
        label: "CWQ",
        layerID: "CWQ",
      },
      {
        label: "Topography",
        layerID: "ContourLines",
      },
      {
        label: "Over 15% Slope",
        layerID: "Slope",
      },
      {
        label: "Pipelines",
        layerID: "Pipelines",
      },
      {
        label: "Edwards Recharge",
        layerID: "EdwardsRecharge",
      },
      {
        label: "Edwards Contributing",
        layerID: "EdwardsContributing",
      },
      {
        label: "GCWH",
        layerID: "GCWH",
      },
      {
        label: "Perennial",
        layerID: "Perennial",
      },
      {
        label: "Intermittent",
        layerID: "Intermittent",
      },
      {
        label: "Waterbody",
        layerID: "Waterbody",
      },
      // button labels
      {
        label: "Water Features",
        layerID: "Waterfeatures",
      },
    ],
  },
  {
    label: "Hex Layers",
    layerID: "HexLayers",
    defaultChecked: ["HexMigrationInflow"],
    children: [
      {
        label: "Migration Inflow",
        layerID: "HexMigrationInflow",
      },
      {
        label: "PPA Index",
        layerID: "PPAIndex",
      },
    ],
  },
];
