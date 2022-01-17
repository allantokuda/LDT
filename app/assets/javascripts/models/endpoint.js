'use strict';

window.Endpoint = function(endpoint) {
  this.label  = endpoint.label  || '';
  this.symbol = endpoint.symbol || '?';

  this.setOutwardVector = function() {
    switch(this.sideName) {
      case 'top':    this.outwardVector = {x: 0, y:-1}; break;
      case 'bottom': this.outwardVector = {x: 0, y: 1}; break;
      case 'left':   this.outwardVector = {x:-1, y: 0}; break;
      case 'right':  this.outwardVector = {x: 1, y: 0}; break;
    }
  };

  this.arrowheadPath = function() {
    return "M" + Math.round(this.x) + ',' + Math.round(this.y) + window.arrowheadSVG[this.symbol][this.sideName];
  };

  this.boxPath = function() {
    return "M" + Math.round(this.x) + ',' + Math.round(this.y) + window.arrowheadSVG['box'][this.sideName];
  };

  this.questionMarkX = function() {
    switch(this.sideName) {
      case 'right': return this.x + 7;
      case 'left': return this.x - 14;
      default: return this.x - 3;
    }
  };

  this.questionMarkY = function() {
    switch(this.sideName) {
      case 'bottom': return this.y + 15;
      case 'top': return this.y - 6;
      default: return this.y + 4;
    }
  };

  this.toggleArrowhead = function(toggleIdentifier) {
    if (toggleIdentifier) {
      switch(this.symbol) {
        case 'none':                   this.symbol = 'identifier'; break;
        case 'identifier':             this.symbol = 'none'; break;
        case 'chickenfoot':            this.symbol = 'chickenfoot_identifier'; break;
        case 'chickenfoot_identifier': this.symbol = 'chickenfoot'; break;
        case '?':                      this.symbol = '?_identifier'; break;
        case '?_identifier':           this.symbol = '?'; break;
        default: break;
      }
    } else {
      switch(this.symbol) {
        case 'none':                   this.symbol = 'chickenfoot'; break;
        case 'chickenfoot':            this.symbol = 'none'; break;
        case 'identifier':             this.symbol = 'chickenfoot_identifier'; break;
        case 'chickenfoot_identifier': this.symbol = 'identifier'; break;
        case '?':                      this.symbol = 'none'; break;
        case '?_identifier':           this.symbol = 'identifier'; break;
        default: break;
      }
    }
  };
};
