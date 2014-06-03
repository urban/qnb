(function (context) {

  var timer;
  var deck = document.querySelector('#deck');
  var cards = deck.querySelectorAll('frog-card');

  // exports
  context.presentation = {
    start: start,
    stop: stop,
    toggle: toggle
  };

  deck.addEventListener('change', function (e) {
    var detail = e.detail;
    if (detail.oldVal) deselectVisualizations(cards[detail.oldVal]);
    selectVisualizations(cards[detail.newVal]);
  });

  document.addEventListener('click', next, false);

  // initial render
  window.addEventListener('WebComponentsReady', function(e) {
    selectVisualizations(cards[0]);
    var readyEvent = new Event('ready');
    document.dispatchEvent(readyEvent);
  });

  function selectVisualizations(card) {
    var visualizations = card.querySelectorAll('q-visualization > *');
    visualizations.array().forEach(function (v) {
      var cb = function () {
        if (!v.isRendered) v.render();
        if (v.start) {
          v.start();
        }
      };
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
  };

  function cardDelay(card) {
    var delay;
    if (card && card.hasAttribute('delay')) {
      delay = +card.getAttribute('delay');
    }
    return delay || 10000;
  };

  function next() {
    deck.selected = (deck.selected + 1) % deck.children.length;
  };

  function start() {
    var delay = cardDelay(cards[deck.selected]);
    console.log('next card in', delay);
    timer = window.setTimeout(function () {
        next();
        start();
      }, delay);
  };

  function stop() {
    window.clearTimeout(timer);
  };

  function toggle() {
    if (!timer) {
      start();
    } else {
      stop();
    }
  };

})(this);