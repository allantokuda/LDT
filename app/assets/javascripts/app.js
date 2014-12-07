'use strict';

angular.module('LDT.entity', []);
angular.module('LDT.controllers', []);
angular.module('LDT.ui', ['LDT.entity']);

angular.module('LDT', ['LDT.ui', 'LDT.controllers', 'LDT.entity']);
