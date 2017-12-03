import React from "react"
import { Button, Dropdown, Header, Icon } from "semantic-ui-react"

import actions from "../actions"
import { prefectureDef } from "../helpers/params"

export default class AppHeader extends React.Component {
  render() {
    const prefectureOptions = prefectureDef.map(x => {
      return { key: x.id, value: x.id, text: x.prefecture_jp }
    })
    const columnOptions = this.props.geoStatData
      ? this.props.geoStatData.csvKeys.slice(1, -1).map((x, i) => {
        return { key: i, value: i, text: x }
      })
      : []

    const headerElem = (
      <div id="header">
        <Header as="h2">
          <Icon name="map outline" />
          <Header.Content>
            Seseki Viewer
          <Header.Subheader className="subtitle">Geo Statistical Data Visualizer</Header.Subheader>
          </Header.Content>
        </Header>
        <div id="prefecture_selector">
          <Dropdown
            placeholder="Select Prefecture"
            multiple
            fluid
            selection
            options={prefectureOptions}
            value={this.props.areas.map(x => x.id)}
            onChange={(e, x) => this.props.dispatch({ type: actions.AREA_CHANGE, data: { areas: x.value } })}
          />
        </div>
        <div id="toolbox">
          <Button content="Open CSV" icon="file excel outline" labelPosition="left" />
          <Button content="Edit" icon="edit" labelPosition="left" />
        </div>
        <div id="column-selector">
          <Dropdown
            placeholder="Select column"
            fluid
            selection
            options={columnOptions}
            value={this.props.geoStatisticalDataColumn}
            onChange={(e, x) => this.props.dispatch({ type: actions.GEOSTATISTICALDATA_CHANGE_COLUMN, data: { column: x.value } })}
          />
        </div>
      </div>
    )
    return headerElem
  }
}