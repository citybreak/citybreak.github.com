$(function(){
    var pager = $('.pager-nav');
    if (!pager.size()) return;

    var prev = $('a[rel=prev]', pager).attr('href');
    var next = $('a[rel=next]', pager).attr('href');
    if (prev) key('left, k', 'pager', function() { window.location = prev });
    if (next) key('right, j', 'pager', function() { window.location = next });
    key.setScope('pager');
});