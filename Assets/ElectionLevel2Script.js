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
var box_size_2 : int;					//Size of box for displaying candidates inside wards
var title_bar_height : int;				//Height of the top title bar
var message_box_height : int;			//Height of the message box
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

var selected_people_election_1 = new Array();
var num_selected_people_election_1 : int;
var num_selected_people_election_2 : int;

var selected_people_ward_1 = new Array();
var selected_people_ward_2 = new Array();
var selected_people_ward_3 = new Array();
var selected_people_ward_4 = new Array();
var selected_people_ward_5 = new Array();
var selected_people_ward_6 = new Array();
var selected_people_ward_7 = new Array();

var scrollPosition : Vector2;
var touch : Touch;
var hit: RaycastHit2D;
var person_object : PersonObject;

var level_fail : boolean;
var num_correct_age_selected : int;

var display_level_failed_message : boolean;

var sw : int;
var sh : int;
var fstyle : GUIStyle;
var b1 : boolean;

function OnGUI()
{
		scrollPosition = GUI.BeginScrollView(new Rect(margin,screen_height-margin-box_size, screen_width-2*margin, box_size),
											scrollPosition, 
											new Rect(margin, screen_height-margin-box_size ,(box_size+margin)*(num_selected_people_election_1), box_size),
											GUIStyle.none,GUIStyle.none);
		//Debug.Log(selected_people_election_1.length);
		for(i=0;i<selected_people_election_1.length;i++)
		{
			person_object = selected_people_election_1[i];
			if(GUI.Button (new Rect (margin + i*(margin+box_size), screen_height-margin-box_size, box_size, box_size), Resources.Load("person"+person_object.id+"_age")))
			{
				switch(person_object.ward)
				{
				case 1:
					selected_people_ward_1.push(person_object);
					if(person_object.age >=21)
					{
						num_correct_age_selected++;
						SceneManager.selected_people_age_ward_1.push(person_object);
					}
					else	
						level_fail = true;
					break;
				case 2:
					selected_people_ward_2.push(person_object);
					if(person_object.age >=21)
					{
						num_correct_age_selected++;
						SceneManager.selected_people_age_ward_2.push(person_object);
					}
					else	
						level_fail = true;
					break;
				case 3:
					selected_people_ward_3.push(person_object);
					if(person_object.age >=21)
					{
						num_correct_age_selected++;
						SceneManager.selected_people_age_ward_3.push(person_object);
					}
					else	
						level_fail = true;
					break;
				case 4:
					selected_people_ward_4.push(person_object);
					if(person_object.age >=21)
					{
						num_correct_age_selected++;
						SceneManager.selected_people_age_ward_4.push(person_object);
					}
					else	
						level_fail = true;
					break;
				case 5:
					selected_people_ward_5.push(person_object);
					if(person_object.age >=21)
					{
						num_correct_age_selected++;
						SceneManager.selected_people_age_ward_5.push(person_object);
					}
					else	
						level_fail = true;
					break;
				case 6:
					selected_people_ward_6.push(person_object);
					if(person_object.age >=21)
					{
						num_correct_age_selected++;
						SceneManager.selected_people_age_ward_6.push(person_object);
					}
					else	
						level_fail = true;
					break;
				case 7:
					selected_people_ward_7.push(person_object);
					if(person_object.age >=21)
					{
						num_correct_age_selected++;
						SceneManager.selected_people_age_ward_7.push(person_object);
					}
					else	
						level_fail = true;
					break;
				}
				selected_people_election_1.RemoveAt(i);
				if (!level_fail)
				{
					audio.clip = SceneManager.caudio;
					audio.Play();
				}
				else
				{
					audio.clip = SceneManager.waudio;
					audio.Play();
				}
			}
		}																	
	GUI.EndScrollView ();
	if(GUI.Button (new Rect (screen_width-margin-box_size, title_bar_height * 0.1, box_size, title_bar_height * 0.8), "Done"))
	{
		if(level_fail || num_correct_age_selected < 19)
		{
			display_level_failed_message = true;
			Application.LoadLevel("ElectionLevel2Scene");
		}
		else	
			Application.LoadLevel("ElectionLevel3Scene");
	}	
	if(display_level_failed_message)
	{
		GUI.Box (new Rect (margin, (screen_height - message_box_height) / 2, screen_width - 2 * margin, message_box_height), "LEVEL FAILED");
	}
	
	//Ward1
	starting_x = (0.6 * screen_width - selected_people_ward_1.length * (box_size_2 + margin)) / 2;
	starting_y = (0.3 * screen_height + title_bar_height + margin - box_size_2) / 2; 
	for(i=0;i<selected_people_ward_1.length;i++)
	{
		person_object = selected_people_ward_1[i];
		GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id+"_age"));
 	
	}
	
	//Ward2
	starting_x = (0.6 * screen_width - selected_people_ward_2.length * (box_size_2 + margin)) / 2;
	starting_y = (0.9 * screen_height - box_size_2) / 2; 
	for(i=0;i<selected_people_ward_2.length;i++)
	{
		person_object = selected_people_ward_2[i];
		GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id+"_age"));
 	
	}
	
	//Ward3
	starting_x = (0.3 * screen_width - selected_people_ward_3.length * (box_size_2 + margin)) / 2;
	starting_y = (1.6 * screen_height - box_size - 2 * margin - box_size_2) / 2;
	for(i=0;i<selected_people_ward_3.length;i++)
	{
		person_object = selected_people_ward_3[i];
		GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id+"_age"));
 	
	}
	
	//Ward4
	starting_x = (0.9 * screen_width - selected_people_ward_4.length * (box_size_2 + margin) - margin) / 2;
	starting_y = (1.6 * screen_height - box_size - 2 * margin - box_size_2) / 2;
	for(i=0;i<selected_people_ward_4.length;i++)
	{
		person_object = selected_people_ward_4[i];
		GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id+"_age"));
 	
	}
	
	//Ward5
	starting_x = (1.4 * screen_width - box_size_2) / 2;
	starting_y = title_bar_height + margin + (0.5 * screen_height - title_bar_height - selected_people_ward_5.length * (box_size_2 + margin)) / 2; 
	for(i=0;i<selected_people_ward_5.length;i++)
	{
		person_object = selected_people_ward_5[i];
		GUI.Box(new Rect(starting_x, starting_y + i * (box_size_2 + margin), box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id+"_age"));
 	
	}
	
	//Ward6
	starting_x = (1.8 * screen_width - box_size_2) / 2;
	starting_y = title_bar_height + margin + (0.5 * screen_height - title_bar_height - selected_people_ward_6.length * (box_size_2 + margin)) / 2; 
	for(i=0;i<selected_people_ward_6.length;i++)
	{
		person_object = selected_people_ward_6[i];
		GUI.Box(new Rect(starting_x, starting_y + i * (box_size_2 + margin), box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id+"_age"));
 	
	}
	
	//Ward7
	starting_x = 0.6 * screen_width + (0.4 * screen_width - selected_people_ward_7.length * (box_size_2 + margin)) / 2; 
	starting_y = (1.5 * screen_height - 2 * margin - box_size - box_size_2) / 2;
	for(i=0;i<selected_people_ward_7.length;i++)
	{
		person_object = selected_people_ward_7[i];
		GUI.Box(new Rect(starting_x + i * (box_size_2 + margin), starting_y, box_size_2, box_size_2), 
				Resources.Load("person"+person_object.id+"_age"));
 	
	}
	GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
	if (b1)
	{
		GUILayout.Box("One of the  criteria  to contest in the election – the individual should be above 21 year of  age.  Select all those who  are above 21 years  of age.Tab the individuals to select them.  ",fstyle);
		if (GUILayout.Button("Close"))
			b1 = false;
	}
	GUILayout.EndArea();
}

function Start () {
	SceneManager.selected_people_age_ward_1.clear();
	SceneManager.selected_people_age_ward_2.clear();
	SceneManager.selected_people_age_ward_3.clear();
	SceneManager.selected_people_age_ward_4.clear();
	SceneManager.selected_people_age_ward_5.clear();
	SceneManager.selected_people_age_ward_6.clear();
	SceneManager.selected_people_age_ward_7.clear();
	sw = Screen.width;
	sh = Screen.height;
	b1 = true;
	game_object_index = 0;
	
	screen_width = Screen.width;		//Calculating and storing screen dimensions
	screen_height = Screen.height;
	
	margin = screen_height * 0.0125;	//Calculating and storing the margin
	
	box_size = screen_height * 0.125;	//Calculating and storing the box size.
	box_size_2 = screen_height * 0.08;
	title_bar_height = screen_height * 0.0625;	//Calculating and storing the title bar height
	message_box_height = screen_height * 0.2;	//Calculating and storing the Message Box height
	CreateVillage();					//Recreating the village as scene background
	CreateWardBoundaries();				//Creating the ward boundaries
	num_selected_people_election_1 = SceneManager.selected_people_election_1.length;
	
	for(i=0;i<SceneManager.selected_people_election_1.length;i++)
	{
		selected_people_election_1.push(SceneManager.selected_people_election_1[i]);
	}
	num_selected_people_election_2 = 0;
	
	SceneManager.selected_people_age_ward_1.clear();
	SceneManager.selected_people_age_ward_2.clear();
	SceneManager.selected_people_age_ward_3.clear();
	SceneManager.selected_people_age_ward_4.clear();
	SceneManager.selected_people_age_ward_5.clear();
	SceneManager.selected_people_age_ward_6.clear();
	SceneManager.selected_people_age_ward_7.clear();
	
	level_fail = false;
	num_correct_age_selected = 0;
	display_level_failed_message = false;
}

function Update () {
	if(Input.touchCount > 0 && !b1)
	{
		touch = Input.touches[0];
		if(touch.position.y < box_size)			//The touch occured in the bottom menu bar.
		{
			if (touch.phase == TouchPhase.Moved)
			{
				scrollPosition.x -= touch.deltaPosition.x*2;
			}
		}
	}
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