import { parse } from "query-string"

import actions from "../actions"
import { prefectureDef } from "../helpers/params"

const initialState = {
  areas: [],
  idMap: {},
  communes: {},
  geoJson: null,
  geoJsonFiles: [],
  geoStatisticalData: null,
  geoStatisticalDataFiles: [],
  geoStatisticalDataColumn: null
}

function parseHash() {
  const parsedHash = parse(location.hash)
  let areas = []
  if (parsedHash.areas) {
    const hashAreas = parsedHash.areas.split(",")
    areas = prefectureDef.filter(x => {
      return hashAreas.indexOf(x.id) != -1
    })
  }
  return {
    areas
  }
}

export default function sesekiReducer(state = initialState, action) {
  const parsedHash = parseHash()
  const newState = Object.assign({}, state, parsedHash)
  switch (action.type) {
    case actions.INIT:
      return newState
    case actions.LOCATION_CHANGE:
      console.log("TODO") // TODO
      return newState
    case actions.AREA_CHANGE:
      //location.href = action.areas
      return newState
    case actions.GEOJSON_CLEAR:
      newState.idMap = []
      newState.geoJson = null
      newState.geoJsonFiles = null
      return newState
    case actions.GEOJSON_FETCH_REQUEST:
      return newState
    case actions.GEOJSON_FETCH_SUCCEEDED:
      newState.idMap = action.data.idMap
      newState.communes = action.data.communes
      newState.geoJson = action.data.geoJson
      newState.geoJsonFiles = action.data.options.geoJsonFiles
      return newState
    case actions.GEOJSON_FETCH_FAILED:
      return newState
    case actions.GEOSTATISTICALDATA_FETCH_SUCCEEDED:
      newState.geoStatisticalData = action.data.geoStatisticalData
      newState.geoStatisticalDataFiles = ["TODO"] // TODO
      newState.geoStatisticalDataColumn = 0
      return newState
    default:
      return newState
  }
}
