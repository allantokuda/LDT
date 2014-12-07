'use strict';

angular.module('LDT.geometry', []);
angular.module('LDT.controllers', []);
angular.module('LDT.ui', ['LDT.geometry']);

angular.module('LDT', ['LDT.ui', 'LDT.controllers', 'LDT.geometry']);
