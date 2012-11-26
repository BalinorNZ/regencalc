(function() {
var _dragged;
ko.bindingHandlers.drag = {
    init: function(element, valueAccessor, allBindingsAccessor, LevelsViewModel) {
        var dragElement = $(element);
        var dragOptions = {
            helper: 'clone',
            start: function() {
                _dragged = ko.utils.unwrapObservable(valueAccessor().value);
            },
            cursor: 'default'
        };
        dragElement.draggable(dragOptions).disableSelection();
    }
};

ko.bindingHandlers.drop = {
    init: function(element, valueAccessor, allBindingsAccessor, LevelsViewModel) {
        var dropElement = $(element);
        var dropOptions = {
            drop: function(event, ui) {
                valueAccessor().value(_dragged);
            }
        };
        dropElement.droppable(dropOptions);
    }
};
})();

$(document).ready(function(){

    function Hero(data) {
        this.name = data.name;
        this.base = data.base;
        this.gain = data.gain;
        this.cost = data.cost;
    }

    function Item(data) {
        this.name = data.name;
        this.intel = data.intel;
    }

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
        // Data
        var self = this;
        self.name = ko.observable('default');
        self.base = ko.numericObservable(10);
        self.gain = ko.numericObservable(1);
        self.cost = ko.numericObservable(100);

        self.levels = ko.observableArray([]);
        for(var i=0; i<25; i++) {
            self.levels.push(
                new Level({ level: i+1, base: self.base, gain: self.gain, cost: self.cost })
            );
        }

        self.heroes = ko.observableArray([
            new Hero({ name: 'Lina', base: 27, gain: 3.2, cost: 265}),
            new Hero({ name: 'Sandking', base: 16, gain: 1.8, cost: 140}),
        ]);

        self.items = ko.observableArray([
            new Item({ name: "mantle-of-intelligence", intel: 3 }),
            new Item({ name: "robe-of-the-magi", intel: 6 }),
            new Item({ name: "staff-of-wizardry", intel: 10 }),
            new Item({ name: "mystic-staff", intel: 25 })
        ]);
        self.equippedItems = ko.observableArray([]);
        self.buyItem = ko.computed({
            read: function() {
                return self.equippedItems().length ? self.items()[0] : "";
            },
            write: function(item) {
                this.equippedItems.push(item);
                self.base(item.intel+self.base());
            },
            owner: this
        });

        // Operations
        self.loadHero = function(hero) {
            self.equippedItems.removeAll();
            self.name(hero.name);
            self.base(hero.base);
            self.gain(hero.gain);
            self.cost(hero.cost);
        };
        self.loadItem = function(item) {
            self.base(self.base+item.intel);
        };
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

/*
    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("Text", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.originalEvent.dataTransfer.getData("Text");
        LevelsViewModel.items.push(new Item({ name: data }));
        ev.target.appendChild(document.getElementById(data));
    }
*/