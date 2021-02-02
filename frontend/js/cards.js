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
<span id="$_value" style="display:none">&</span>
</div>
`;

var number_card_html = `
<div class="tic_card tic_number tic_center_align" id="$_card">
<span class="tic_number tic_value">&</span>
<span id="$_value" style="display:none">&</span>
</div>
`;

var backwards_card_html = `
<div class="tic_card tic_backwards tic_center_align tic_special" id="$_card">
<span class="tic_backwards tic_value">-4</span>
<span id="$_value" style="display:none">&</span>
</div>
`;

var skip_card_html = `
<div class="tic_card tic_skip tic_center_align tic_special" id="$_card">
<span class="tic_skip tic_value">8</span>
<span id="$_value" style="display:none">&</span>
</div>
`;

var enter_card_html = `
<div class="tic_card tic_enter tic_center_align tic_special" id="$_card">
<span class="tic_enter tic_value">&</span>
<span id="$_value" style="display:none">&</span>
</div>
`

var undo_card_html = `
<div class="tic_card tic_undo tic_center_align" id="$_card">
<span class="tic_undo tic_value">UNDO</span>
<span id="$_value" style="display:none">&</span>
</div>
`;

var swap_card_html = `
<div class="tic_card tic_swap tic_center_align" id="$_card">
<span class="tic_swap tic_value">SWAP</span>
<span id="$_value" style="display:none">&</span>
</div>
`;



/*
var hand_cards = [
  split_card_html,
  swap_card_html,
  skip_card_html,
  backwards_card_html,
  enter_card_html.replaceAll("&", "13"),
  number_card_html.replaceAll("&", "5")
]

hand_cards.forEach((item, i) => {
    $("#hand_cards").append(item.replaceAll("$", i));
});
 */

function getCardHTML(card, id) {
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
  return html.replaceAll("$", id).replaceAll("&", card.value);
}
