/*
This script creates the initial village and displays the introduction.
Author: Vishesh Kandhari
*/
#pragma strict

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
var box_size : int;						//Standard box size followed in the game.


function OnGUI()
{
//	GUI.Box(new Rect(margin, (screen_height - welcome_box_height)/2, welcome_box_width, welcome_box_height), SceneManager.intro_scene_text);
//	if(GUI.Button(
//						new Rect((welcome_box_width - box_size) / 2, (screen_height + welcome_box_height - box_size) / 2, box_size, box_size), 
//				  		Resources.Load("right")
//				 ))
	{
			Application.LoadLevel("CreateVillageScene1");
	}

}

function Start () {
	game_object_index = 0;
	
	screen_width = Screen.width;		//Calculating and storing screen dimensions
	screen_height = Screen.height;
	
	margin = screen_height * 0.0125;	//Calculating and storing the margin
	
	box_size = screen_height * 0.125;	//Calucating and storing the box size.
	
	welcome_box_width = screen_width - 2 * margin;	//Calculating and storing the welcome text box dimensions
	welcome_box_height = screen_height * 0.5;		//WILL CHANGE WHEN TEXT BECOMES FINAL
	
	//Creating the river
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("river", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.15, screen_height*0.5, 0));
	cur_object.transform.position.z = 0;
	//cur_village_object = new VillageObject();
	//cur_village_object.position = cur_object.transform.position;
	//cur_village_object.sprite = "river";
	//SceneManager.village_game_objects.push(cur_village_object);
	
	//Creating the houses
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("house", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.65, screen_height*0.8, 0));
	cur_object.transform.position.z = 0;
	cur_village_object = new VillageObject();
	cur_village_object.position = cur_object.transform.position;
	cur_village_object.sprite = "house";
	SceneManager.village_game_objects.push(cur_village_object);
	
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("house", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.3, screen_height*0.85, 0));
	cur_object.transform.position.z = 0;
	cur_village_object = new VillageObject();
	cur_village_object.position = cur_object.transform.position;
	cur_village_object.sprite = "house";
	SceneManager.village_game_objects.push(cur_village_object);
	
	game_object_index++;
	cur_object = new GameObject("GameObject"+game_object_index);
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("house", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.4, screen_height*0.2, 0));
	cur_object.transform.position.z = 0;
	cur_village_object = new VillageObject();
	cur_village_object.position = cur_object.transform.position;
	cur_village_object.sprite = "house";
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
	
	//SceneManager.Initialize();
	
}
function Update () {
	
}