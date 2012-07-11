$(function(){

    setupPager()
    setupSearchControl();
});

function setupPager(){
  var pager = $('.pager-nav');
  if (!pager.size()) return;

  var prev = $('a[rel=prev]', pager).attr('href');
  var next = $('a[rel=next]', pager).attr('href');
  if (prev) key('left, k', 'pager', function() { window.location = prev });
  if (next) key('right, j', 'pager', function() { window.location = next });
  key.setScope('pager');
};

function setupSearchControl(){
    var data = false;
    var search = $('#search');
    var template = _.template('<li><a href="<%=url%>"><span class="title"><%=title%></span><small><%=subtitle%></small><small class="date"><%=date%></small></a></li>');
    var find = function(phrase) {
        if (!data) return $.ajax({
            url: '/search.json',
            dataType: 'json',
            success: function(resp) {
                data = _(resp).chain()
                    .compact()
                    .map(function(p) {
                        p.words = (p.title.toLowerCase() +' '+ p.subtitle.toLowerCase()).match(/(\w+)/g);
                        return p;
                    })
                    .value();
                find(phrase);
            }
        });
        var matches = _(data).filter(function(p) {
            return _(phrase).filter(function(a) {
                return _(p.words).any(function(b) {
                    return a === b || b.indexOf(a) === 0;
                });
            }).length === phrase.length;
        });
        return matches;
    };
    $('a', search).click(function() {
        if ($('body').hasClass('searching')) {
            $('body').removeClass('searching');
            $('.branding .wasActive').removeClass('wasActive').addClass('active');
        } else {
            $('body').addClass('searching');
            $('.branding .active').removeClass('active').addClass('wasActive');
            $('input', search).focus();
        }
        return false;
    });
    $('input', search).keyup(_(function() {
        $('#search-results ul').empty();
        $('#search-results > div').removeClass('active');

        var el = {
            'empty': $('#search-results > div.empty'),
            'about': $('#search-results > div.about'),
            'blog': $('#search-results > div.blog')
        };
        var done = {};
        var phrase = $('input', search).val();
        if (phrase.length >= 4) {
            var matches = find(phrase.toLowerCase().match(/(\w+)/g));
            _(matches).each(function(p) {
                if (!p.category) return;
                if (!done[p.category]) {
                    el[p.category].addClass('active');
                    done[p.category] = true;
                }
                $('ul', el[p.category]).append(template(p));
            });
            if (matches.length) return;
        }
        $('#search-results > div.empty').addClass('active');
        return false;
    }).debounce(100));
};
