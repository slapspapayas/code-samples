/*
 * This script will find all CMS generated links and if they
 * are to sections of current page add smooth-scroll transition.
 *
 * Fixed navigation was the reason for offset scroll values.
 */
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    var content = document.querySelector('.cms-created');
    if (!!content) {

      // We will touch a LOT of DOM content so let's use a fragment
      var docFragment = document.createDocumentFragment();
      docFragment.appendChild(content.cloneNode(true));
      var links = docFragment.querySelectorAll('a');

      // Only care about in page links
      var currPage = window.location.pathname;
      var hash = window.location.hash;

      // Decrementing is faster and we have a lot of links
      for (i = links.length; i--;) {
        var link = links[i];
        if (link.pathname === currPage && link.hash) {

          // Add smooth-scroll
          link.setAttribute('data-scroll', '');

          var target = docFragment.querySelector(link.hash);
          var section = target ? target.classList.contains('page-section') : false;

          // If link is not to a page section we need a larger offset
          if (!section) {
            link.setAttribute('data-options', '{"offset":140}');
          }
        }
      }

      // Replace live DOM content with fragment
      content.parentNode.replaceChild(docFragment, content);

      if (hash) {

        // Make sure we offset for hash on inital load
        var el = document.querySelector(hash);
        if (smoothScroll && el) {
          var offset = el.classList && el.classList.contains('page-section') ? 95 : 140;
          smoothScroll.animateScroll(el, hash, {offset: offset});
        }
      }
    }
  }, false);
})();
