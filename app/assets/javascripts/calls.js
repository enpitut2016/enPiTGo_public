/*--------------------------------------------------*/
/*  calls.js                                         */
/*--------------------------------------------------*/

// ページ内で利用する変数・定数
const PER_PAGE = 5;
var selectedMentorID = 0;

// Ajax処理による非同期のお困りごとの新規登録処理
function createNewMessage(){
  var subscription = $("#new-message input").val();
  if(subscription== ""){
    console.log("空白文字は登録できません");
    return false;
  }
  var data = {subscription: subscription}
  $.ajax({
    type: "POST",
    url: "/new_message_ajax",
    data: data
  })
  .done(function(data){
    if(data.status == "success"){
      appendOptionMessage(data.data);
    }else{
      console.log(data.data.subscription + "は既に登録されています");
    }
  })
  .fail(function(){ console.log("お困りごとの新規登録に失敗しました"); });
  return false;
}

// お困りごとのOptionタグを追加し選択状態にする処理
function appendOptionMessage(data){
  var ele = $("<option></option>",{
    value: data.id,
    text: data.subscription,
    selected: true
  });
  $("#call_message_id").append(ele);
}

// メンターを選択したときの処理
function selectMentor(ele){
  // 選択前に選択されていた要素から選択状態のクラスを削除
  $("#mentors li[data-mentor-id^='"+selectedMentorID+"']").removeClass("select");
  // 選択前と同じメンターと選択したかどうか
  if (selectedMentorID == $(ele).attr('data-mentor-id')){
    // 既に選択されているメンターを選択した場合，選択状態を解除する
    // 隠しフォームを空白（初期状態）にする
    $("input[name^='call[mentor][id]']").val("");
  }else{
    // 選択状態を新しいメンターに設定する
    // 選択中のメンターIDを更新
    selectedMentorID = $(ele).attr('data-mentor-id');
    // リストを選択状態のクラスを付与
    $(ele).addClass("select");
    // 隠しフォームに選択中のメンターIDを入力する
    $("input[name^='call[mentor][id]']").val(selectedMentorID);
  }
}

// フィルターのチーム名またはお困りごとが変更されたときの処理
function filterLogs(){
  var team = $("#filter #call_team_id").val();
  var message = $("#filter #call_message_id").val();
  // ページ単位分表示する
  var count = 0;
  $("#log-list li").each(function(){
    var obj_team = $(this).attr("data-team");
    var obj_message = $(this).attr("data-message");
    // 検索条件とマッチしているかチェック
    if(
        ( team == obj_team && message == obj_message )||
        ( team == "" && message == obj_message)||
        ( team == obj_team && message == "" )||
        ( team == "" && message == "" )
    ){
      if(count < PER_PAGE){
        $(this).fadeIn("slow");
      }
      $(this).addClass("match");
      count++;
    }else{
      $(this).fadeOut("slow");
      $(this).removeClass("match");
    }
  });
}

// リロード処理
function reload(){
  var count = 0;
  $("#log-list li").each(function(){
    if($(this).css("display") == "none" && $(this).hasClass("match") && count < PER_PAGE){
      $(this).fadeIn("Slow");
      count++;
    }
  });
}

// 読み込み時の処理
$(function(){
  // メンター選択リストにクリックイベントを付与する
  $("#mentors li").click(function(){
    selectMentor(this);
  });
  // ふんいきのスライダーにbootstrap-sliderを適用させる
  $("#level-slider").slider();
  // 読み込み時はページ単位分しかログを表示させない
  var count = 0;
  $("#log-list li").each(function(){
    if(count < PER_PAGE){
      $(this).fadeIn("Slow");
     count++;
    }
  });
  // スクロール時の処理
  $(window).bind("scroll", function(){
    scrollHeight = $(document).height();
    scrollPosition = (window.innerHeight ? window.innerHeight : $(window).height()) + $(window).scrollTop();
    if((scrollHeight - scrollPosition) / scrollHeight <= 0.01) {
      reload();
    }
  });

})
