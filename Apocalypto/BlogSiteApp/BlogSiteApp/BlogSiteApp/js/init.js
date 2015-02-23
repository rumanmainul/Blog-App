var theme = window.casanova;

$( function () {
    theme.onAppear();
});

$(document).ready( function () {

    theme.fixedHeader();
    theme.menu();
    theme.portfolioItem();
    theme.toggleAccordion();
    theme.quoteRotator();
    theme.progress();
    theme.section();
    theme.initTwitter();
    theme.initTabs();
    theme.initPieChart();
    theme.imageSlider();
    theme.masonryBlog();
    theme.stats();
    theme.notificationBox();
    theme.tooltip();
    theme.lightBox();
    theme.map();
    theme.backToTop();

    $('body').casanovaFitMedia();
});