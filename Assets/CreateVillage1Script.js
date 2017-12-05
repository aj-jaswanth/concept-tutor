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
var cur_object_points : Array;			//Array to store the screen co-ordinates of the vertices of the line being drawn.
var drag_item : int;					//Contains an integer that denotes the type of drag-to-draw object being drawn. 
										//This is used to obtain the corresponding color/texture for the object.					
var num_village_components : int;				//Total number of components
var num_village_non_drag_components : int;		//Total number of non drag-to-draw components
var num_village_drag_components : int;			//Total numbers of drag-to-draw components	
var village_non_drag_component : VillageNonDragComponent;
var village_drag_component : VillageDragComponent;
var lock : boolean = false;
var is_drag_to_draw : boolean = false;
var attributes : Attributes;
var scrollPosition : Vector2;
var touch : Touch;
var pos : Vector3;						//Used to store the screen co-ordinates where the touch occurred.
var hit: RaycastHit2D;
var object_to_move : GameObject;		//Refers to the object to be moved on screen
var delete_lock : int;
var line_color : Color;
var line_width : float;
/*
var b1 : boolean;
var b2 : boolean;
var b3 : boolean;
var b4 : boolean;
var b5 : boolean;
var bc : boolean;
var sw : int;
var sh : int; */
var fstyle : GUIStyle;

function OnGUI()
{
	//Introduction message
	if(SceneManager.create_village_display_intro_msg)
	{
		GUI.Box(
			new Rect(
				SceneManager.margin, 
				(SceneManager.screen_height - SceneManager.intro_msg_box_height) / 2, 
				SceneManager.intro_msg_box_width, 
				SceneManager.intro_msg_box_height
			), 
			SceneManager.create_village_intro_msg_txt,fstyle
		);
		if(GUI.Button(
			new Rect(
				(SceneManager.intro_msg_box_width - SceneManager.box_size) / 2, 
				(SceneManager.screen_height + SceneManager.intro_msg_box_height - SceneManager.box_size) / 2, 
				SceneManager.box_size, 
				SceneManager.box_size
			), 
	  		Resources.Load("right")
		))
		{
			SceneManager.create_village_display_intro_msg = false;
		}
	}
	//After introduction message has been dismissed
	else
	{
		//Scrollable bottom bar
		scrollPosition = 
			GUI.BeginScrollView(
				new Rect(
					SceneManager.margin,
					SceneManager.screen_height - SceneManager.margin - SceneManager.box_size, 
					SceneManager.screen_width - 2 * SceneManager.margin , 
					SceneManager.box_size
				),
				scrollPosition, 
				new Rect(
					SceneManager.margin, 
					SceneManager.screen_height - SceneManager.margin - SceneManager.box_size,
					(SceneManager.margin + SceneManager.box_size) * num_village_components, 
					SceneManager.box_size
				),
				GUIStyle.none,
				GUIStyle.none
			);
		//Placing non drag-to-draw components in bottom menu bar	
		for (i=0; i<SceneManager.village_non_drag_components_list.length; i++)
		{
			village_non_drag_component = SceneManager.village_non_drag_components_list[i];
			if(village_non_drag_component.name == SceneManager.village_component_unlocked)
			{
				if(GUI.Button (
						new Rect (
							SceneManager.margin + i * (SceneManager.box_size + SceneManager.margin), 
							SceneManager.screen_height - SceneManager.margin - SceneManager.box_size, 
							SceneManager.box_size, SceneManager.box_size
						), 
						Resources.Load(village_non_drag_component.icon)
				))
				{
					if(!lock)					//If a game object is not already under creation.
					{
						game_object_index++;
						cur_object = new GameObject("GameObject"+game_object_index);
						cur_village_object = new VillageObject();
						sprite_renderer = cur_object.AddComponent("SpriteRenderer");
						sprite_renderer.sprite = Resources.Load(village_non_drag_component.image, Sprite);
						cur_village_object.sprite = village_non_drag_component.image;
						cur_object.AddComponent("PolygonCollider2D");
						cur_object.AddComponent("Attributes");
						cur_object.layer = 8;
						cur_object.AddComponent("Rigidbody2D");
						cur_object.rigidbody2D.gravityScale = 0;
						cur_object.rigidbody2D.fixedAngle = true;
						lock = true;
					}
				}
			}
			else
			{
				GUI.Box (
						new Rect (
							SceneManager.margin + i * (SceneManager.box_size + SceneManager.margin), 
							SceneManager.screen_height - SceneManager.margin - SceneManager.box_size, 
							SceneManager.box_size, SceneManager.box_size
						), 
						Resources.Load(village_non_drag_component.icon)
				);
			}
		}
		
		//Placing drag-to-draw components in bottom menu bar	
		for (j=0; j<num_village_drag_components; j++)
		{
			village_drag_component = SceneManager.village_drag_components_list[j];
			if(village_drag_component.name == SceneManager.village_component_unlocked)
			{
				if(GUI.Button (
						new Rect (
							SceneManager.margin + i * (SceneManager.box_size + SceneManager.margin), 
							SceneManager.screen_height - SceneManager.margin - SceneManager.box_size, 
							SceneManager.box_size, SceneManager.box_size
						), 
						Resources.Load(village_drag_component.icon)
				))
				{
					if(!lock)					//If a game object is not already under creation.
					{
						is_drag_to_draw = true;
						delete_lock = 1;
						line_color = village_drag_component.color;
						line_width = village_drag_component.width;
						lock = true;
					}
				}
			}
			else
			{
				GUI.Box (
						new Rect (
							SceneManager.margin + i * (SceneManager.box_size + SceneManager.margin), 
							SceneManager.screen_height - SceneManager.margin - SceneManager.box_size, 
							SceneManager.box_size, SceneManager.box_size
						), 
						Resources.Load(village_drag_component.icon)
				);
			}
			i++;
		}
		GUI.EndScrollView ();
		
		//Displaying the right and wrong buttons when a new object is under creation.
		if(lock)
		{
			if(GUI.Button 
				(new Rect (
					(SceneManager.screen_width / 2) - SceneManager.margin - SceneManager.box_size, 
					SceneManager.margin, 
					SceneManager.box_size, 
					SceneManager.box_size
				), 
				Resources.Load("right")
			))
			{
				audio.clip = SceneManager.caudio;
				audio.Play();
				FixObject();
			}
			if(GUI.Button 
				(new Rect ((SceneManager.screen_width / 2) + SceneManager.margin, SceneManager.margin, SceneManager.box_size, SceneManager.box_size), Resources.Load("wrong")))
			{
				audio.clip = SceneManager.waudio;
				audio.Play();
				DeleteObject();
			}
		}
		/*for(j=1; j<=num_drag_items; j++)
		{
			if(GUI.Button (new Rect (margin + (i - 1) * (box_size + margin), screen_height - margin - box_size, box_size, box_size), Resources.Load("dragitem"+j+"_icon")))
				CreateDragItem(j-1);
			i++;
		}*/
	}
/*	GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
	if (b1 && !bc)
	{
		GUILayout.Box("Here you can create your own village.  You can start building your village by adding the free  resources. To begin with just follow the instruction. On the bottom of your screen you will see some resources.  Tab them to activate them . You can drag  and place them anywhere on the screen . Freeze their positions by  click on the  “Tick“ button",fstyle);
		if (GUILayout.Button("Close"))
		{
			b1 = false;
			b2 = true;
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
		GUILayout.Box("You must  add  2 vehicles in your village to move ahead. Just tap  on the vehicle in the resource bin , drag it to the desired place and freeze by clicking on “Tick“",fstyle);
		if (GUILayout.Button("Close"))
		{
			b5 = false;
			bc = true;
		}
	}	
	GUILayout.EndArea(); */
}

function Start () {
	game_object_index = 0;
/*	b1 = true;
	bc = false;
	sw = Screen.width;
	sh = Screen.height; */
	CreateStaticVillage();
	num_village_non_drag_components = SceneManager.village_non_drag_components_list.length;
	num_village_drag_components = SceneManager.village_drag_components_list.length;
	num_village_components = num_village_non_drag_components + num_village_drag_components;
}

function Update () 
{
	if(Input.touchCount > 0)				//If a touch event occured. Specifically if one or more fingers touched the screen.
	{
		touch = Input.touches[0];			//Obtain the touch object corresponding to the first finger that touched the screen.
		if(touch.position.y < SceneManager.box_size)			//The touch occured in the bottom menu bar.
		{
			if (touch.phase == TouchPhase.Moved)	//This condition becomes true while the dragging is taking place.
			{
				scrollPosition.x -= touch.deltaPosition.x*2;	//For scrolling the bottom menu bar in response to the touch and drag.
				//Debug.Log(""+touch.position.y);
			}
		}						
		else if(touch.position.y >= SceneManager.box_size)			
											//The touch occured on the main screen. Occurs for 2 purposes: 
											//1)Dragging a non drag-to-draw object.
											//2)Drawing a drag-to-draw object.
		{
			if(!is_drag_to_draw)			//Non drag-to-draw object. eg: house, tree etc.
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
						object_to_move = GameObject.Find(hit.collider.gameObject.name);
					}
				}
				else if(Input.GetTouch(0).phase == TouchPhase.Moved) //The drag is taking place.
				{
					if(object_to_move != null)
					{
						attributes = object_to_move.GetComponent("Attributes");
						if(attributes.locked == 0)
						{
							pos.x = Input.GetTouch(0).position.x;
							pos.y = Input.GetTouch(0).position.y;
							pos.z = Mathf.Abs(Camera.main.transform.position.z - object_to_move.transform.position.z);
							object_to_move.transform.position = Camera.main.ScreenToWorldPoint(pos);	
						}
						
					}
				}
				else if(Input.GetTouch(0).phase == TouchPhase.Ended || Input.GetTouch(0).phase == TouchPhase.Canceled) //The drag has ended.
				{
					object_to_move=null;
				}
			}
			else							//Drag to draw object.
			{
				if(lock)
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
						line = cur_object.AddComponent("LineRenderer");
						line.SetVertexCount(1);
						line.material = new Material (Shader.Find("Sprites/Default"));
						line.SetColors(line_color, line_color);
						Debug.Log(line_color);
						line.SetWidth(line_width, line_width);
						pos.x = Input.GetTouch(0).position.x;
						pos.y = Input.GetTouch(0).position.y;
						pos.z = Mathf.Abs(Camera.main.transform.position.z);
						cur_object_points.push(pos);
						break;
					case TouchPhase.Moved:
						if(line!=null)
						{
							line.SetVertexCount(cur_object_points.length + 1);
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
}

function CreateStaticVillage()
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
		cur_object.AddComponent("PolygonCollider2D");
		//cur_object.AddComponent("Rigidbody2D");
		//cur_object.rigidbody2D.gravityScale = 0;
		//cur_object.rigidbody2D.fixedAngle = true;
		cur_object.transform.position.z = 0;
		//cur_object.rigidbody2D.isKinematic = true;
		//cur_object.rigidbody2D.mass = 0;
		attributes = cur_object.AddComponent("Attributes");
		attributes.locked = 1;
		cur_object.layer = 0;
		cur_object.isStatic = true;
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

function FixObject()						//Fixing the position of the game object on screen.
{
	if(!is_drag_to_draw)
	{
		attributes = cur_object.GetComponent("Attributes");
		attributes.locked = 1;
		cur_object.transform.position.z = 0;
		cur_object.layer = 0;
		cur_object.rigidbody2D.isKinematic = true;
		cur_object.rigidbody2D.mass = 0;
		cur_village_object.position = cur_object.transform.position;
		SceneManager.village_game_objects.push(cur_village_object);
		SceneManager.num_allowed_village_components--;
		if(SceneManager.num_allowed_village_components <= 0)
		{
			SceneManager.CreateVillageNextScene();
	/*		switch(SceneManager.village_component_unlocked)
			{
			case "Tree":
				b2 = false;
				b3 = true;
				bc = false;
			break;
			case "Animal":
				b3 = false;
				b4 = true;
				bc = false;
			break;
			case "Transport":
				b4 = false;
				b5 = true;
				bc = false;
			break;			
			} */
		}	
		lock = false;
	}
	else
	{
		is_drag_to_draw = false;
		lock = false;
	}
}

function DeleteObject()						//Deleting the game object.
{
	if(delete_lock == 0)
	{
		Destroy(cur_object);
		//game_object_count--;
		cur_object = null;
		cur_village_object = null;
		cur_object_points = null;
		is_drag_to_draw = false;
	}
	lock = false;
}