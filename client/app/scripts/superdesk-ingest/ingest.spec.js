
describe('ingest', function() {
    'use strict';

    describe('send service', function() {

        beforeEach(module('superdesk.ingest.send'));

        it('can send an item', inject(function(send, api, $q, $rootScope) {
            spyOn(api, 'save').and.returnValue($q.when({_created: 'now'}));
            var item = {_id: '1'};

            expect(send.one(item).then).toBeDefined();
            $rootScope.$digest();

            expect(api.save).toHaveBeenCalled();
            expect(item.archived).toBe('now');
        }));

        it('can send multiple items', inject(function(send, api, $q, $rootScope) {
            spyOn(api, 'save').and.returnValue($q.when({}));
            var items = [{_id: 1}, {_id: 2}];

            send.all(items);
            $rootScope.$digest();

            expect(api.save.calls.count()).toBe(2);
        }));

        it('can send an item as', inject(function(send, api, $q, $rootScope) {
            var item = {_id: 1},
                config = {
                    desk: 'desk1',
                    stage: 'stage1',
                    macro: 'macro1'
                };

            spyOn(api, 'save').and.returnValue($q.when({}));

            expect(send.oneAs(item, config).then).toBeDefined();
            $rootScope.$digest();

            expect(api.save).toHaveBeenCalled();
        }));

        it('can send multiple items as', inject(function(send, api, $q, $rootScope) {
            spyOn(api, 'save').and.returnValue($q.when({}));

            var items = [{_id: 1}, {_id: 2}];
            expect(send.config).toBe(null);

            send.allAs(items);
            send.config.resolve({desk: 'desk1', stage: 'stage1'});
            $rootScope.$digest();

            expect(api.save.calls.count()).toBe(2);
        }));
    });

    describe('registering activities in superdesk.ingest module', function () {

        beforeEach(module('superdesk.ingest'));

        describe('the "archive" activity', function () {
            var activity;

            beforeEach(inject(function (superdesk) {
                activity = superdesk.activities.archive;
                if (angular.isUndefined(activity)) {
                    fail('Activity "archive" is not registered.');
                }
            }));

            it('is allowed if the current desk is not "personal"', function () {
                var extra_condition = activity.additionalCondition,
                    fakeDesks;

                // get the function that checks the additional conditions
                extra_condition = extra_condition[extra_condition.length - 1];
                fakeDesks = {
                    getCurrentDeskId: function () { return '1234'; }
                };

                expect(extra_condition(fakeDesks)).toBe(true);
            });

            it('is not allowed if the current desk is "personal"', function () {
                var extra_condition = activity.additionalCondition,
                    fakeDesks;

                // get the function that checks the additional conditions
                extra_condition = extra_condition[extra_condition.length - 1];
                fakeDesks = {
                    getCurrentDeskId: function () { return null; }
                };

                expect(extra_condition(fakeDesks)).toBe(false);
            });
        });
    });

});
