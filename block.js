
//グラフィックのメソッド取得
const canvas = document.getElementById("myCanvas");   // <canvas> 要素への参照を canvas に保存。
const ctx = canvas.getContext("2d");   //2Dグラフィックを描画するためのメソッドやプロパティを持つオブジェクトを定数ctxに格納。


//円の開始位置を定義
let x = canvas.width / 2;   // 横幅を取得。　割って中央。
let y = canvas.height - 30;   //ちなみにcanvasは右向きにX+,下向きにY+です。 


//動いてみせるために小さな値を加えたい。
//フレームごとに x と y を変数 dx、dy で更新して、更新されるたびにボールが新しい位置に描画されるようにする。
let dx = 2;
let dy = -2;


//円の半径を保持し、計算に使用するという変数を定義。
const ballRadius = 10;

//ボールを描画
function dorwball(){
  ctx.beginPath();  //パスの定義を開始
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);   //円を定義。xとyの位置に半径10のか
  ctx.fillStyle = "#111111";  //色を設定
  ctx.fill();  //塗りつぶし
  ctx.closePath();
}


//パドルに用いるいくつかの変数を定義。
const paddleHeight = 10;   //パドルの高さ
const paddleWidth = 75;   //パドルの幅
let paddleX = (canvas.width - paddleWidth) / 2;   //パドルの開始地点

//パドルを描画
function drawPaddle() {
  ctx.beginPath();  
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);  //四角形を定義
  ctx.fillStyle = "#111111";
  ctx.fill();
  ctx.closePath();
}


//操作ボタンの初期化。最初は押されていない為、規定値はfalse。
let rightPressed = false;
let leftPressed = false;


//ブロックの行と列の数、幅と高さ、ブロックがくっつかないように足元の隙間を定義
//そしてキャンバスのブロックに描画されないように上端、左端からの相対位置を定義
const brickRowCount = 3;   //ブロックの行数。c。
const brickColumnCount = 5;   //ブロックの列数。r。
const brickWidth = 75;   //幅
const brickHeight = 20;   //高さ
const brickPadding = 10;   //間隔
const brickOffsetTop = 30;   //位置（上）
const brickOffsetLeft = 30;   //位置（左）


//二次元配列はブロックの列 (c) を含んでおり、列は行 (r) を含み、行はそれぞれのブロックが描画される画面上x規定とy規定を含んでいます。
//上記の説明はよくわからなかった。
//二重ループを使い、二次元配列を作り、そのなかに連想配列を定義？
//ループを使用して一括で描画できるようにする。
//二次元配列はブロックの位置や状態を効果的に管理することができる。
//配列名[インデックス][要素に含まれる配列のインデックス]
//配列Cに含まれるRに連想配列を格納。
//衝突関数で使う
const bricks = []; 
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];    
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };   //status:はブロック有無ステータス。１は有、0は無。初期値は有りだから1。
  }
}


//ブロックを描画
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {   //ステータスを確認。１でなければ描画しない。
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;   //列番＊ブロック幅と間隔+左オフセット
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;   //列番＊ブロック高さと間隔+上オフセット
        bricks[c][r].x = brickX;  //連想配列キーxに代入
        bricks[c][r].y = brickY;  //連想配列キーyに代入
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);   //ブロックを座標に描画　//ブロックの座標は左下が基準。
        ctx.fillStyle = "#555555";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


//ブッロクとボールの衝突検出関数
//衝突検出のループの内部ブロック オブジェクトを保存する変数をb定義
//ボールの中央がブロックの 1 もし何かの規定の内部だったらボールの向きを変え、有無ステータスも変更。
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          
          x > b.x &&   //ボールの x 座標がブロックの x 座標より大きい。
          x < b.x + brickWidth &&   //ボールの x 座標がブロックの x 座標とその幅の和より小さい。
          y > b.y &&   //ボールのy座標がブロックのy座標より大きい。
          y < b.y + brickHeight   //ボールのy座標がブロックのy座標とその高さの和より小さい
        ) {
          dy = -dy;   //yの向きを変える。ボールの動きは上から下になる。xはそのままの向き。
          b.status = 0;   //ステータス無にする。
        }
      }
    }
  }
}


//動きを定義
function draw() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);   //キャンバスの内容を消去。アニメーション開始時の初期化。
    drawBricks();   //ブロックを表示
    dorwball();   //ボール表示
    drawPaddle();   //パドル表示
    collisionDetection();   //衝突検出関数
    x += dx;   //少し動かす
    y += dy;   //少し動かす

    //右端に円が当たった時（円の座標が最大引く半径より多きかったら）、または、左端に円が当たった時（円の座標が半径より小さかったら）、x方向の動きを反転させる。
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    //上端に円が当たった時（半径より低かったら）、y方向の動きを反転させる。
    //下端に円が当たった時（最大引く半径より高かったら）ゲームオーバー。
    //ボールの中心がパドルの左端と右端の間にあるかどうかをチェックして衝突判定。
    if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
          } else {
        // alert("ゲームオーバー");
        document.location.reload();   //再読み込み。
        }
    }

    //パドルが左端の 0 と右端の canvas.width-paddleWidth 間で動くようにする。
    if (rightPressed) {
        paddleX = Math.min(paddleX + 5, canvas.width - paddleWidth);   //右端(canvas.width - paddleWidth)か右に5px動いた位置のどちらか小さいほうが位置になる。
      } else if (leftPressed) {
        paddleX = Math.max(paddleX - 5, 0);   //左端(0)か左に5px動いた位置のどちらか大きいほうが位置になる。
    }
}

// パドル操作ボタン-------------------------------------------------------

//ボタン押し検知。
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


//引数eにはイベントリスナー実行時に生成されたイベントオブジェクトのイベント発生情報を取得される。
//key は押されたキーについての情報を持っています。
//キーが押された時
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
}

//キーが離れた時
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
}

// スマホ対応ボタン
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

leftButton.onclick = function() {
  left();
};

rightButton.onclick = function() {
  right();
};

function left() {
  paddleX = paddleX - 25;
}

function right() {
  paddleX = paddleX + 25;
}

// 画面設定--------------------------------------------------------

// 初期画面
function first() {  
  drawBricks();   //ブロックを表示
  dorwball();   //ボール表示
  drawPaddle();   //パドル表示
}

// ページ読み込みされたら表示
window.addEventListener('load',function(){
  first();
})

//ストップとスタートとリセット
let interval;
const stopButton = document.getElementById("stopButton");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");


stopButton.onclick = function() {
  stop();
};

startButton.onclick = function() {
  start();
};

resetButton.onclick = function() {
  reset();
};

// ストップ
function stop() {
  clearInterval(interval);   //インターバル停止
}

// スタート
function start() {
  interval = setInterval(draw, 20); 
  // ストップ
    function stop() {
      clearInterval(interval);   //インターバル停止
    }
}
//setIntervalは、一定の遅延間隔を置いて関数やコードスニペットを繰り返し呼び出す。
//draw() 関数は setInterval 内で 10 ミリ秒ごとに実行されます。

//リセット
function reset() {
  document.location.reload();   //再読み込み。
}




