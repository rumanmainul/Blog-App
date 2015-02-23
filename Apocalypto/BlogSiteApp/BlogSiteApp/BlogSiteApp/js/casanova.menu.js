/**
 * Casanova Menu
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

    $.casanovaMenu = function (options, element) {
        this.el = $(element);
        this.initialize(options);
    };

    $.casanovaMenu.defaults = {
        selector: 'ul'
    };

    $.casanovaMenu.prototype = {
        initialize: function (options) {
            var self = this;

            self.settings = $.extend(true, {}, $.casanovaMenu.defaults, options);

            self.el.find('li').each(function () {
                var item = $(this),
                    sub  = item.children('ul'),
                    exception = item.parents('li').hasClass('mega-menu');

                if (!exception && sub.length) {
                    item.addClass('has');
                    self.events(item);
                }
            });
        },
        events: function (item) {
            item.on('mouseenter', this.over);
            item.on('mouseleave', this.out);
        },
        over: function () {
            $(this).addClass('over');
            if (( $(this).children('ul').outerWidth() + $(this).children('ul').offset().left ) - window.outerWidth > 0) {
                $(this).addClass('reserved');
            };
            $(this).children('ul').stop().hide().fadeIn(300);
        },
        out: function () {
            $(this).removeClass('over');
            $(this).removeClass('reserved');
            $(this).children('ul').stop().fadeOut(300);
        }
    };

    logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    $.fn.casanovaMenu = function (options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                var instance = $.data(this, 'casanovaMenu');

                if (!instance) {
                    logError('cannot call methods on casanovaMenu prior to initialization; attempted to call method "' + options + '"');
                    return;
                }
                if (!$.isFunction(instance[options])) {
                    logError('no such method "' + options + '" for casanovaMenu instance');
                    return;
                }

                instance[options].apply(instance, args);
            });
        } else {
            this.each(function () {
                var instance = $.data(this, 'casanovaMenu');

                if (instance) {
                    instance.initialize();
                } else {
                    instance = $.data(this, 'casanovaMenu', new $.casanovaMenu(options, this));
                }
            });
        }

        return this;
    };

}(jQuery, window));