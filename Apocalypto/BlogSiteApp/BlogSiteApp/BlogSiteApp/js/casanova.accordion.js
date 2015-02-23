/**
 * Casanova Accordion
 * @version v1.0.0
 *
 * Copyright 2013 KingThemes
 * http://www.kingthemes.com
 */

/*jslint nomen:true, unparam:true*/
/*global jQuery:true, window:true*/
(function ($, window, undefined) {
    'use strict';

    var logError, doc = $('html, body');

    $.casanovaAccordion = function (options, element) {
        this.el = $(element);
        this.initialize(options);
    };

    $.casanovaAccordion.defaults = {
        closeOthers: true,
        speed: 300
    };

    $.casanovaAccordion.prototype = {
        initialize: function (options) {
            this.options = $.extend(true, {}, $.casanovaAccordion.defaults, this.el.data(), options);
            this.setup();
            this.events();
        },
        setup: function () {
            this.items = this.el.find('.accordion-trigger');
        },
        events: function () {
            var self = this;

            this.items.on('click.casanovaAccordion', function () {
                var dd = $(this).next();

                if ($(this).hasClass('active') && self.options.closeOthers) {
                    return;
                };

                if (dd.is(':visible')) {
                    $(this).removeClass('active');
                    dd.slideUp(self.options.speed);
                } else {
                    if (self.options.closeOthers) {
                        self.items.next().slideUp(self.options.speed);
                        self.items.removeClass('active');
                    }
                    dd.slideDown(self.options.speed);
                    $(this).addClass('active');
                }
            });
        },
        destroy: function () {
            this.items.off('.casanovaAccordion').removeClass('active').next().removeClass('active').hide();
        }
    };

    logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    $.fn.casanovaAccordion = function (options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                var instance = $.data(this, 'casanovaAccordion');

                if (!instance) {
                    logError('cannot call methods on casanovaAccordion prior to initialization; attempted to call method "' + options + '"');
                    return;
                }
                if (!$.isFunction(instance[options])) {
                    logError('no such method "' + options + '" for casanovaAccordion instance');
                    return;
                }

                instance[options].apply(instance, args);
            });
        } else {
            this.each(function () {
                var instance = $.data(this, 'casanovaAccordion');

                if (instance) {
                    instance.initialize();
                } else {
                    instance = $.data(this, 'casanovaAccordion', new $.casanovaAccordion(options, this));
                }
            });
        }

        return this;
    };

}(jQuery, window));
