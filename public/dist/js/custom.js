let lastKnownScrollPosition = 0;
let ticking = false;

function doSomething(scrollPos) {
  // Do something with the scroll position
  if (scrollPos == 0) {
    $('.top-nav').css('top', '90px');
    $('.top-nav').css('padding-top', '12px');
    // $('.top-nav').css('padding-bottom', '18px');
    $('.top-nav').css('border-top-right-radius', '18px');
    $('.top-nav').css('border-top-left-radius', '18px');
    $('.wrapper.wrapper--top-nav').css('margin-top', '147px');

  } else {
    $('.top-nav').css('top', '73px');
    $('.top-nav').css('padding-top', '3px');
    // $('.top-nav').css('padding-bottom', '7px');
    $('.top-nav').css('border-top-right-radius', '0');
    $('.top-nav').css('border-top-left-radius', '0');
    $('.wrapper.wrapper--top-nav').css('margin-top', '121px');

  }

}

document.addEventListener('scroll', function(e) {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething(lastKnownScrollPosition);
      ticking = false;
    });

    ticking = true;
  }
});