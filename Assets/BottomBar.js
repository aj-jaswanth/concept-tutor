#pragma strict
	
var scrollPosition : Vector2;
var touch : Touch;
var i : int;
var j : int;
var num_items : int;					//Number of non drag-to-draw objects
var num_drag_items : int;				//Number of drag-to-draw objects
var game_object_count : int;			//Total number of game objects
var game_object_index : int;			//Index for new game object name. eg: GameObject1, Gameobject2 etc.
var spriterenderer : SpriteRenderer;
var Object_to_move : GameObject;		//Refers to the object to be moved on screen
var cur_object : GameObject;			//Refers to the object just created
var cur_village_object : VillageObject;	//Refers to the object of class VillageObject for the current object created.
var village_game_objects : Array;
var object_lock : int;					//Set to indicate that the object being created is a drag-to-draw object. 
										//Reset to indicate that the object being created is a non drag-to-draw object.
var pos : Vector3;						//Used to store the screen co-ordinates where the touch occurred.
var line : LineRenderer;				//Component attached to drag-to-draw objects, used for drawing the object.
var vertex_count : int;					//Number of vertices of the line being drawn.
var cur_object_points : Array;			//Array to store the screen co-ordinates of the vertices of the line being drawn.
//var all_points = new Array();			//2 dimensional array that stores the screen co-ordinates of all vertices of all lines
										//drawn. 
var drag_item : int;					//Index denoting the type of drag-to-draw game object being drawn.
var colors = new Array();				//Array storing the colors corresponding to the drag_item values.
var show_buttons : int;					//Set to indicate that the tick-mark and cross buttons should be shown.
										//Reset to hide the buttons.
var attributes : Attributes;			//Referring to the Attributes script.
//var hit : RaycastHit;
var ray : Ray;
var raycast_pos : Vector2;
var polygonCollider : PolygonCollider2D;

var person : GameObject;
var hit: RaycastHit2D;
var personInfo : PersonInfo;
var num_selected_people : int;
var level : int;
var wall : GameObject;
var xFactor : float;
var yFactor : float;

var margin : int;
var screen_width : int;
var screen_height : int;
var box_size : int;
var box_collider : BoxCollider2D;
var box_collider_array = new Array(); 
var guicontent : GUIContent;
var collider_height : int;
var collider_width : int;
var delete_lock : int;
var b1 : boolean;
var b2 : boolean;
var b3 : boolean;
var b4 : boolean;
var b5 : boolean;
var bc : boolean;
var sw : int;
var sh : int;
var fstyle : GUIStyle;
function Start()  						//Called when the game starts
{
	sw = Screen.width;
	sh = Screen.height;
	b1 = false;
	b2 = false;
	b3 = false;
	b4 = false;
	b5 = false;
	bc = false;
	num_items = 7;
	num_drag_items = 2;
	game_object_index = 0;
	game_object_count = 0;
	object_lock = 0;
	colors.push(Color.grey);
	colors.push(Color.cyan);
	show_buttons = 0;
	level = 0;
	delete_lock = 0;
	/*wall = GameObject.Find("horizontal_wall1");
	wall.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(0, 0, 0));
	wall.transform.position.z = 0;
	
	wall = GameObject.Find("horizontal_wall2");
	wall.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(0, 1275, 0));
	wall.transform.position.z = 0;
	
	wall = GameObject.Find("vertical_wall1");
	wall.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(0, 0, 0));
	wall.transform.position.z = 0;
	
	wall = GameObject.Find("vertical_wall1");
	wall.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(0, 795, 0));
	wall.transform.position.z = 0;*/
	//Debug.Log(Screen.width + " " + Screen.height);
	screen_width = Screen.width;
	screen_height = Screen.height;
	margin = screen_height * 0.0125;
	box_size = screen_height * 0.125;
	
	collider_height = 2f*Camera.main.orthographicSize;
	collider_width = collider_height * Camera.main.aspect;
	
	box_collider_array = Camera.main.GetComponents(BoxCollider2D);
	
	box_collider = box_collider_array[0];
	box_collider.size.x = collider_width;
	box_collider.size.y = collider_width * 0.0125;
	box_collider.center.y = collider_height / 2;
	box_collider.center.x = 0;
	
	box_collider = box_collider_array[1];
	box_collider.size.x = collider_width;
	box_collider.size.y = collider_width * 0.0125;
	box_collider.center.y = -(collider_height / 2);
	box_collider.center.x = 0;
	
	box_collider = box_collider_array[2];
	box_collider.size.y = collider_height;
	box_collider.size.x = collider_width * 0.0125;
	box_collider.center.x = collider_width / 2;
	box_collider.center.y = 0;
	
	box_collider = box_collider_array[3];
	box_collider.size.y = collider_height;
	box_collider.size.x = collider_width * 0.0125;
	box_collider.center.x = -(collider_width / 2);
	box_collider.center.y = 0;
	
	village_game_objects = new Array();
	
	//CreateNewGameObject(4);
	//FixObject();
}

function OnGUI () {
	switch(level)
	{
	case 0:
		scrollPosition = GUI.BeginScrollView(new Rect(margin,screen_height-margin-box_size, screen_width - 2*margin , box_size),
											scrollPosition, 
											new Rect(margin, screen_height-margin-box_size ,(margin+box_size)*(num_items+num_drag_items), box_size),
											GUIStyle.none,GUIStyle.none);
		for (i=1; i<=num_items; i++)
		{
			if(GUI.Button (new Rect (margin+(i-1)*(box_size+margin), screen_height-margin-box_size, box_size, box_size), Resources.Load("texture"+i+"_icon")))
				CreateNewGameObject(i);
		}
		for(j=1; j<=num_drag_items; j++)
		{
			if(GUI.Button (new Rect (margin+(i-1)*(box_size+margin), screen_height-margin-box_size, box_size, box_size), Resources.Load("dragitem"+j+"_icon")))
				CreateDragItem(j-1);
			i++;
		}
		GUI.EndScrollView ();
		
		if(show_buttons)
		{
			if(GUI.Button (new Rect ((screen_width/2)-margin-box_size, margin, box_size, box_size), Resources.Load("right")))
			{
				FixObject();
			}
			if(GUI.Button (new Rect ((screen_width/2)+margin, margin, box_size, box_size), Resources.Load("wrong")))
			{
				DeleteObject();
			}
			/*if(GUI.Button (new Rect (100, 100, 100, 100), Resources.Load("right")))
			{
				FixObject();
			}*/
		}
		if(game_object_count > 0)
		{
			if(GUI.Button (new Rect (screen_width-margin-box_size, margin, box_size, box_size), "Done"))
			{
				Elections1();
			}
		}
		break;
	case 1:
		scrollPosition = GUI.BeginScrollView(new Rect(margin,screen_height-margin-box_size, screen_width-2*margin, box_size),
											scrollPosition, 
											new Rect(margin, screen_height-margin-box_size ,(box_size+margin)*(num_selected_people), box_size),
											GUIStyle.none,GUIStyle.none);
			for(i=1;i<=num_selected_people;i++)
			{
				GUI.Box (new Rect (margin+(i-1)*(margin+box_size), screen_height-margin-box_size, box_size, box_size), Resources.Load("boy"));
			}																								
		GUI.EndScrollView ();	
		if(num_selected_people == 15)
		{
			if(GUI.Button (new Rect (screen_width-margin-box_size, margin, box_size, box_size), "Done"))
			{
				//SceneManager.LoadScene(1);
			}
		}								
		break;
	}
	GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
	if (b1 && !bc)
	{
		GUILayout.Box("Here you can create your own village.  You can start building your village by adding the free  resources. To begin with just follow the instruction. On the bottom of your screen you will see some resources.  Tab them to activate them . You can drag  and place them anywhere on the screen . Freeze their positions by  click on the  “Tick“ button",fstyle);
		if (GUILayout.Button("Close"))
		{
			b1 = false;
			bc = true;
		}
	}
	if (b2 && !bc)
	{
		GUILayout.Box("You must  add  2  houses   in your village to move ahead. Just tap  on the house on the resource bin, drag it to the desired place and freeze by clicking on “Tick“.",fstyle);
		if (GUILayout.Button("Close"))
		{
			b2 = false;
			bc = true;
		}
	}
	if (b3 && !bc)
	{
		GUILayout.Box("You must  add  3   trees   in your village to move ahead. Just tap  on the tree in the resource bin , drag it to the desired place and freeze by clicking on “Tick“.",fstyle);
		if (GUILayout.Button("Close"))
		{
			b3 = false;
			bc = true;
		}
	}
	if (b4 && !bc)
	{
		GUILayout.Box("You must  add  3 cattle  in your village to move ahead. Just tap  on the cattle in the resource bin , drag it to the desired place and freeze by clicking on “Tick“.",fstyle);
		if (GUILayout.Button("Close"))
		{
			b4 = false;
			bc = true;
		}
	}
	if (b5 && !bc)
	{
		GUILayout.Box("You must  add  2  vehicles in your village to move ahead. Just tap  on the vehiclein the resource bin , drag it to the desired place and freeze by clicking on “Tick“",fstyle);
		if (GUILayout.Button("Close"))
		{
			b5 = false;
			bc = true;
		}
	}
	
	GUILayout.EndArea();
}

function Update()							//Called in every frame.
{
	switch(level)
	{
	//LEVEL 0. Create the village scene.
	case 0:
		b1 = true;	
		if(Input.touchCount > 0 && bc)				//If a touch event occured. Specifically if one or more fingers touched the screen.
		{
			touch = Input.touches[0];			//Obtain the touch object corresponding to the first finger that touched the screen.
			if(touch.position.y < box_size)			//The touch occured in the bottom menu bar.
			{
				if (touch.phase == TouchPhase.Moved)	//This condition becomes true while the dragging is taking place.
				{
					scrollPosition.x -= touch.deltaPosition.x*2;	//For scrolling the bottom menu bar in response to the touch and drag.
					//Debug.Log(""+touch.position.y);
				}
			}						
			else if(touch.position.y >= box_size && touch.position.y <= (screen_height-margin-box_size))			
												//The touch occured on the main screen. Occurs for 2 purposes: 
												//1)Dragging a non drag-to-draw object.
												//2)Drawing a drag-to-draw object.
			{
				if(object_lock == 0)			//Non drag-to-draw object. eg: house, tree etc.
				{
					if(Input.GetTouch(0).phase == TouchPhase.Began)	//The drag event started. 
					{
						pos.x = Input.GetTouch(0).position.x;
						pos.y = Input.GetTouch(0).position.y;
						pos.z = Camera.main.transform.position.z;
						//ray = Camera.main.ScreenPointToRay(Input.GetTouch(0).position);
						/*ray = Camera.main.ScreenPointToRay(pos);
						if(Physics.Raycast(ray, hit))
						{
							Object_to_move = GameObject.Find(hit.transform.name);
							Debug.Log(hit.transform.name);
						}*/
						hit = 
							Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position), 
												-Vector2.up, 
												10f, 
												1 << LayerMask.NameToLayer("current_object_layer"));
						if(hit.collider != null)
						{
							Object_to_move = GameObject.Find(hit.collider.gameObject.name);
						}
					}
					else if(Input.GetTouch(0).phase == TouchPhase.Moved) //The drag is taking place.
					{
						if(Object_to_move != null)
						{
							attributes = Object_to_move.GetComponent("Attributes");
							if(attributes.locked == 0)
							{
								pos.x = Input.GetTouch(0).position.x;
								pos.y = Input.GetTouch(0).position.y;
								pos.z = Mathf.Abs(Camera.main.transform.position.z - Object_to_move.transform.position.z);
								Object_to_move.transform.position = Camera.main.ScreenToWorldPoint(pos);	
							}
							
						}
					}
					else if(Input.GetTouch(0).phase == TouchPhase.Ended || Input.GetTouch(0).phase == TouchPhase.Canceled) //The drag has ended.
					{
						Object_to_move=null;
					}
				}
				else							//Drag to draw object.
				{
					if(show_buttons == 1)
					{
						switch(Input.GetTouch(0).phase)
						{
						case TouchPhase.Began:
							delete_lock = 0;
							game_object_index++;
							cur_object = new GameObject("GameObject"+game_object_index);
							cur_object.AddComponent("Attributes");
							cur_object_points = new Array();
							SceneManager.line_points.push(cur_object_points);
							Debug.Log("TOUCH: "+SceneManager.line_points.length);
							SceneManager.line_id.push(drag_item);
							//game_object_list.push(cur_object);
							//all_points.push(cur_object_points);
							//points.clear();
							line = cur_object.AddComponent("LineRenderer");
							line.SetVertexCount(1);
							line.material = new Material (Shader.Find("Sprites/Default"));
							//line.material = new Material (Shader.Find("Mobile/Bumped"));
							line.SetColors(colors[drag_item], colors[drag_item]);
							line.SetWidth(0.5,0.5);
							//var pos : Vector3;
							pos.x = Input.GetTouch(0).position.x;
							pos.y = Input.GetTouch(0).position.y;
							pos.z = Mathf.Abs(Camera.main.transform.position.z);
							cur_object_points.push(pos);
							break;
						case TouchPhase.Moved:
							if(line!=null)
							{
								line.SetVertexCount(cur_object_points.length + 1);
								//var pos : Vector3;
								pos.x = Input.GetTouch(0).position.x;
								pos.y = Input.GetTouch(0).position.y;
								pos.z = Mathf.Abs(Camera.main.transform.position.z);
								cur_object_points.push(pos);
								for(i=0;i<cur_object_points.length;i++)
								{
									line.SetPosition(i, Camera.main.ScreenToWorldPoint(cur_object_points[i]));
								}
							}
							break;
						case TouchPhase.Canceled:
						case TouchPhase.Ended:
							line=null;
							break;
						}	
					}
				}
			}
		}
		break;
	
	//LEVEL 1. Choosing the Indian candidates.
	case 1:
		if(Input.touchCount > 0)
		{
			touch = Input.touches[0];
			if(touch.position.y < box_size)			//The touch occured in the bottom menu bar.
			{
				if (touch.phase == TouchPhase.Moved)
				{
					scrollPosition.x -= touch.deltaPosition.x*2;
					//Debug.Log(""+touch.position.y);
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
						if(personInfo.country == "India")
						{
							num_selected_people++;
							SceneManager.selected_people_election_1.push(personInfo.id);
							//selected_people.Add(""+personInfo.id);
							
							Destroy(person);
						}
					}
				}
			}
		}
		break;
	}
}

function CreateNewGameObject(x)  			//Creating a new non drag-to-draw game object.
{
	if(show_buttons == 0)					//If a game object is not already under creation.
	{
		game_object_count++;
		object_lock=0;
		game_object_index++;
		cur_object = new GameObject("GameObject"+game_object_index);
		cur_village_object = new VillageObject();
		spriterenderer = cur_object.AddComponent("SpriteRenderer");
		spriterenderer.sprite = Resources.Load("texture"+x, Sprite);
		cur_village_object.sprite_id = x;
		//cur_object.AddComponent("BoxCollider");
		cur_object.AddComponent("PolygonCollider2D");
		cur_object.AddComponent("Attributes");
		//cur_object.transform.position.z = -1;
		cur_object.layer = 8;
		cur_object.AddComponent("Rigidbody2D");
		cur_object.rigidbody2D.gravityScale = 0;
		cur_object.rigidbody2D.fixedAngle = true;
		//cur_object.AddComponent("SliderJoint2D");
		//cur_object.AddComponent("CollisionScript");
		/*cur_object.rigidbody.useGravity = false;
		cur_object.rigidbody.constraints = RigidbodyConstraints.FreezePosition | RigidbodyConstraints.FreezeRotation;*/
		show_buttons = 1;
	}
}

function CreateDragItem(x)					//Creating a new drag-to-draw game object.
{
	if(show_buttons == 0)
	{
		game_object_count++;
		object_lock = 1;
		delete_lock = 1;
		drag_item = x;
		show_buttons = 1;
	}
}

function FixObject()						//Fixing the position of the game object on screen.
{
	if(object_lock == 0)
	{
		attributes = cur_object.GetComponent("Attributes");
		attributes.locked = 1;
		cur_object.transform.position.z = 0;
		cur_object.layer = 0;
		//Destroy(cur_object.GetComponent("PolygonCollider2D"));
		//Destroy(cur_object.GetComponent("CollisionScript"));
		//cur_object.AddComponent("PolygonCollider2D");
		//Destroy(cur_object.GetComponent("Rigidbody2D"));
		//Destroy(cur_object.GetComponent("Rigidbody2D"));
		cur_object.rigidbody2D.isKinematic = true;
		cur_object.rigidbody2D.mass = 0;
		
		cur_village_object.position = cur_object.transform.position;
		SceneManager.village_game_objects.push(cur_village_object);
		//cur_object = null;
		show_buttons = 0;
	}
	else
	{
		object_lock = 0;
		show_buttons = 0;
		//cur_object = null;
	}
}

function DeleteObject()						//Deleting the game object.
{
	if(delete_lock == 0)
	{
		Destroy(cur_object);
		game_object_count--;
		cur_object = null;
		cur_village_object = null;
		cur_object_points = null;
		object_lock = 0;
	}
	show_buttons = 0;
}

function Elections1()
{
	num_items = 0;
	num_drag_items = 0;
	if(show_buttons == 1)
		FixObject();
	PlacePeople();
	num_selected_people = 0;
	level = 1;
}

function PlacePeople()
{
	for(i=1;i<=17;i++)
	{
		person = new GameObject("Person"+i);
		spriterenderer = person.AddComponent("SpriteRenderer");
		personInfo = person.AddComponent("PersonInfo");
		personInfo.id = i;
		if(i==6)
		{
			spriterenderer.sprite = Resources.Load("boy_eng", Sprite);
			personInfo.country = "England";
		}
		else if(i==17)
		{
			spriterenderer.sprite = Resources.Load("boy_italy", Sprite);
			personInfo.country = "Italy";
		}
		else
		{
			spriterenderer.sprite = Resources.Load("boy_ind", Sprite);
		}
		//cur_object.AddComponent("BoxCollider");
		person.AddComponent("BoxCollider2D");
		person.AddComponent("Rigidbody2D");
		person.rigidbody2D.gravityScale = 0;
		person.rigidbody2D.fixedAngle = true;
		//person.rigidbody2D.isKinematic = true;
		//Debug.Log(Mathf.Round(Random.Range(0f, 1280f)));
		person.layer = 8;
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(2*margin,screen_width-2*margin)), Mathf.Round(Random.Range(box_size+2*margin,screen_height-2*margin)), 0));
		person.transform.position.z = -1;
		//person.transform.position = new Vector3(Random.Range(-2f, 2f), Random.Range(-2f, 2f), 0);
		//person.transform.position = new Vector3(0, 0, 0);
	}
	person = null;

}