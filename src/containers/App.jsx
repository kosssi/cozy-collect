import React, { Component } from 'react'

import Sidebar from '../components/Sidebar'
import Notifier from '../components/Notifier'

import Loading from '../components/Loading'
import Failure from '../components/Failure'

class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.store = this.context.store

    this.state = {
      categories: [],
      isFetching: true
    }

    this.store.fetchAllAccounts()
      .then(() => {
        this.setState({
          categories: this.store.getCategories(),
          isFetching: false
        })
      })
      .catch(error => {
        this.setState({
          isFetching: false,
          error
        })
      })
  }

  render () {
    const { children } = this.props
    // If this is an OAuth response
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get('account')) {
      const opener = window.opener
      const accountKey = queryParams.get('account')
      const targetOrigin = window.location.origin || `${window.location.protocol}//${window.location.hostname}${(window.location.port ? ':' + window.location.port : '')}`
      opener.postMessage({
        key: accountKey,
        origin: window.name
      }, targetOrigin)
      window.close()
    }
    const { categories, isFetching, error } = this.state
    if (error) {
      return (
        <div className='con-initial-error'>
          <Failure errorType='initial' />
        </div>
      )
    }
    return (
      isFetching
        ? <div className='con-initial-loading'>
          <Loading loadingType='initial' />
        </div>
        : <div className='con-wrapper coz-sticky'>
          <Sidebar categories={categories} />
          <main className='con-content'>
            <div role='contentinfo'>
              {children}
            </div>
          </main>
          <Notifier />
        </div>
    )
  }
}

export default App