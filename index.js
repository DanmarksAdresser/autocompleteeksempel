import './styles.css';
import autocomplete from 'autocomplete.js';

function initAutocomplete(input, url, selected) {

  function search(url) {
    return function search(query, callback) {
      fetch(url+query)
      .catch(function (error) {
        alert(error.message);
        callback([]);
      })
      .then(function(response) {
        if (response.status >=400 && response.status <= 499) {
          response.json().then(function (object) {
            alert(object.type + ': ' + object.title);
          });            
          callback([]);
        }
        else if (response.status >= 200 && response.status <=299 ){
          return response.json();
        }
      }) 
      .then( function ( resultat ) { 
        callback(resultat);
      });
    }
  }

  autocomplete(input, { debug: true, hint: false, templates: { empty: '' }, autoselect: true }, [
    {
      source: search(url),
      displayKey: 'betegnelse',
      templates: {
        suggestion: function(suggestion) {
          return '<div>' + suggestion.betegnelse + '</div>';
        }
      }
    }
  ]).on('autocomplete:selected', function(even, suggestion, dataset) {
    even, dataset;
   // console.log('selected', suggestion, dataset);
    selected(suggestion);
  }).on('autocomplete:cursorchanged', function(even, suggestion, dataset) {
    even, suggestion, dataset;
    //console.log('cursorchanged', suggestion, dataset);
  });
}

function selected(objekt) {
	document.getElementById('label').textContent = 'Du valgte ' + objekt.betegnelse;
	//alert('Du har valgt ' + objekt.betegnelse);
}

initAutocomplete('#input', 'https://dawa.aws.dk/stednavne2?autocomplete&q=', selected);