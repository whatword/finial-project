//畫線
function grid(cxt) {
	// the first point is (30, 30)
	for (var i = 0; i < 19; i++)
	{
		cxt.beginPath();
		//col line
		cxt.moveTo(0+30,   (i+1)*30);
		cxt.lineTo(600-30, (i+1)*30);
		//row line
		cxt.moveTo((i+1)*30,   0+30);
		cxt.lineTo((i+1)*30, 600-30);
		cxt.stroke();
	}
}

//九個星位
function ninePoints(cxt) {
	var np = new Array(
		[120,120],[300,120],[480,120],
		[120,300],[300,300],[480,300],
		[120,480],[300,480],[480,480]
	);
	
	for (var i = 0; i < np.length; i++)
	{
		//circle
		cxt.beginPath();
		cxt.arc(np[i][0],np[i][1],3,0,2*Math.PI,false);
		cxt.fillStyle="black";
		cxt.fill();
	}
}

//點擊偵測
var move_count = 0;
function mousedownHandler(e) {
	var x, y;
	if(e.layerX || e.layerX == 0)
	{
		x = e.layerX;
		y = e.layerY;
	}

	//在邊界外
	if (x < 30-10 || x > 600-30+10 || y < 30-10 || y > 600-30+10)
		return;

	var xok = false, yok = false;
	var x_point, y_point;
	for (var i = 1; i <= 19; i++)
	{
		if (x > i*30-15 && x < i*30+15)
		{
			x = i*30;
			xok = true;
			x_point = i - 1;
		}
		if (y > i*30-15 && y < i*30+15)
		{
			y = i*30;
			yok = true;
			y_point = i - 1;
		}
	}
	if (!xok || !yok)
		return;

	play(x_point, y_point, move_count);
	showTable();
}


function initBoard() {
	var c_path = document.getElementById("path");
	c_path.addEventListener('mousedown', mousedownHandler, false);

	var c_weiqi = document.getElementById("weiqi");
	var cxt = c_weiqi.getContext("2d");
	cxt.fillStyle = "silver";
	cxt.fillRect(0,0,600,600);

	grid(cxt);
	ninePoints(cxt);

	showTable();
}

function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function')
	{
		window.onload = func;
	} 
	else
	{
		window.onload = function() {
			oldonload();
			func();
		}
	}
}
addLoadEvent(initBoard);