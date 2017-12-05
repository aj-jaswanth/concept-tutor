#pragma strict
var drag_object : GameObject;
var drag_parent : GameObject;
var hit : RaycastHit2D;
var ray : Ray2D;
var total_e : int[];
var total_c : int[];
var current_ward : int;
var current_count : int;
var game_over : boolean;
var sw : int;
var sh : int;
var b1 : boolean;
var fstyle : GUIStyle;

function Start () {
	sw = Screen.width;
	sh = Screen.height;
	b1 = true;
	total_e = [-1,2,2,2,2,3,2,2];
	total_c = [-1,2,4,2,2,3,3,3];
	current_ward = 1;
	current_count = 0;
	game_over = false;
}

function Update () {
	if (current_count == total_e[current_ward])
		{
		current_count = 0;
		current_ward++;
		SceneManager.ward++;
		}
	if (current_ward == 8)
		game_over =true;
	if (Input.touchCount == 1 && !game_over && !b1)
	{
		if (Input.GetTouch(0).phase == TouchPhase.Began)
		{
			hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position),
								-Vector2.up, 1f, 1 << LayerMask.NameToLayer("roaming_list"));
			if (hit.collider != null)
			{
				drag_parent = hit.collider.gameObject;
				if (drag_parent.name.Substring(1,1) != current_ward+"")
					return;
				drag_object = Instantiate(drag_parent);
				drag_object.layer = LayerMask.NameToLayer("drag_layer");	
			}
		}
		else if (Input.GetTouch(0).phase == TouchPhase.Moved)
		{
			if (drag_object != null)
			{
				var pos : Vector3;
				pos.x = Input.GetTouch(0).position.x; // Moving the object according to the user's drag.
				pos.y = Input.GetTouch(0).position.y;				
				pos.z = Mathf.Abs(Camera.main.transform.position.z - drag_object.transform.position.z);
				drag_object.transform.position = Camera.main.ScreenToWorldPoint(pos);
			}
		}
		else if (Input.GetTouch(0).phase == TouchPhase.Ended || Input.GetTouch(0).phase == TouchPhase.Canceled)
		{
			if (drag_object != null)
			{
				hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position),
								-Vector2.up, 1f, 1 << LayerMask.NameToLayer("electoral_list"));
				if (hit.collider != null)
				{
					var obj = hit.collider.gameObject;
					if (obj.name.Substring(3,1) == drag_object.name.Substring(3,1) && obj.name.Substring(1,1) == current_ward+"")
					{
						audio.clip = SceneManager.caudio;
						audio.Play();
						obj.GetComponent(SpriteRenderer).color = Color.green;
						Destroy(drag_parent);
						current_count++;
					}
					else
					{
						audio.clip = SceneManager.waudio;
						audio.Play();
					}
				}
				Destroy(drag_object);
			}
		}
	}
}

function OnGUI()
{
	GUI.Box(new Rect(sw*0.01,sh*0.05,sw*0.07,sh*0.07),"Ward 1");
	GUI.Box(new Rect(sw*0.01,sh*0.18,sw*0.07,sh*0.07),"Ward 2");
	GUI.Box(new Rect(sw*0.01,sh*0.30,sw*0.07,sh*0.07),"Ward 3");
	GUI.Box(new Rect(sw*0.01,sh*0.42,sw*0.07,sh*0.07),"Ward 4");
	GUI.Box(new Rect(sw*0.01,sh*0.58,sw*0.07,sh*0.07),"Ward 5");
	GUI.Box(new Rect(sw*0.01,sh*0.74,sw*0.07,sh*0.07),"Ward 6");
	GUI.Box(new Rect(sw*0.01,sh*0.88,sw*0.07,sh*0.07),"Ward 7");
	if (game_over)
	{
		if (GUI.Button(new Rect(Screen.width*0.4,Screen.height*0.5,Screen.width*0.1,Screen.height*0.1),"Next"))
		{
			Application.LoadLevel("ElectionLevel4Scene");
		}
	}
	if (b1)
	{
		GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
		GUILayout.Box("One of the  criteria  to contest in the election – the individual should be enrolled in the voter list of the village.   Let us shortlist the individuals on the basis of the electoral list. Drag to match  the individuals with the  electoral list. ",fstyle);
		if (GUILayout.Button("Close"))
			b1 = false;
		GUILayout.EndArea();		
	}
}