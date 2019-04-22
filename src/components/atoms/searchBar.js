import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import _ from 'lodash'

class SearchBar extends Component {
  state = {
    loading: false,
    text: '',
    results: []
  }

  componentWillMount() {
    this.handleReset()
  }

  handleReset = () => {
    this.setState({ loading: false, text: '', results: [] })
  }

  handleChooseResult = (e, { result }) => {
    this.setState({ text: result.title })
  }

  handleChangeSearch = (e, { value }) => {
    this.setState({ loading: true, text: value })

    setTimeout(() => {
      if (this.state.text.length < 1) {
        return this.resetComponent()
      }

      // get results from API
      const results = []
      this.setState({ loading: false, results })
    }, 300)
  }

  render() {
    const { loading, text, results } = this.state
    return (
      <Search
        category
        loading={loading}
        onResultSelect={this.handleChooseResult}
        onSearchChange={_.debounce(this.handleChangeSearch, 500, { leading: true })}
        results={results}
        value={text}
        {...this.props}
      />
    )
  }
}

export default SearchBar