export const mapStyles = {
  Default: "mapbox://styles/sbarton/cktxfw18d00xe18qhac4xwagi",
  Satellite: "mapbox://styles/sbarton/ckol9ixqv2m6317o2mlfs28b3",
  Streets: "mapbox://styles/sbarton/ckmb1r8qj6hxg17o75dve76lh",
  Outdoors: "mapbox://styles/sbarton/ckmencbh20fqx17oe5wcbysx3",
  OldDefault: "mapbox://styles/sbarton/ckovxisx801lw17rt4rsnhcet",
  Monochrome: "mapbox://styles/sbarton/ckmenexvb0aww17pfm7id0rvy",
};

export const ppa_map_filter = [
  "format",
  ["to-string", ["round", ["get", "acres"]]],
  {},
  " acres\n",
  {},
  [
    "case",
    ["case", ["==", ["get", "status"], 0], ["!", ["has", "sold"]], ["!", ["has", "price"]]],
    "No Price",
    [
      "slice",
      [
        "number-format",
        [
          "round",
          [
            "case",
            ["==", ["get", "status"], 0],
            ["/", ["get", "sold"], ["get", "acres"]],
            ["/", ["get", "price"], ["get", "acres"]],
          ],
        ],
        { currency: "USD", "max-fraction-digits": 1 },
      ],
      0,
      [
        "-",
        [
          "length",
          [
            "number-format",
            [
              "round",
              [
                "case",
                ["==", ["get", "status"], 0],
                ["/", ["get", "sold"], ["get", "acres"]],
                ["/", ["get", "price"], ["get", "acres"]],
              ],
            ],
            { currency: "USD", "max-fraction-digits": 1 },
          ],
        ],
        2,
      ],
    ],
  ],
  {},
];

export const mapLayers = {
  //Projects
  Projects: [
    {
      id: "Projects",
      type: "fill",
      source: "projects_merge",
      layout: { visibility: "none" },
      paint: {
        "fill-color": ["match", ["get", "Status"], ["Future"], "hsl(0, 100%, 100%)", "#000000"],
        "fill-opacity": 0.6,
        "fill-outline-color": "hsla(0, 96%, 56%, 0)",
      },
      "source-layer": "projects_merge",
    },

    {
      id: "Projects_outline",
      type: "line",
      source: "projects_merge",
      layout: { visibility: "none" },
      paint: {
        "line-color": [
          "match",
          ["get", "Status"],
          ["Future"],
          "hsla(354, 0%, 0%, 0.99)",
          "hsla(354, 100%, 100%, 0.99)",
        ],
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          1,
          15.5,
          ["case", ["boolean", ["feature-state", "hover"], false], 6, 3],
        ],
      },
      "source-layer": "projects_merge",
    },

    {
      id: "Projects_labels",
      type: "symbol",
      source: "project_labels_tim",
      layout: {
        visibility: "none",
        "text-field": ["to-string", ["get", "Subdivisio"]],
        "text-padding": 0,
        "text-size": ["interpolate", ["linear"], ["zoom"], 6, 8, 22, 16],
        "text-font": ["Open Sans SemiBold Italic", "Arial Unicode MS Regular"],
        "text-line-height": 1.2,
        "text-max-width": 4,
      },
      paint: {
        "text-color": ["match", ["get", "Status"], ["Active"], "hsl(0, 83%, 100%)", "#000000"],
        "text-opacity": ["case", ["match", ["get", "Subdivisio"], ["----"], true, false], 0.01, 1],
      },
      "source-layer": "project_labels_tim",
      minzoom: 9.6,
    },
  ],

  //Performing Projects
  PerformingProjects: [
    {
      id: "PerformingProjects",
      type: "fill",
      source: "projects_merge",
      layout: { visibility: "none" },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "AnnStarts"],
          71.99,
          "hsla(0, 0%, 0%, 0)",
          72,
          "hsl(59, 100%, 53%)",
          99.99,
          "hsl(59, 100%, 53%)",
          100,
          "hsl(29, 100%, 53%)",
          249.99,
          "hsl(29, 100%, 53%)",
          250,
          "hsl(0, 100%, 53%)",
        ],
        "fill-opacity": 1,
        "fill-outline-color": "hsla(0,0,0,0)",
      },
      "source-layer": "projects_merge",
      createFilter: (highlightLayersProjectMerge) => [
        "all",
        [">", ["get", "AnnStarts"], 71],
        ["in", ["to-string", ["id"]], ["literal", highlightLayersProjectMerge]],
      ],
      // 'filter':['all', ['>', ['get', 'AnnStarts'], 71], ['in', ['to-string', ['id']], ['literal', mapInfo.highlightLayers['projects_merge']]]]
      filter: [">", ["get", "AnnStarts"], 71],
    },

    {
      id: "PerformingProjects_outline",
      type: "line",
      source: "projects_merge",
      layout: { visibility: "none" },
      paint: {
        "line-color": "#000000",
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          1,
          15.5,
          ["case", ["boolean", ["feature-state", "hover"], false], 6, 3],
        ],
      },
      "source-layer": "projects_merge",
      filter: [">", ["get", "AnnStarts"], 71],
      // 'filter':['all', ['>', ['get', 'AnnStarts'], 71], ['in', ['to-string', ['id']], ['literal', mapInfo.highlightLayers['projects_merge']]]]
    },

    {
      id: "PerformingProjects_labels",
      type: "symbol",
      source: "project_labels_tim",
      layout: {
        visibility: "none",
        "text-field": ["concat", ["get", "Subdivisio"], " ", "Ann Starts:", " ", ["get", "AnnStarts"]],
        "text-padding": 0,
        "text-size": ["interpolate", ["linear"], ["zoom"], 6, 8, 22, 16],
        "text-font": ["Open Sans SemiBold Italic", "Arial Unicode MS Regular"],
        "text-line-height": 1.2,
        "text-max-width": 6,
      },
      paint: {
        "text-color": ["match", ["get", "Status"], ["Active"], "hsl(0, 83%, 100%)", "#000000"],
        "text-opacity": ["case", ["match", ["get", "Subdivisio"], ["----"], true, false], 0.01, 1],
      },
      "source-layer": "project_labels_tim",
      minzoom: 9.6,
      filter: [">", ["get", "AnnStarts"], 71],
      // 'filter':['all', ['>', ['get', 'AnnStarts'], 71], ['in', ['to-string', ['id']], ['literal', mapInfo.highlightLayers['projects_merge']]]]
    },
  ],
  OrigOwner: [
    {
      id: "OrigOwner",
      type: "fill",
      source: "ownerships_merge",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "#FFFFFF",
        "fill-opacity": 0,
        "fill-outline-color": "hsla(0,0,0,0)",
      },
      "source-layer": "ownerships_merge",
      // 'filter':['in', ['to-string', ['id']], ['literal', mapInfo.highlightLayers['ownerships_merge']]]
    },
    {
      id: "OrigOwner_outline",
      type: "line",
      source: "ownerships_merge",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(61, 100%, 57%)",
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          1,
          15.5,
          ["case", ["boolean", ["feature-state", "hover"], false], 6, 3],
        ],
      },
      "source-layer": "ownerships_merge",
      // 'filter':['in', ['to-string', ['id']], ['literal', mapInfo.highlightLayers['ownerships_merge']]]
    },
  ],

  Government: [
    {
      id: "Government",
      type: "fill",
      source: "govt",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "hsl(105, 27%, 53%)",
        "fill-opacity": 0.63,
        "fill-outline-color": "hsla(105, 27%, 53%,0)",
      },
      "source-layer": "govt",
      // 'filter':['in', ['to-string', ['id']], ['literal', mapInfo.highlightLayers['govt']]]
    },

    {
      id: "Government_outline",
      type: "line",
      source: "govt",
      layout: { visibility: "none" },
      paint: {
        "line-color": "#000000",
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          1,
          15.5,
          ["case", ["boolean", ["feature-state", "hover"], false], 6, 3],
        ],
      },
      "source-layer": "govt",
      // 'filter':['in', ['to-string', ['id']], ['literal', mapInfo.highlightLayers['govt']]]
    },
  ],
  Results: [
    {
      id: "Results",
      type: "fill",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "status"], 1],
          "hsl(61, 94%, 63%)",
          ["==", ["get", "status"], 0],
          "hsl(210, 98%, 60%)",
          "hsl(300, 95%, 68%)",
        ],
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 11.5, 0.7, 16, 0.25],
        "fill-outline-color": "hsla(0, 96%, 56%, 0)",
      },
      "source-layer": "properties",
      // 'filter': ['in', ['to-string', ['get', 'ID']], ['literal', resultsIDs]],
    },
    {
      id: "Results_outline",
      type: "line",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "line-color": "hsl(108, 100%, 45%)",
        // [
        //   "interpolate",
        //   ["linear"],
        //   ["get", "utility"],
        //   0,
        //   "hsl(232, 100%, 51%)",
        //   5,
        //   "hsl(108, 100%, 45%)"
        // ]
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          5,
          22,
          ["case", ["boolean", ["feature-state", "hover"], false], 5, 2.5],
        ],
      },
      "source-layer": "properties",
      // 'filter': ['in', ['to-string', ['get', 'ID']], ['literal', resultsIDs]]
    },
  ],
  Listings: [
    {
      id: "Listings",
      type: "fill",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "fill-color": "hsl(61, 94%, 63%)",
        //   [
        //     'case',
        //     // ['in', ['to-string', ['get', 'ID']], ['literal', resultsIDs]],
        //     [
        //       "interpolate",
        //       ["linear"],
        //       ["get", "utility"],
        //       0,
        //       "hsl(213, 100%, 45%)",
        //       5,
        //       "hsl(108, 100%, 45%)"
        //     ],
        //     "hsl(61, 94%, 63%)"
        //   ],
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 11.5, 0.7, 16, 0.25],
        "fill-outline-color": "hsla(0, 96%, 56%, 0)",
      },
      "source-layer": "properties",
      filter: ["==", ["get", "status"], 1],
      createNewFilter: (hideIDS) => [
        "all",
        ["==", ["get", "status"], 1],
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
      ],
    },
    {
      id: "Listings_outline",
      type: "line",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "line-color": "hsl(0, 96%, 56%)",
        // ['case',
        //   ['boolean', ['feature-state', 'hover'], false],
        //   "hsl(182, 100%, 61%)",[
        //     'case',
        //     ['in', ['to-string', ['get', 'ID']], ['literal', resultsIDs]],
        //     [
        //       "interpolate",
        //       ["linear"],
        //       ["get", "utility"],
        //       0,
        //       "hsl(232, 100%, 51%)",
        //       5,
        //       "hsl(108, 100%, 45%)"
        //     ],
        //     "hsl(0, 96%, 56%)"
        //   ]
        // ],
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          1,
          15.5,
          ["case", ["boolean", ["feature-state", "hover"], false], 6, 3],
        ],
      },
      "source-layer": "properties",
      filter: ["==", ["get", "status"], 1],
      createNewFilter: (hideIDS) => [
        "all",
        ["==", ["get", "status"], 1],
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
      ],
    },
    {
      id: "Listings_labels",
      type: "symbol",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
        "text-field": ppa_map_filter,
        "text-font": [
          //"Poppins Medium",
          "Arial Unicode MS Regular",
        ],
        "text-size": ["interpolate", ["linear"], ["zoom"], 0, 12, 16.42, 18, 22, 32],
      },
      paint: {
        "text-color": "#fff",
      },
      minzoom: 13,
      "symbol-placement": "line-center",
      "source-layer": "properties",
      filter: ["==", ["get", "status"], 1],
      createNewFilter: (hideIDS) => [
        "all",
        ["==", ["get", "status"], 1],
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
      ],
    },
  ],
  Sales: [
    {
      id: "Sales",
      type: "fill",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "fill-color": "hsl(210, 98%, 60%)",
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 11.5, 0.7, 16, 0.25],
        "fill-outline-color": "hsla(0, 98%, 55%, 0)",
      },
      "source-layer": "properties",
      filter: ["==", ["get", "status"], 0],
      createNewFilter: (hideIDS) => [
        "all",
        ["==", ["get", "status"], 0],
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
      ],
    },
    {
      id: "Sales_outline",
      type: "line",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "line-color": "hsl(0, 96%, 56%)",
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          1,
          15.5,
          ["case", ["boolean", ["feature-state", "hover"], false], 6, 3],
        ],
      },
      "source-layer": "properties",
      filter: ["==", ["get", "status"], 0],
      createNewFilter: (hideIDS) => [
        "all",
        ["==", ["get", "status"], 0],
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
      ],
    },
    {
      id: "Sales_labels",
      type: "symbol",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
        "text-field": ppa_map_filter,
        "text-font": [
          //"Poppins Medium",
          "Arial Unicode MS Regular",
        ],
        "text-size": ["interpolate", ["linear"], ["zoom"], 0, 12, 16.42, 18, 22, 32],
      },
      paint: { "text-color": "#fff" },
      minzoom: 13.5,
      "symbol-placement": "line-center",
      "source-layer": "properties",
      filter: ["==", ["get", "status"], 0],
      createNewFilter: (hideIDS) => [
        "all",
        ["==", ["get", "status"], 0],
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
      ],
    },
  ],
  RecentSales: [
    {
      id: "RecentSales",
      type: "fill",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "fill-color": "hsl(210, 98%, 60%)",
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 11.5, 0.7, 16, 0.25],
        "fill-outline-color": "hsla(0, 98%, 55%,0)",
      },
      "source-layer": "properties",
      filter: ["==", ["get", "status"], 0],
      createNewFilter: (hideIDS, value) => [
        "all",
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
        [">=", ["to-string", ["get", "date_sold"]], ["to-string", value]],
        ["==", ["get", "status"], 0],
      ],
      createFilter: (value, hideIDS) => [
        "all",
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
        [">=", ["to-string", ["get", "date_sold"]], ["to-string", value]],
        ["==", ["get", "status"], 0],
      ],
    },
    {
      id: "RecentSales_outline",
      type: "line",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "line-color": "hsl(0, 96%, 56%)",
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          1,
          15.5,
          ["case", ["boolean", ["feature-state", "hover"], false], 6, 3],
        ],
      },
      "source-layer": "properties",
      filter: ["==", ["get", "status"], 0],
      createNewFilter: (hideIDS, value) => [
        "all",
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
        [">=", ["to-string", ["get", "date_sold"]], ["to-string", value]],
        ["==", ["get", "status"], 0],
      ],
      createFilter: (value, hideIDS) => [
        "all",
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
        [">=", ["to-string", ["get", "date_sold"]], ["to-string", value]],
        ["==", ["get", "status"], 0],
      ],
    },
    {
      id: "RecentSales_labels",
      type: "symbol",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
        "text-field": ppa_map_filter,
        "text-font": [
          //"Poppins Medium",
          "Arial Unicode MS Regular",
        ],
        "text-size": ["interpolate", ["linear"], ["zoom"], 0, 12, 16.42, 18, 22, 32],
      },
      paint: {
        "text-color": "#fff",
      },
      minzoom: 13.5,
      "symbol-placement": "line-center",
      "source-layer": "properties",
      // 'filter-parts': {
      //   data: "today",
      //   filter: [">=", ["to-string", ["get", "date_sold"]],["to-string", 'filter-data-placeholder']]
      // }
      filter: ["==", ["get", "status"], 0],
      createNewFilter: (hideIDS, value) => [
        "all",
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
        [">=", ["to-string", ["get", "date_sold"]], ["to-string", value]],
        ["==", ["get", "status"], 0],
      ],
      createFilter: (value, hideIDS) => [
        "all",
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
        [">=", ["to-string", ["get", "date_sold"]], ["to-string", value]],
        ["==", ["get", "status"], 0],
      ],
    },
  ],

  Pending: [
    {
      id: "Pending",
      type: "fill",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "fill-color": "hsl(300, 95%, 68%)",
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 11.5, 0.7, 16, 0.25],
        "fill-outline-color": "hsla(0, 99%, 54%,0)",
      },
      "source-layer": "properties",
      filter: ["==", ["get", "status"], -2],
      createNewFilter: (hideIDS) => [
        "all",
        ["==", ["get", "status"], -2],
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
      ],
    },
    {
      id: "Pending_outline",
      type: "line",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "line-color": "hsl(0, 96%, 56%)",
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          1,
          15.5,
          ["case", ["boolean", ["feature-state", "hover"], false], 6, 3],
        ],
      },
      "source-layer": "properties",
      filter: ["==", ["get", "status"], -2],
      createNewFilter: (hideIDS) => [
        "all",
        ["==", ["get", "status"], -2],
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
      ],
    },
    {
      id: "Pending_labels",
      type: "symbol",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
        "text-field": ppa_map_filter,
        "text-font": [
          //"Poppins Medium",
          "Arial Unicode MS Regular",
        ],
        "text-size": ["interpolate", ["linear"], ["zoom"], 0, 12, 16.42, 18, 22, 32],
      },
      paint: {
        "text-color": "#fff",
      },
      minzoom: 13.5,
      "symbol-placement": "line-center",
      "source-layer": "properties",
      filter: ["==", ["get", "status"], -2],
      createNewFilter: (hideIDS) => [
        "all",
        ["==", ["get", "status"], -2],
        ["!", ["in", ["to-string", ["get", "ID"]], ["literal", hideIDS]]],
      ],
    },
  ],

  PCC_inactive: [
    {
      id: "PCC_inactive",
      type: "fill",
      source: "PCC_inactive",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "fill-color": "#607d8b",
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 11.5, 0.7, 16, 0.25],
        "fill-outline-color": "hsla(0, 98%, 55%, 0)",
      },
      "source-layer": "PCC_inactive",
    },
    {
      id: "PCC_inactive_outline",
      type: "line",
      source: "PCC_inactive",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "line-color": "hsl(0, 96%, 56%)",
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          1,
          15.5,
          ["case", ["boolean", ["feature-state", "hover"], false], 6, 3],
        ],
      },
      "source-layer": "PCC_inactive",
    },
    {
      id: "PCC_inactive_labels",
      type: "symbol",
      source: "PCC_inactive",
      layout: {
        // make layer visible by default
        visibility: "none",
        "text-field": ppa_map_filter,
        "text-font": [
          //"Poppins Medium",
          "Arial Unicode MS Regular",
        ],
        "text-size": ["interpolate", ["linear"], ["zoom"], 0, 12, 16.42, 18, 22, 32],
      },
      paint: {
        "text-color": "#fff",
      },
      minzoom: 13.5,
      "symbol-placement": "line-center",
      "source-layer": "PCC_inactive",
    },
  ],

  Unmatched: [
    {
      id: "Unmatched",
      type: "circle",
      source: "unmatched",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 2, 12, 6, 16, 16],
        "circle-color": [
          "match",
          ["get", "status"],
          ["1"],
          "hsl(61, 94%, 63%)",
          ["0"],
          "hsl(210, 98%, 60%)",
          "hsl(300, 95%, 68%)",
        ],
        "circle-opacity": 1,
        "circle-stroke-color": "hsl(0, 96%, 56%)",
        "circle-stroke-width": 0.5,
      },
      "source-layer": "unmatched",
      filter: ["all", ["match", ["get", "status"], ["-1"], false, true], ["any", ["has", "price"], ["has", "sold"]]],
    },
  ],
  HomeSales: [
    {
      id: "HomeSales",
      type: "circle",
      source: "home",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "List Price"],
          115000,
          "hsl(221, 97%, 52%)",
          300000,
          "hsl(212, 94%, 40%)",
          300001,
          "#62b347",
          400000,
          "#62b347",
          400001,
          "#f5fd12",
          500000,
          "#f5fd12",
          500001,
          "hsl(39, 98%, 53%)",
          600000,
          "hsl(39, 98%, 53%)",
          600001,
          "hsl(20, 77%, 56%)",
          700000,
          "hsl(20, 77%, 56%)",
          700001,
          "hsl(0, 99%, 51%)",
          4000000,
          "hsl(0, 99%, 51%)",
        ],
        "circle-stroke-opacity": 1,
        "circle-stroke-color": "#000000",
        "circle-stroke-width": 0,
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 2.5, 12, 5.5, 16, 9],
        "circle-blur": 0,
      },
      "source-layer": "home",
    },
  ],
  Cities: [
    {
      id: "Cities",
      type: "fill",
      source: "city",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "hsl(0, 98%, 61%)",
        "fill-opacity": 0.4,
        "fill-outline-color": "hsl(0, 100%, 56%)",
      },
      "source-layer": "city",
    },
    {
      id: "Cities_outline",
      type: "line",
      source: "city",
      layout: { visibility: "none" },
      paint: {
        "line-color": "#000000",
        "line-opacity": 1,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1, 13, 1.5],
      },
      "source-layer": "city",
    },
  ],
  SchoolZones: [
    {
      id: "SchoolZones",
      type: "line",
      source: "school",
      layout: { visibility: "none" },
      paint: {
        "line-color": "#fd3535",
        "line-opacity": 1,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 2, 14, 4],
      },
      "source-layer": "school",
    },
    {
      id: "SchoolZones_labels",
      type: "symbol",
      source: "school",
      layout: {
        visibility: "none",
        "text-field": ["to-string", ["get", "NAME"]],
        "text-padding": ["interpolate", ["linear"], ["zoom"], 8, 20, 10, 40],
        "text-size": 20,
        "text-font": ["Poppins Medium", "Arial Unicode MS Regular"],
      },
      paint: {
        "text-color": "hsl(0, 100%, 100%)",
        "text-halo-width": 0.75,
        "text-halo-color": "#000000",
      },
      "source-layer": "school",
    },
  ],
  ETJ: [
    {
      id: "ETJ",
      type: "fill",
      source: "ETJ",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "hsl(0, 79%, 61%)",
        "fill-opacity": 0.59,
        "fill-outline-color": "#000000",
      },
      "source-layer": "ETJ",
    },
    {
      id: "ETJ_outline",
      type: "line",
      source: "ETJ",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(0, 92%, 43%)",
        "line-opacity": 1,
        "line-width": ["interpolate", ["linear"], ["zoom"], 0, 1, 22, 2],
      },
      "source-layer": "ETJ",
    },
  ],
  UtilityDistricts: [
    {
      id: "UtilityDistricts",
      type: "fill",
      source: "utilitydistricts_austin",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "#ffff00",
        "fill-opacity": 0.3,
        "fill-outline-color": "hsl(0, 100%, 56%)",
      },
      "source-layer": "utilitydistricts_austin",
      filter: ["match", ["get", "TYPE"], ["RA"], false, true],
    },
  ],
  OpportunityZones: [
    {
      id: "OpportunityZones",
      type: "fill",
      source: "opportunityzonestx",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "#FF8C00",
        "fill-opacity": 0.4,
        "fill-outline-color": "hsl(0, 100%, 56%)",
      },
      "source-layer": "opportunityzonestx",
    },
  ],
  Wells: [
    {
      id: "Wells",
      type: "circle",
      source: "wells",
      layout: { visibility: "none" },
      minzoom: 11,
      maxzoom: 22,
      paint: {
        "circle-color": "#edfe81",
        "circle-opacity": 0.6,
      },
      "source-layer": "wells",
    },
  ],
  OGWells: [
    {
      id: "OGWells",
      type: "circle",
      source: "og_wells",
      layout: { visibility: "none" },
      minzoom: 11,
      maxzoom: 22,
      paint: {
        "circle-color": "#2d57f0",
        "circle-opacity": 0.6,
      },
      "source-layer": "og_wells",
    },
  ],
  Railroads: [
    {
      id: "Railroads",
      type: "line",
      source: "railroad",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(327, 97%, 60%)",
        "line-opacity": 1,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1, 16, 6],
        "line-blur": ["interpolate", ["linear"], ["zoom"], 8, 0, 16, 2],
        "line-gap-width": 2,
      },
      "source-layer": "railroad",
    },
  ],
  PowerLines: [
    {
      id: "PowerLines",
      type: "line",
      source: "powerlines",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(62, 93%, 57%)",
        "line-opacity": 1,
        "line-width": ["interpolate", ["linear"], ["zoom"], 0, 1, 22, 2],
      },
      "source-layer": "powerlines",
    },
  ],
  Counties: [
    {
      id: "Counties_labels",
      type: "symbol",
      source: "counties",
      layout: {
        visibility: "none",
        "text-field": ["to-string", ["get", "CNTY_NM"]],
        "text-padding": ["interpolate", ["linear"], ["zoom"], 8, 20, 13, 800],
        "text-size": 20,
        "text-font": ["Poppins Medium", "Arial Unicode MS Regular"],
      },
      paint: {
        "text-color": "hsl(0, 100%, 100%)",
        "text-halo-width": 0.75,
        "text-halo-color": "#000000",
      },
      "source-layer": "Texas_County_Boundaries-shp-cugzaq",
    },
    {
      id: "Counties",
      type: "line",
      source: "counties",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(311, 0%, 100%)",
        "line-opacity": 1,
      },
      "source-layer": "Texas_County_Boundaries-shp-cugzaq",
    },
  ],
  Water: [
    {
      id: "Water",
      type: "line",
      source: "water_merge",
      layout: {
        visibility: "none",
      },
      paint: {
        "line-color": "hsl(196, 90%, 58%)",
        "line-width": ["interpolate", ["linear"], ["zoom"], 0, 1, 22, 2],
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0, 10.95, 0, 10.96, 1, 22, 1],
      },
      "source-layer": "water_merge",
    },
  ],
  WaterExtent: [
    {
      id: "WaterExtent",
      type: "fill",
      source: "waterextent",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "#0a78ff",
        "fill-opacity": 0.53,
      },
      "source-layer": "waterextent",
    },
  ],
  WasteWater: [
    {
      id: "WasteWater",
      type: "line",
      source: "waste_water_merge",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(63, 90%, 49%)",
        "line-width": ["interpolate", ["linear"], ["zoom"], 0, 1, 22, 2],
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0, 10.95, 0, 10.96, 1, 22, 1],
      },
      "source-layer": "waste_water_merge",
    },
  ],
  WasteWaterExtent: [
    {
      id: "WasteWaterExtent",
      type: "fill",
      source: "wastewaterextent",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "#fffb0a",
        "fill-opacity": 0.53,
      },
      "source-layer": "wastewaterextent",
    },
  ],
  WaterCCN: [
    {
      id: "WaterCCN",
      type: "fill",
      source: "waterccn",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "hsl(193, 100%, 51%)",
        "fill-opacity": 0.42,
        "fill-outline-color": "#000000",
      },
      "source-layer": "waterccn",
    },
    {
      id: "WaterCCN_outline",
      type: "line",
      source: "waterccn",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(229, 100%, 50%)",
        "line-opacity": 1,
        "line-width": ["interpolate", ["linear"], ["zoom"], 0, 1, 22, 2],
      },
      "source-layer": "waterccn",
    },
  ],
  SewerCCN: [
    {
      id: "SewerCCN",
      type: "fill",
      source: "sewerccn",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "hsl(98, 75%, 36%)",
        "fill-opacity": 0.42,
        "fill-outline-color": "#000000",
      },
      "source-layer": "sewerccn",
    },
    {
      id: "SewerCCN_outline",
      type: "line",
      source: "sewerccn",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(95, 74%, 43%)",
        "line-opacity": 1,
        "line-width": ["interpolate", ["linear"], ["zoom"], 0, 1, 22, 2],
      },
      "source-layer": "sewerccn",
    },
  ],
  Traffic: [
    {
      id: "Traffic",
      type: "line",
      source: "mapbox-traffic",
      layout: { visibility: "none" },
      paint: {
        "line-width": 1.5,
        "line-color": [
          "case",
          ["==", "low", ["get", "congestion"]],
          "#aab7ef",
          ["==", "moderate", ["get", "congestion"]],
          "#4264fb",
          ["==", "heavy", ["get", "congestion"]],
          "#ee4e8b",
          ["==", "severe", ["get", "congestion"]],
          "#b43b71",
          "#000000",
        ],
      },
      "source-layer": "traffic",
    },
  ],
  MSPD: [
    {
      id: "MSPD",
      type: "circle",
      source: "point_Data",
      layout: { visibility: "none" },
      paint: {
        "circle-color": ["match", ["get", "Status"], ["Future"], "#878787", "hsl(286, 100%, 57%)"],
        "circle-stroke-opacity": 1,
        "circle-stroke-color": "#000000",
        "circle-stroke-width": 0,
        "circle-radius": ["interpolate", ["exponential", 0.9998], ["get", "Total"], 0, 2, 1, 3.5, 12056, 12],
        "circle-blur": 0,
      },
      "source-layer": "point_Data",
      createFilter: (date) =>
        date == "2021-10" ? null : ["all", ["!=", "Status", "Future"], ["<", "act_start_q", date]],
      createPaint: (date) =>
        date == "2021-10"
          ? [
              "circle-color",
              [
                "case",
                ["match", ["get", "Status"], ["Future"], true, false],
                "#ff2e2e",
                ["match", ["get", "act_end_q"], ["2021-07-01T00:00:00"], true, false],
                "#000000",
                "#878787",
              ],
            ]
          : ["circle-color", ["case", [">=", ["get", "act_end_q"], date + "-01T00:00:00"], "#000000", "#878787"]],
    },
    // {
    //   'id': 'MSPD',
    //   'type': 'circle',
    //   'source': 'point_Data',
    //   'layout': {'visibility': 'none'},
    //   'paint': {
    //     'circle-color': ["match",["get", "Status"],["Future"],"#878787","hsl(286, 100%, 57%)"],
    //     'circle-stroke-opacity': 1,
    //     'circle-stroke-color':"#000000",
    //     'circle-stroke-width':0,
    //     'circle-radius':[
    //                       "interpolate",
    //                       ["exponential", 0.9998],
    //                       ["get", "Total"],
    //                       0,
    //                       2,
    //                       1,
    //                       3.5,
    //                       12056,
    //                       12
    //                     ],
    //                     'circle-blur':0
    //   },
    //   'source-layer': 'point_Data'
    // }
  ],
  LandCover: [
    {
      id: "LandCover",
      type: "raster",
      source: "nlcd_2019",
      layout: { visibility: "none" },
      paint: {
        "raster-opacity": 0.6,
        "raster-fade-duration": 0,
      },
      "source-layer": "nlcd_2019",
    },
  ],
  LandCoverChange: [
    {
      id: "LandCoverChange2004",
      type: "raster",
      source: "changes_2004-2006",
      layout: { visibility: "none" },
      paint: {
        "raster-opacity": 0.6,
        "raster-fade-duration": 0,
      },
      "source-layer": "changes_2004-2006",
    },
    {
      id: "LandCoverChange2006",
      type: "raster",
      source: "changes_2006-2008",
      layout: { visibility: "none" },
      paint: {
        "raster-opacity": 0.6,
        "raster-fade-duration": 0,
      },
      "source-layer": "changes_2006-2008",
    },
    {
      id: "LandCoverChange2008",
      type: "raster",
      source: "changes_2008-2011",
      layout: { visibility: "none" },
      paint: {
        "raster-opacity": 0.6,
        "raster-fade-duration": 0,
      },
      "source-layer": "changes_2008-2011",
    },
    {
      id: "LandCoverChange2011",
      type: "raster",
      source: "changes_2011-2013",
      layout: { visibility: "none" },
      paint: {
        "raster-opacity": 0.6,
        "raster-fade-duration": 0,
      },
      "source-layer": "changes_2011-2013",
    },
    {
      id: "LandCoverChange2013",
      type: "raster",
      source: "changes_2013-2016",
      layout: { visibility: "none" },
      paint: {
        "raster-opacity": 0.6,
        "raster-fade-duration": 0,
      },
      "source-layer": "changes_2013-2016",
    },
    {
      id: "LandCoverChange",
      type: "raster",
      source: "changes_2016-2019",
      layout: { visibility: "none" },
      paint: {
        "raster-opacity": 0.6,
        "raster-fade-duration": 0,
      },
      "source-layer": "changes_2016-2019",
    },
  ],
  FEMA100yr: [
    {
      id: "FEMA100yr",
      type: "fill",
      source: "flood",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "hsl(184, 99%, 66%)",
        "fill-opacity": 0.5,
      },
      "source-layer": "flood",
    },
  ],
  FEMA500yr: [
    {
      id: "FEMA500yr",
      type: "fill",
      source: "fema500yr",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "#d30303",
        "fill-opacity": 0.5,
      },
      "source-layer": "fema500yr",
    },
  ],
  Creeks: [
    {
      id: "Creeks",
      type: "line",
      source: "creeks_state",
      layout: { visibility: "none" },
      paint: {
        "line-color": "#0abeff",
        "line-opacity": 1,
        "line-width": 2,
      },
      "source-layer": "creeks_state",
      minzoom: 10.2,
    },
    {
      id: "Creeks_labels",
      type: "symbol",
      source: "creeks_state",
      layout: {
        visibility: "none",
        "text-field": ["to-string", ["get", "GNIS_NAME"]],
        "text-padding": ["interpolate", ["linear"], ["zoom"], 8, 20, 13, 800],
        "text-size": 12,
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        "symbol-placement": "line",
        "symbol-spacing": 250,
        "text-max-angle": 45,
        "text-justify": "center",
      },
      paint: {
        "text-color": "hsl(196, 21%, 100%)",
        "text-halo-width": 2,
        "text-halo-color": "hsla(0, 2%, 100%, 0)",
      },
      "source-layer": "creeks_state",
      minzoom: 10,
    },
  ],
  CWQ: [
    {
      id: "CWQ",
      type: "fill",
      source: "cwqbz",
      layout: { visibility: "none" },
      paint: {
        "fill-color": [
          "match",
          ["get", "critical_w"],
          ["CWQZ"],
          "hsl(308, 77%, 72%)",
          ["WQTZ"],
          "hsl(318, 98%, 82%)",
          "hsla(0, 0%, 0%, 0)",
        ],
        "fill-opacity": 0.6,
        "fill-outline-color": "hsla(0, 0%, 0%, 0)",
      },
      "source-layer": "cwqbz",
    },
  ],
  ContourLines: [
    {
      id: "ContourLines",
      type: "line",
      source: "contour_elev",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(60, 100%, 69%)",
        "line-opacity": 1,
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 0.2, 22, 3],
      },
      "source-layer": "contour_elev",
      minzoom: 11,
    },
    {
      id: "ContourLines_labels",
      type: "symbol",
      source: "contour_elev",
      layout: {
        visibility: "none",
        "text-field": ["to-string", ["get", "ELEVATION"]],
        "text-padding": 10,
        "text-size": 20,
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        "symbol-placement": "line",
        "symbol-spacing": 500,
        "text-max-angle": 45,
      },
      paint: {
        "text-color": "#ffff61",
        "text-halo-width": 2,
        "text-halo-color": "#000000",
      },
      "source-layer": "contour_elev",
      minzoom: 11,
    },
  ],
  Slope: [
    {
      id: "Slope",
      type: "raster",
      source: "slope",
      layout: { visibility: "none" },
      paint: {},
    },
  ],
  Pipelines: [
    {
      id: "Pipelines",
      type: "line",
      source: "pipelines",
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(0, 98%, 66%)",
        "line-opacity": 1,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1, 16, 6],
        "line-blur": ["interpolate", ["linear"], ["zoom"], 8, 0, 16, 2],
        "line-gap-width": 2,
      },
      "source-layer": "pipelines",
    },
  ],
  EdwardsRecharge: [
    {
      id: "EdwardsRecharge",
      type: "fill",
      source: "edwardsrechargezone",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "hsla(288, 90%, 56%, 0.73)",
        "fill-opacity": 1,
      },
      "source-layer": "edwardsrechargezone",
    },
  ],
  EdwardsContributing: [
    {
      id: "EdwardsContributing",
      type: "fill",
      source: "edwardscontributingzone",
      layout: { visibility: "none" },
      paint: {
        "fill-color": "hsla(72, 93%, 53%, 0.61)",
        "fill-opacity": 1,
      },
      "source-layer": "edwardscontributingzone",
    },
  ],
  GCWH: [
    {
      id: "GCWH",
      type: "fill",
      source: "gcwh",
      layout: { visibility: "none" },
      paint: {
        "fill-color": [
          "match",
          ["get", "ZONEDESC"],
          ["Not Known to be Habitat"],
          "hsla(120, 92%, 70%, 0.65)",
          [
            "match",
            ["get", "ZONEDESC"],
            ["Unconfirmed Habitat"],
            "hsla(38, 84%, 59%, 0.65)",
            ["Confirmed Habitat"],
            "hsla(0, 97%, 48%, 0.65)",
            "hsla(0, 97%, 48%, 0)",
          ],
        ],
        "fill-opacity": 1,
      },
      "source-layer": "gcwh",
    },
  ],
  MigrationInflow: [],
  Results: [
    {
      id: "Results",
      type: "fill",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "status"], 1],
          "hsl(61, 94%, 63%)",
          ["==", ["get", "status"], 0],
          "hsl(210, 98%, 60%)",
          "hsl(300, 95%, 68%)",
        ],
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 11.5, 0.7, 16, 0.25],
        "fill-outline-color": "hsla(0, 96%, 56%, 0)",
      },
      "source-layer": "properties",
      createFilter: (resultsIDs) => ["in", ["to-string", ["get", "ID"]], ["literal", resultsIDs]],
    },
    {
      id: "Results_outline",
      type: "line",
      source: "properties",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "line-color": "hsl(108, 100%, 45%)",
        "line-opacity": 1,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          5,
          22,
          ["case", ["boolean", ["feature-state", "hover"], false], 5, 2.5],
        ],
      },
      "source-layer": "properties",
      createFilter: (resultsIDs) => ["in", ["to-string", ["get", "ID"]], ["literal", resultsIDs]],
    },
  ],
  Unacast: [
    {
      id: "Unacast",
      type: "fill",
      source: "growth",
      layout: {
        // make layer visible by default
        visibility: "none",
      },
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "gridcode"],
          0,
          "hsla(92, 100%, 64%, 0)",
          132,
          "hsl(27, 100%, 69%)",
          200,
          "hsl(0, 100%, 61%)",
          528,
          "hsl(304, 100%, 63%)",
        ],
        "fill-opacity": 0.4,
        "fill-outline-color": "hsla(0, 0%, 0%, 0)",
      },
      "source-layer": "growth",
      minzoom: 8.2,
    },
  ],
  Perennial: [
    {
      id: "Perennial",
      type: "line",
      source: "perennial",
      "source-layer": "perennial",
      minzoom: 8,
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(188, 66%, 62%)",
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.5, 22, 4],
      },
    },
    {
      id: "Perennial_outline",
      type: "line",
      source: "perennial",
      "source-layer": "perennial",
      minzoom: 8,
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(187, 36%, 24%)",
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1, 22, 8],
      },
    },
    {
      id: "Perennial_label",
      type: "symbol",
      source: "perennial",
      "source-layer": "perennial",
      minzoom: 8,
      layout: {
        "text-field": ["to-string", ["get", "GNIS_NAME"]],
        "text-size": ["interpolate", ["linear"], ["zoom"], 8, 8, 22, 20],
        "text-font": ["Ubuntu Mono Bold Italic", "Arial Unicode MS Regular"],
        "symbol-spacing": 300,
        "text-padding": 0,
        "text-max-angle": 60,
        "text-transform": "uppercase",
        "symbol-placement": "line",
        visibility: "none",
      },
      paint: {
        "text-halo-width": 1,
        "text-halo-color": "hsl(0, 99%, 5%)",
        "text-color": "#ffffff",
        "text-halo-blur": 1,
      },
    },
  ],
  Intermittent: [
    {
      id: "Intermittent",
      type: "line",
      source: "intermittent_creeks",
      "source-layer": "intermittent",
      // minzoom changed from 12 to 8
      minzoom: 8,
      layout: { visibility: "none" },
      paint: {
        "line-color": "hsl(188, 66%, 62%)",
        "line-dasharray": [1, 1],
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1, 22, 2],
      },
    },
    {
      id: "Intermittent_label",
      type: "symbol",
      source: "intermittent_creeks",
      "source-layer": "intermittent",
      // minzoom changed from 12 to 8
      minzoom: 8,
      layout: {
        "text-field": ["to-string", ["get", "GNIS_NAME"]],
        "symbol-placement": "line",
        "text-size": ["interpolate", ["linear"], ["zoom"], 12, 10, 22, 14],
        "text-font": ["Ubuntu Italic", "Arial Unicode MS Regular"],
        "symbol-spacing": 300,
        "text-max-angle": 60,
      },
      paint: { "text-color": "hsl(0, 0%, 100%)" },
    },
  ],
  Waterbody: [
    {
      id: "Waterbody",
      type: "fill",
      source: "waterbody",
      "source-layer": "waterbody",
      minzoom: 6,
      paint: { "fill-opacity": 0.8, "fill-color": "hsl(188, 66%, 62%)" },
      layout: { visibility: "none" },
    },
  ],
  Whiteout: [
    {
      id: "Whiteout",
      type: "raster",
      source: "whiteout",
      minzoom: 5,
      paint: {
        "raster-brightness-max": ["step", ["zoom"], 0, 11, 1],
        "raster-saturation": ["step", ["zoom"], 0, 11, 1],
        "raster-brightness-min": ["step", ["zoom"], 0, 11, 1],
      },
      layout: { visibility: "none" },
    },
  ],
};

export const ownershipLayers = {
  line: {
    // 'id': county + '_outline',
    type: "line",
    // 'source': county,
    layout: { visibility: "visible" },
    paint: {
      "line-color": "hsl(61, 100%, 57%)",
      "line-opacity": 1,
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8,
        ["case", ["boolean", ["feature-state", "hover"], false], 6, 1.5],
        15.5,
        ["case", ["boolean", ["feature-state", "hover"], false], 6, 1.5],
      ],
    },
    // 'source-layer': county,
    minzoom: 9,
    createFilter: (value1, value2) => [
      "all",
      [">", ["get", "ll_gisacre"], value1],
      ["<", ["get", "ll_gisacre"], value2],
    ],
    // 'filter': ["all",[">",["get", "ll_gisacre"],parseInt(sliderOwnerships.noUiSlider.get()[0])],["<",["get", "ll_gisacre"],parseInt(sliderOwnerships.noUiSlider.get()[1])]]
  },
  fill: {
    // 'id': county,
    type: "fill",
    // 'source': county,
    layout: { visibility: "visible" },
    paint: {
      "fill-color": "rgb(177, 250, 30)",
      "fill-opacity": 0,
      "fill-outline-color": "rgb(177, 250, 30)",
    },
    // 'source-layer': county,
    minzoom: 9,
    createFilter: (value1, value2) => [
      "all",
      [">", ["get", "ll_gisacre"], value1],
      ["<", ["get", "ll_gisacre"], value2],
    ],
    // 'filter': ["all",[">",["get", "ll_gisacre"],parseInt(sliderOwnerships.noUiSlider.get()[0])],["<",["get", "ll_gisacre"],parseInt(sliderOwnerships.noUiSlider.get()[1])]]
  },
};

export const parcelLayers = {
  merge_line: {
    // 'id': county + '_outline',
    type: "line",
    // 'source': county,
    layout: {
      // make layer visible by default
      visibility: "visible",
    },
    paint: {
      "line-color": "hsl(100, 100%, 53%)",
      "line-opacity": 1,

      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8,
        ["case", ["boolean", ["feature-state", "hover"], false], 6, 0.5],
        15.5,
        ["case", ["boolean", ["feature-state", "hover"], false], 6, 1],
      ],
    },
    // 'source-layer': county,
    // 'maxzoom': 12
  },
  marge_fill: {
    // 'id': county,
    type: "fill",
    // 'source': county,
    layout: {
      // make layer visible by default
      visibility: "visible",
    },
    paint: {
      "fill-color": "rgb(177, 250, 30)",
      "fill-opacity": 0,
      "fill-outline-color": "rgb(177, 250, 30)",
    },
    // 'source-layer': county,
    // 'maxzoom': 12
  },
  line: {
    // 'id': county + '_outline',
    type: "line",
    // 'source': county,
    layout: {
      // make layer visible by default
      visibility: "visible",
    },
    paint: {
      "line-color": "hsl(100, 100%, 53%)",
      "line-opacity": 1,

      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8,
        ["case", ["boolean", ["feature-state", "hover"], false], 6, 0.5],
        15.5,
        ["case", ["boolean", ["feature-state", "hover"], false], 6, 1],
      ],
    },
    // 'source-layer': county,
    // 'minzoom': 12
  },
  fill: {
    // 'id': county,
    type: "fill",
    // 'source': county,
    layout: {
      // make layer visible by default
      visibility: "visible",
    },
    paint: {
      "fill-color": "rgb(177, 250, 30)",
      "fill-opacity": 0,
      "fill-outline-color": "rgb(177, 250, 30)",
    },
    // 'source-layer': county,
    // 'minzoom': 12
  },
};
