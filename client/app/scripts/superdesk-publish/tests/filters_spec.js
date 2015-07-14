'use strict';

describe('publish filters', function() {

    var $scope, controller;
    beforeEach(module('superdesk.publish'));
    beforeEach(module('superdesk.mocks'));

    beforeEach(inject(function($rootScope, $controller, filters, $q, api, $location, $window, notify) {
        $scope = $rootScope.$new();
        controller = $controller('ProductionTestController',
            {
                $scope: $scope,
                $location: $location,
                $window: $window,
                'notify': notify,
                'filters': filters
            }
        );
    }));

    it('can call production test for matching results', inject(function($rootScope, notify, filters, $timeout, $q, api, $window) {
        var diff = {'filter_id': '559ba1c91024548825803cc4', 'return_matching': true};
        var to_match = [{source: 'test'}];
        spyOn(api, 'save').and.returnValue($q.when({match_results: to_match}));
        $scope.selectedfilter = '559ba1c91024548825803cc4';
        $scope.model.selectedType = 'true';
        $scope.fetchResults();

        $rootScope.$digest();
        $timeout.flush(1500);
        expect(api.save).toHaveBeenCalledWith('publish_filter_tests', {}, diff);
        expect($scope.testResult).toBe(to_match);
    }));
    it('can call production test for non-matching results', inject(function($rootScope, notify, filters, $timeout, $q, api, $window) {
        var diff = {'filter_id': '559ba1c91024548825803cc5', 'return_matching': false};
        var to_match = [];
        spyOn(api, 'save').and.returnValue($q.when({match_results: to_match}));
        $scope.selectedfilter = '559ba1c91024548825803cc5';
        $scope.model.selectedType = 'false';
        $scope.fetchResults();

        $rootScope.$digest();
        $timeout.flush(1500);
        expect(api.save).toHaveBeenCalledWith('publish_filter_tests', {}, diff);
        expect($scope.testResult.length).toBe(0);
    }));
});
