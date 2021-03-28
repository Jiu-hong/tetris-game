document.addEventListener("DOMContentLoaded", () => {
  const scoreinfo = document.querySelector(".scoreinfo");
  const gameovercard = document.querySelector(".gameovercard");
  const closecard = document.querySelector(".closecard");
  const newplay = document.querySelector(".newplay");

  let speed = 400;
  //====change game level start======//
  const levelinput = document.querySelector("#levelinput");
  const output = document.querySelector(".level-output");
  levelinput.value = 3;
  output.textContent = 3;

  //listen to level input
  levelinput.addEventListener("input", function () {
    output.textContent = levelinput.value;

    switch (levelinput.value) {
      case "1":
        speed = 800;
        break;
      case "2":
        speed = 600;
        break;
      case "3":
        speed = 400;
        break;
      case "4":
        speed = 200;
        break;
      case "5":
        speed = 50;
        break;
    }
  });

  //====change game level end======//
  const up = document.querySelector(".up");
  const down = document.querySelector(".down");

  const left = document.querySelector(".left");
  const right = document.querySelector(".right");
  const startBtn = document.querySelector(".start");
  const pauseBtn = document.querySelector(".pause");
  const restartBtn = document.querySelector(".restart");
  const score = document.querySelector(".score");
  let startInterval = null;
  let scoreContent = 0;
  const width = 10;
  const height = 15;
  const backgroundLength = width * height;
  const showX = 0;
  const showY = Math.floor(width / 2 - 1);
  let switchLine = 0;
  let gameStart = false;

  //the heros//
  const T = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const L = [
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],

    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width + 1, width + 2, width * 2],
  ];

  const Z = [
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
  ];

  const Four = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const I = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];
  const heros = [T, L, Z, Four, I];

  const dispWidth = 3;
  const nextT = [
    [1, dispWidth, dispWidth + 1, dispWidth + 2],
    [1, dispWidth + 1, dispWidth + 2, dispWidth * 2 + 1],
    [dispWidth, dispWidth + 1, dispWidth + 2, dispWidth * 2 + 1],
    [1, dispWidth, dispWidth + 1, dispWidth * 2 + 1],
  ];

  const nextL = [
    [0, 1, dispWidth + 1, dispWidth * 2 + 1],
    [2, dispWidth, dispWidth + 1, dispWidth + 2],

    [1, dispWidth + 1, dispWidth * 2 + 1, dispWidth * 2 + 2],
    [dispWidth, dispWidth + 1, dispWidth + 2, dispWidth * 2],
  ];

  const nextZ = [
    [0, 1, dispWidth + 1, dispWidth + 2],
    [1, dispWidth, dispWidth + 1, dispWidth * 2],
    [0, 1, dispWidth + 1, dispWidth + 2],
    [1, dispWidth, dispWidth + 1, dispWidth * 2],
  ];

  const nextFour = [
    [0, 1, dispWidth, dispWidth + 1],
    [0, 1, dispWidth, dispWidth + 1],
    [0, 1, dispWidth, dispWidth + 1],
    [0, 1, dispWidth, dispWidth + 1],
  ];

  const nextI = [
    [1, dispWidth + 1, dispWidth * 2 + 1],
    [dispWidth, dispWidth + 1, dispWidth + 2],
    [1, dispWidth + 1, dispWidth * 2 + 1],
    [dispWidth, dispWidth + 1, dispWidth + 2],
  ];
  const nextHeros = [nextT, nextL, nextZ, nextFour, nextI];

  const colors = ["red", "blue", "yellow", "green", "orange"];
  const originalPosition = [
    [
      [0, 0], //==T start ==/
      [0, 0],
      [0, -1],
      [0, 0],
    ], //==T end ==/
    [
      [0, 0], //==L start ==/
      [0, 0],
      [-1, 0],
      [0, -1],
    ], //==L end==/
    [
      [0, 0], //==Z start==/
      [0, 0],
      [0, 0],
      [0, 0],
    ], //==Z end==/
    [
      [0, 0], //==Four start==/
      [0, 0],
      [0, 0],
      [0, 0],
    ], //==Four end==/
    [
      [0, 0], //==I start ==/
      [0, -1],
      [0, 0],
      [0, -1],
    ], //==I end==/
  ];

  //draw background//
  const grid = document.querySelector(".grid");
  function drawBackground() {
    for (let i = 0; i < width * height; i++) {
      const div = document.createElement("div");
      //   div.classList.add(i);
      //   div.innerHTML = i;
      grid.appendChild(div);
    }
  }
  drawBackground();

  //draw bottom wall/taken
  function drawBottomWall() {
    for (let i = 0; i < width; i++) {
      const div = document.createElement("div");
      div.classList.add("taken");
      grid.appendChild(div);
    }
  }
  drawBottomWall();

  //draw nextview//
  const nextview = document.querySelector(".nextview");
  function drawNextViewground() {
    for (let i = 0; i < dispWidth * dispWidth; i++) {
      const div = document.createElement("div");
      //   div.classList.add(i);
      //   div.innerHTML = i;
      nextview.appendChild(div);
    }
  }

  drawNextViewground();

  let squares = Array.from(document.querySelectorAll(".grid div"));
  let nextSquare = Array.from(document.querySelectorAll(".nextview div"));

  // random number//
  const rotateLength = 4;
  let ramNumber = Math.floor(Math.random(0, 1) * heros.length);
  let rotateIndex = Math.floor(Math.random(0, 1) * rotateLength);
  let color = colors[ramNumber];

  let nextRamNumber = Math.floor(Math.random(0, 1) * nextHeros.length);
  let nextRotateIndex = Math.floor(Math.random(0, 1) * rotateLength);
  let nextColor = colors[nextRamNumber];

  let currentline = showX;
  let currentcolumn = showY;

  let hero = heros[ramNumber][rotateIndex];

  let nextHero = nextHeros[nextRamNumber][nextRotateIndex];

  let originalX = originalPosition[ramNumber][rotateIndex][0];
  let originalY = originalPosition[ramNumber][rotateIndex][1];

  function firstHero() {
    hero = hero.map(
      (h) =>
        h + originalX + originalY * width + currentcolumn + currentline * width
    );
  }

  firstHero();

  //check if touch top line
  function checkGameOver() {
    //check if touch first line
    for (let i = 0; i < width; i++) {
      if (squares[i].classList.contains("taken")) {
        clearInterval(startInterval);
        startInterval = null;
        gameStart = false;
        gameovercard.classList.add("show");
        // gameovercard.style.transition = "1000ms";
        pauseBtn.style.display = "none";
        startBtn.style.display = "block";

        return true;
      }
    }
  }

  function draw() {
    if (!checkGameOver()) {
      hero.forEach((h, i) => {
        squares[h].classList.add(color);
      });
    }
  }

  function undraw() {
    hero.forEach((h) => squares[h].classList.remove(color));
  }

  function rotate() {
    if (!gameStart) return;
    rotateIndex = (rotateIndex + 1) % 4;
    let originalHero = heros[ramNumber][rotateIndex]; //step1 select one   from original heros
    let base = currentline * width + currentcolumn;

    if (
      originalHero.some((h) => {
        let currentPosition = h + base;
        if (currentPosition < 0 || currentPosition >= backgroundLength) {
          rotateIndex = (rotateIndex - 1) % 4;
          return true;
        }

        if (squares[currentPosition].classList.contains("taken")) {
          // contains taken
          rotateIndex = (rotateIndex - 1) % 4;
          return true;
        }

        if ((currentPosition % width) - currentcolumn !== h % width) {
          // or edge

          rotateIndex = (rotateIndex - 1) % 4;
          return true;
        }
      })
    ) {
      return; // cannot rotate
    } else {
      undraw();
      hero = originalHero;
      hero = hero.map((h) => h + base);

      draw();
    }
  }

  function moveDown() {
    if (!gameStart) return;
    if (hero.some((h) => squares[h + width].classList.contains("taken"))) {
      //stop current hero
      hero.forEach((h) => squares[h].classList.add("taken"));

      //change to next hero//
      //nextView change
      ramNumber = nextRamNumber;
      rotateIndex = nextRotateIndex;

      nextView();
      //
      currentline = switchLine;
      currentcolumn = showY;

      hero = heros[ramNumber][rotateIndex];

      originalX = originalPosition[ramNumber][rotateIndex][0];
      originalY = originalPosition[ramNumber][rotateIndex][1];
      hero = hero.map(
        (h) =>
          h +
          originalX +
          originalY * width +
          currentcolumn +
          currentline * width
      );
      color = colors[ramNumber];
    } else {
      //current hero  movedown 1 step
      undraw();
      hero = hero.map((h) => h + width);
      currentline += 1;
    }
    checkiffillupwholeline();
    draw();
  }

  function nextView() {
    undrawNext();

    nextRamNumber = Math.floor(Math.random(0, 1) * heros.length);
    nextRotateIndex = Math.floor(Math.random(0, 1) * rotateLength);
    nextHero = nextHeros[nextRamNumber][nextRotateIndex];
    nextColor = colors[nextRamNumber]; //new
    drawNext();
  }

  function undrawNext() {
    nextHero.forEach((h) => nextSquare[h].classList.remove(nextColor));
  }

  function drawNext() {
    nextHero.forEach((h) => nextSquare[h].classList.add(nextColor));
  }

  let textInterval = null;
  function checkiffillupwholeline() {
    for (let j = 0; j < height; j = j + 1) {
      let start = width * j;
      let linefill = squares
        .slice(start, start + width)
        .every((square) => square.classList.contains("taken"));

      if (linefill) {
        squares
          .slice(start, start + width)
          .forEach((square) => square.classList.remove(...square.classList));

        const removedSquares = squares.splice(start, width);
        scoreContent += 10;
        score.textContent = scoreContent;

        if (!textInterval) {
          transformText();
        } else {
          clearInterval(textInterval);
          transformText();
        }

        squares = removedSquares.concat(squares);

        squares.forEach((square) => grid.appendChild(square));
      }
    }
  }

  function transformText() {
    score.classList.add("transtext");

    textInterval = setInterval(() => {
      score.classList.remove("transtext");
      clearInterval(textInterval);
      textInterval = null;
    }, 500);
  }

  function moveLeft() {
    if (!gameStart) return;

    //check if touch left edge
    if (hero.some((h) => h % width === 0)) {
      return;
    } else if (
      //check if touch taken
      hero.some((h) => squares[h - 1].classList.contains("taken"))
    ) {
      return;
    } else {
      undraw();
      hero = hero.map((h) => h - 1);
      currentcolumn -= 1;
      draw();
    }
  }

  function moveRight() {
    if (!gameStart) return;

    if (hero.some((h) => h % width === width - 1)) {
      return;
    } else if (hero.some((h) => squares[h + 1].classList.contains("taken"))) {
      return;
    } else {
      undraw();
      hero = hero.map((h) => h + 1);
      currentcolumn += 1;
      draw();
    }
  }

  //listen kyboard ->
  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowLeft":
        moveLeft();
        // checkiffillupwholeline();
        break;
      case "ArrowRight":
        moveRight();
        // checkiffillupwholeline();
        break;
      case "ArrowDown":
        moveDown();
        checkiffillupwholeline();

        break;
      case "ArrowUp":
        rotate();
        break;
      case "Space":
        playStart();
    }
  });

  //keyboard on phone
  up.addEventListener("click", rotate);
  down.addEventListener("click", moveDown);
  left.addEventListener("click", moveLeft);
  right.addEventListener("click", moveRight);

  //listen play/pause
  function playStart() {
    gameStart = true;

    drawNext();
    draw();
    if (!startInterval) {
      startInterval = setInterval(moveDown, speed);

      pauseBtn.style.display = "block";
      startBtn.style.display = "none";
    } else {
      clearInterval(startInterval);
      startInterval = null;
      pauseBtn.style.display = "none";
      startBtn.style.display = "block";
    }
  }

  startBtn.addEventListener("click", () => {
    if (!checkGameOver()) {
      playStart();
    }
  });

  pauseBtn.addEventListener("click", () => {
    if (!checkGameOver()) {
      playStart();
    }
  });

  const checkCloseCard = () => {
    if (gameovercard.classList.contains("show")) {
      gameovercard.classList.remove("show");
      setTimeout(restartPlay, 1000);
    } else {
      restartPlay();
    }
  };

  const restartPlay = () => {
    //check if close card if open

    //
    clearInterval(startInterval);
    startInterval = null;
    scoreContent = 0;
    score.textContent = scoreContent;
    //hero
    ramNumber = Math.floor(Math.random(0, 1) * heros.length);
    rotateIndex = Math.floor(Math.random(0, 1) * rotateLength);
    currentline = switchLine;
    currentcolumn = showY;

    hero = heros[ramNumber][rotateIndex];

    originalX = originalPosition[ramNumber][rotateIndex][0];
    originalY = originalPosition[ramNumber][rotateIndex][1];
    hero = hero.map(
      (h) =>
        h + originalX + originalY * width + currentcolumn + currentline * width
    );
    color = colors[ramNumber];
    //

    //background:
    for (let i = 0; i < width * height; i++) {
      squares[i].classList.remove(...squares[i].classList);
    }

    //start

    playStart();
  };
  //listen restart
  restartBtn.addEventListener("click", checkCloseCard);

  closecard.addEventListener("click", () => {
    gameovercard.classList.remove("show");
  });

  newplay.addEventListener("click", checkCloseCard);
});
