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
var collider_width : int;				//Stores the value of the camera viewing width
var collider_height : int;				//Stores the value of the camera viewing height
var margin : int;						//Stores the value of the margin calculated. 
var box_size : int;						//Standard box size followed in the game.
var box_size_2 : int;					//Size of box for displaying candidates inside wards
var title_bar_height : int;				//Height of the top title bar
var message_box_height : int;			//Height of the message box
var vote_box_height : int;				//Height of text box used to display the number of votes for each candidate
var starting_x : int;					//Starting x co-ordinae for boxes inside a ward
var starting_y : int;					//Starting y co-ordinate for oxes inside a ward

var line1 : GameObject;					//Game objects correspong to the lines of ward boundaries
var line2 : GameObject;
var line3 : GameObject;
var line4 : GameObject;
var line5 : GameObject;
var line6 : GameObject;
var line7 : GameObject;
var line8 : GameObject;
var line9 : GameObject;
var line10 : GameObject;
var line1renderer : LineRenderer;		//Line renderers corresponding to the line objects
var line2renderer : LineRenderer;
var line3renderer : LineRenderer;
var line4renderer : LineRenderer;
var line5renderer : LineRenderer;
var line6renderer : LineRenderer;
var line7renderer : LineRenderer;
var line8renderer : LineRenderer;
var line9renderer : LineRenderer;
var line10renderer : LineRenderer;

var person_object : PersonObject;

var selected_people_electoral_ward_1 = new Array();
var selected_people_electoral_ward_2 = new Array();
var selected_people_electoral_ward_3 = new Array();
var selected_people_electoral_ward_4 = new Array();
var selected_people_electoral_ward_5 = new Array();
var selected_people_electoral_ward_6 = new Array();
var selected_people_electoral_ward_7 = new Array();

var ward1_selected : boolean = false;
var ward2_selected : boolean = false;
var ward3_selected : boolean = false;
var ward4_selected : boolean = false;
var ward5_selected : boolean = false;
var ward6_selected : boolean = false;
var ward7_selected : boolean = false;

var ward1_selected_object_id : int;
var ward2_selected_object_id : int;
var ward3_selected_object_id : int;
var ward4_selected_object_id : int;
var ward5_selected_object_id : int;
var ward6_selected_object_id : int;
var ward7_selected_object_id : int;

var selected_object_ids : int[];

var scrollPosition : Vector2;

var indices_array : Array;
var index : int;
var votes: int;
var total_votes : int;
var random_max : float;

var display_votes : boolean;			//Set to true to display votes text box, false to hide.
var display_bottom_menu_bar : boolean = false;
var level_fail : boolean = false;
var display_level_failed_message : boolean;
var sw : int;
var sh : int;
var b1 : boolean;
var fstyle : GUIStyle;
var show_level_fail : boolean;
function OnGUI()
{
	//Ward1
	starting_x = (0.6 * screen_width - selected_people_electoral_ward_1.length * (box_size_2 + margin)) / 2;
	starting_y = (0.3 * screen_height + title_bar_height - box_size_2 - vote_box_height) / 2; 
	for(i=0;i<selected_people_electoral_ward_1.length && !b1;i++)
	{
		person_object = selected_people_electoral_ward_1[i];
		if(GUI.Button(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id)) && !ward1_selected)
		{
			ward1_selected = true;
			if(!person_object.winning)
				{
				audio.clip = SceneManager.waudio;
				audio.Play();
				level_fail = true;
				}
			else
				{
				SceneManager.selected_election_ward_1 = person_object;
				audio.clip = SceneManager.caudio;
				audio.Play();
				}
			selected_object_ids[0] = person_object.id;
		}
		if(person_object.votes > 0 && display_bottom_menu_bar)
			GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y + margin + box_size_2, box_size_2, vote_box_height),""+person_object.votes);
 	
	}
	
	//Ward2
	starting_x = (0.6 * screen_width - selected_people_electoral_ward_2.length * (box_size_2 + margin)) / 2;
	starting_y = (0.9 * screen_height - box_size_2 - margin - vote_box_height) / 2; 
	for(i=0;i<selected_people_electoral_ward_2.length;i++)
	{
		person_object = selected_people_electoral_ward_2[i];
		if(GUI.Button(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id)) && !ward2_selected)
		{
			ward2_selected = true;
			if(!person_object.winning)
			{
				level_fail = true;
				audio.clip = SceneManager.waudio;
				audio.Play();
			}
			else
			{
				SceneManager.selected_election_ward_2 = person_object;
				audio.clip = SceneManager.caudio;
				audio.Play();
			}
			selected_object_ids[1] = person_object.id;
		}
		if(person_object.votes > 0 && display_bottom_menu_bar)
			GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y + margin + box_size_2, box_size_2, vote_box_height),""+person_object.votes);		
 	
	}
	
	//Ward3
	starting_x = (0.3 * screen_width - selected_people_electoral_ward_3.length * (box_size_2 + margin)) / 2;
	starting_y = (1.6 * screen_height - box_size - 2 * margin - box_size_2 - margin - vote_box_height) / 2;
	for(i=0;i<selected_people_electoral_ward_3.length;i++)
	{
		person_object = selected_people_electoral_ward_3[i];
		if(GUI.Button(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id)) && !ward3_selected)
		{
			ward3_selected = true;
			if(!person_object.winning)
			{
				level_fail = true;
				audio.clip = SceneManager.waudio;
				audio.Play();
			}
			else
			{
				SceneManager.selected_election_ward_3 = person_object;
				audio.clip = SceneManager.caudio;
				audio.Play();
			}
			selected_object_ids[2] = person_object.id;
		}
		if(person_object.votes > 0 && display_bottom_menu_bar)
			GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y + margin + box_size_2, box_size_2, vote_box_height),""+person_object.votes);
 	
	}
	
	//Ward4
	starting_x = (0.9 * screen_width - selected_people_electoral_ward_4.length * (box_size_2 + margin) - margin) / 2;
	starting_y = (1.6 * screen_height - box_size - 2 * margin - box_size_2 - margin - vote_box_height) / 2;
	for(i=0;i<selected_people_electoral_ward_4.length;i++)
	{
		person_object = selected_people_electoral_ward_4[i];
		if(GUI.Button(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id)) && !ward4_selected)
		{
			ward4_selected = true;
			if(!person_object.winning)
			{
				level_fail = true;
				audio.clip = SceneManager.waudio;
				audio.Play();
			}
			else
			{
				SceneManager.selected_election_ward_4 = person_object;
				audio.clip = SceneManager.caudio;
				audio.Play();
			}
			selected_object_ids[3] = person_object.id;
		}
		if(person_object.votes > 0 && display_bottom_menu_bar)
			GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y + margin + box_size_2, box_size_2, vote_box_height),""+person_object.votes);
 	
	}
	
	//Ward5
	starting_x = (1.4 * screen_width - box_size_2 - margin - box_size_2) / 2;
	starting_y = title_bar_height + margin + (0.5 * screen_height - title_bar_height - selected_people_electoral_ward_5.length * (box_size_2 + margin)) / 2; 
	for(i=0;i<selected_people_electoral_ward_5.length;i++)
	{
		person_object = selected_people_electoral_ward_5[i];
		if(GUI.Button(new Rect(starting_x, starting_y + i * (box_size_2 + margin), box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id)) && !ward5_selected)
		{
			ward5_selected = true;
			if(!person_object.winning)
			{
				level_fail = true;
				audio.clip = SceneManager.waudio;
				audio.Play();
			}
			else
			{
				SceneManager.selected_election_ward_5= person_object;
				audio.clip = SceneManager.caudio;
				audio.Play();
			}
			selected_object_ids[4] = person_object.id;
		}
		if(person_object.votes > 0 && display_bottom_menu_bar)
			GUI.Box(new Rect(starting_x + box_size_2 + margin, starting_y + i * (box_size_2 + margin), box_size_2, vote_box_height),""+person_object.votes);
 	
	}
	
	//Ward6
	starting_x = (1.8 * screen_width - box_size_2 - margin - box_size_2) / 2;
	starting_y = title_bar_height + margin + (0.5 * screen_height - title_bar_height - selected_people_electoral_ward_6.length * (box_size_2 + margin)) / 2; 
	for(i=0;i<selected_people_electoral_ward_6.length;i++)
	{
		person_object = selected_people_electoral_ward_6[i];
		if(GUI.Button(new Rect(starting_x, starting_y + i * (box_size_2 + margin), box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id)) && !ward6_selected)
		{
			ward6_selected = true;
			if(!person_object.winning)
			{
				level_fail = true;
				audio.clip = SceneManager.waudio;
				audio.Play();
			}
			else
			{
				SceneManager.selected_election_ward_6 = person_object;
				audio.clip = SceneManager.caudio;
				audio.Play();
			}
			selected_object_ids[5] = person_object.id;
		}
 		if(person_object.votes > 0 && display_bottom_menu_bar)
			GUI.Box(new Rect(starting_x + box_size_2 + margin, starting_y + i * (box_size_2 + margin), box_size_2, vote_box_height),""+person_object.votes);
	}
	
	//Ward7
	starting_x = 0.6 * screen_width + (0.4 * screen_width - selected_people_electoral_ward_7.length * (box_size_2 + margin)) / 2; 
	starting_y = (1.5 * screen_height - 2 * margin - box_size - box_size_2 - margin - vote_box_height) / 2;
	for(i=0;i<selected_people_electoral_ward_7.length;i++)
	{
		person_object = selected_people_electoral_ward_7[i];
		if(GUI.Button(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id)) && !ward7_selected)
		{
			ward7_selected = true;
			if(!person_object.winning)
			{
				level_fail = true;
				audio.clip = SceneManager.waudio;
				audio.Play();
			}
			else
			{
				SceneManager.selected_election_ward_7 = person_object;
				audio.clip = SceneManager.caudio;
				audio.Play();
			}
			selected_object_ids[6] = person_object.id;
		}
		if(person_object.votes > 0 && display_bottom_menu_bar)
			GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y + margin + box_size_2, box_size_2, vote_box_height),""+person_object.votes);
 	
	}
	if (show_level_fail)
	{
		if (GUI.Button(new Rect(sw*0.5,sh*0.5,sw*0.15,sh*0.1),"Level Failure"))
			Application.LoadLevel("ElectionLevel4Scene");
	}
	if(GUI.Button (new Rect (screen_width-margin-box_size, title_bar_height * 0.1, box_size, title_bar_height * 0.8), "Done"))
	{
		if(level_fail)
		{
			show_level_fail = true;
		}	
		else
		{
			Application.LoadLevel("ElectionLevel5Scene");
		}
	}
	
	if(!display_bottom_menu_bar)
	{
		if(!b1 && GUI.Button(new Rect (screen_width - margin - box_size, screen_height - margin - box_size, box_size, box_size), "VOTE"))
		{
			display_bottom_menu_bar = true;
			RandomGenerator();
		}
	}
	
	if(display_bottom_menu_bar)
	{
		scrollPosition = GUI.BeginScrollView(new Rect(margin,screen_height-margin-box_size, screen_width-2*margin, box_size),
												scrollPosition, 
												new Rect(margin, screen_height-margin-box_size ,(box_size+margin)*(SceneManager.num_wards), box_size),
												GUIStyle.none,GUIStyle.none);
			Debug.Log(selected_object_ids.Length);
			for(i=0;i<selected_object_ids.length;i++)
			{
				if(selected_object_ids[i] != -1)
					GUI.Box (new Rect (margin + i*(margin+box_size), screen_height-margin-box_size, box_size, box_size), Resources.Load("person"+selected_object_ids[i]));
				else
					GUI.Box (new Rect (margin + i*(margin+box_size), screen_height-margin-box_size, box_size, box_size), "Ward "+(i+1));
			}			
		GUI.EndScrollView ();
	}
	if(display_level_failed_message)
	{
		GUI.Box (new Rect (margin, (screen_height - message_box_height) / 2, screen_width - 2 * margin, message_box_height), "LEVEL FAILED");
	}
	if (b1)
	{
		GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
		GUILayout.Box("We have got the list of the final contestants. Now the voting can be done, just click on the  “vote” button to see the voting results.  In each ward , the contestant  with the maximum number of votes is the winner. They  will  be also become a member of the Gram Panchayat.",fstyle);
		if (GUILayout.Button("Close"))
			b1 = false;
		GUILayout.EndArea();
	}
}

function Temporary() 					//Temporarily fill in input arrays selected_people_electoral_ward_* 
{
	for(i=0;i<2;i++)
		SceneManager.selected_people_electoral_ward_1.push(SceneManager.selected_people_age_ward_1[i]);
		
	for(i=0;i<2;i++)
		SceneManager.selected_people_electoral_ward_2.push(SceneManager.selected_people_age_ward_2[i]);
		
	for(i=0;i<2;i++)
		SceneManager.selected_people_electoral_ward_3.push(SceneManager.selected_people_age_ward_3[i]);
		
	for(i=0;i<2;i++)
		SceneManager.selected_people_electoral_ward_4.push(SceneManager.selected_people_age_ward_4[i]);
		
	for(i=0;i<3;i++)
		SceneManager.selected_people_electoral_ward_5.push(SceneManager.selected_people_age_ward_5[i]);
		
	for(i=0;i<2;i++)
		SceneManager.selected_people_electoral_ward_6.push(SceneManager.selected_people_age_ward_6[i]);
		
	for(i=0;i<2;i++)
		SceneManager.selected_people_electoral_ward_7.push(SceneManager.selected_people_age_ward_7[i]);

}

function Start () {
	sw = Screen.width;
	sh = Screen.height;
	b1 = true;
	game_object_index = 0;
	display_bottom_menu_bar = false;
	screen_width = Screen.width;		//Calculating and storing screen dimensions
	screen_height = Screen.height;
	
	margin = screen_height * 0.0125;	//Calculating and storing the margin
	
	box_size = screen_height * 0.125;	//Calculating and storing the box size.
	box_size_2 = screen_height * 0.08;
	title_bar_height = screen_height * 0.0625;	//Calculating and storing the title bar height
	message_box_height = screen_height * 0.2;	//Calculating and storing the Message Box height
	vote_box_height = screen_height * 0.05;		//Calculating and storing the vote box height
	
	CreateVillage();					//Recreating the village as scene background
	CreateWardBoundaries();				//Creating the ward boundaries
	
	//*************************REMOVE DURING INTEGRATION***************************************
	//Temporary();	
	//*****************************************************************************************	
	
	for(i=0;i<SceneManager.selected_people_electoral_ward_1.length;i++)
	{
		selected_people_electoral_ward_1.push(SceneManager.selected_people_electoral_ward_1[i]);
	}
	for(i=0;i<SceneManager.selected_people_electoral_ward_2.length;i++)
	{
		selected_people_electoral_ward_2.push(SceneManager.selected_people_electoral_ward_2[i]);
	}
	for(i=0;i<SceneManager.selected_people_electoral_ward_3.length;i++)
	{
		selected_people_electoral_ward_3.push(SceneManager.selected_people_electoral_ward_3[i]);
	}
	for(i=0;i<SceneManager.selected_people_electoral_ward_4.length;i++)
	{
		selected_people_electoral_ward_4.push(SceneManager.selected_people_electoral_ward_4[i]);
	}
	for(i=0;i<SceneManager.selected_people_electoral_ward_5.length;i++)
	{
		selected_people_electoral_ward_5.push(SceneManager.selected_people_electoral_ward_5[i]);
	}
	for(i=0;i<SceneManager.selected_people_electoral_ward_6.length;i++)
	{
		selected_people_electoral_ward_6.push(SceneManager.selected_people_electoral_ward_6[i]);
	}
	for(i=0;i<SceneManager.selected_people_electoral_ward_7.length;i++)
	{
		selected_people_electoral_ward_7.push(SceneManager.selected_people_electoral_ward_7[i]);
	}
	
	selected_object_ids = new int[SceneManager.num_wards];
	for(i=0;i<selected_object_ids.length;i++)
	{
		selected_object_ids[i] = -1;
	}
	
	display_votes = false;
	display_level_failed_message = false;			
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
	cur_object.transform.position.z = 0;
	
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

function CreateWardBoundaries()
{
	line1 = new GameObject("Line1");
	line1.transform.position.z = -1;
	line1renderer = line1.AddComponent("LineRenderer");
	line1renderer.material = new Material (Shader.Find("Sprites/Default"));
	line1renderer.SetColors(Color.black, Color.black);
	line1renderer.SetWidth(0.1,0.1);
	line1renderer.SetVertexCount(2);
	line1renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.6, box_size + 2 * margin, 9)));
	line1renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.6, screen_height - title_bar_height - margin, 9)));
	
	line2 = new GameObject("Line2");
	line2.transform.position.z = -1;
	line2renderer = line2.AddComponent("LineRenderer");
	line2renderer.material = new Material (Shader.Find("Sprites/Default"));
	line2renderer.SetColors(Color.black, Color.black);
	line2renderer.SetWidth(0.1,0.1);
	line2renderer.SetVertexCount(2);
	line2renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, screen_height * 0.7, 9)));
	line2renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.6, screen_height * 0.7, 9)));
	
	line3 = new GameObject("Line3");
	line3.transform.position.z = -1;
	line3renderer = line3.AddComponent("LineRenderer");
	line3renderer.material = new Material (Shader.Find("Sprites/Default"));
	line3renderer.SetColors(Color.black, Color.black);
	line3renderer.SetWidth(0.1,0.1);
	line3renderer.SetVertexCount(2);
	line3renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, screen_height * 0.4, 9)));
	line3renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.6, screen_height * 0.4, 9)));
	
	line4 = new GameObject("Line4");
	line4.transform.position.z = -1;
	line4renderer = line4.AddComponent("LineRenderer");
	line4renderer.material = new Material (Shader.Find("Sprites/Default"));
	line4renderer.SetColors(Color.black, Color.black);
	line4renderer.SetWidth(0.1,0.1);
	line4renderer.SetVertexCount(2);
	line4renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.8, screen_height * 0.5, 9)));
	line4renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.8, screen_height - title_bar_height - margin, 9)));
	
	line5 = new GameObject("Line5");
	line5.transform.position.z = -1;
	line5renderer = line5.AddComponent("LineRenderer");
	line5renderer.material = new Material (Shader.Find("Sprites/Default"));
	line5renderer.SetColors(Color.black, Color.black);
	line5renderer.SetWidth(0.1,0.1);
	line5renderer.SetVertexCount(2);
	line5renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.6, screen_height * 0.5, 9)));
	line5renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, screen_height * 0.5, 9)));

	line6 = new GameObject("Line6");
	line6.transform.position.z = -1;
	line6renderer = line6.AddComponent("LineRenderer");
	line6renderer.material = new Material (Shader.Find("Sprites/Default"));
	line6renderer.SetColors(Color.black, Color.black);
	line6renderer.SetWidth(0.1,0.1);
	line6renderer.SetVertexCount(2);
	line6renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.3, box_size + 2 * margin, 9)));
	line6renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.3, screen_height * 0.4, 9)));
	
	line7 = new GameObject("Line7");
	line7.transform.position.z = -1;
	line7renderer = line7.AddComponent("LineRenderer");
	line7renderer.material = new Material (Shader.Find("Sprites/Default"));
	line7renderer.SetColors(Color.black, Color.black);
	line7renderer.SetWidth(0.1,0.1);
	line7renderer.SetVertexCount(2);
	line7renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, box_size + 2 * margin, 9)));
	line7renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, box_size + 2 * margin, 9)));
	
	line8 = new GameObject("Line8");
	line8.transform.position.z = -1;
	line8renderer = line8.AddComponent("LineRenderer");
	line8renderer.material = new Material (Shader.Find("Sprites/Default"));
	line8renderer.SetColors(Color.black, Color.black);
	line8renderer.SetWidth(0.1,0.1);
	line8renderer.SetVertexCount(2);
	line8renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, box_size + 2 * margin, 9)));
	line8renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(0, screen_height, 9)));
	
	line9 = new GameObject("Line9");
	line9.transform.position.z = -1;
	line9renderer = line9.AddComponent("LineRenderer");
	line9renderer.material = new Material (Shader.Find("Sprites/Default"));
	line9renderer.SetColors(Color.black, Color.black);
	line9renderer.SetWidth(0.1,0.1);
	line9renderer.SetVertexCount(2);
	line9renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, screen_height - title_bar_height - margin, 9)));
	line9renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, screen_height - title_bar_height - margin, 9)));
	
	line10 = new GameObject("Line10");
	line10.transform.position.z = -1;
	line10renderer = line10.AddComponent("LineRenderer");
	line10renderer.material = new Material (Shader.Find("Sprites/Default"));
	line10renderer.SetColors(Color.black, Color.black);
	line10renderer.SetWidth(0.1,0.1);
	line10renderer.SetVertexCount(2);
	line10renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, screen_height, 9)));
	line10renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, box_size + 2 * margin, 9)));
}

function RandomGenerator()
{
	indices_array = new Array();
	//Ward 1
	total_votes = SceneManager.ward1_population;
	for(i=0;i<selected_people_electoral_ward_1.length;i++)
	{
		indices_array.push(i);
	}
	index = Random.Range(0f, indices_array.length);
	person_object = selected_people_electoral_ward_1[indices_array[index]];
	votes = Random.Range(0.6f * total_votes, 0.9f * total_votes);
	total_votes = total_votes - votes;
	person_object.votes=votes;
	indices_array.RemoveAt(index);
	person_object.winning = true;
	while(indices_array.length > 1)
	{
		index = Random.Range(0f, indices_array.length);
		person_object = selected_people_electoral_ward_1[indices_array[index]];
		votes = Random.Range(0, total_votes);
		total_votes = total_votes - votes;
		person_object.votes=votes;
		indices_array.RemoveAt(index);
	}
	person_object = selected_people_electoral_ward_1[indices_array[0]];
	votes = total_votes;
	person_object.votes=votes;
	
	//Ward 2
	total_votes = SceneManager.ward2_population;
	indices_array.clear();
	for(i=0;i<selected_people_electoral_ward_2.length;i++)
	{
		indices_array.push(i);
	}
	index = Random.Range(0f, indices_array.length);
	person_object = selected_people_electoral_ward_2[indices_array[index]];
	votes = Random.Range(0.6f * total_votes, 0.9f * total_votes);
	total_votes = total_votes - votes;
	person_object.votes=votes;
	indices_array.RemoveAt(index);
	person_object.winning = true;
	while(indices_array.length > 1)
	{
		index = Random.Range(0f, indices_array.length);
		person_object = selected_people_electoral_ward_2[indices_array[index]];
		votes = Random.Range(0, total_votes);
		total_votes = total_votes - votes;
		person_object.votes=votes;
		indices_array.RemoveAt(index);
	}
	person_object = selected_people_electoral_ward_2[indices_array[0]];
	votes = total_votes;
	person_object.votes=votes;
	
	//Ward 3
	total_votes = SceneManager.ward3_population;
	indices_array.clear();
	for(i=0;i<selected_people_electoral_ward_3.length;i++)
	{
		indices_array.push(i);
	}
	index = Random.Range(0f, indices_array.length);
	person_object = selected_people_electoral_ward_3[indices_array[index]];
	votes = Random.Range(0.6f * total_votes, 0.9f * total_votes);
	total_votes = total_votes - votes;
	person_object.votes=votes;
	indices_array.RemoveAt(index);
	person_object.winning = true;
	while(indices_array.length > 1)
	{
		index = Random.Range(0f, indices_array.length);
		person_object = selected_people_electoral_ward_3[indices_array[index]];
		votes = Random.Range(0, total_votes);
		total_votes = total_votes - votes;
		person_object.votes=votes;
		indices_array.RemoveAt(index);
	}
	person_object = selected_people_electoral_ward_3[indices_array[0]];
	votes = total_votes;
	person_object.votes=votes;
	
	//Ward 4
	total_votes = SceneManager.ward4_population;
	indices_array.clear();
	for(i=0;i<selected_people_electoral_ward_4.length;i++)
	{
		indices_array.push(i);
	}
	index = Random.Range(0f, indices_array.length);
	person_object = selected_people_electoral_ward_4[indices_array[index]];
	votes = Random.Range(0.6f * total_votes, 0.9f * total_votes);
	total_votes = total_votes - votes;
	person_object.votes=votes;
	indices_array.RemoveAt(index);
	person_object.winning = true;
	while(indices_array.length > 1)
	{
		index = Random.Range(0f, indices_array.length);
		person_object = selected_people_electoral_ward_4[indices_array[index]];
		votes = Random.Range(0, total_votes);
		total_votes = total_votes - votes;
		person_object.votes=votes;
		indices_array.RemoveAt(index);
	}
	person_object = selected_people_electoral_ward_4[indices_array[0]];
	votes = total_votes;
	person_object.votes=votes;
	
	//Ward 5
	total_votes = SceneManager.ward5_population;
	indices_array.clear();
	for(i=0;i<selected_people_electoral_ward_5.length;i++)
	{
		indices_array.push(i);
	}
	index = Random.Range(0f, indices_array.length);
	person_object = selected_people_electoral_ward_5[indices_array[index]];
	votes = Random.Range(0.6f * total_votes, 0.9f * total_votes);
	total_votes = total_votes - votes;
	person_object.votes=votes;
	indices_array.RemoveAt(index);
	person_object.winning = true;
	while(indices_array.length > 1)
	{
		index = Random.Range(0f, indices_array.length);
		person_object = selected_people_electoral_ward_5[indices_array[index]];
		votes = Random.Range(0, total_votes);
		total_votes = total_votes - votes;
		person_object.votes=votes;
		indices_array.RemoveAt(index);
	}
	person_object = selected_people_electoral_ward_5[indices_array[0]];
	votes = total_votes;
	person_object.votes=votes;
	
	//Ward 6
	total_votes = SceneManager.ward6_population;
	indices_array.clear();
	for(i=0;i<selected_people_electoral_ward_6.length;i++)
	{
		indices_array.push(i);
	}
	index = Random.Range(0f, indices_array.length);
	person_object = selected_people_electoral_ward_6[indices_array[index]];
	votes = Random.Range(0.6f * total_votes, 0.9f * total_votes);
	total_votes = total_votes - votes;
	person_object.votes=votes;
	indices_array.RemoveAt(index);
	person_object.winning = true;
	while(indices_array.length > 1)
	{
		index = Random.Range(0f, indices_array.length);
		person_object = selected_people_electoral_ward_6[indices_array[index]];
		votes = Random.Range(0, total_votes);
		total_votes = total_votes - votes;
		person_object.votes=votes;
		indices_array.RemoveAt(index);
	}
	person_object = selected_people_electoral_ward_6[indices_array[0]];
	votes = total_votes;
	person_object.votes=votes;
	
	//Ward 7
	total_votes = SceneManager.ward7_population;
	indices_array.clear();
	for(i=0;i<selected_people_electoral_ward_7.length;i++)
	{
		indices_array.push(i);
	}
	index = Random.Range(0f, indices_array.length);
	person_object = selected_people_electoral_ward_7[indices_array[index]];
	votes = Random.Range(0.6f * total_votes, 0.9f * total_votes);
	total_votes = total_votes - votes;
	person_object.votes=votes;
	indices_array.RemoveAt(index);
	person_object.winning = true;
	while(indices_array.length > 1)
	{
		index = Random.Range(0f, indices_array.length);
		person_object = selected_people_electoral_ward_7[indices_array[index]];
		votes = Random.Range(0, total_votes);
		total_votes = total_votes - votes;
		person_object.votes=votes;
		indices_array.RemoveAt(index);
	}
	person_object = selected_people_electoral_ward_7[indices_array[0]];
	votes = total_votes;
	person_object.votes=votes;
}