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
var collider_width : int;				//Stores the value of the camera viewing width
var collider_height : int;				//Stores the value of the camera viewing height
var margin : int;						//Stores the value of the margin calculated. 
var box_size : int;						//Standard box size followed in the game.
var title_bar_height : int;				//Height of the top title bar
var message_box_height : int;			//Height of the message box

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

var indians = new Array();				//Array storing the person numbers of Indians
var non_indians = new Array();			//Array storing the person numbers of Non-Indians

var index : int;
var max_indian_index : float;
var max_non_indian_index : float;
var box_collider : BoxCollider2D;

var person : GameObject;
var personInfo : PersonInfo;
var person_object : PersonObject;
var person_index : int;
var wards_num_indians_list : int[];
var wards_num_non_indians_list : int[];
var ages : int[];

var selected_people_id = new Array();
var num_indians_selected : int;
var level_fail : boolean;
var display_level_failed_message : boolean;

var scrollPosition : Vector2;
var touch : Touch;
var hit: RaycastHit2D;
var sw : int;
var sh : int;
var fstyle : GUIStyle;
var b1 : boolean;
var b2 : boolean;
var b3 : boolean;
var bc : boolean;
function OnGUI()
{
	scrollPosition = GUI.BeginScrollView(new Rect(margin,screen_height-margin-box_size, screen_width-2*margin, box_size),
											scrollPosition, 
											new Rect(margin, screen_height-margin-box_size ,(box_size+margin)*(selected_people_id.length), box_size),
											GUIStyle.none,GUIStyle.none);
			for(i=0;i<selected_people_id.length;i++)
			{
				GUI.Box (new Rect (margin+i*(margin+box_size), screen_height-margin-box_size, box_size, box_size), Resources.Load("person"+selected_people_id[i]+"_flag"));
			}																								
	GUI.EndScrollView ();
	
	//GUI.Box(new Rect(0, 0, screen_width, title_bar_height), "Election-Level1");	
	if(GUI.Button (new Rect (screen_width-margin-box_size, title_bar_height * 0.1, box_size, title_bar_height * 0.8), "Done"))
	{
		if(level_fail || num_indians_selected < 21)
		{
			display_level_failed_message = true;
			Application.LoadLevel("ElectionLevel1Scene");
		}
		else	
			Application.LoadLevel("ElectionLevel2Scene");
	}	
	if(display_level_failed_message)
	{
		GUI.Box (new Rect (margin, (screen_height - message_box_height) / 2, screen_width - 2 * margin, message_box_height), "LEVEL FAILED");
	}
	GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
	if (b1)
	{
		GUILayout.Box("Let us form  a Gram Panchayat, a governing boby, to manage different activities and to resolve various issues of the village . This village has seven wards , we will need one representative  from each ward . The representatives together will form  the village Gram Panchyat. The  wards  will select their representatives  through elections. Some of the individuals staying in the village  are willing to  be a part of Gram Panchayat.",fstyle);
		if (GUILayout.Button("Close"))
		{
			b1 = false;
			b2 = true;
		}
	}
	if (b2)
	{
		GUILayout.Box(" Remember the individuals should fulfill the eligibility criteria  to contest for the elections. They should be:  1. Indian Citizen \n2. Above the age of 21 years \n3. Enrolled in the village voter list. \nThe composition  of the Gram Panchayat is such that there should be at least 30% seats are reserved for women, 27% seats are reserved for backward class.Let us play the game  ahead to find out how the villager will form  the Gram Panchayat.",fstyle);
		if (GUILayout.Button("Play"))
		{
			b2 = false;
			b3 = true;
		}
	}
	if (b3)
	{
		GUILayout.Box("One of the  criteria  to contest in the election – the individual should be an Indian citizen.  So, let us identify all the Indian citizens . \nTab the individuals to select them.  ",fstyle);
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
	game_object_index = 0;
	
	screen_width = Screen.width;		//Calculating and storing screen dimensions
	screen_height = Screen.height;
	
	margin = screen_height * 0.0125;	//Calculating and storing the margin
	
	box_size = screen_height * 0.125;	//Calculating and storing the box size.
	
	title_bar_height = screen_height * 0.0625;	//Calculating and storing the title bar height
	
	message_box_height = screen_height * 0.2;	//Calculating and storing the Message Box height
	
	CreateVillage();					//Recreating the village as scene background
	
	CreateWardBoundaries();				//Creating the ward boundaries

	PlacePeople();						//Place people in the wards	
	
	level_fail = false;		
	display_level_failed_message = false;
	num_indians_selected = 0;
	
	SceneManager.selected_people_election_1.clear();
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
	/*for(i=0;i<SceneManager.line_points.length;i++)
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
	}*/
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
	
	box_collider = line1.AddComponent("BoxCollider2D");
	box_collider.size.x = 0.3;
	
	line2 = new GameObject("Line2");
	line2.transform.position.z = -1;
	line2renderer = line2.AddComponent("LineRenderer");
	line2renderer.material = new Material (Shader.Find("Sprites/Default"));
	line2renderer.SetColors(Color.black, Color.black);
	line2renderer.SetWidth(0.1,0.1);
	line2renderer.SetVertexCount(2);
	line2renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, screen_height * 0.7, 9)));
	line2renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.6, screen_height * 0.7, 9)));
	
	box_collider = line2.AddComponent("BoxCollider2D");
	box_collider.size.y = 0.3;
	
	line3 = new GameObject("Line3");
	line3.transform.position.z = -1;
	line3renderer = line3.AddComponent("LineRenderer");
	line3renderer.material = new Material (Shader.Find("Sprites/Default"));
	line3renderer.SetColors(Color.black, Color.black);
	line3renderer.SetWidth(0.1,0.1);
	line3renderer.SetVertexCount(2);
	line3renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, screen_height * 0.4, 9)));
	line3renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.6, screen_height * 0.4, 9)));
	
	box_collider = line3.AddComponent("BoxCollider2D");
	box_collider.size.y = 0.3;
	
	line4 = new GameObject("Line4");
	line4.transform.position.z = -1;
	line4renderer = line4.AddComponent("LineRenderer");
	line4renderer.material = new Material (Shader.Find("Sprites/Default"));
	line4renderer.SetColors(Color.black, Color.black);
	line4renderer.SetWidth(0.1,0.1);
	line4renderer.SetVertexCount(2);
	line4renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.8, screen_height * 0.5, 9)));
	line4renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.8, screen_height - title_bar_height - margin, 9)));
	
	box_collider = line4.AddComponent("BoxCollider2D");
	box_collider.size.x = 0.3;
	
	line5 = new GameObject("Line5");
	line5.transform.position.z = -1;
	line5renderer = line5.AddComponent("LineRenderer");
	line5renderer.material = new Material (Shader.Find("Sprites/Default"));
	line5renderer.SetColors(Color.black, Color.black);
	line5renderer.SetWidth(0.1,0.1);
	line5renderer.SetVertexCount(2);
	line5renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.6, screen_height * 0.5, 9)));
	line5renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, screen_height * 0.5, 9)));
	
	box_collider = line5.AddComponent("BoxCollider2D");
	box_collider.size.y = 0.3;

	line6 = new GameObject("Line6");
	line6.transform.position.z = -1;
	line6renderer = line6.AddComponent("LineRenderer");
	line6renderer.material = new Material (Shader.Find("Sprites/Default"));
	line6renderer.SetColors(Color.black, Color.black);
	line6renderer.SetWidth(0.1,0.1);
	line6renderer.SetVertexCount(2);
	line6renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.3, box_size + 2 * margin, 9)));
	line6renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width * 0.3, screen_height * 0.4, 9)));
	
	box_collider = line6.AddComponent("BoxCollider2D");
	box_collider.size.x = 0.3;
	
	line7 = new GameObject("Line7");
	line7.transform.position.z = -1;
	line7renderer = line7.AddComponent("LineRenderer");
	line7renderer.material = new Material (Shader.Find("Sprites/Default"));
	line7renderer.SetColors(Color.black, Color.black);
	line7renderer.SetWidth(0.1,0.1);
	line7renderer.SetVertexCount(2);
	line7renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, box_size + 2 * margin, 9)));
	line7renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, box_size + 2 * margin, 9)));
	
	box_collider = line7.AddComponent("BoxCollider2D");
	box_collider.size.y = 0.3;
	
	line8 = new GameObject("Line8");
	line8.transform.position.z = -1;
	line8renderer = line8.AddComponent("LineRenderer");
	line8renderer.material = new Material (Shader.Find("Sprites/Default"));
	line8renderer.SetColors(Color.black, Color.black);
	line8renderer.SetWidth(0.1,0.1);
	line8renderer.SetVertexCount(2);
	line8renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, box_size + 2 * margin, 9)));
	line8renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(0, screen_height, 9)));
	
	box_collider = line8.AddComponent("BoxCollider2D");
	box_collider.size.x = 0.3;
	
	line9 = new GameObject("Line9");
	line9.transform.position.z = -1;
	line9renderer = line9.AddComponent("LineRenderer");
	line9renderer.material = new Material (Shader.Find("Sprites/Default"));
	line9renderer.SetColors(Color.black, Color.black);
	line9renderer.SetWidth(0.1,0.1);
	line9renderer.SetVertexCount(2);
	line9renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0, screen_height - title_bar_height - margin, 9)));
	line9renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, screen_height - title_bar_height - margin, 9)));
	
	box_collider = line9.AddComponent("BoxCollider2D");
	box_collider.size.y = 0.3;
	
	line10 = new GameObject("Line10");
	line10.transform.position.z = -1;
	line10renderer = line10.AddComponent("LineRenderer");
	line10renderer.material = new Material (Shader.Find("Sprites/Default"));
	line10renderer.SetColors(Color.black, Color.black);
	line10renderer.SetWidth(0.1,0.1);
	line10renderer.SetVertexCount(2);
	line10renderer.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, screen_height, 9)));
	line10renderer.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(screen_width, box_size + 2 * margin, 9)));
	
	box_collider = line10.AddComponent("BoxCollider2D");
	box_collider.size.x = 0.3;
}


function PlacePeople()
{
	indians.push(1);
	//indians.push(2);
	indians.push(3);
	indians.push(4);
	indians.push(5);
	indians.push(7);
	indians.push(8);
	indians.push(9);
	indians.push(10);
	indians.push(11);
	indians.push(12);
	indians.push(13);
	indians.push(15);
	indians.push(16);
	indians.push(18);
	indians.push(19);
	indians.push(20);
	indians.push(22);
	//indians.push(23);
	indians.push(24);
	indians.push(25);
	
	non_indians.push(6);
	non_indians.push(14);
	non_indians.push(17);
	non_indians.push(21);
	
	max_indian_index = 18;
	max_non_indian_index = 3;
	person_index = 1;
	
	wards_num_indians_list = new int[7];
	wards_num_non_indians_list = new int[7];
	ages = new int[25];
	
	wards_num_indians_list[0]=2;
	wards_num_indians_list[1]=4;
	wards_num_indians_list[2]=2;
	wards_num_indians_list[3]=2;
	wards_num_indians_list[4]=3;
	wards_num_indians_list[5]=3;
	wards_num_indians_list[6]=3;
	
	wards_num_non_indians_list[0]=1;
	wards_num_non_indians_list[1]=1;
	wards_num_non_indians_list[2]=1;
	wards_num_non_indians_list[3]=0;
	wards_num_non_indians_list[4]=1;
	wards_num_non_indians_list[5]=0;
	wards_num_non_indians_list[6]=0;
	
	ages[0] = 21;
	ages[1] = 18;
	ages[2] = 50;
	ages[3] = 50;
	ages[4] = 45;
	ages[5] = -1;
	ages[6] = 25;
	ages[7] = 49;
	ages[8] = 37;
	ages[9] = 56;
	ages[10] = 56;
	ages[11] = 42;
	ages[12] = 36;
	ages[13] = -1;
	ages[14] = 39;
	ages[15] = 51;
	ages[16] = -1;
	ages[17] = 34;
	ages[18] = 30;
	ages[19] = 37;
	ages[20] = -1;
	ages[21] = 25;
	ages[22] = 15;
	ages[23] = 34;
	ages[24] = 39;
	
	
	//Ward 1 4-3
	//Indians
	for(i=1;i<=wards_num_indians_list[0];i++)
	{
		if(max_indian_index == 0)
			index=0;
		else
			index = Random.Range(0f, max_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = indians[index];
		sprite_renderer.sprite = Resources.Load("person"+indians[index]+"_flag", Sprite);
		personInfo.country = "India";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 1;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(2*margin,screen_width * 0.6 - margin)), Mathf.Round(Random.Range(screen_height * 0.7 + margin, screen_height - title_bar_height - margin)), 0));
		person.transform.position.z = -1;
		indians.RemoveAt(index);
		max_indian_index--;
		person_index++;
	}
	//Non-Indians
	for(i=1;i<=wards_num_non_indians_list[0];i++)
	{
		if(max_non_indian_index == 0)
			index = 0;
		else
			index = Random.Range(0f, max_non_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = non_indians[index];
		sprite_renderer.sprite = Resources.Load("person"+non_indians[index]+"_flag", Sprite);
		personInfo.country = "Other";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 1;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(2*margin,screen_width * 0.6 - margin)), Mathf.Round(Random.Range(screen_height * 0.7 + margin, screen_height - title_bar_height - margin)), 0));
		person.transform.position.z = -1;
		non_indians.RemoveAt(index);
		max_non_indian_index--;
		person_index++;
	}
	
	person = new GameObject("Person"+person_index);
	sprite_renderer = person.AddComponent("SpriteRenderer");
	personInfo = person.AddComponent("PersonInfo");
	personInfo.id = 2;
	sprite_renderer.sprite = Resources.Load("person2_flag", Sprite);
	personInfo.country = "India";
	personInfo.age = ages[personInfo.id - 1];
	personInfo.ward = 1;
	person.AddComponent("BoxCollider2D");
	person.AddComponent("Rigidbody2D");
	person.rigidbody2D.gravityScale = 0;
	person.rigidbody2D.fixedAngle = true;
	person.layer = 8;
	person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(2*margin,screen_width * 0.6 - margin)), Mathf.Round(Random.Range(screen_height * 0.7 + margin, screen_height - title_bar_height - margin)), 0));
	person.transform.position.z = -1;
	person_index++;
	
	//Ward 2 5-4
	//Indians
	for(i=1;i<=wards_num_indians_list[1];i++)
	{
		if(max_indian_index == 0)
			index=0;
		else
			index = Random.Range(0f, max_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = indians[index];
		sprite_renderer.sprite = Resources.Load("person"+indians[index]+"_flag", Sprite);
		personInfo.country = "India";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 2;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(2*margin,screen_width * 0.6 - margin)), Mathf.Round(Random.Range(screen_height * 0.4 + margin, screen_height * 0.7 - margin)), 0));
		person.transform.position.z = -1;
		indians.RemoveAt(index);
		max_indian_index--;
		person_index++;
	}
	//Non-Indians
	for(i=1;i<=wards_num_non_indians_list[1];i++)
	{
		if(max_non_indian_index == 0)
			index = 0;
		else
			index = Random.Range(0f, max_non_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = non_indians[index];
		sprite_renderer.sprite = Resources.Load("person"+non_indians[index]+"_flag", Sprite);
		personInfo.country = "Other";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 2;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(2*margin,screen_width * 0.6 - margin)), Mathf.Round(Random.Range(screen_height * 0.4 + margin, screen_height * 0.7 - margin)), 0));
		person.transform.position.z = -1;
		non_indians.RemoveAt(index);
		max_non_indian_index--;
		person_index++;
	}
	
	
	//Ward 3 3-2
	//Indians
	for(i=1;i<=wards_num_indians_list[2];i++)
	{
		if(max_indian_index == 0)
			index=0;
		else
			index = Random.Range(0f, max_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = indians[index];
		sprite_renderer.sprite = Resources.Load("person"+indians[index]+"_flag", Sprite);
		personInfo.country = "India";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 3;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(2*margin,screen_width * 0.3 - margin)), Mathf.Round(Random.Range(box_size + 2 * margin, screen_height * 0.4 - margin)), 0));
		person.transform.position.z = -1;
		indians.RemoveAt(index);
		max_indian_index--;
		person_index++;
	}
	//Non-Indians
	for(i=1;i<=wards_num_non_indians_list[2];i++)
	{
		if(max_non_indian_index == 0)
			index = 0;
		else
			index = Random.Range(0f, max_non_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = non_indians[index];
		sprite_renderer.sprite = Resources.Load("person"+non_indians[index]+"_flag", Sprite);
		personInfo.country = "Other";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 3;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(2*margin,screen_width * 0.3 - margin)), Mathf.Round(Random.Range(box_size + 2 * margin, screen_height * 0.4 - margin)), 0));
		person.transform.position.z = -1;
		non_indians.RemoveAt(index);
		max_non_indian_index--;
		person_index++;
	}
	
	
	//Ward 4 3-2
	//Indians
	for(i=1;i<=wards_num_indians_list[3];i++)
	{
		if(max_indian_index == 0)
			index=0;
		else
			index = Random.Range(0f, max_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = indians[index];
		sprite_renderer.sprite = Resources.Load("person"+indians[index]+"_flag", Sprite);
		personInfo.country = "India";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 4;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(screen_width * 0.3 + margin, screen_width * 0.6 - margin)), Mathf.Round(Random.Range(box_size + 2 * margin, screen_height * 0.4 - margin)), 0));
		person.transform.position.z = -1;
		indians.RemoveAt(index);
		max_indian_index--;
		person_index++;
	}
	//Non-Indians
	for(i=1;i<=wards_num_non_indians_list[3];i++)
	{
		if(max_non_indian_index == 0)
			index = 0;
		else
			index = Random.Range(0f, max_non_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = non_indians[index];
		sprite_renderer.sprite = Resources.Load("person"+non_indians[index]+"_flag", Sprite);
		personInfo.country = "Other";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 4;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(screen_width * 0.3 + margin, screen_width * 0.6 - margin)), Mathf.Round(Random.Range(box_size + 2 * margin, screen_height * 0.4 - margin)), 0));
		person.transform.position.z = -1;
		non_indians.RemoveAt(index);
		max_non_indian_index--;
		person_index++;
	}
	
	//Ward 5 5-4
	for(i=1;i<=wards_num_indians_list[4];i++)
	{
		if(max_indian_index == 0)
			index=0;
		else
			index = Random.Range(0f, max_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = indians[index];
		sprite_renderer.sprite = Resources.Load("person"+indians[index]+"_flag", Sprite);
		personInfo.country = "India";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 5;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(screen_width * 0.6 + margin, screen_width * 0.8 - margin)), Mathf.Round(Random.Range(screen_height * 0.5 + margin, screen_height - title_bar_height - margin)), 0));
		person.transform.position.z = -1;
		indians.RemoveAt(index);
		max_indian_index--;
		person_index++;
	}
	//Non-Indians
	for(i=1;i<=wards_num_non_indians_list[4];i++)
	{
		if(max_non_indian_index == 0)
			index = 0;
		else
			index = Random.Range(0f, max_non_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = non_indians[index];
		sprite_renderer.sprite = Resources.Load("person"+non_indians[index]+"_flag", Sprite);
		personInfo.country = "Other";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 5;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(screen_width * 0.6 + margin, screen_width * 0.8 - margin)), Mathf.Round(Random.Range(screen_height * 0.5 + margin, screen_height - title_bar_height - margin)), 0));
		person.transform.position.z = -1;
		non_indians.RemoveAt(index);
		max_non_indian_index--;
		person_index++;
	}
	
	person = new GameObject("Person"+person_index);
	sprite_renderer = person.AddComponent("SpriteRenderer");
	personInfo = person.AddComponent("PersonInfo");
	personInfo.id = 23;
	sprite_renderer.sprite = Resources.Load("person5_flag", Sprite);
	personInfo.country = "India";
	personInfo.age = ages[personInfo.id - 1];
	personInfo.ward = 5;
	person.AddComponent("BoxCollider2D");
	person.AddComponent("Rigidbody2D");
	person.rigidbody2D.gravityScale = 0;
	person.rigidbody2D.fixedAngle = true;
	person.layer = 8;
	person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(screen_width * 0.6 + margin, screen_width * 0.8 - margin)), Mathf.Round(Random.Range(screen_height * 0.5 + margin, screen_height - title_bar_height - margin)), 0));
	person.transform.position.z = -1;
	person_index++;
	
	//Ward 6 4-3
	//Indians
	for(i=1;i<=wards_num_indians_list[5];i++)
	{
		if(max_indian_index == 0)
			index=0;
		else
			index = Random.Range(0f, max_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = indians[index];
		sprite_renderer.sprite = Resources.Load("person"+indians[index]+"_flag", Sprite);
		personInfo.country = "India";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 6;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(screen_width * 0.8 + margin, screen_width - 2 * margin)), Mathf.Round(Random.Range(screen_height * 0.5 + margin, screen_height - title_bar_height - margin)), 0));
		person.transform.position.z = -1;
		indians.RemoveAt(index);
		max_indian_index--;
		person_index++;
	}
	//Non-Indians
	for(i=1;i<=wards_num_non_indians_list[5];i++)
	{
		if(max_non_indian_index == 0)
			index = 0;
		else
			index = Random.Range(0f, max_non_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = non_indians[index];
		sprite_renderer.sprite = Resources.Load("person"+non_indians[index]+"_flag", Sprite);
		personInfo.country = "Other";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 6;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(screen_width * 0.8 + margin, screen_width - 2 * margin)), Mathf.Round(Random.Range(screen_height * 0.5 + margin, screen_height - title_bar_height - margin)), 0));
		person.transform.position.z = -1;
		non_indians.RemoveAt(index);
		max_non_indian_index--;
		person_index++;
	}
	
	//Ward 7 3-3
	//Indians
	for(i=1;i<=wards_num_indians_list[6];i++)
	{
		if(max_indian_index == 0)
			index=0;
		else
			index = Random.Range(0f, max_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = indians[index];
		sprite_renderer.sprite = Resources.Load("person"+indians[index]+"_flag", Sprite);
		personInfo.country = "India";
		personInfo.age = ages[personInfo.id - 1];;
		personInfo.ward = 7;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(screen_width * 0.6 + margin, screen_width - 2 * margin)), Mathf.Round(Random.Range(box_size + 2 * margin, screen_height * 0.35 - margin)), 0));
		person.transform.position.z = -1;
		indians.RemoveAt(index);
		max_indian_index--;
		person_index++;
	}
	//Non-Indians
	for(i=1;i<=wards_num_non_indians_list[6];i++)
	{
		if(max_non_indian_index == 0)
			index = 0;
		else
			index = Random.Range(0f, max_non_indian_index);
		person = new GameObject("Person"+person_index);
		sprite_renderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = non_indians[index];
		sprite_renderer.sprite = Resources.Load("person"+non_indians[index]+"_flag", Sprite);
		personInfo.country = "Other";
		personInfo.age = ages[personInfo.id - 1];
		personInfo.ward = 7;
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(screen_width * 0.6 + margin, screen_width - 2 * margin)), Mathf.Round(Random.Range(box_size + 2 * margin, screen_height * 0.35 - margin)), 0));
		person.transform.position.z = -1;
		non_indians.RemoveAt(index);
		max_non_indian_index--;
		person_index++;
	}
}

function Update () {
	if(Input.touchCount > 0 && bc)
	{
		touch = Input.touches[0];
		if(touch.position.y < box_size)			//The touch occured in the bottom menu bar.
		{
			if (touch.phase == TouchPhase.Moved)
			{
				scrollPosition.x -= touch.deltaPosition.x*2;
			}
		}	
		else if(touch.position.y >= box_size)
		{
			if(Input.GetTouch(0).phase == TouchPhase.Began)
			{
				hit = 
					Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position), 
										-Vector2.up, 
										1f, 
										1 << LayerMask.NameToLayer("current_object_layer"));
				if(hit.collider != null)
				{
					person = GameObject.Find(hit.collider.gameObject.name);
					personInfo = person.GetComponent("PersonInfo");
					selected_people_id.push(personInfo.id);
					if(personInfo.country == "India")
					{
						person_object = new PersonObject();
						person_object.id = personInfo.id;
						person_object.ward = personInfo.ward;
						person_object.country = personInfo.country;
						person_object.age = personInfo.age;
						SceneManager.selected_people_election_1.push(person_object);
						num_indians_selected++;
						audio.clip = SceneManager.caudio;
						audio.Play();
					}
					else
					{
						audio.clip = SceneManager.waudio;
						audio.Play();
						level_fail = true;
					}
					Destroy(person);
				}
			}
		}
	}
}