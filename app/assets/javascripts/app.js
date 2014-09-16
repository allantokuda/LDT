'use strict';

angular.module('LDT.entity', []);
angular.module('LDT.directives', ['LDT.entity']);
angular.module('LDT.controllers', []);

angular.module('LDT', ['LDT.directives', 'LDT.controllers', 'LDT.entity']);
