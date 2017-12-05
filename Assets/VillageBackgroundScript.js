#pragma strict

var i : int;
var j : int;
var line : LineRenderer;
var cur_line_points : Array;
var game_object_index : int;
var cur_object : GameObject;
var spriterenderer : SpriteRenderer;
var cur_village_object : VillageObject;
var drag_item : int;
var village_game_objects : Array;

function Start () {
	game_object_index = 0;
	for(i=0;i<SceneManager.village_game_objects.length;i++)
	{
		game_object_index++;
		cur_object = new GameObject("GameObject"+game_object_index);
		cur_village_object = SceneManager.village_game_objects[i];
		cur_object.transform.position = cur_village_object.position;
		spriterenderer = cur_object.AddComponent("SpriteRenderer");
		spriterenderer.sprite = Resources.Load("texture"+cur_village_object.sprite_id, Sprite);
	}
	Debug.Log(SceneManager.line_points.length);
	for(i=0;i<SceneManager.line_points.length;i++)
	{
		cur_line_points = SceneManager.line_points[i] as Array;
		game_object_index++;
		cur_object = new GameObject("GameObject"+game_object_index);
		line = cur_object.AddComponent("LineRenderer");
		line.SetVertexCount(cur_line_points.length);
		line.material = new Material (Shader.Find("Sprites/Default"));
		drag_item = SceneManager.line_id[i];
		line.SetColors(SceneManager.colors[drag_item], SceneManager.colors[drag_item]);
		line.SetWidth(0.5,0.5);
		for(j=0;j<cur_line_points.length;j++)	
			line.SetPosition(j, Camera.main.ScreenToWorldPoint(cur_line_points[j]));
	}
}

function Update () {

}