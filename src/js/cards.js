var split_card_html = `
<div class="card split" id="$_card">
<div class="column">
<span class="split_dot" id="$_btn_1"></span>
<span class="split_dot" id="$_btn_5"></span>
</div>

<div class="column">
<span class="split_dot" id="$_btn_2"></span>
<span class="split_dot" id="$_btn_4"></span>
<span class="split_dot" id="$_btn_6"></span>
</div>

<div class="column">
<span class="split_dot" id="$_btn_3"></span>
<span class="split_dot" id="$_btn_7"></span>
</div>
</div>
`;

var number_card_html = `
<div class="card number" id="$_card">
<span class="number value" id="$_value">&</span>
</div>
`;

var backwards_card_html = `
<div class="card backwards" id="$_card">
<span class="backwards value" id="$_value">&</span>
</div>
`;


var swap_card_html = `
<div class="card swap" id="$_card">
<span class="swap value" id="$_value">SWAP</span>
</div>
`;

$("#card_1").html(split_card_html.replaceAll("$", "1"));
$("#card_2").html(number_card_html.replaceAll("$", "2").replaceAll("&", "1"));
$("#card_3").html(swap_card_html);
$("#card_4").html(backwards_card_html.replaceAll("$", "4").replaceAll("&", "-4"));
$("#card_5").html(number_card_html.replaceAll("$", "5").replaceAll("&", "12"));


$(".card.number").on("click", function(e){
  if($(this).attr("disabled") == "disabled" || state.busy)return;
  //get value
  var elem = e.currentTarget;
  var id = elem.id.split("_")[0];
  var amount = $("#" + id + "_value").html();
  console.log(amount);
  //move by
  moveMarbleBy(amount);
  //disable card
  $(this).attr("disabled", "disabled");
});

$(".card.swap").on("click", function(e){
  if($(this).attr("disabled") == "disabled" || state.busy)return;
  //swap
  swapMarbles();
  //disable card
  $(this).attr("disabled", "disabled");
});

$(".card.backwards").on("click", function(e){
  if($(this).attr("disabled") == "disabled" || state.busy)return;
  //swap
  moveMarbleBy(-4);
  //disable card
  $(this).attr("disabled", "disabled");
});


//Splitcard Interface
$(".split_dot").on("click", function(e){
  if($(this).attr("disabled") == "disabled" || state.busy)return;

  var elem = e.currentTarget;
  var id = elem.id.split("_")[0];
  var num = parseInt(elem.id.split("_")[2]);

  if(state.card != null && state.card != id)return;
  state.busy = true;
  state.card = id;
  var amt = 0;

  for(let i = num; i > 0; i--){
    var dot = $("#" + id +"_btn_" + i);
    if(dot.attr("disabled") == "disabled"){
      break;
    }
    dot.css("background-color", "red");
    dot.attr("disabled", "disabled");
    amt++;
  }
  if(num == 7)$("#" + id + "_card").attr("disabled", "disabled")
  moveMarbleBy(amt);
});
