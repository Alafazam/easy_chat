/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 *
 * Multiple class add remove
 * classie.add( elem, 'my-new-class-1 my-new-class-2' )
 * classie.remove( elem, 'my-new-class-1 my-new-class-2' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

"use strict";

;(function(root, factory){

  if (typeof define != 'undefined' && define.amd) {

    define(factory());

  } else if (typeof exports != 'undefined') {

    module.exports = factory();

  } else {

    root.classie = factory();

  }

})(this, function() {

  // class helper functions from bonzo https://github.com/ded/bonzo
  function classReg(className) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  var hasClass, addClass, removeClass;

  if ('classList' in document.documentElement) {
    hasClass = function(elem, c) {
      return elem.classList.contains( c );
    };
    addClass = function(elem, c) {
      var classList = c.split(' ');
      elem.classList.add(classList[0]);

      if (classList.length > 1) {
        addClass(elem, classList.slice(1).join(' '));
      }

    };
    removeClass = function(elem, c) {
      var classList = c.split(' ');
      elem.classList.remove(classList[0]);

      if (classList.length > 1) {
        removeClass(elem, classList.slice(1).join(' '));
      }
    };
  }
  else {
    hasClass = function(elem, c) {
      return classReg(c).test(elem.className);
    };
    addClass = function(elem, c) {
      var classList = c.split(' ');
      if (!hasClass(elem, classList[0])) {
        elem.className = elem.className + ' ' + classList[0];
      }

      if (classList.length > 1) {
        addClass(elem, classList.slice(1).join(' '));
      }
    };
    removeClass = function( elem, c ) {
      var classList = c.split(' ');
      if (!hasClass(elem, classList[0])) {
          elem.className = elem.className.replace(classReg(classList[0] ), ' ');
      }

      if (classList.length > 1) {
        removeClass(elem, classList.slice(1).join(' '));
      }
    };
  }

  function toggleClass( elem, c ) {
    var fn = hasClass(elem, c) ? removeClass : addClass;
    fn(elem, c);
  }

  var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  return classie;

});