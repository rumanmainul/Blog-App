/**
 * Casanova Tabs
 * @version v1.0.0
 *
 * Copyright 2013 KingThemes
 * http://www.kingthemes.com
 */

/*jslint nomen:true, unparam:true*/
/*global jQuery:true, window:true*/
(function ($, window, undefined) {
    'use strict';

    var logError;

    $.casanovaTabs = function (options, element) {
        this.el = $(element);
        this.initialize(options);
    };

    $.casanovaTabs.defaults = {};

    $.casanovaTabs.prototype = {
        initialize: function (options) {
            this.options = $.extend(true, {}, $.casanovaTabs.defaults, this.el.data(), options);
            this.setup();
            this.events();
        },
        setup: function () {
            this.nav = this.el.find('.nav li');
            this.tabs = this.el.find('.tab');

            this.nav.children().first().addClass('active');
            $(this.tabs[0]).show();
        },
        events: function () {
            var self = this;

            self.nav.each(function (index, item){
                $(this).on('click', 'a', function (e) {
                    self.nav.removeClass('active');
                    $(this).parent().addClass('active');
                    self.tabs.hide();
                    $(self.tabs[index]).show();
                    e.preventDefault();
                });
            });
        }
    };

    logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    $.fn.casanovaTabs = function (options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                var instance = $.data(this, 'casanovaTabs');

                if (!instance) {
                    logError('cannot call methods on casanovaTabs prior to initialization; attempted to call method "' + options + '"');
                    return;
                }
                if (!$.isFunction(instance[options])) {
                    logError('no such method "' + options + '" for casanovaTabs instance');
                    return;
                }

                instance[options].apply(instance, args);
            });
        } else {
            this.each(function () {
                var instance = $.data(this, 'casanovaTabs');

                if (instance) {
                    instance.initialize();
                } else {
                    instance = $.data(this, 'casanovaTabs', new $.casanovaTabs(options, this));
                }
            });
        }

        return this;
    };

}(jQuery, window));
