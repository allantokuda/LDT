'use strict';

angular.module('lib', []);

angular.module('LDT.directives', []);
angular.module('LDT.controllers', []);
angular.module('LDT.entity', ['lib']);

angular.module('LDT', ['LDT.directives', 'LDT.controllers', 'LDT.entity']);
