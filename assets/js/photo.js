(function () {
  Array.from(document.getElementsByClassName("img_container")).forEach(
    (container) => {
      // Init
      var inner = container.getElementsByClassName("img_inner")[0];

      // Mouse
      var mouse = {
        _x: 0,
        _y: 0,
        x: 0,
        y: 0,
        updatePosition: function (event) {
          var e = event || window.event;
          this.x =
            e.clientX -
            container.getBoundingClientRect().left -
            container.getBoundingClientRect().width / 2;
          this.y =
            (e.clientY -
              container.getBoundingClientRect().top -
              container.getBoundingClientRect().height / 2) *
            -1;
        },
        show: function () {
          return "(" + this.x + ", " + this.y + ")";
        },
      };

      //----------------------------------------------------

      var counter = 0;
      var refreshRate = 10;
      var isTimeToUpdate = function () {
        return counter++ % refreshRate === 0;
      };

      //----------------------------------------------------

      var onMouseEnterHandler = function (event) {
        update(event);
      };

      var onMouseLeaveHandler = function () {
        inner.style = "";
      };

      var onMouseMoveHandler = function (event) {
        if (isTimeToUpdate()) {
          update(event);
        }
      };

      //----------------------------------------------------

      var update = function (event) {
        mouse.updatePosition(event);
        updateTransformStyle(
          (mouse.y / inner.offsetHeight / 10).toFixed(2),
          (mouse.x / inner.offsetWidth / 10).toFixed(2)
        );
      };

      var updateTransformStyle = function (x, y) {
        var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
        inner.style.transform = style;
        inner.style.webkitTransform = style;
        inner.style.mozTranform = style;
        inner.style.msTransform = style;
        inner.style.oTransform = style;
      };

      //--------------------------------------------------------

      container.onmousemove = onMouseMoveHandler;
      container.onmouseleave = onMouseLeaveHandler;
      container.onmouseenter = onMouseEnterHandler;
    }
  );
})();
