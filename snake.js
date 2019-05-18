// var snake = [{ top: 0, left: 0},{ top: 0, left: 1},{ top: 0, left: 2}];
// var snake4 = [{ top: 0, left: 3}];
// var drawSnake = function(snakeToDraw, snakeToDraw2) {
//   var drawableSnake = { color: "turquoise", pixels: snakeToDraw };
//   var drawableSnake4 = { color: "indigo", pixels: snakeToDraw2 };
//   var drawableObjects = [drawableSnake, drawableSnake4];
//   CHUNK.draw(drawableObjects);
// }
// var moveSnake = function(snake, snake4) {
//   var oldSegment = snake[0];
//     var oldSegment2 = snake[1];
//       var oldSegment3 = snake[2];
//   var oldSegment4 = snake4[0];
//   var newSegment = { top: oldSegment.top + 1, left: oldSegment.left };
//     var newSegment2 = { top: oldSegment2.top + 1, left: oldSegment2.left };
//       var newSegment3 = { top: oldSegment3.top + 1, left: oldSegment3.left };
//   var newSegment4 = { top: oldSegment4.top + 1, left: oldSegment4.left };
//   var newSnake = [newSegment, newSegment2, newSegment3, newSegment4];
//   return newSnake;
// }
// var advanceGame = function() {
//   snake = moveSnake(snake, snake4);
//   drawSnake(snake, snake4);
// }
// CHUNK.executeNTimesPerSecond(advanceGame, 1)var drawSnake = function(snakeToDraw) {
var draw = function(snakeToDraw, apple) {
  var drawableSnake = { color: "pink", pixels: snakeToDraw };
  var drawableApple = { color: "red", pixels: [apple] };
  var drawableObjects = [drawableSnake, drawableApple];
  CHUNK.draw(drawableObjects);
}

var moveSegment = function(segment) {
  switch(segment.direction) {
    case "down":
      return { top: segment.top + 1, left: segment.left };
    case "up":
      return { top: segment.top - 1, left: segment.left };
    case "right":
      return { top: segment.top, left: segment.left + 1 }
    case "left":
      return { top: segment.top, left: segment.left - 1 }
    default:
      return segment;
  }
}

var segmentFurtherForwardThan = function(index, snake) {
  return snake[index - 1] || snake[index];
}

var moveSnake = function(snake) {
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    return newSegment;
  });
}

var growSnake = function(snake) {
  var tipOfTailIndex = snake.length - 1;
  var tipOfTail = snake[tipOfTailIndex];
  snake.push({ top: tipOfTail.top, left: tipOfTail.left });
  return snake;
}

var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

var advanceGame = function() {
  var newSnake = moveSnake(snake);

  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself!");
  }

  if (ate(newSnake, [apple])) {
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }

  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! you hit a wall!");
  }

  snake = newSnake;
  draw(snake, apple);
}

var changeDirection = function(direction) {
  snake[0].direction = direction;
}

var apple = CHUNK.randomLocation();
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];

CHUNK.executeNTimesPerSecond(advanceGame, 3);
CHUNK.onArrowKey(changeDirection);
