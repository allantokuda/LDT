'use strict';

angular.module('LDT.ui').directive('hotkey',function() {
  return {
    link: function(scope, element, iAttrs, ctrl) {
      var pattern = /(?:(.)-)?(.)/;
      var matches = pattern.exec(iAttrs.hotkey);
      var hotkey = _.object(['chord', 'letter'], matches.slice(1,3));

      $(window).keypress(function(e) {
        var pressedChord =
          (e.ctrlKey  ? 'c' : '') +
          (e.shiftKey ? 's' : '') +
          (e.altKey   ? 'a' : '') +
          (e.metaKey  ? 'm' : '');

        if ((pressedChord === ''  && hotkey.chord === undefined && e.charCode == hotkey.letter.charCodeAt(0)     ) ||
            (pressedChord == 'c'  && hotkey.chord == 'c'        && e.charCode == hotkey.letter.charCodeAt(0) - 96) )
           element.trigger('click');
        });
      element.attr('title', 'hotkey: ' + iAttrs.hotkey);
    }
  };
});
