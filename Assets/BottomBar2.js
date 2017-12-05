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
var selected_people : Array;
var wall : GameObject;
var xFactor : float;
var yFactor : float;

var margin : int;
var screen_width : int;
var screen_height : int;

var guicontent : GUIContent;

function Start()  						//Called when the game starts
{
	num_items = 7;
	num_drag_items = 2;
	game_object_index = 0;
	game_object_count = 0;
	object_lock = 0;
	colors.push(Color.grey);
	colors.push(Color.cyan);
	show_buttons = 0;
	level = 0;
	wall = GameObject.Find("horizontal_wall1");
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
	wall.transform.position.z = 0;
	//Debug.Log(Screen.width + " " + Screen.height);
	//CreateNewGameObject(4);
	//FixObject();
}

function OnGUI () {
	xFactor = 800f / 1024f;
	yFactor = 432f  / 800f;
	//GUIUtility.ScaleAroundPivot( new Vector2 (xFactor, yFactor), Vector2.up);
	switch(level)
	{
	case 0:
		scrollPosition = GUI.BeginScrollView(new Rect(10,690,1260,100),
											scrollPosition, 
											new Rect(10,690,110*(num_items+num_drag_items),100),
											GUIStyle.none,GUIStyle.none);
		for (i=1; i<=num_items; i++)
		{
			if(GUI.Button (new Rect ((10+(i-1)*110), 690, 100, 100), Resources.Load("texture"+i+"_icon")))
				CreateNewGameObject(i);
		}
		for(j=1; j<=num_drag_items; j++)
		{
			if(GUI.Button (new Rect ((10+(i-1)*110), 690, 100, 100), Resources.Load("dragitem"+j+"_icon")))
				CreateDragItem(j-1);
			i++;
		}
		GUI.EndScrollView ();
		
		if(show_buttons)
		{
			if(GUI.Button (new Rect (530, 10, 100, 100), Resources.Load("right")))
			{
				FixObject();
			}
			if(GUI.Button (new Rect (650, 10, 100, 100), Resources.Load("wrong")))
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
			if(GUI.Button (new Rect (1170 * xFactor, 10 * yFactor, 100, 100), "Done"))
			{
				Elections1();
			}
		}
		break;
	case 1:
		scrollPosition = GUI.BeginScrollView(new Rect(10,690,1260,100),
											scrollPosition, 
											new Rect(10,690,110*(num_selected_people),100),
											GUIStyle.none,GUIStyle.none);
			for(i=1;i<=num_selected_people;i++)
			{
				GUI.Box (new Rect (10+(i-1)*110, 690, 100, 100), Resources.Load("boy"));
			}																								
		GUI.EndScrollView ();									
		break;
	}
}

function Update()							//Called in every frame.
{
	switch(level)
	{
	case 0:
		if(Input.touchCount > 0)				//If a touch event occured.
		{
			touch = Input.touches[0];
			if(touch.position.y < 100)			//he touch occured in the bottom menu bar.
			{
				if (touch.phase == TouchPhase.Moved)
				{
					scrollPosition.x -= touch.deltaPosition.x*2;
					//Debug.Log(""+touch.position.y);
				}
			}						
			else if(touch.position.y >= 100 && touch.position.y <= 690)			
												//The touch occured on the main screen. Occurs for 2 purposes: 
												//1)Dragging a non drag-to-draw object.
												//2)Drawing a darg-to-draw object.
			{
				if(object_lock == 0)			//Non drag-to-draw object
				{
					if(Input.GetTouch(0).phase == TouchPhase.Began)
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
					else if(Input.GetTouch(0).phase == TouchPhase.Moved)
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
								/*if (Object_to_move.SweepTest (-Vector3.up, hit, 1)) {
									show_buttons = 0;
								}*/
								/*ray = Camera.main.ScreenPointToRay(Input.GetTouch(0).position);
								if(Physics.Raycast(ray, hit))
								{
									Object_to_move.rigidbody.
									if (hit.transform.name != Object_to_move.transform.name)
										show_buttons = 0;
									else
										show_buttons = 1;
								}	
								else
									show_buttons = 1;
								*/
							}
							
						}
					}
					else if(Input.GetTouch(0).phase == TouchPhase.Ended || Input.GetTouch(0).phase == TouchPhase.Canceled)
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
							game_object_index++;
							cur_object = new GameObject("GameObject"+game_object_index);
							cur_object.AddComponent("Attributes");
							cur_object_points = new Array();
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
	
	case 1:
		if(Input.touchCount > 0)
		{
			touch = Input.touches[0];
			if(touch.position.y < 100)			//he touch occured in the bottom menu bar.
			{
				if (touch.phase == TouchPhase.Moved)
				{
					scrollPosition.x -= touch.deltaPosition.x*2;
					//Debug.Log(""+touch.position.y);
				}
			}	
			else if(touch.position.y >= 100)
			{
				if(Input.GetTouch(0).phase == TouchPhase.Began)
				{
					hit = 
						Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position), 
											-Vector2.up, 
											10f, 
											1 << LayerMask.NameToLayer("current_object_layer"));
					if(hit.collider != null)
					{
						person = GameObject.Find(hit.collider.gameObject.name);
						Debug.Log(person.name);
						personInfo = person.GetComponent("PersonInfo");
						if(personInfo.country == "India")
						{
							num_selected_people++;
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
		spriterenderer = cur_object.AddComponent("SpriteRenderer");
		spriterenderer.sprite = Resources.Load("texture"+x, Sprite);
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
		//cur_object.transform.position.z = 0;
		cur_object.layer = 0;
		//Destroy(cur_object.GetComponent("PolygonCollider2D"));
		//Destroy(cur_object.GetComponent("CollisionScript"));
		//cur_object.AddComponent("PolygonCollider2D");
		//Destroy(cur_object.GetComponent("Rigidbody2D"));
		//Destroy(cur_object.GetComponent("Rigidbody2D"));
		cur_object.rigidbody2D.isKinematic = true;
		cur_object.rigidbody2D.mass = 0;
		cur_object = null;
		show_buttons = 0;
	}
	else
	{
		object_lock = 0;
		show_buttons = 0;
		cur_object = null;
	}
}

function DeleteObject()						//Deleting the game object.
{
	if(cur_object != null)
	{
		Destroy(cur_object);
		game_object_count--;
		cur_object = null;
		cur_object_points = null;
		object_lock = 0;
	}
	show_buttons = 0;
}

function Elections1()
{
	num_items = 0;
	num_drag_items = 0;
	if(cur_object != null)
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
		person.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(Mathf.Round(Random.Range(20f,1260f)), Mathf.Round(Random.Range(120f,600f)), 0));
		person.transform.position.z = 0;
		//person.transform.position = new Vector3(Random.Range(-2f, 2f), Random.Range(-2f, 2f), 0);
		//person.transform.position = new Vector3(0, 0, 0);
	}
	person = null;

}