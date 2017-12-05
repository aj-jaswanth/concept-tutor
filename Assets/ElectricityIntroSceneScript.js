#pragma strict
var sw : int;
var sh : int ;
var node : XMLNode;
var style : GUIStyle;

function Start () {
	sw = Screen.width;
	sh = Screen.height;
	var c = Resources.Load("electricity_intro") as TextAsset;
	var parser = new XMLParser();
	node = parser.Parse(c.text);
}

function Update () {

}

function OnGUI() {
	GUILayout.BeginArea(new Rect(sw/2f-sw*.35,sh*0.1,sw*0.7,0.8*sh));
	GUILayout.Label(node.GetValue("power_supply>0>intro>0>_text"),style);
	if(GUILayout.Button("Next"))
		Application.LoadLevel("ElectricityRoleScene");
	GUILayout.EndArea();
}