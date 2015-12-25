//盤面
var table = new Array(19);
for(var i = 0; i < 19; i++)
{
    table[i] = new Array(19);
    for(var j = 0; j < 19; j++)
    	table[i][j] = 0;
}
//盤面複製
var copy = new Array(19);
for(var i = 0; i < 19; i++)
{
    copy[i] = new Array(19);
    for(var j = 0; j < 19; j++)
    	copy[i][j] = 0;
}
//毀棋紀錄
var regret_table = new Array(19);
for(var i = 0; i < 19; i++)
{
    regret_table[i] = new Array(19);
    for(var j = 0; j < 19; j++)
    {
    	regret_table[i][j] = new Array(500);
    	for(var k = 0; k < 500; k++)
    		regret_table[i][j][k] = 0;
    }
}
//劫
var zed = new Array();
//步數紀錄
var move_record = new Array();

//畫盤面
function showTable() {
	var c = document.getElementById("weiqi");
	var cxt = c.getContext("2d");
	cxt.strokeStyle="black";
	
	// 清空，重新畫線
	cxt.clearRect(0,0,600,600);
	cxt.fillStyle = "sandybrown";
	cxt.fillRect(0,0,600,600);
	grid(cxt);
	ninePoints(cxt);

	//毀棋
	if(regret_number && move_count > 0)
	{
		for (var i = 0; i < 19; i++)
		    for (var j = 0; j < 19; j++)
			    table[i][j] = regret_table[i][j][move_count-1];
		move_count--;
		move_record.pop();
	}

	//重新開始
	if(restart_number)
	{
		for (var i = 0; i < 19; i++)
		    for (var j = 0; j < 19; j++)
			    table[i][j] = 0;
		while(move_count)
		{
			move_record.pop();
			move_count--;
		}
	}

	//整地
	if(place_number)
	{
	    var B=0, W=0;
	    make_copy();
		for (var i = 0; i < 19; i++)
		    for (var j = 0; j < 19; j++)
		        if ((table[i][j] === 1 || table[i][j] === 2) && copy[i][j] !== 7)
                    place_fill(i, j, table[i][j]);
		for (var i = 0; i < 19; i++)
			for (var j = 0; j < 19; j++)
				if(table[i][j] === 1)
					B++;
				else
					W++;
	}

	//畫黑棋白棋
	for (var i = 0; i < 19; i++)
	{
		for (var j = 0; j < 19; j++)
		{
		    //black
			if (table[i][j] === 1)
			{ 
				var rg = cxt.createRadialGradient((i+1)*30-3, (j+1)*30-3, 1, (i+1)*30-4, (j+1)*30-4, 11);
				rg.addColorStop(0, "black");
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				cxt.fillStyle=rg;
				cxt.fill();
				
			}
			//white
			else if (table[i][j] === 2)
			{ 
				var rg = cxt.createRadialGradient((i+1)*30-3, (j+1)*30-3, 1, (i+1)*30-4, (j+1)*30-4, 11);
				rg.addColorStop(0, "white");
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				cxt.fillStyle=rg;
				cxt.fill();
			}
			// fill color
			else if (table[i][j] === 7)
			{ 
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				cxt.fillStyle="red";
				cxt.fill();
			}
		}
	}

    //整地後判斷誰勝誰負
    if(place_number)
	{
		var winer;
		if(B > W)
		{
			winer = B - W;
			alert("黑方勝利！！\n 贏" + winer + "目。");
		}
		else if(W > B)
		{
			winer = W - B;
			alert("白方勝利！！\n 贏" + winer + "目。");
		}
		else
			alert("和局！！");
	}

	// 顯示手數
	if (show_number)
	{
		// 最新的一手由红色標記
		for (var m = 0; m < move_record.length-1; m++)
		{
			// 判斷棋子是否在棋盤上
			if (table[move_record[m][0]][move_record[m][1]] === 0)
				continue;

			// 畫最新的數字（打劫後，可能導致一個座標上重復步數）
			var repeat_move = false;
			for (var j = m+1; j < move_record.length; j++)
			{
				if (move_record[m][0] === move_record[j][0] && move_record[m][1] === move_record[j][1])
				{
					repeat_move = true;
					break;
				}
			}
			if (repeat_move)
				continue;

			// 畫數字
			if (move_record[m][2] % 2 === 1)
				cxt.fillStyle="white";
			else
				cxt.fillStyle="black";

			cxt.font="bold 18px sans-serif";
			if (move_record[m][2] > 99)
				cxt.font="bold 16px sans-serif";
			cxt.textAlign="center";
			var move_msg = move_record[m][2].toString();
			cxt.fillText(move_msg, (move_record[m][0]+1)*30, (move_record[m][1]+1)*30+6);
		}
	}
	// 特别顯示最新的一手
	if (move_record.length > 0)
	{
		cxt.fillStyle = "red";
		var newest_move = move_record.length-1;
		cxt.fillRect((move_record[newest_move][0]+1)*30-5, (move_record[newest_move][1]+1)*30-5, 10, 10);
	}
}

function play(row, col) {
	//超過邊界的點
	if (row < 0 || row > 19 || col < 0 || col > 19 || table[row][col] !== 0)
		return;

    // 是否可下
	var can_down = false; 
	// 得到黑白方的棋子的顏色
	var color;
	//黑
	if (move_count % 2 === 0)
		color = 1;
	//白
	else
		color = 2;

    //是否要下
	var down = have_air(row, col, color);
	var dead_body = new Array();
	var eat = can_eat(row, col, color, dead_body);
	if (down === 1) 
	{
		can_down = true;
		clean_dead_body(dead_body);
	}
	else if(down === 2)
	{
		make_copy();
		space_fill(row, col, color);
		if (fill_block_have_air(row, col, color))
		{
			can_down = true;
			clean_dead_body(dead_body);
		}
		else
		{
			clean_dead_body(dead_body);
			if (eat)
				can_down = true;
			else
				alert("無氣，不能落子！！");
		}
	}
	else
	{
		// 劫爭
		if (eat)
		{
			if (!is_zed(row, col, dead_body))
			{
				clean_dead_body(dead_body);
				can_down = true;
			}
			else
				alert("劫, 不能落子, 請至少隔一手棋！！");
		}
		else
			alert("無氣，不能落子！！");
	}
	if (can_down)
		stone_down(row, col);
}

//是否劫
function is_zed(row, col, dead_body) { 
	if (dead_body.length === 1)
	{
		for (var i = 0; i < zed.length; i++)
		{
			//若符合（有座標，且為上一手）
			if (zed[i][0] === dead_body[0][0] && zed[i][1] === dead_body[0][1] && zed[i][2] === move_count)
				return true;
		}
		//加入紀錄表
		zed.push([row, col, move_count+1]);
		return false;
	}
	return false;
}

// 能吃
function can_eat(row, col, color, dead_body) {
	var ret = false;
	var anti_color;
	if (color === 1)
		anti_color = 2;
	else
		anti_color = 1;
	var i = new Array( 0, 1, 0,-1);
	var j = new Array( 1, 0,-1, 0);
	for(var k=0; k<4; k++)
	{
		if(row+i[k] >= 0 && row+i[k] < 19 && col+j[k] >= 0 && col+j[k] < 19 && table[row+i[k]][col+j[k]] === anti_color)
		{
			make_copy();
		    copy[row][col] = color;
		    space_fill(row+i[k], col+j[k], anti_color);
		    if (!is_dead(anti_color))
		    {
			    var rret = record_dead_body(dead_body);
			    ret = ret || rret;
		    }
		}
	}
	return ret;
}

//紀錄死亡棋子
function record_dead_body(db) {
	var ret = false;
	for (var row = 0; row < 19; row++)
		for (var col = 0; col < 19; col++)
			if (copy[row][col] === 7)
			{
				db.push([row, col]);
				ret = true; // it's true have dead body
			}
	return ret;
}

//移除死棋
function clean_dead_body(db) {
	for (var i = 0; i < db.length; i++)
		table[db[i][0]][db[i][1]] = 0;
}

// 填充的區域周圍是否有空
function fill_block_have_air(row, col, color) {
	for (var i = 0; i < 19; i++)
		for (var j = 0; j < 19; j++)
			if (i !== row || j !== col)
				if (copy[i][j] === 7 && table[i][j] !== color)
					return true;
	return false;
}

// 提吃判斷
function is_dead(color) {
	for (var i = 0; i < 19; i++)
		for (var j = 0; j < 19; j++)
			if (copy[i][j] === 7 && table[i][j] !== color)
				return true; // 活
	return false; //死
}

// 將盤面複製
function make_copy() {
	for (var i = 0; i < 19; i++)
		for (var j = 0; j < 19; j++)
			copy[i][j] = table[i][j];
}

// 在複製盤面上做查找
function space_fill(row, col, color) {
	if (row < 0 || row > 18 || col < 0 || col > 18)
		return;

    //(異色or沒棋)且沒找過
	if ((copy[row][col] === color || copy[row][col] === 0) && copy[row][col] !== 7)
	{
		copy[row][col] = 7; // 設已找過
		space_fill(row+1, col, color);
		space_fill(row-1, col, color);
		space_fill(row, col+1, color);
		space_fill(row, col-1, color);
	}
}

//整地填滿
function place_fill(row, col, color) {
	if (row < 0 || row > 18 || col < 0 || col > 18)
		return;

    var anti_color;
    if(color === 1)
    	anti_color = 2;
    else
    	anti_color = 1;
    //從第一個顏色填滿全部區域
    if (table[row][col] !== anti_color && copy[row][col] !== 7) {
        copy[row][col] = 7; // 設已找過
        table[row][col] = color;
        place_fill(row + 1, col, color);
        place_fill(row - 1, col, color);
        place_fill(row, col + 1, color);
        place_fill(row, col - 1, color);
    }
}

// 座標周圍是否有氣
function have_air(row, col, color) {
	var anti_color;
	if(color === 1)
		anti_color = 2;
	else
		anti_color = 1;
	//中間
	if (row > 0 && row < 18 && col > 0 && col < 18)
	{ 
		if (table[row+1][col] === anti_color && table[row-1][col] === anti_color && table[row][col+1] === anti_color && table[row][col-1] === anti_color)
			return 0;
		else if(table[row+1][col] === 0 || table[row-1][col] === 0 || table[row][col+1] === 0 || table[row][col-1] === 0)
			return 1;
		else
			return 2;
	}
	//角
	else if((row === 0 && col === 0) || (row === 0 && col === 18) || (row === 18 && col === 0) || (row === 18 && col === 18))
	{
		var temp_row = row;
		if(temp_row === 0)
			temp_row = temp_row+1;
		else
			temp_row = temp_row-1;
		var temp_col = col;
		if(temp_col === 0)
			temp_col = temp_col+1;
		else
			temp_col = temp_col-1;

		if(table[temp_row][col] === anti_color && table[row][temp_col] === anti_color)
			return 0;
		else if(table[temp_row][col] === 0 || table[row][temp_col] === 0)
			return 1;
		else
			return 2;

	}
	//邊
	else
	{
		var temp_row = row;
		if(temp_row === 0)
			temp_row = temp_row+1;
		else if(temp_row === 18)
			temp_row = temp_row-1;
		var temp_col = col;
		if(temp_col === 0)
			temp_col = temp_col+1;
		else if(temp_col === 18)
			temp_col = temp_col-1;
		if(temp_row !== row)
		{
			if(table[temp_row][col] === anti_color && table[row][col+1] === anti_color && table[row][col-1] === anti_color)
			    return 0;
		    else if(table[temp_row][col] === 0 || table[row][col+1] === 0 || table[row][col-1] === 0)
			    return 1;
			else
				return 2;
		}
		else if(temp_col !== col)
		{
			if(table[row][temp_col] === anti_color && table[row+1][col] === anti_color && table[row-1][col] === anti_color)
			    return 0;
			else if(table[row][temp_col] === 0 || table[row+1][col] === 0 || table[row-1][col] === 0)
				return 1;
		    else
			    return 2;
		}
		
	}
}

// 真正落子
function stone_down(row, col) {
	//放黑
	if (move_count % 2 === 0)
		table[row][col] = 1;
	//放白
	else
		table[row][col] = 2;

	// 紀錄手數
	move_count ++;
	move_record.push([row, col, move_count]);

	//記錄毀棋
	for(var i = 0; i < 19; i++)
		for(var j = 0; j<19; j++)
			regret_table[i][j][move_count] = table[i][j];
}