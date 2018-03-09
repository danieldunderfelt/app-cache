import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { observable, action, reaction } from 'mobx'
import styled from 'styled-components'
import UIRouter from './UIRouter'
import createHistory from 'history/createBrowserHistory'

const TabWrapper = styled.nav`
  display: flex;
  flex-direction: column;
  max-width: 960px;
  margin: 0 auto;
  font-family: "Helvetica", Arial, sans-serif;
`

const Tab = styled.button`
  padding: 1em;
  appearance: none;
  background: ${({ selected = false }) => selected ? '#0080FF' : '#1034A6' };
  border: 0;
  color: white;
  outline: none;
  cursor: pointer;
  margin-right: 2px;
  font-size: 1.2em;
  flex: 1 1 auto;
  font-weight: 700;
  transition: color .15s ease;
  text-transform: uppercase;
  
  &:hover {
    color: white;
  }
  
  &.tab-position-right {
    float: right;
  }
`

const TabContent = styled.div`
  padding: 1em;
  margin-top: 1em;
`

const SelectRouter = styled.div`
  margin-bottom: 2em;
  padding: 1em;
  border-bottom: 1px solid #efefef;
`

const INITIAL_ROUTE = '/tab'

class TabBar extends Component {
  
  constructor() {
    super()
  
    this.tabState = observable({
      tabs: [
        { label: 'Tab one', path: '/tab' },
        { label: 'Tab two', path: '/tab/tab-two' },
        { label: 'Tab three', path: '/tab/tab-two/tab-three' },
      ],
      selectedTab: INITIAL_ROUTE,
      selectedRouter: 'hash'
    })
  
    const setTab = action(tabName => {
      this.tabState.selectedTab = tabName
    })
    
    this.setRouter = action(routerType => {
      this.tabState.selectedRouter = routerType
    })
  
    let routerListener = null
    this.router = null
    
    // Switch the routers
    reaction(() => this.tabState.selectedRouter, router => {
      if(routerListener !== null) {
        routerListener() // Remove the listener
      }
      
      this.router = router === 'hash' ?
        UIRouter(INITIAL_ROUTE) :
        UIRouter(INITIAL_ROUTE, createHistory())
      
      routerListener = this.router.listen(setTab) // Add the listener
      setTab(this.router.get()) // Update the current location from the new router
    }, true)
  }
  
  render() {
    const { tabs, selectedTab, selectedRouter } = this.tabState
    const currentTab = tabs.find(t => t.path === selectedTab)
    
    console.log(selectedTab)
    
    return (
      <TabWrapper>
        <h2>
          ui-router
        </h2>
        <p>
          This is an example of how to use the UI Router in React. Peek into the <code>example/src/App.js</code> file to see how it's wired up!
        </p>
        <p>
          To demonstrate how to use the hash-based setup and the history based setup, you can switch between the two with these controls. Obviously you'd use either one in a real app, not both.
        </p>
        <SelectRouter>
          <label>
            <input
              onChange={ () => this.setRouter('hash') }
              value="hash"
              name="router"
              checked={ selectedRouter === 'hash' }
              type="radio" /> Use hash router
          </label><br />
          <label>
            <input
              onChange={ () => this.setRouter('history') }
              value="history"
              name="router"
              checked={ selectedRouter === 'history' }
              type="radio" /> Use history router
          </label>
        </SelectRouter>
        <div>
          { tabs.map(tab => (
            <Tab
              selected={ selectedTab === tab.path }
              onClick={ () => this.router.go(tab.path) }
              key={ `tab_item_${ tab.path }` }>
              { tab.label }
            </Tab>
          )) }
        </div>
        <TabContent>
          You selected { currentTab ? currentTab.label : '' }
        </TabContent>
      </TabWrapper>
    )
  }
}

export default observer(TabBar)