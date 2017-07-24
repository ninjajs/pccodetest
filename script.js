
function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

function highlightWord(keyword, fullString) {
  var re = new RegExp(keyword, 'gi');
  return fullString.replace(re, function(str) {return '<b>'+str+'</b>'});
}

function search(keyword, list) {
  console.log('search', keyword);
  var options = {
    shouldSort: true,
    //includeMatches: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
      "name"
    ]
  };

  var fuse = new Fuse(list, options);
  var results = fuse.search(keyword);
  var data = [];

  //console.log('results ' + results.length);

  for (var i = 0; i < results.length && i < 10; i++) {
    var curr = results[i];
    var highlighted = highlightWord(keyword, curr.name);
    var obj = {
      name: highlighted,
      type: curr.type.replace('_', ' '),
      url: curr.url
    };

    data.push(obj);
  }

  return data;
}

function autocomplete(e) {
  console.log('key', $(this).val());

  if (e.which == 27) {
    $('#results').hide();
    return;
  }

  var keyword = $(this).val();

  if (keyword) {
    var results = search(keyword, products.products);

    if (results.length) {
      var html = template({results: results});

      $('#results').html(html).show();
    }
    else {
      $('#results').hide();
    }
  }
  else {
    $('#results').hide();
  }
}

function bindEvents() {
  $('#search').on('keyup', debounce(autocomplete, 300));

  $('body').on('click', function() {
    $('#results').hide();
  });
}

$(document).ready(function() {
  bindEvents();
});

var tmpl = $("#resultsTmpl").html();
var template = Handlebars.compile(tmpl);
