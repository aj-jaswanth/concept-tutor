#pragma strict

var sw : int;
var sh : int;
var i : int;
var j : int;
var line : LineRenderer;
var cur_line_points : Array;
var game_object_index : int;
var cur_object : GameObject;
var spriterenderer : SpriteRenderer;
var sprite_renderer : SpriteRenderer;
var cur_village_object : VillageObject;
var drag_item : int;
var village_game_objects : Array;
var Object_to_move : GameObject;
var dragObject : GameObject;
var revert_back = false;
var positioned_block : String;
var ray : Ray2D;
var hit : RaycastHit2D;
var showGUI = false;
var count = 0;
var index1 = 0;
var index2 = 0;
var valid = true;
var font : Font;
var sObj : GameObject;			// Simple Scratch Box element
var b1 : boolean;
var fstyle : GUIStyle;
var show_level_fail : boolean;
function Start()
{
	CreateVillage();					//Recreating the village as scene background
	show_level_fail = false;
	b1 = true;
	SceneManager.selected_election_ward_list.clear();
	SceneManager.selected_election_ward_list.push(SceneManager.selected_election_ward_1);
	SceneManager.selected_election_ward_list.push(SceneManager.selected_election_ward_2);
	SceneManager.selected_election_ward_list.push(SceneManager.selected_election_ward_3);
	SceneManager.selected_election_ward_list.push(SceneManager.selected_election_ward_4);
	SceneManager.selected_election_ward_list.push(SceneManager.selected_election_ward_5);
	SceneManager.selected_election_ward_list.push(SceneManager.selected_election_ward_6);
	SceneManager.selected_election_ward_list.push(SceneManager.selected_election_ward_7);

	sObj = new GameObject("scratch_box");		// Initialising one scratch box element
	var sr = sObj.AddComponent("SpriteRenderer") as SpriteRenderer;
	sr.sprite = Resources.Load("gray",Sprite) as Sprite;
	sObj.transform.localScale = new Vector3(0.32,0.32,0.32);
	var rb = sObj.AddComponent("Rigidbody2D") as Rigidbody2D;
	rb.mass = 0;
	rb.drag = 0;
	rb.angularDrag = 0;
	rb.gravityScale = 0;
	rb.fixedAngle = true;
	rb.isKinematic = true;
	
	showGUI = false;					
	for (var z=1;z<8;z++)
		SceneManager.list.push("P"+z);
							// Code to generate the village background.
	game_object_index = 0;							// Creates village in the background
	for(i=0;i<SceneManager.village_game_objects.length;i++)
	{
		game_object_index++;
		cur_object = new GameObject("GameObject"+game_object_index);
		cur_village_object = SceneManager.village_game_objects[i];
		cur_object.transform.position = cur_village_object.position;
		spriterenderer = cur_object.AddComponent("SpriteRenderer");
		spriterenderer.sprite = Resources.Load("texture"+cur_village_object.sprite_id, Sprite);
	}
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
	var x = 0;
	var y = 0;
	var arr = SceneManager.votes;
	for (var i = arr.length - 1; i > 0; i--) {
        var r = Random.Range(0,i);
        var tmp = arr[i];
        arr[i] = arr[r];
        arr[r] = tmp;
    }
	var max1 = 0;
	for (x=0;x<7;x++)				// Finding person with maximum number of votes
	{
		if (SceneManager.votes[x] > max1)
		{
			max1 = SceneManager.votes[x];
			index1 = x;
		}
	}
	var max2 = 0;
	for (x=0;x<7;x++)				// Finding person with second maximum number of votes
	{
		if (SceneManager.votes[x] > max2 && x != index1)
		{
			max2 = SceneManager.votes[x];
			index2 = x;
		}
	}
	
	SceneManager.priority[index1] = 1;
	SceneManager.priority[index2] = 2;
	
	SceneManager.sarpanch_index = (SceneManager.selected_election_ward_list[index1] as PersonObject).id;
	SceneManager.upsarpanch_index = (SceneManager.selected_election_ward_list[index2] as PersonObject).id;
	SceneManager.panch_index = (SceneManager.selected_election_ward_list[(index1+index2+1)%6] as PersonObject).id;
	
	sw = Screen.width;
	sh = Screen.height;
	var obj : GameObject;
	var factor = 0;
	for (x=0;x<7;x++)	// Relative positioning of all GameObjects.
	{
		obj = GameObject.FindGameObjectWithTag(SceneManager.list[x]);
		obj.GetComponent(SpriteRenderer).sprite = Resources.Load("person"+(SceneManager.selected_election_ward_list[x] as PersonObject).id,Sprite);
		obj.GetComponent(SpriteRenderer).enabled = true;
		obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.2+factor,0,0)).x;
		obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.7,0)).y;
		factor += sw*0.1;
	}
	// Positioning all empty blocks
	
	obj = GameObject.FindGameObjectWithTag("e1");
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.2,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.4,0)).y;
	
	obj = GameObject.FindGameObjectWithTag("e2");
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.2,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.1,0)).y;
	
	factor = 0;
	for (x=3;x<8;x++)
	{
		obj = GameObject.FindGameObjectWithTag("e"+x);
		obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.5+factor,0,0)).x;
		obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.4,0)).y;
		factor += sw*0.1;
	}
	obj = GameObject.FindGameObjectWithTag("sevak");
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.7,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.2,0)).y;
	
	factor = 0;
	var gObj : GameObject;
	for (x=0;x<7;x++)		// Positioning all vote dispaly boxes
		{
		obj = new GameObject("vote_box");	
		obj.layer = LayerMask.NameToLayer("Electoral List");
		var gui_text = obj.AddComponent("GUIText") as GUIText;
		gui_text.text = SceneManager.votes[x]+"";
		gui_text.font = font;
		gui_text.fontSize = 18;
		gui_text.color = Color.red;
		obj.transform.position = Camera.main.ScreenToViewportPoint(new Vector3(sw*0.20+factor,sh*0.89,-1));
		var objArray = new Array();
	/*	for (y=0;y<8;y++)		// Creating scratch box using small elements
		{
			for (z=0;z<9;z++)
			{
				gObj = Instantiate(sObj);
				gObj.isStatic = true;
				gObj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.11+factor+sw*0.01*y,0,0)).x;
				gObj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.57+sh*0.01*z,0)).y;
			//	gObj.transform.parent = sObj.transform;
			//	objArray.push(gObj);
			}
		} */
		factor += sw*0.1;
		}
	//StaticBatchingUtility.Combine(objArray as GameObject[],sObj);
}

function OnGUI()
{
	GUI.Box(new Rect(sw*0.15,sh*0.45,sw*0.16,sh*0.05),"Sarpanch");			// Headings dispalyed above characters
	GUI.Box(new Rect(sw*0.15,sh*0.75,sw*0.16,sh*0.05),"Up Sarpanch");
	GUI.Box(new Rect(sw*0.53,sh*0.45,sw*0.2,sh*0.05),"Members of Panchayat");
	GUI.Box(new Rect(sw*0.52,sh*0.75,sw*0.13,sh*0.05),"Gram Sevak");
	var factor = 0;
	for (var x=0;x<7;x++)
		{
		GUI.Box(new Rect(sw*0.17+factor,sh*0.09,sw*0.07,sh*0.08),/*SceneManager.votes[x]+*/"");
		factor += sw*0.1;
		}
	if (show_level_fail)
	{
		if (GUI.Button(new Rect(sw*0.5,sh*0.5,sw*0.15,sh*0.1),"Level Failure"))
		{
			Application.LoadLevel("ElectionLevel5Scene");
		}
	}
	if (showGUI)
	{
		if (GUI.Button(new Rect(Screen.width*0.9,Screen.height*0.1,50,40),"Next"))
		{
			if (SceneManager.filledE[1] == true && SceneManager.filledE[2] == true)
			{
			 Application.LoadLevel("MainMenu");
			}
			else
			{
			 show_level_fail = true;
			}
		}	
	}
	if (b1)
	{
		GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
		GUILayout.Box("Each member in Gram  Panchayat has a specific role to play. Together they look after the wellbeing and  development of the village.  These member will  vote amongst each other. The contestant with the maximum votes is selected as the SURPANCH- the leader. The runner up is selected as UP-SURPANCH- the acting leader. All the other members are referred as PANCH.Let us go ahead and assign different roles to the members based on the voting. ",fstyle);
		if (GUILayout.Button("Close"))
			b1 = false;
		GUILayout.EndArea();
	}	
}

function Update()
{
	if (count == 7)
		showGUI = true;
	if(Input.touchCount == 1 && !b1)
	{
		if(Input.GetTouch(0).phase == TouchPhase.Began)
		{
			hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position),
								-Vector2.up, 1f, 1 << LayerMask.NameToLayer("Electoral List"));
			if(hit.collider != null)			// Selected a character
			{
				if (hit.collider.gameObject.name == "scratch_box")
					hit.collider.gameObject.SetActive(false);
				if (hit.collider.gameObject.tag.Substring(0,1) == "P")
				{
					Object_to_move = Instantiate(hit.collider.gameObject);
					Object_to_move.layer = LayerMask.NameToLayer("Drag Object");
				//	Object_to_move.tag = hit.collider.gameObject.tag+"_d";
				}
			}
		}
		else if(Input.GetTouch(0).phase == TouchPhase.Moved)
		{
			if(Object_to_move != null)		// Dragging a character
			{
				var pos : Vector3;
				pos.x = Input.GetTouch(0).position.x;
				pos.y = Input.GetTouch(0).position.y;
				
				pos.z = Mathf.Abs(Camera.main.transform.position.z - Object_to_move.transform.position.z);
				Object_to_move.transform.position = Camera.main.ScreenToWorldPoint(pos);	
			}
		}
		else if(Input.GetTouch(0).phase == TouchPhase.Ended || Input.GetTouch(0).phase == TouchPhase.Canceled)
		{
			hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position),
								-Vector2.up, 1f, 1 << LayerMask.NameToLayer("Roaming List"));
			if (hit.collider != null)			
			{
				if (hit.collider.gameObject.tag.Substring(0,1) == 'e')	// Checking whether the dragged object is left on an empty box or not
				{
					var index = int.Parse(hit.collider.gameObject.tag.Substring(1,1));
					var pindex = int.Parse(Object_to_move.tag.Substring(1,1));
					if (SceneManager.filledE[index] == false)
					{
						if (SceneManager.posB[pindex] == false)
						{
							var p = 0;
							for (var x=0;x<7;x++)
							{
								if (SceneManager.list[x] == Object_to_move.tag)
								{
								p = x;
								break;
								}
							}
							valid = true;
							if (index == 1 && SceneManager.priority[p] != 1)
								valid = false;
							else if (index == 2 && SceneManager.priority[p] != 2)
								valid = false;
							if (index !=1 && index != 2)
							{
								if (p == index1 || p == index2)
									valid = false;
							}
							if (valid == true)
							{
								SceneManager.filledE[index] = true;
								SceneManager.posB[pindex] = true;
								hit.collider.gameObject.GetComponent(BoxCollider2D).enabled = false;
								hit.collider.gameObject.GetComponent(SpriteRenderer).enabled = false;
								GameObject.FindGameObjectWithTag(Object_to_move.tag).transform.position
											= hit.collider.gameObject.transform.position;
								GameObject.FindGameObjectWithTag(Object_to_move.tag.Substring(0,2)).
									GetComponent(BoxCollider2D).enabled = false;
								SceneManager.posE[pindex] =	hit.collider.gameObject.tag;
								count++;
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
				}
			}
		Destroy(Object_to_move);
		Object_to_move=null;
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