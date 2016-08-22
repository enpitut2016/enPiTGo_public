/*--------------------------------------------------*/
/*  logs.js                                         */
/*--------------------------------------------------*/

// ページ内 定数・変数
const PER_PAGE = 5;

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
