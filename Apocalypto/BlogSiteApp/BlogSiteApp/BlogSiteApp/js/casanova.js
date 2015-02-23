/*global document:true, imagesLoaded:true, setInterval:true, clearInterval:true, Maplace:true, google:true, countUp:true*/
/*jslint nomen: true */
(function () {
    'use strict';

    var root, $, casanova;

    /* Create the window instance */
    root = this;
    $ = root.jQuery || root.$;

    /* Define casanova as an object */
    casanova = {};

    /* Fixed header */
    casanova.fixedHeader = function () {
        var doc    = $(document),
            header = $('#site-header');

        if (doc.outerWidth() > 800) {
            header.sticky();
        }
    };

    /* Main menu */
    casanova.menu = function () {
        var header  = $('#site-header'),
            menu    = $('#site-nav'),
            mobile  = $('<nav id="mobile-menu" />'),
            clone   = menu.children('.dropdown').clone(),
            trigger = $('<a id="mobile-menu-trigger" href="#"><i class="fa fa-bars"></i></a>');

        clone.removeClass('dropdown');
        clone.find('ul, li').removeAttr('class');
        clone.find('.fa').remove();

        menu.casanovaMenu();
        
        trigger.insertAfter(menu);
        mobile.append(clone).appendTo(header);
        mobile.children().slicknav({
            prependTo: '#mobile-menu',
            duplicate: false
        });

        trigger.click(function (event) {
            if ($(this).hasClass('open')) {
                $(this).removeClass('open');
                mobile.find('.slicknav_nav').slicknav('close');
            } else {
                $(this).addClass('open');
                mobile.find('.slicknav_nav').slicknav('open');
            }
            event.preventDefault();
        });
        
    };

    /* Portfolio items */
    casanova.portfolioItem = function () {
        var projects = $('.projects'),
            filters = projects.prev('.project-filter'),
            imgLoad = imagesLoaded(projects),
            overlay = $('.project .project-thumb figcaption'),
            bgColor = overlay.css('background-color');

        if (projects.length) {
            overlay.css('background-color', casanova.rgbtorgba(bgColor, '0.8'));

            imgLoad.on('always', function () {
                projects.isotope({
                    masonry: {
                        columnWidth: 1,
                        gutter: 0
                    }
                }).find('.project-thumb').each(function () {
                    $(this).hoverdir({
                        hoverElem: 'figcaption'
                    });
                });
            });

            filters.on('click', 'a', function (event) {
                var _this = $(this),
                    filter = _this.data('filter'),
                    allFilters = _this.parents('nav').find('li');

                allFilters.removeClass('active');

                _this.parent().addClass('active');

                projects.isotope({
                    filter: filter,
                    masonry: {
                        columnWidth: 1,
                        gutter: 0
                    }
                });

                event.preventDefault();
            });
        }
    };

    /* RGB to RGBA */
    casanova.rgbtorgba = function (rgb, opacity) {
        var color = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        if (color) {
            return 'rgba(' + color[1] + ',' + color[2] + ',' + color[3] + ',' + opacity + ')';
        }
    };

    /* Toggle and accordion */
    casanova.toggleAccordion = function () {
        $('.accordion').not('.toggles').casanovaAccordion();

        $('.toggles').casanovaAccordion({
            closeOthers: false
        });
    };

    /* Quote rotator */
    casanova.quoteRotator = function () {
        var quotes = $('.quote-rotator');

        quotes.find('.bxslider').bxSlider({
            adaptiveHeight: true,
            nextText: '<i class="fa fa-angle-right" />',
            prevText: '<i class="fa fa-angle-left" />'
        });
    };

    /* Progress bar */
    casanova.progress = function () {
        var bars = $('.progress-bar');

        bars.appear().one('appear', function () {
            var bar = $(this).find('.bar'),
                width = bar.data('width'),
                note = bar.prev('.label').children('.right');

            bar.children().animate({
                width: width + '%'
            }, 1500);

            note.html(width + '%');
        });
    };

    /* Section */
    casanova.section = function () {
        var self = this;

        $('.section').each(function () {
            var section = $(this),
                data    = section.data(),
                isMap   = section.hasClass('section-map'),
                map     = section.children('.map'),
                div     = $('<div />');

            if (data.overlay) {
                div.clone().addClass('section-overlay').css('background-color', data.overlay).css('opacity', data.overlayOpacity).prependTo(section);
            }

            if (data.pattern) {
                div.clone().addClass('section-pattern ' + data.pattern).css('opacity', data.patternOpacity).prependTo(section);
            }

            if (isMap) {
                section.on('click', '.map-switcher', function (event) {
                    var content = section.children('.section-overlay, .section-pattern, .container'),
                        height  = section.children('.container').outerHeight();

                    if ($(this).hasClass('show-map')) {
                        content.hide();
                        section.height(height);
                        $(this).hide();
                        $('.hide-map').show();
                    } else {
                        content.show();
                        section.height('auto');
                        $(this).hide();
                        $('.show-map').show();
                    }

                    event.preventDefault();
                });
            }
        });
    };

    /* Initialize google map */
    casanova.gmap = function (el) {
        var data = el.data() || {},
            id = el.attr('id'),
            map;

        if (typeof Maplace === 'function') {
            map = new Maplace({
                map_div: '#' + id,
                locations: [{
                    lat: data.lat || "0",
                    lon: data.lon || "0"
                }],
                map_options: {
                    mapTypeId: data.type ? google.maps.MapTypeId[data.type] : google.maps.MapTypeId.ROADMAP,
                    zoom: data.zoom || 12
                }
            });

            map.Load();
        }
    };

    /* Map element */
    casanova.map = function () {
        $('.map').each(function () {
            var id = casanova.uniqueId();

            $(this).attr('id', id);

            casanova.gmap($(this));
        });
    }

    /* Initialize twitter */
    casanova.initTwitter = function () {
        $('.tweets').each(function () {
            var tweets = $(this),
                data   = tweets.data() || {};

            tweets.tweet({
                modpath: 'src/twitter/',
                username: data.username,
                count: data.count,
                template: "{text}{time}",
                loading_text: 'loading twitter feed...'
            });
        });
    };

    /* Initialize tabs */
    casanova.initTabs = function () {
        $('.tabs').casanovaTabs();
    };

    /* Initialize pie chart */
    casanova.initPieChart = function () {
        var el = $('.pie-chart');
        el.appear();

        el.data.percent = '1';

        el.easyPieChart({
            lineWidth: 8,
            onStep: function (from, to, percent) {
                $(this.el).find('.percent').children().text(Math.round(percent));
            }
        });

        el.one('appear', function () {
            $(this).data('easyPieChart').update($(this).data('value'));
        });
    };

    /* Initialize image slider */
    casanova.imageSlider = function () {
        var slider = $('.image-slider ul'),
            imgLoad = imagesLoaded(slider);

        imgLoad.on('always', function () {
            slider.bxSlider({
                adaptiveHeight: true,
                nextText: '<i class="fa fa-angle-right" />',
                prevText: '<i class="fa fa-angle-left" />',
                pager: false
            });
        });
    };

    /* Initialize tabs */
    casanova.stats = function () {
        var el = $('.stats');

        el.each(function () {
            var id = casanova.uniqueId();

            $(this).find('.number').attr('id', id);
        });

        el.appear().one('appear', function () {
            var num  = $(this).find('.number'),
                anim = new countUp(num.attr('id'), 0, num.text().replace(',', ''), 0, 2.5);

            anim.start();
        });
    };

    /* Initialize masontry blog */
    casanova.masonryBlog = function () {
        var entries = $('.masonry-entries'),
            imgLoad = imagesLoaded(entries);

        imgLoad.on('always', function () {
            entries.isotope({
                masonry: {
                    columnWidth: 0,
                    gutter: 0
                }
            });
        });
    };

    casanova.onAppear = function () {
        var el = $('[data-on-appear]');

        el.appear().addClass('waypoint');

        el.on('appear', function (event, elements) {
            var anim = $(this).data('onAppear');

            $(this).addClass('animated ' + anim);
        });
    };

    /* Notification box */
    casanova.notificationBox = function () {
        var el = $('.notification');

        el.each(function () {
            var box = $(this),
                close = $('<span class="close"><i class="fa fa-times"></i></span>');

            box.prepend(close);

            close.on('click', function () {
                box.remove();
            });
        });
    };

    /* Tooltip */
    casanova.tooltip = function () {
        $('.tooltip').each(function () {
            var el = $(this),
                data = el.data();

            data.positionTracker = true;
            el.tooltipster(data);
        });
    };

    /* Lightbox */
    casanova.lightBox = function () {
        var el = $('.lightbox');

        el.swipebox();
    };

    casanova.backToTop = function () {
        var el = $('<div id="back-to-top"><a class="icon square primary" href="#"><i class="fa fa-chevron-up"></i></a></div>');

        $(window).scroll(function () {
            if ( $(this).scrollTop() > ( $(this).height() / 3 ) ) {
                el.fadeIn('slow');
            } else {
                el.fadeOut('slow');
            }
        });

        el.appendTo('body').on('click', function (e) {
            $('body,html').animate({
                scrollTop: 0
            }, 800);

            e.preventDefault();
        });
    };

    /* Create unique ID */
    casanova.uniqueId = function (type, length) {
        var output = '', chars, count = isNaN(length) ? 5 : Number(length), i = 0;

        switch (type) {
        case 'alphabet':
            chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            break;
        case 'lowercase':
            chars = 'abcdefghijklmnopqrstuvwxyz';
            break;
        case 'uppercase':
            chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            break;
        case 'number':
            chars = '0123456789';
            break;
        default:
            chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            break;
        }

        while (i < count) {
            output += chars.charAt(Math.floor(Math.random() * chars.length));
            i = i + 1;
        }

        return output;
    };

    /* Attach casanova object to the window */
    root.casanova = casanova;

}).call(this);