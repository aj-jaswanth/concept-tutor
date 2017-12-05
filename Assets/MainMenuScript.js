/*
This script creates the main menu with the village in the background.
Author: Vishesh Kandhari
*/
#pragma strict

var i : int;
var j : int;
var line : LineRenderer;				//Refers to the LineRenderer component attached to the game object created
var cur_line_points : Array;			//Refers to the array consisting of the vertices of the line being created.
var drag_item : int;					//Contains an integer that denotes the type of drag-to-draw object being drawn. 
										//This is used to obtain the corresponding color/texture for the object.
var cur_object : GameObject;			//Latest game object created
var cur_village_object : VillageObject;	//Refers to an object of class VillageObject containing information about a game object to be stored.
var game_object_index : int;			//Index of latest game object created, 0 means that no game object has been created. 
										//Index starts from 1
var sprite_renderer : SpriteRenderer;	//Refers to the SpriteRenderer component attached to the game object created
var screen_width : int;					//Stores the value of the screen width
var screen_height : int;				//Stores the value of the screen height
var margin : int;						//Stores the value of the margin calculated. 
var welcome_box_width : int;
var welcome_box_height : int;
var menu_item_width : int;			//Dimensions of a menu item.
var menu_item_height : int;
var h_margin : int;
var v_margin : int;
var row : int;
var col : int;
var starting_x : int;
var starting_y : int;
var box_size : int;
var main_menu_item_object : MainMenuItemObject;
var sw : int;
var sh : int;
var b1 : boolean;
var b2 : boolean;
var b3 : boolean;
var bc : boolean;
var fstyle : GUIStyle;
function OnGUI()
{
	for(i=0;i<SceneManager.main_menu_item_objects_list.length && bc;i++)
	{
		main_menu_item_object = SceneManager.main_menu_item_objects_list[i];
		row = Mathf.Floor(i/3f);
		col = i%3;
		if(GUI.Button
			(new Rect 
				(
					starting_x + col * (h_margin + menu_item_width), 
					starting_y + row * (margin + menu_item_height), 
					menu_item_width, 
					menu_item_height
				),
			main_menu_item_object.name 
		))
		{
			if(main_menu_item_object.is_matching_scene == "true")
			{
				SceneManager.file_to_load = main_menu_item_object.matching_scene_file;
			}
			Application.LoadLevel(main_menu_item_object.scene1_name);
		}
	}
	GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
	if (b1)
	{
		GUILayout.Box("The members of the Gram Panchayat is  assisted by GRAM SEVAK, who works as a secretary  for Gram Panchayat. He/she is an important link between the Government and the villagers. ",fstyle);
		if (GUILayout.Button("Next"))
		{
			b1 = false;
			b2 = true;
		}
	}
	if (b2)
	{
		GUILayout.Box("Each Gram Panchayat has a tenure of 5years. One of their major task is  the development of the village . Their function is to by strengthen the existing resources and to provide necessary  services and facilities to the villagers.",fstyle);
		if (GUILayout.Button("Next"))
		{
			b2 = false;
			b3 = true;
		}
	}
	if (b3)
	{
		GUILayout.Box("The village needs attention on these issues. The Gram Panchayat can  resolve them, one at a time and earn the resource for the prosperity and development  of the village.\nClick on the issues to resolve them. ",fstyle);
		if (GUILayout.Button("Close"))
		{
			b3 = false;
			bc = true;
		}
	}
	GUILayout.EndArea();
}

function Start () {
	sw = Screen.width;
	sh = Screen.height;
	b1 = true;
	b2 = false;
	b3 = false;
	bc = false;
	game_object_index = 0;
	
	screen_width = Screen.width;		//Calculating and storing screen dimensions
	screen_height = Screen.height;
	
	margin = screen_height * 0.05;	//Calculating and storing the margin
	
	box_size = screen_height * 0.125;
	menu_item_width = screen_width * 0.2;
	menu_item_height = box_size;
	h_margin = margin;
	v_margin = margin;
	starting_x = (screen_width - 3 * menu_item_width - 2 * h_margin) / 2;
	starting_y = (screen_height - 3 * menu_item_height - 2 * v_margin) / 2;
	
	welcome_box_width = screen_width - 2 * margin;	//Calculating and storing the welcome text box dimensions
	welcome_box_height = screen_height * 0.5;		//WILL CHANGE WHEN TEXT BECOMES FINAL
	
	CreateVillage();
	/*
	//Creating the river
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("river", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.15, screen_height*0.5, 0));
	cur_object.transform.position.z = 0;
	cur_village_object = new VillageObject();
	cur_village_object.position = cur_object.transform.position;
	cur_village_object.sprite = "river";
	SceneManager.village_game_objects.push(cur_village_object);
	
	//Creating the houses
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("texture1", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.8, screen_height*0.8, 0));
	cur_object.transform.position.z = 0;
	cur_village_object = new VillageObject();
	cur_village_object.position = cur_object.transform.position;
	cur_village_object.sprite = "texture1";
	SceneManager.village_game_objects.push(cur_village_object);
	
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("texture1", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.3, screen_height*0.85, 0));
	cur_object.transform.position.z = 0;
	cur_village_object = new VillageObject();
	cur_village_object.position = cur_object.transform.position;
	cur_village_object.sprite = "texture1";
	SceneManager.village_game_objects.push(cur_village_object);
	
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("texture1", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.4, screen_height*0.2, 0));
	cur_object.transform.position.z = 0;
	cur_village_object = new VillageObject();
	cur_village_object.position = cur_object.transform.position;
	cur_village_object.sprite = "texture1";
	SceneManager.village_game_objects.push(cur_village_object);
	
	//Creating the well
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("well", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.5, screen_height*0.5, 0));
	cur_object.transform.position.z = 0;
	cur_village_object = new VillageObject();
	cur_village_object.position = cur_object.transform.position;
	cur_village_object.sprite = "well";
	SceneManager.village_game_objects.push(cur_village_object);
	
	//Creating the hand pump
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("hand_pump", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.9, screen_height*0.2, 0));
	cur_object.transform.position.z = 0;
	cur_village_object = new VillageObject();
	cur_village_object.position = cur_object.transform.position;
	cur_village_object.sprite = "hand_pump";
	SceneManager.village_game_objects.push(cur_village_object);
	*/
	//PlacePeople();	
}
function Update () {
	
}

function CreateVillage()
{
	//Creating the river
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("river", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(SceneManager.screen_width*0.15, SceneManager.screen_height*0.5, 0));
	cur_object.transform.position.z = 1;
	
	//Non drag-to-draw objects
	for(i=0;i<SceneManager.village_game_objects.length;i++)
	{
		game_object_index++;
		cur_object = new GameObject("VillageObject"+game_object_index);
		cur_village_object = SceneManager.village_game_objects[i];
		cur_object.transform.position = cur_village_object.position;
		sprite_renderer = cur_object.AddComponent("SpriteRenderer");
		sprite_renderer.sprite = Resources.Load(cur_village_object.sprite, Sprite);
	}
	//Drag-to-draw objects
	for(i=0;i<SceneManager.line_points.length;i++)
	{
		cur_line_points = SceneManager.line_points[i] as Array;
		game_object_index++;
		cur_object = new GameObject("VillageObject"+game_object_index);
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