import React from 'react'
import { Button, Icon, Modal, Table } from 'semantic-ui-react'

export default class ExampleSelector extends React.Component {
  getData() {
    return []
  }

  render() {
    const { sampleDataDef } = this.props
    const bodyRows = sampleDataDef.map(x => {
      return (
        <Table.Row
          key={x.file}
          onClick={() => {
            this.props.selectExampleSelector(x)
          }}
          onMouseOver={() => {
            null
          }}
          onMouseOut={() => {
            null
          }}>
          <Table.Cell>{x.title}</Table.Cell>
          <Table.Cell>{x.right_holder}</Table.Cell>
        </Table.Row>
      )
    })

    const rankingTable = (
      <Table compact sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Right Holder</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{bodyRows}</Table.Body>
      </Table>
    )
    return (
      <Modal
        open={this.props.exampleSelector}
        closeOnDimmerClick
        onClose={this.props.closeExampleSelector}>
        <Modal.Header>Example Datasets</Modal.Header>
        <Modal.Content>
          <Modal.Description>{rankingTable}</Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={this.props.closeExampleSelector}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}