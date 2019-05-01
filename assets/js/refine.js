'use strict';

window.onresize=function(){  
  let toc = $('#toc_content')
  if ($(document).width() > 1150) {
    return toc.css('display', 'block')
  } else {
    return toc.css('display', 'none')
  }
}

// Debouncing function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
      var context = this, args = arguments;
      var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
  };
}

// toc
$(document).ready((function () {
  if ($(document).width() > 1150) {
    let currentAnchor, list, readingVO
    const distance = 0
    let tocList = $("#TableOfContents").find("a")

    $(window).scroll(debounce(
      function () {
        list = []
        for (var i = 0; i < tocList.length; i++) {
          let id = tocList[i].getAttribute("href").substr(1)
          let dom = document.getElementById(id)
          let domTitle = document.querySelector('a[href="#'+ id +'"]').getAttribute("href").substr(1)
      
          document.querySelector('a[href="#'+ id +'"]').classList.remove('reading')

          list.push({
            y: dom.getBoundingClientRect().top + 10,
            index: i,
            domTitle
          }, 100)
        }
      
        readingVO = list.filter(item => item.y > distance).sort((a, b) => {
          return a.y - b.y
        })[0]

        if ( readingVO ) {
          currentAnchor = $('a[href="#'+ readingVO.domTitle +'"]' )[0]

          for (var i = 0; i < tocList.length; i++) {
            let id = tocList[i].getAttribute("href").substr(1)
            let dom = document.getElementById(id)
            
            if (!currentAnchor.getAttribute("href").substr(1) == dom.getAttribute("id")) {
              console.log(currentAnchor.getAttribute("href").substr(1), dom.getAttribute("id"))
              return currentAnchor.classList.remove('reading')
            } else {
              return currentAnchor.classList.add("reading");
            }
          }
          return readingVO
        }

        return 0
      }
    ))
  }
}))

// toc
$(document).ready((function (_this) {
  return function () {
    let toc
    toc = $('#toc_content')
    if ($(document).width() > 1150) {
      $(window).scroll(function () {
        let st
        st = $(window).scrollTop()

        if (st > 70) {
          return toc.addClass('fixed')
        } else {
          return toc.removeClass('fixed')
        }
      })
    } else {
      return toc.css('display', 'none')
    }
  }
})(this))

// back-to-top
$(document).ready((function (_this) {
  return function () {
    let bt
    bt = $('#back_to_top')
    if ($(document).width() > 480) {
      $(window).scroll(function () {
        let st
        st = $(window).scrollTop()
        if (st > 30) {
          return bt.css('display', 'block')
        } else {
          return bt.css('display', 'none')
        }
      })
      return bt.click(function () {
        $('body,html').animate({
          scrollTop: 0,
        }, 800)
        return false
      })
    }
  }
})(this))

// nav-toggle
$(document).ready((function (_this) {
  return function () {
    let nav,icon
    icon = $('#menu_icon')
    nav = $('#site_nav')
    icon.click(function () {
      nav.slideToggle(250)
    })
  }
})(this))
