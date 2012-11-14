$(document).ready(function(){ 
    function Level(data) {
        this.level = ko.observable(data.level);
        this.intel = ko.computed(function() {
            var intel = data.base() + (data.level - 1) * data.gain();
            return intel.toFixed(1);
        }, this);
        this.regen = ko.computed(function() {
            var regen = (this.intel() * 0.04) + 0.01;
            return regen.toFixed(2);
        }, this);
        this.time = ko.computed(function() {
            var time = data.cost() / this.regen();
            return time.toFixed(0);
        }, this);
    }

    function LevelsViewModel() {
        this.base = ko.numericObservable(16);
        this.gain = ko.numericObservable(1.8);
        this.cost = ko.numericObservable(140);

        this.levels = ko.observableArray([]);
        for(var i=0; i<25; i++) {
            this.levels.push(new Level({ level: i+1, base: this.base, gain: this.gain, cost: this.cost }));
        }
    }

    ko.numericObservable = function(initialValue) {
        // "shim" observable constructor to automatically store numeric strings as numbers
        // html elements always store values as strings, which is annoying for numbers
        var _actual = ko.observable(initialValue);
        var result = ko.dependentObservable({
            read: function() {
                return _actual();
            },
            write: function(newValue) {
                var parsedValue = parseFloat(newValue);
                _actual(isNaN(parsedValue) ? newValue : parsedValue);
            }
        });
        return result;
    };

    ko.applyBindings(new LevelsViewModel());
});