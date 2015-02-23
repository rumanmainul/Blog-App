/**
 * Casanova Accordion
 * @version v1.0.0
 *
 * Copyright 2013 KingThemes
 * http://www.kingthemes.com
 */

/*jslint nomen:true, unparam:true*/
/*global jQuery:true, window:true*/
(function ($, window) {
    'use strict';

    $.fn.casanovaFitMedia = function (options) {
        return this.each(function () {
            var obj = [
                    'iframe[src*="player.vimeo.com"]', 
                    'iframe[src*="youtube.com"]',
                    'iframe[src*="dailymotion.com"]', 
                    'iframe[src*="funnyordie.com"]', 
                    'iframe[src*="hulu.com"]', 
                    'iframe[src*="scribd.com"]', 
                    'iframe[src*="embed.revision"]', 
                    'iframe[src*="blip.tv"]',
                    'iframe[src*="slideshare.net"]',
                    'object',
                    'embed'
                ],
                media = $(this).find(obj.join(','));

            media.each(function () {
                var self = $(this),
                    height = ( this.tagName.toLowerCase() === 'object' || (self.attr('height') && !isNaN(parseInt(self.attr('height'), 10))) ) ? parseInt(self.attr('height'), 10) : self.height(),
                    width = !isNaN(parseInt(self.attr('width'), 10)) ? parseInt(self.attr('width'), 10) : self.width(),
                    ratio = (height / width) * self.parent().width(),
                    padd  = (ratio * 100 / self.parent().width()) + '%',
                    wrapper = $('<div class="fitmedia"></div>');

                wrapper.css('padding-top', padd);
                self.removeAttr('height').removeAttr('width').wrap(wrapper);
            });
        });
    };

}(jQuery, this));