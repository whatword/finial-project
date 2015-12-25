var show_number = false;
var regret_number = false;
var restart_number = false;
var place_number = false;
function deal_button() {
	var hand_button = document.getElementById("hand");	
	if (hand_button)
	{
		hand_button.onclick = function() {
			//alert(move_show_button);
			if (show_number)
			{
				hand_button.innerHTML="顯示手數";
				show_number = false;
			}
			else
			{
				hand_button.innerHTML="取消手數";
				show_number = true;
			}
			showTable();
		}
	}

	var regret_button = document.getElementById("regret");
	if(regret_button)
	{
		regret_button.onclick = function() {
			regret_number = true;
			showTable();
			regret_number = false;
		}
	}

    var restart_button = document.getElementById("restart");
	if(restart_button)
	{
		restart_button.onclick = function() {
			restart_number = true;
			showTable();
			restart_number = false;
		}
	}

	var lose_button = document.getElementById("lose");
	if(lose_button)
	{
		lose_button.onclick = function() {
			if(move_count % 2 ===0)
				alert("黑方勝利！！");
			else
				alert("白方勝利！！");
			restart_number = true;
			showTable();
			restart_number = false;
		}
	}

	var place_button = document.getElementById("place");
	if(place_button)
	{
		place_button.onclick = function() {
			place_number = true;
			showTable();
			place_number = false;
		}
	}
}
addLoadEvent(deal_button);