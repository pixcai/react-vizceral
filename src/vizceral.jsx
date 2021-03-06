import React from 'react'
import PropTypes from 'prop-types'
import VizceralGraph from 'vizceral'
import get from 'lodash/get'
import set from 'lodash/set'
import noop from 'lodash/noop'
import isEqual from 'lodash/isEqual'

const style = {
  width: '100%',
  height: '100%'
}

class Vizceral extends React.Component {

  updateStyles (styles) {
    const styleNames = this.vizceral.getStyles()

    this.vizceral.updateStyles(styleNames.reduce((names, styleName) => set(
      names,
      styleName,
      get(styles, styleName, names[styleName])
    )))
  }

  initVizceralEvent () {
    const {
      viewChanged,
      objectHighlighted,
      objectHovered,
      nodeUpdated,
      nodeContextSizeChanged,
      matchesFound,
      viewUpdated
    } = this.props

    this.vizceral.on('viewChanged', viewChanged)
    this.vizceral.on('objectHighlighted', objectHighlighted)
    this.vizceral.on('objectHovered', objectHovered)
    this.vizceral.on('nodeUpdated', nodeUpdated)
    this.vizceral.on('nodeContextSizeChanged', nodeContextSizeChanged)
    this.vizceral.on('matchesFound', matchesFound)
    this.vizceral.on('viewUpdated', viewUpdated)
  }

  initVizceralGraph (el) {
    const {
      styles,
      allowDraggingOfNodes,
      showLabels,
      filters,
      definitions,
      traffic,
      view,
      objectToHighlight
    } = this.props

    if (!el) {
      return delete this.vizceral
    }

    this.vizceral = new VizceralGraph(el)
    this.updateStyles(styles)
    this.initVizceralEvent()

    this.vizceral.setOptions({
      allowDraggingOfNodes,
      showLabels
    })

    if (!isEqual(filters, Vizceral.defaultProps.filters)) {
      this.vizceral.setFilters(filters)
    }
    if (!isEqual(definitions, Vizceral.defaultProps.definitions)) {
      this.vizceral.updateDefinitions(definitions)
    }
    
    setTimeout(() => {
      this.vizceral.setView(
        view || Vizceral.defaultProps.view,
        objectToHighlight
      )
      this.vizceral.updateData(traffic)
      this.vizceral.animate(0)
      this.vizceral.updateBoundingRectCache()
    }, 0)
  }

  componentWillReceiveProps (nextProps) {
    const {
      styles,
      view,
      objectToHighlight,
      filters,
      showLabels,
      allowDraggingOfNodes,
      modes,
      definitions,
      match,
      traffic
    } = this.props

    if (!isEqual(nextProps.styles, styles)) {
      this.updateStyles(nextProps.styles)
    }
    if (!isEqual(nextProps.view, view) || 
        !isEqual(nextProps.objectToHighlight, objectToHighlight)) {
      this.vizceral.setView(nextProps.view, nextProps.objectToHighlight)
    }
    if (!isEqual(nextProps.filters, filters)) {
      this.vizceral.setFilters(nextProps.filters)
    }
    if (!isEqual(nextProps.showLabels, showLabels) || 
        !isEqual(nextProps.allowDraggingOfNodes, allowDraggingOfNodes)) {
      this.vizceral.setOptions({
        allowDraggingOfNodes: nextProps.allowDraggingOfNodes,
        showLabels: nextProps.showLabels
      })
    }
    if (!isEqual(nextProps.modes, modes)) {
      this.vizceral.setModes(nextProps.modes)
    }
    if (!isEqual(nextProps.definitions, definitions)) {
      this.vizceral.updateDefinitions(nextProps.definitions)
    }
    if (nextProps.match !== match) {
      this.vizceral.findNodes(nextProps.match)
    }
    nextProps.traffic.updated = nextProps.traffic.updated || Date.now()
    if (!traffic.nodes || 
        nextProps.traffic.updated > (traffic.updated || 0)) {
      this.vizceral.updateData(nextProps.traffic)
    }
  }

  render () {
    return (
      <div className="vizceral">
        <canvas style={style} ref={el => this.initVizceralGraph(el)} />
        <div className="vizceral-notice" />
      </div>
    )
  }
}

Vizceral.defaultProps = {
  definitions: {},
  filters: [],
  match: '',
  nodeUpdated: noop,
  nodeContextSizeChanged: noop,
  matchesFound: noop,
  objectHighlighted: noop,
  objectHovered: noop,
  objectToHighlight: null,
  showLabels: true,
  allowDraggingOfNodes: false,
  styles: {},
  traffic: {},
  viewChanged: noop,
  viewUpdated: noop,
  view: []
}

export default Vizceral

