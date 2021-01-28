var split_card_html = `
<div class="tic_card tic_split" id="$_card">
<div class="split_column">
<span class="tic_split_dot $_tic_split_btn" id="$_btn_1"></span>
<span class="tic_split_dot $_tic_split_btn" id="$_btn_5"></span>
</div>

<div class="split_column">
<span class="tic_split_dot $_tic_split_btn" id="$_btn_2"></span>
<span class="tic_split_dot $_tic_split_btn" id="$_btn_4"></span>
<span class="tic_split_dot $_tic_split_btn" id="$_btn_6"></span>
</div>

<div class="split_column">
<span class="tic_split_dot $_tic_split_btn" id="$_btn_3"></span>
<span class="tic_split_dot $_tic_split_btn" id="$_btn_7"></span>
</div>
</div>
`;

var number_card_html = `
<div class="tic_card tic_number tic_center_align" id="$_card">
<span class="tic_number tic_value" id="$_value">&</span>
</div>
`;

var backwards_card_html = `
<div class="tic_card tic_backwards tic_center_align tic_special" id="$_card">
<span class="tic_backwards tic_value" id="$_value">-4</span>
</div>
`;

var skip_card_html = `
<div class="tic_card tic_skip tic_center_align tic_special" id="$_card">
<span class="tic_skip tic_value" id="$_value">8</span>
</div>
`;

var enter_card_html = `
<div class="tic_card tic_enter tic_center_align tic_special" id="$_card">
<span class="tic_enter tic_value" id="$_value">&</span>
</div>
`

var undo_card_html = `
<div class="tic_card tic_undo tic_center_align" id="$_card">
<span class="tic_undo tic_value" id="$_value">UNDO</span>
</div>
`;

var swap_card_html = `
<div class="tic_card tic_swap tic_center_align" id="$_card">
<span class="tic_swap tic_value" id="$_value">SWAP</span>
</div>
`;



// var hand_cards = [
//   split_card_html,
//   swap_card_html,
//   skip_card_html,
//   backwards_card_html,
//   enter_card_html.replaceAll("&", "13"),
//   number_card_html.replaceAll("&", "1")
// ]
//
// hand_cards.forEach((item, i) => {
//     $("#hand_cards").append(item.replaceAll("$", i));
// });

function addCard(card) {
  var html;
  switch (card.type) {
    case 'enter':
    html = enter_card_html;
    break;
    case 'number':
    html = number_card_html;
    break;
    case 'skip':
    html = skip_card_html;
    break;
    case 'split':
    html = split_card_html;
    break;
    case 'swap':
    html = swap_card_html;
    break;
    case 'undo':
    html = undo_card_html;
    break;
    case 'backwards':
    html = backwards_card_html;
    break;
  }
  $("#hand_cards").append(html.replaceAll("$", $('.yourclass').length).replaceAll("&", card.value));
}

$(".tic_card").mouseenter(function(){
  if(!$(this).hasClass("tic_unplayable")){
    $(this).addClass("tic_hovered")
  }
})

$(".tic_card").mouseleave(function(){
  $(this).removeClass("tic_hovered")
})
