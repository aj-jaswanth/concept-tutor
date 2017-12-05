/*
This script is associated with level 1 of the Gram Panchayat elections.
Author : Vishesh Kandhari
*/

#pragma strict

var game_object_index : int;			//Index of latest game object created, 0 means that no game object has been created. 
										//Index starts from 1
var i : int;							//General purpose variables
var j : int;							
var cur_object : GameObject;			//Latest game object created
var cur_village_object : VillageObject;	//Refers to the stored game object corresponding to the one being created.	
var sprite_renderer : SpriteRenderer;	//Refers to the SpriteRenderer component attached to the game object created
var line : LineRenderer;				//Refers to the LineRenderer component attached to the game object created
var cur_line_points : Array;			//Refers to the array consisting of the vertices of the line being created.
var drag_item : int;					//Contains an integer that denotes the type of drag-to-draw object being drawn. 
										//This is used to obtain the corresponding color/texture for the object.
var screen_width : int;					//Stores the value of the screen width
var screen_height : int;				//Stores the value of the screen height
var margin : int;						//Stores the value of the margin calculated. 
var box_size : int;						//Standard box size followed in the game.
var sarpanch_text_box_width : int;		//Dimensions of the sarpanch text box
var sarpanch_text_box_height : int;
var cur_callout : GameObject;			//Refers to the callout currently being displayed.
var callout_index : int;				//Denotes the callout to be displayed.
var change_callout : int;				//Set to value 1 to indicate that a change of callout is needed.
var show_sarpanch_text_box : int;		//Set to indicate that the Sarpanch text box should be displayed.

function OnGUI()
{
	if(show_sarpanch_text_box == 1)
	{
		GUI.Box(new Rect(screen_width * 0.3, 
								screen_height - margin - sarpanch_text_box_height, 
								sarpanch_text_box_width, sarpanch_text_box_height), 
								"Let's play the game!");
	}
	else
	{
		if(GUI.Button(new Rect(screen_width - margin - box_size, screen_height - box_size - margin, box_size, box_size), "Skip"))
		{
			Application.LoadLevel("WaterMCQScene");
		}
	}
	if(GUI.Button(new Rect(screen_width - margin - box_size, margin, box_size, box_size), "Next"))
	{
		if(show_sarpanch_text_box == 1)
			Application.LoadLevel("WaterMCQScene");
		callout_index++;
		if(callout_index==5)
		{
			show_sarpanch_text_box = 1;
			Destroy(cur_callout);
			cur_object = new GameObject("Sarpanch");
			var num : int;
			if (SceneManager.selected_role == "sarpanch")
				num = SceneManager.sarpanch_index;
			else if (SceneManager.selected_role == "upsarpanch")
				num = SceneManager.upsarpanch_index;
			else if (SceneManager.selected_role == "panch")
				num = SceneManager.panch_index;
			else if (SceneManager.selected_role == "sevak")
				num = SceneManager.sevak_index;
			sprite_renderer = cur_object.AddComponent("SpriteRenderer");
			sprite_renderer.sprite = Resources.Load("person"+num+"_large", Sprite);
			cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.15, screen_height*0.2, 0));
			cur_object.transform.position.z = -2;
			/*GUI.Box(new Rect(screen_width * 0.3, 
								screen_height - margin - sarpanch_text_box_height, 
								sarpanch_text_box_width, sarpanch_text_box_height), 
								SceneManager.water_intro_sarpanch_text);*/
			
		}
		else if(callout_index < 5)	
		{
			Destroy(cur_callout);
			switch(callout_index)
			{
			case 2:
				cur_callout = new GameObject("Callout");
				sprite_renderer = cur_callout.AddComponent("SpriteRenderer");
				sprite_renderer.sprite = Resources.Load("water_person_2_callout", Sprite);
				cur_callout.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.42, screen_height*0.67, 0));
				cur_callout.transform.position.z = -1;
				break;
			case 3:
				cur_callout = new GameObject("Callout");
				sprite_renderer = cur_callout.AddComponent("SpriteRenderer");
				sprite_renderer.sprite = Resources.Load("water_person_3_callout", Sprite);
				cur_callout.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.87, screen_height*0.37, 0));
				cur_callout.transform.position.z = -1;
				break;
			case 4:
				cur_callout = new GameObject("Callout");
				sprite_renderer = cur_callout.AddComponent("SpriteRenderer");
				sprite_renderer.sprite = Resources.Load("water_person_4_callout", Sprite);
				cur_callout.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.27, screen_height*0.37, 0));
				cur_callout.transform.position.z = -1;
				break;
			}
		}
	}
}

function Start () {
	game_object_index = 0;
	
	screen_width = Screen.width;		//Calculating and storing screen dimensions
	screen_height = Screen.height;
	
	margin = screen_height * 0.0125;	//Calculating and storing the margin
	
	box_size = screen_height * 0.125;	//Calculating and storing the box size.
	
	sarpanch_text_box_width = screen_width * 0.7 - margin;
	sarpanch_text_box_height = screen_height * 0.3;
	
	CreateVillage();
		
	PlacePeople();	
	
	callout_index = 1;
	
	show_sarpanch_text_box = 0;
					
}

//Recreating the village stored in memory.
function CreateVillage()
{
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

function PlacePeople()
{
	//Person near the river
	cur_object = new GameObject("Person1");
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("water_person_1", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.2, screen_height*0.45, 0));
	cur_object.transform.position.z = 0;
	
	cur_callout = new GameObject("Callout");
	sprite_renderer = cur_callout.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("water_person_1_callout", Sprite);
	cur_callout.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.15, screen_height*0.62, 0));
	cur_callout.transform.position.z = -1;
	
	//Person near the well
	cur_object = new GameObject("Person2");
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("water_person_2", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.47, screen_height*0.5, 0));
	cur_object.transform.position.z = 0;
	
	//Person near the hand pump
	cur_object = new GameObject("Person3");
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("water_person_3", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.92, screen_height*0.2, 0));
	cur_object.transform.position.z = 0;
	
	//Person near a house
	cur_object = new GameObject("Person4");
	sprite_renderer = cur_object.AddComponent("SpriteRenderer");
	sprite_renderer.sprite = Resources.Load("water_person_4", Sprite);
	cur_object.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(screen_width*0.32, screen_height*0.2, 0));
	cur_object.transform.position.z = 0;
}


function Update () {

}