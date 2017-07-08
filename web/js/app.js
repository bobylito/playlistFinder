/* global instantsearch */

// Registering service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Instanciating InstantSearch.js

app({
  appId: 'JTH1JDTDFT',
  apiKey: '25e594bccdc9059ec90ccbe80dcee493',
  indexName: 'spotify-search'
});

function app(opts) {
  var search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    createAlgoliaClient: function(algoliasearch, appId, apiKey) {
      return algoliasearch(appId, apiKey, {
        protocol: 'https:'
      });
    },
  });

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for a playlist'
    })
  );

  search.addWidget(
    instantsearch.widgets.infiniteHits({
      container: '#hits',
      hitsPerPage: 24,
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results')
      },
      transformData: {
        item: function(item) {
          item.poster = item.images[0];
          return item;
        }
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats'
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#artists',
      attributeName: 'artists',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      limit: 10,
      operator: 'and',
      searchForFacetValues: true,
      templates: {
        header: getHeader('Artists')
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#songs',
      attributeName: 'songs',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      limit: 10,
      operator: 'and',
      searchForFacetValues: true,
      templates: {
        header: getHeader('Songs')
      }
    })
  );

  search.start();

  var currentSearches = 1;
  search.helper.on('search', function() {
    document.body.classList.toggle('is-searching', true);
  });

  search.helper.on('searchQueueEmpty', function() {
    document.body.classList.remove('is-searching');
  });

  var buttons = [].slice.call(document.querySelectorAll('.filter-menu'));
  var allMenus = buttons.map(function(btn) {
    var target = btn.dataset['for'];
    return document.querySelector(target);
  });
  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      var $list = document.querySelector(this.dataset['for'])
      var isAlreadyDisplayed = $list.classList.contains('show');
      allMenus.forEach(function(m) {
        m.classList.remove('show');
      });
      buttons.forEach(function(b) {
        b.classList.remove('active');
      });
      if(!isAlreadyDisplayed) {
        $list.classList.toggle('show');
        this.classList.toggle('active');
      }
    });
  });
}

function getTemplate(templateName) {
  return document.querySelector('#' + templateName + '-template').innerHTML;
}

function getHeader(title) {
  return '<h5>' + title + '</h5>';
}
