import qs from 'qs';
import setImmediate from 'setImmediate';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
  ClearAll,
  InstantSearch,
  Hits,
  HierarchicalMenu,
  RefinementList,
  Toggle,
}
  from 'react-instantsearch/dom';

  function createURL(searchState) {
    return `${window.location.pathname}?${qs.stringify(searchState)}`;
  }

  const withUrlSync = App => class extends React.Component {
    constructor() {
      super();
      this.state = { searchState: qs.parse(window.location.search.slice(1)) };
      window.onpopstate = () => {
        this.setState({ searchState: qs.parse(window.location.search.slice(1)) });
      };
      this.onSearchStateChange = this.onSearchStateChange.bind(this);
    }

    onSearchStateChange(nextSearchState) {
      const THRESHOLD = 700;
      const newPush = Date.now();
      const search = nextSearchState ? `${window.location.pathname}?${qs.stringify(nextSearchState)}` : '';
      if (this.state.lastPush && newPush - this.state.lastPush <= THRESHOLD) {
        window.history.replaceState(null, null, search);
      } else {
        window.history.pushState(null, null, search);
      }
      this.setState({ lastPush: newPush, searchState: nextSearchState });
    }

    render() {
      return (
        <App
          {...this.props}
          searchState={this.state.searchState}
          onSearchStateChange={this.onSearchStateChange}
          createURL={createURL}
        />
      );
    }
  };
  const ALGOLIA_APP_ID = 'EUEY0IRRO5';
  const ALGOLIA_API_KEY = '77785c53c15c248b6467e988fdd8e175';

  const App = (props) => {
    const createURL = props.createURL.bind(this);

    const onSearchStateChange = props.onSearchStateChange.bind(this);
    return (
      <InstantSearch
        appId={ALGOLIA_APP_ID}
        apiKey={ALGOLIA_API_KEY}
        indexName="products"
        searchParameters={{ hitsPerPage: 60 }}
        searchState={props.searchState}
        createURL={createURL}
        onSearchStateChange={onSearchStateChange}
      >
        <section
          id="hits-container"
        >
          <Hits
            hitComponent={Item}
          />
        </section>
          <Toggle
            key="isSuitableForOutdoor"
            attributeName="isSuitableForOutdoor"
            label="Suitable for outdoor"
            value
          />
          <Toggle
            key="isOnSale"
            attributeName="isOnSale"
            label="On Sale"
            value
          />
      </InstantSearch>

    );
  };

  const Item = ({ hit }) => {
    return (
      <div>
        <p>
          {`${hit.objectID}`}
        </p>
        <p>
          {`${hit.isSuitableForOutdoor}`}
        </p>
        <p>
          {`${hit.isOnSale}`}
        </p>
      </div>)
  };

  const Test = withUrlSync(App)
  ReactDOM.render(<Test/>, document.querySelector('#instantsearch-root'));
