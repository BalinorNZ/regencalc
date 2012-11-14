$(document).ready(function(){ 
    function Task(data) {
        this.title = ko.observable(data.title);
        this.isDone = ko.observable(data.isDone);
    }

    function Level(data) {
        this.level = ko.computed(function() {
            return data.level+1;
        });
        this.intel = ko.computed(function() {
            return this.base+data.level*this.gain;
        });
        this.regen = ko.computed(function() {
            return parseFloat(data.gain);
        });
        this.time = ko.computed(function() {
            return parseFloat(data.level)+1;
        });
    }

    function TaskListViewModel() {
        this.base = ko.numericObservable(16);
        this.gain = ko.numericObservable(1.8);
        this.cost = ko.numericObservable(140);
        this.levels = ko.observableArray([]);
        for(var i=0; i<25; i++) {
            var intel = Math.round((this.base+i*this.gain)*10)/10;
            var regen = (intel*0.04)+0.01;//Math.round(((intel*0.04)+0.01)*100)/100;
            var time = Math.round((this.cost/regen)*10)/10;
            this.levels.push(new Level({ level: i, base: this.base, gain: this.gain, cost: this.cost }));
        }

        var self = this;
        self.tasks = ko.observableArray([]);
        self.newTaskText = ko.observable();
        self.incompleteTasks = ko.computed(function() {
            return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() });
        });

        // Operations
        self.addTask = function() {
            self.tasks.push(new Task({ title: this.newTaskText() }));
            self.newTaskText("");
        };
        self.removeTask = function(task) { self.tasks.remove(task) };
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

    ko.applyBindings(new TaskListViewModel());
});