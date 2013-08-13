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
        this.regen_percent = data.regen_percent;
        this.regen_raw = data.regen_raw;
    }

    function Item(data) {
        this.name = data.name;
        this.intel = data.intel;
        this.regen_percent = data.regen_percent;
        this.regen_raw = data.regen_raw;
    }

    function Level(data) {
        this.level = ko.observable(data.level);
        this.intel = ko.computed(function() {
            var intel = data.base() + (data.level - 1) * data.gain();
            return intel.toFixed(1);
        }, this);
        this.regen = ko.computed(function() {
            //[Base Mana Regen + (Intelligence* .04)] * [1 + (% Total Percentage Increase)] + static regen
            var regen = ((0.01 + (this.intel() * 0.04))*(data.regen_percent() / 100)) + data.regen_raw();
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
        self.regen_percent = ko.numericObservable(100);
        self.regen_raw = ko.numericObservable(0);

        self.levels = ko.observableArray([]);
        for(var i=0; i<25; i++) {
            self.levels.push(
                new Level({ level: i+1, base: self.base, gain: self.gain, cost: self.cost, regen_percent: self.regen_percent, regen_raw: self.regen_raw })
            );
        }

        self.heroes = ko.observableArray([
            //new Hero({ name: 'Lina', base: 27, gain: 3.2, cost: 265}),
            //new Hero({ name: 'Sandking', base: 16, gain: 1.8, cost: 140}),
        ]);

        $.getJSON("/getheroes", function(heroes) {
            var mappedHeroes = $.map(heroes, function(hero) { return new Hero(hero) });
            self.heroes(mappedHeroes);
        });

        self.items = ko.observableArray([
            new Item({ name: "mantle-of-intelligence", intel: 3, regen_percent: 0, regen_raw: 0 }),
            new Item({ name: "robe-of-the-magi", intel: 6, regen_percent: 0, regen_raw: 0 }),
            new Item({ name: "staff-of-wizardry", intel: 10, regen_percent: 0, regen_raw: 0 }),
            new Item({ name: "mystic-staff", intel: 25, regen_percent: 0, regen_raw: 0 }),
            new Item({ name: "treads", intel: 8, regen_percent: 0, regen_raw: 0 }),
            new Item({ name: "arcane-boots", intel: 0, regen_percent: 0, regen_raw: 2.5 }),
            new Item({ name: "bloodstone", intel: 0, regen_percent: 200, regen_raw: 8 }),
            new Item({ name: "orchid", intel: 25, regen_percent: 150, regen_raw: 0 }),
            new Item({ name: "guinsoo", intel: 35, regen_percent: 150, regen_raw: 0 }),
            new Item({ name: "void-stone", intel: 0, regen_percent: 100, regen_raw: 0 }),
            new Item({ name: "sobi-mask", intel: 0, regen_percent: 50, regen_raw: 0 }),
            new Item({ name: "ring-of-basilius", intel: 0, regen_percent: 0, regen_raw: 0.65 }),
            new Item({ name: "oblivion-staff", intel: 6, regen_percent: 75, regen_raw: 0 })
        ]);
        self.equippedItems = ko.observableArray([]);
        self.buyItem = ko.computed({
            read: function() {
                return self.equippedItems().length ? self.items()[0] : "";
            },
            write: function(item) {
                this.equippedItems.push(item);
                self.base(item.intel+self.base());
                self.regen_percent(self.regen_percent()+item.regen_percent);
                self.regen_raw(self.regen_raw()+item.regen_raw);
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
            self.regen_percent(100);
            self.regen_raw(0);
        };
        self.loadItem = function(item) {
            self.base(self.base+item.intel);
            self.regen_percent(self.regen_percent()+item.regen_percent);
            self.regen_raw(self.regen_raw()+item.regen_raw);
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