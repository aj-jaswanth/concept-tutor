#pragma strict
var sh : int;
var sw : int;
var xl : int;
var xr : int;
function Start () {
	sh = Screen.height;
	sw = Screen.width;
	xl = sw*0.45;
	xr = sw*0.98;
	InvokeRepeating("RandomFunction",1.8,1);
}

function RandomFunction()
{
	if (gameObject.name.Substring(1,1) == SceneManager.ward+"")
		gameObject.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(Random.Range(xl,xr),0,0)).x;
}