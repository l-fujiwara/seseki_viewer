import React from "react"
import { Map, GeoJSON, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { geoCentroid } from "d3-geo"

class MyGeoJSON extends GeoJSON {
  updateLeafletElement(fromProps, toProps) {
    const geoJsonLayer = this.leafletElement
    geoJsonLayer.getLayers().forEach((x) => {
      geoJsonLayer.resetStyle(x)
      toProps.onEachFeature(x.feature, x, geoJsonLayer)
    })
    super.updateLeafletElement(fromProps, toProps)
  }
}

export default class Heatmap extends React.Component {
  render() {
    /* heatmap layer */
    const heatmapAttrib =
      '&copy; <a href="http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03.html">国土数値情報 行政区域データ</a>, ' +
      'CC BY NC SA 4.0 <a href="https://github.com/colspan">Miyoshi(@colspan)</a> <a href="https://github.com/colspan/seseki_viewer">Seseki</a>'
    let featureStyle = {
      color: "#222",
      weight: 0.3,
      opacity: 0.6,
      fillOpacity: 0.6,
      fillColor: "#ffffff"
    }
    let eachFeature = (d, l) => {
      l.bindTooltip(d.name)
      l.on({
        mouseover: (e) => {},
        mouseout: (e) => {},
        click: (e) => {}
      })
    }
    /* データがあったらイベントを付与する */
    if (this.props.geoStatData) {
      /* データをバインドする */
      const geoStatData = this.props.geoStatData
      const targetColumn = geoStatData.getByColumnName(
        geoStatData.csvKeys[this.props.geoStatisticalDataColumn + 1]
      )
      const idMap = this.props.idMap
      featureStyle = (d) => {
        return {
          color: "#222",
          weight: 0.3,
          opacity: 0.6,
          fillOpacity: 0.6,
          fillColor: targetColumn.colorScale(
            targetColumn.parsedData[idMap[d.name]]
          )
        }
      }
      eachFeature = (d, layer, parent) => {
        const communeId = d.communeId
        const commune_name = d.name
        const value = targetColumn.format(
          targetColumn.parsedData[idMap[d.name]]
        )
        /* binding tooltip */
        const tooltipElem = document.createElement("span")
        tooltipElem.innerHTML = `<span class="commune_name">${commune_name}</span><div class="value">${value}</div>`
        tooltipElem.addEventListener("click", (x) => {
          // click({ name: commune_name, communeId: communeId })
        })
        layer.bindTooltip(tooltipElem, { className: "layer_tooltip" })
        let lastTarget = null /* Tooltipがゴミとして残るのを防ぐ */
        layer.on({
          mouseover: (e) => {
            const style = {
              weight: 5,
              fillColor: "#dce775",
              fillOpacity: 0.7
            }
            /* 同じ市町村を同時に塗りかえる */
            if (parent)
              parent
                .getLayers()
                .filter((y) => {
                  return y.feature.communeId === communeId
                })
                .forEach((y) => {
                  y.setStyle(style)
                  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    y.bringToFront()
                  }
                })
            /* Tooltipがゴミとして残るのを防ぐ */
            lastTarget = e.target
          },
          mouseout: (e) => {
            /* 同じ市町村を同時に塗りかえる */
            if (parent)
              parent
                .getLayers()
                .filter((y) => {
                  return y.feature.communeId === communeId
                })
                .forEach((y) => {
                  y.setStyle(featureStyle(y.feature))
                })
          },
          click: (e) => {
            /* Tooltipがゴミとして残るのを防ぐ */
            if (lastTarget) lastTarget.closeTooltip()
            this.props.openDetailView(communeId)
          }
        })
      }
    }
    const heatMapElem = this.props.geoJson
      ? <MyGeoJSON
          data={this.props.geoJson}
          style={featureStyle}
          onEachFeature={eachFeature}
          attribution={heatmapAttrib}
        />
      : null

    /* tile layer */
    const centroid = this.props.geoJson
      ? geoCentroid(this.props.geoJson)
      : [141.348541, 43.065617]
    const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    const osmAttrib =
      '&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    const tileLayerElem = (
      <TileLayer attribution={osmAttrib} url={osmUrl} opacity={0.2} />
    )

    const mapElem = (
      <Map
        center={[centroid[1], centroid[0]]}
        zoom={7}
        className="sesekimap"
        refs="map"
      >
        {heatMapElem}
        {tileLayerElem}
      </Map>
    )

    return mapElem
  }
}
