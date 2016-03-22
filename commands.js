"use strict";

var Commands = {
    'commands': {},
    'removalTimeouts': {},
    'callbackTimeouts': {},
    'callbacks': {},
    'get': function (token, defaultValue) {
        var self = this;
        clearTimeout(self.removalTimeouts[token]);
        setTimeout(function () {
            delete self.commands[token];
        }, 0);
        return self.commands[token] || (defaultValue || null);
    },
    'set': function (token, value, timeout) {
        var self = this;
        self.commands[token] = value;
        self.removalTimeouts[token] = setTimeout(function () {
            delete self.commands[token];
        }, timeout || 1000);
        if (self.callbacks[token]) {
            self.callbacks[token](self.get(token));
            clearTimeout(self.callbackTimeouts[token]);
        }
        delete self.callbacks[token];
    },
    'poll': function (token, callback, timeout) {
        var self = this;
        if (self.commands[token]) {
            callback(self.get(token));
        } else {
            self.callbacks[token] = callback;
            self.callbackTimeouts[token] = setTimeout(function () {
                callback(null);
            }, timeout || 20000);
        }
    }
};

module.exports = Commands;