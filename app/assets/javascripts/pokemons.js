/*--------------------------------------------------*/
/*  pokemons.js                                     */
/*--------------------------------------------------*/

// ページ内共通で利用する定数・変数（コンソールから閲覧できる定数・変数）
const PATH = "/images/pokemon/";
const FONT_FAMILY = "56px PixelMplus";
const FONT_COLOR = "Black";
const BR = "\n\n\n";
const SHAPE_COLOR = "#2cc82a";
const SHAPE_WIDTH = 300;
const SHAPE_HEIGHT = 12;
const SELECTER = "▶︎";
const SPACE = "　";
const PER_ROW = 3;
const BATTLE_TIME = 10 * 1000;
// 1000x1000をキャンバスとした場合のそれぞれのパーツの所定位置配列
const POS = {
  "img_idling": {x: 0, y: 0},
  "img_enemy" : {x: 870, y: 30},
  "img_enemy_hp": {x: -190, y: 100},
  "img_master": {x: -160, y: 270},
  "img_mentor_ball": {x: 680, y: 460},
  "img_mentor": {x: -330, y: 270},
  "img_mentor_hp": {x: 680, y: 460},
  "img_message": {x: 10, y: 630},
  "txt_enemy": {x: -150, y: 40},
  "txt_mentor": {x: 740, y: 390},
  "txt_mentor_hp": {x: 770, y: 510},
  "txt_message": {x: 50, y: 720},
  "shp_enemy": {x: -46, y: 123},
  "shp_mentor": {x: 836, y: 475}
};
// オーディオ定数
const AUDIO_WAIT = "Wait";
const AUDIO_PING = "Ping";
const AUDIO_LEVEL1 = "enemy_level1";
const AUDIO_LEVEL2 = "enemy_level2";
const AUDIO_LEVEL3 = "enemy_level3";
const AUDIO_RARE = "rare";

// CreateJSでオブジェクトが乗るステージ変数
var stage;
// 各オブジェクト変数(関数で引数として渡さなくても参照できるように)
var img_idling;
var img_enemy;
var img_enemy_hp;
var img_master;
var img_mentor_ball;
var img_mentor;
var img_mentor_hp;
var img_message;
var txt_enemy;
var txt_mentor;
var txt_mentor_hp;
var txt_message;
var shp_enemy;
var shp_mentor;
// slackウザいんでテスト用
var testData = {
    log_id: 1,
    mentor_id: 3,
    team_name: '踊れるエンジニア',
    mentors: [
      {id: 1, name: "XXX XXX"},
      {id: 2, name: "YYY YY"},
      {id: 3, name: "ZZZ"},
      {id: 7, name: "VVV VV VVV"},
      {id: 10, name: "WWW　WWW"}
    ],
    src_enemy: "enemy/unknown.png",
    src_mentor: "mentor/trainer.png",
    subscription: "test",
    level: 1
};
// メンター選択中かどうか
var isSelectMode = false;
var selectedMentorNum = 0;
var mentorsArray = [];
var mentor;
var src_mentor;
var log_id;
var team_name;
// セットタイムアウト制御用変数
var setTimeOutAnimation;

// ポケモンの初期化処理
function initPokemon(){
  // すべてのオブジェクトをステージから削除
  stage.removeAllChildren();
  // メンター選択をオフにする
  isSelectMode = false;
  // 選択中のメンター番号を初期化
  selectedMentorNum = 0;
}

// メッセージのリセット処理
function resetMessage(){
  stage.removeChild(txt_message);
}

// ポケモンのスタート処理（お困りごと・マスター表示）
function startPokemon(data){
  // 画像の表示
  img_enemy = addImage(POS["img_enemy"], data.src_enemy);
  img_enemy_hp = addImage(POS["img_enemy_hp"], "enemy_hp.png");
  img_master = addImage(POS["img_master"], "master.png");
  img_mentor_ball = addImage(POS["img_mentor_ball"], "mentor_ball.png");
  img_message = addImage(POS["img_message"], "message.png");

  // テキストの表示
  txt_enemy = addText(POS["txt_enemy"], data.subscription+" :L"+data.level*30);
  txt_message = addText(POS["txt_message"], "やせいの"+data.subscription+"が"+BR+"あらわれた！");

  // 矩形の表示
  shp_enemy = addShape(POS["shp_enemy"]);

  // メンターの選択
  selectMentor(data);

  // ポケモンを動かす
  pokeMove();
}

// メンター表示処理
function goMentor(){
  // マスターをはける
  outMaster();

  setTimeOutAnimation = setTimeout(function(){
    // 画像の表示
    img_mentor = addImage(POS["img_mentor"], src_mentor);
    img_mentor_hp = addImage(POS["img_mentor_hp"], "mentor_hp.png");

    // テキストの表示
    txt_mentor = addText(POS["txt_mentor"], shortName(mentor.name)+" :L20");
    txt_mentor_hp = addText(POS["txt_mentor_hp"], "119/119");
    resetMessage();
    txt_message = addText(POS["txt_message"], team_name + " のもとへ"+BR+"ゆけ! "+shortName(mentor.name));

    // 矩形の表示
    shp_mentor = addShape(POS["shp_mentor"]);

    // メンターを動かす
    inMentor();

    // メンター登場後 戦闘時間経過したら終了する
    setTimeOutAnimation = setTimeout(function(){
      stopBattle();
    }, BATTLE_TIME);
  }, 800);
}

// 画像を追加する処理
function addImage(pos, src){
  var image = new createjs.Bitmap(PATH + src);
  image.x = pos.x;
  image.y = pos.y;
  stage.addChild(image);
  stage.update();
  return image;
}

// テキストを追加する処理
function addText(pos, content){
  var text = new createjs.Text(content, FONT_FAMILY, FONT_COLOR);
  text.x = pos.x;
  text.y = pos.y;
  stage.addChild(text);
  stage.update();
  return text;
}

// 矩形を追加する処理
function addShape(pos){
  var shape = new createjs.Shape();
  shape.graphics.beginFill(SHAPE_COLOR).drawRect(0, 0, SHAPE_WIDTH, SHAPE_HEIGHT);
  shape.x = pos.x;
  shape.y = pos.y;
  stage.addChild(shape);
  stage.update();
  return shape;
}

// ポケモンアニメーション
function pokeMove(){
  createjs.Tween.get(img_enemy).to({x:630}, 800);
  createjs.Tween.get(img_enemy_hp).to({x:50}, 800);
  createjs.Tween.get(img_master).to({x:80}, 800);
  createjs.Tween.get(img_mentor_ball).to({x:440}, 800);
  createjs.Tween.get(txt_enemy).to({x:90}, 800);
  createjs.Tween.get(shp_enemy).to({x:194}, 800);
}

// マスターをはけさせるアニメーション
function outMaster(){
  createjs.Tween.get(img_master).to({x:-330}, 800);
  createjs.Tween.get(img_mentor_ball).to({x:1000}, 800);
}

// メンターを登場させるアニメーション
function inMentor(){
  createjs.Tween.get(img_mentor).to({x:80}, 800);
  createjs.Tween.get(img_mentor_hp).to({x:440}, 800);
  createjs.Tween.get(txt_mentor).to({x:500}, 800);
  createjs.Tween.get(txt_mentor_hp).to({x:530}, 800);
  createjs.Tween.get(shp_mentor).to({x:596}, 800);
}

// リサイズ処理
function handleResize(event) {
  var w = window.innerWidth;
  var h = window.innerHeight;
  // 短い方を一辺の長さとする
  var size = (w>h? h:w);
  $("#pokemonCanvas").css("height", size);
  $("#pokemonCanvas").css("width", size);
  $("#imgSwitch").css("height", size);
  $("#imgSwitch").css("width", size);
  // ウィンドウが横長の場合の左右の余白幅
  var pad = ($(window).width() - size ) / 2;
  $("#imgSwitch").css("left", pad+"px");
}

// キーイベント処理
function handleKey(event){
  if(isSelectMode){
    // 入力されたキーコード
    var keyCode = event.keyCode;
    // 下を押した際に，メンター配列の長さより越えてしまう場合のフラグ変数
    var isOver = selectedMentorNum + PER_ROW >= mentorsArray.length ? true:false;
    // 上を押した際に，0より下回ってしまう場合のフラグ変数
    var isUnder = selectedMentorNum - PER_ROW < 0 ? true:false;
    if(keyCode == 39){// 右
      createjs.Sound.play(AUDIO_PING);
      if(selectedMentorNum != mentorsArray.length-1){
        selectedMentorNum ++;
        renderSelectMentor(selectedMentorNum);
      }
    }else if(keyCode == 37){// 左
      createjs.Sound.play(AUDIO_PING);
      if(selectedMentorNum != 0){
        selectedMentorNum --;
        renderSelectMentor(selectedMentorNum);
      }
    }else if(keyCode == 40){// 下
      createjs.Sound.play(AUDIO_PING);
      if(!isOver){
        selectedMentorNum += PER_ROW;
        renderSelectMentor(selectedMentorNum);
      }
    }else if(keyCode == 38){// 上
      createjs.Sound.play(AUDIO_PING);
      if(!isUnder){
        selectedMentorNum -= PER_ROW;
        renderSelectMentor(selectedMentorNum);
      }
    }else if(keyCode == 13){// エンター
      createjs.Sound.play(AUDIO_PING);
      assignMentor();
    }
  }
}

// バトル開始時の関数
function startBattle(data){
  // グローバル変数への格納
  mentorsArray = data.mentors;
  src_mentor = data.src_mentor;
  log_id = data.log_id;
  team_name = data.team_name;
  // タイムアウトアニメーションを停止させる
  clearTimeout(setTimeOutAnimation);
  // オーディオをすべて停止する
  createjs.Sound.stop();
  // ポケモンを初期化
  initPokemon();
  // 画面を再リロード
  var timestamp = new Date().getTime();
  $("#imgSwitch").attr('src', $("#imgSwitch").attr('src')+'?'+timestamp);
  // 画面切り替え
  $("#imgSwitch").removeClass("hidden");
  // 戦闘曲開始
  playAudio(data.level);

  // GIFのアニメーション時間だけ待つ
  setTimeOutAnimation = setTimeout(function(){
    // 待ち受け画像を消す
    stage.removeChild(img_idling);
    $("#imgSwitch").addClass("hidden");
    // ポケモンスタート
    startPokemon(data);
  }, 2500);
}

// バトル終了時の関数
function stopBattle(){
  // オーディオをすべて停止する
  createjs.Sound.stop();
  // ポケモンを初期化
  initPokemon();
  // 待ち受けを表示
  initIdling();
}

// 待ち受け表示処理
function initIdling(){
  img_idling = addImage(POS["img_idling"], "idling.png");
  // 待ち受け曲を再生
  createjs.Sound.play(AUDIO_WAIT);
}

// オーディオの読み込み処理
function loadAudio(){
  createjs.Sound.registerSound("/audios/waiting.mp3", AUDIO_WAIT);
  createjs.Sound.registerSound("/audios/ping.m4a", AUDIO_PING);
  createjs.Sound.registerSound("/audios/red_yasei.mp3", AUDIO_LEVEL1);
  createjs.Sound.registerSound("/audios/red_gym.mp3", AUDIO_LEVEL2);
  createjs.Sound.registerSound("/audios/red.mp3", AUDIO_LEVEL3);
  // createjs.Sound.registerSound("/assets/rare.mp3", AUDIO_RARE);
}
// オーディオの開始処理
function playAudio(level){
  switch(Number(level)){
    case 1:
      createjs.Sound.play(AUDIO_LEVEL1);
      break;
    case 2:
      createjs.Sound.play(AUDIO_LEVEL2);
      break;
    case 3:
      createjs.Sound.play(AUDIO_LEVEL3);
      break;
    case 777:
      createjs.Sound.play(AUDIO_RARE);
      break;
  }
}

// メンターの選択処理
function selectMentor(data){
  // メンターが指定されていたら，選択中のメンター配列番号を更新する
  if(data.mentor_id != ""){
    // メンターIDが一致しているメンターを取得する
    mentorsArray.forEach(function(val, index, ar){
      if(data.mentor_id == val.id){
        mentor = val;
        selectedMentorNum = index;
      }
    });
  }
  // メンターが指定されていたとしても，メンターを選択するようにする
  setTimeOutAnimation = setTimeout(function(){
    resetMessage();
    txt_message = addText(POS["txt_message"], "マスターはメンターを"+BR+"えらんでいる");
    setTimeOutAnimation = setTimeout(function(){
      // 選択可能モードに切り替える
      isSelectMode = true;
      // メンターの一覧出力
      renderSelectMentor(selectedMentorNum);
    }, 2000);
  }, 2000);
}

// メンター選択時のテキストを表示する処理
function renderSelectMentor(num){
  resetMessage();
  // 一度に表示できるのは６人（１行３列）
  var row = Math.floor(num/PER_ROW);
  var col = num%PER_ROW;
  var text = "";
  for(i=0; i<PER_ROW; i++){
    if (mentorsArray[row*PER_ROW+i] != null){
      text += (col == i ? SELECTER : SPACE) + shortName(mentorsArray[row*PER_ROW + i].name);
    }
  }
  text += BR;
  for(i=0; i<PER_ROW; i++){
    if (mentorsArray[(row+1)*PER_ROW+i] != null){
      text += SPACE + shortName(mentorsArray[(row+1)*PER_ROW + i].name);
    }
  }
  txt_message = addText(POS["txt_message"], text);
}

// メンターの名前の短縮形を返す処理
function shortName(name){
  if(name.indexOf("　") != -1){
    return name.slice(0, name.indexOf("　"));
  }else if(name.indexOf(" ") != -1){
    return name.slice(0, name.indexOf(" "));
  }else{
    return name.substr(0, 5);
  }
}

// メンターの割り当て処理
function assignMentor(){
  // メンター
  mentor = mentorsArray[selectedMentorNum];
  // 選択モードを終了
  isSelectMode = false;
  selectedMentorNum = 0;
  // Ajaxでログを更新
  var data = {"mentor_id": mentor.id};
  $.ajax({
    type: "PATCH",
    url: "/logs/"+log_id,
    data: data
  })
  .done(function(data){})
  .fail(function(){ console.log("ログの更新に失敗しました"); });
  // Ajaxでメンターの画像を更新
  $.ajax({
    type: "GET",
    url: "/get_mentor_src_ajax",
    data: data
  })
  .done(function(data){
    src_mentor = data.src_mentor;
  })
  .fail(function(){ console.log("メンター画像の取得に失敗しました") });
  // メンターを登場させる
  goMentor();
}

// 読み込み時の処理
$(function(){
  stage = new createjs.Stage("pokemonCanvas");

  // リサイズイベントを検知してリサイズ処理を実行
  window.addEventListener("resize", handleResize);
  handleResize();

  // キー操作で実行される処理
  window.addEventListener("keydown", handleKey);

  // canvasの描画設定（30fpsで更新）
  createjs.Ticker.setFPS(30);
  createjs.Ticker.addEventListener('tick', function(){
  stage.update();
  });

  // オーディオの読み込み
  loadAudio();
  // 待ち受け処理を実行
  initIdling();
  setTimeOutAnimation = setTimeout(function(){
    createjs.Sound.play(AUDIO_WAIT, {volume: 0.3, loop: -1});
  }, 2000);

})
