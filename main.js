(function () {

  var timer;
  var deck = document.querySelector('#deck');
  var cards = deck.querySelectorAll('frog-card');

  deck.addEventListener('change', function (e) {
    var detail = e.detail;
    if (detail.oldVal) deselectVisualizations(cards[detail.oldVal]);
    selectVisualizations(cards[detail.newVal]);
  });

  document.addEventListener('click', next, false);

  function selectVisualizations(card) {
    var visualizations = card.querySelectorAll('q-visualization > *');
    visualizations.array().forEach(function (v) {
      var cb = function () {
        console.log(v.isRendered);
        if (!v.isRendered) v.render();
        if (v.start) {
          v.start();
        }
      };
      // console.log(v.render);
      if (v.data && v.render) {
        cb();
      } else {
        v.addEventListener('load', cb);
      }
    });
  };

  function deselectVisualizations(card) {
    var visualizations = card.querySelectorAll('q-visualization > *');
    visualizations.array().forEach(function (v) {
      if (v.stop) v.stop();
    });
  }

  function next() {
    deck.selected = (deck.selected + 1) % deck.children.length;
  };

  function start() {
    timer = window.setInterval(next, 5000);
  };

  function stop() {
    window.clearInterval(timer);
  };

  function toggle() {
    if (!timer) {
      start();
    } else {
      stop();
    }
  };

  // initial render
  window.addEventListener('WebComponentsReady', function(e) {
    selectVisualizations(cards[0]);
  });
})();