//食物沙箱;
;(function(window) {
  //食物构造函数
  function Food(options) {
    options = options || {}
    this.width = options.width || 20
    this.height = options.height || 20
    this.bgColor = options.bgColor || 'blue'
    this.x = options.x || 0
    this.y = options.y || 0
    this.div = document.createElement('div')
    this.map = map
  }

  //食物原型
  Food.prototype = {
    init: function() {
      this.div.style.width = this.width + 'px'
      this.div.style.height = this.height + 'px'
      this.div.style.backgroundColor = this.bgColor
      this.render()
    },
    render: function() {
      this.div.style.position = 'absolute'
      this.x = parseInt(Math.random() * this.map.offsetWidth / this.width)
      this.y = parseInt(Math.random() * this.map.offsetHeight / this.height)
      this.div.style.left = this.x * this.width + 'px'
      this.div.style.top = this.y * this.height + 'px'
      this.map.appendChild(this.div)
    }
  }
  window.Food = Food
})(window)

//Snack沙箱;
;(function(window) {
  //Snack构造函数
  function Snack(options) {
    options = options || {}
    this.width = options.width || 20
    this.height = options.height || 20
    this.headColor = options.headColor || 'red'
    this.bodyColor = options.bodyColor || 'green'
    this.direction = options.direction || 'right'
    this.body = [
      {
        x: 2,
        y: 0,
        bgColor: this.headColor
      },
      {
        x: 1,
        y: 0,
        bgColor: this.bodyColor
      },
      {
        x: 0,
        y: 0,
        bgColor: this.bodyColor
      }
    ]
    this.map = map
  }
  //Snack原型
  Snack.prototype = {
    init: function() {
      for (var i = 0; i < this.body.length; i++) {
        var span = document.createElement('span')
        span.style.width = this.width + 'px'
        span.style.height = this.height + 'px'
        span.style.backgroundColor = this.body[i].bgColor
        this.x = this.body[i].x
        this.y = this.body[i].y
        span.style.position = 'absolute'
        span.style.left = this.x * this.width + 'px'
        span.style.top = this.y * this.height + 'px'
        this.map.appendChild(span)
      }
    },
    move: function() {
      //先移动蛇身体
      this.bindKeyListener()
      for (var i = this.body.length - 1; i > 0; i--) {
        this.body[i].x = this.body[i - 1].x
        this.body[i].y = this.body[i - 1].y
      }

      //根据方向移动蛇头
      switch (this.direction) {
        case 'right':
          this.body[0].x++
          break
        case 'left':
          this.body[0].x--
          break
        case 'up':
          this.body[0].y--
          break
        case 'down':
          this.body[0].y++
          break
      }
      //吃食物逻辑 删除原来的蛇，重新渲染
      var spans = document.querySelectorAll('span')
      for (var i = 0; i < spans.length; i++) {
        this.map.removeChild(spans[i])
      }
      this.init()
    },
    bindKeyListener: function() {
      var that = this
      document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
          case 37:
            if (that.direction !== 'right') {
              that.direction = 'left'
            }
            break
          case 38:
            if (that.direction !== 'down') {
              that.direction = 'up'
            }
            break
          case 39:
            if (that.direction !== 'left') {
              that.direction = 'right'
            }
            break
          case 40:
            if (that.direction !== 'up') {
              that.direction = 'down'
            }
            break
        }
      })
    }
  }
  window.Snack = Snack
})(window)

//Game沙箱;
;(function(window) {
  var map = document.querySelector('#map')
  var timer

  function Game() {
    this.map = map
    this.level = 1
    this.food = new Food()
    this.snack = new Snack()
    this.food.init()
    this.snack.init()
  }
  Game.prototype = {
    start: function() {
      var head = this.snack.body[0]
      var that = this
      clearInterval(timer)
      timer = setInterval(function() {
        that.snack.move()
        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x > that.snack.map.offsetWidth / that.snack.width - 1 ||
          head.y > that.snack.map.offsetHeight / that.snack.height - 1
        ) {
          clearInterval(timer)
          alert('Game Over')
        }
        for (var i = 3; i < that.snack.body.length; i++) {
          if (head.x == that.snack.body[i].x && head.y == that.snack.body[i].y) {
            clearInterval(timer)
            alert('Game Over')
          }
        }
        if (that.snack.body.length % 2 === 0 && that.snack.body.length / 2 !== that.level) {
          that.level++
          that.start()
        }
        if (that.level == 10) {
          clearInterval(timer)
          alert('大吉大利，今晚吃鸡')
        }
        if (head.x == that.food.x && head.y == that.food.y) {
          that.snack.body.push({
            x: that.snack.body[that.snack.body.length - 1].x,
            y: that.snack.body[that.snack.body.length - 1].y,
            bgColor: that.snack.bodyColor
          })
          that.snack.init()
          var div = that.food.map.querySelector('div')
          that.food.map.removeChild(div)
          that.food.init()
        }
      }, 150 / that.level)
    }
  }
  window.Game = Game
})(window)
