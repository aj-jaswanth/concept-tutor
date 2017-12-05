#pragma strict
var sw : int;
var sh : int;
var s_line : LineRenderer;
var score : int;
var hit : RaycastHit2D;
var ray : Ray2D;
var drag_object : GameObject;
var b1 : boolean;
var bc : boolean;
var fstyle : GUIStyle;
function Start () {
	b1 = true;
	bc = false;
	score = 0;
	sw = Screen.width;
	sh = Screen.height;
	s_line = GameObject.Find("Divider").GetComponent(LineRenderer);	
	s_line.SetColors(Color.green, Color.green);
	s_line.material = new Material (Shader.Find("Sprites/Default"));
	s_line.SetWidth(0.3,0.3);
	s_line.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(sw*0.55,0,10)));
	s_line.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(sw*0.55,sh,10)));
	s_line.SetVertexCount(2); 
	
	var obj = new GameObject("sevak");
	var sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
	sr.sprite = Resources.Load("person"+SceneManager.sevak_index,Sprite) as Sprite;
	obj.layer = LayerMask.NameToLayer("selection_panel");
	var rigid_body = obj.AddComponent("Rigidbody2D") as Rigidbody2D;
	rigid_body.mass = 0;
	rigid_body.drag = 0;
	rigid_body.angularDrag = 0;
	rigid_body.gravityScale = 0;
	rigid_body.fixedAngle = true;
	rigid_body.isKinematic = true;
	obj.AddComponent("BoxCollider2D");
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.7,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.63,0)).y;
	obj.transform.localScale = Vector3(2,2,2);

	obj = new GameObject("gram_panchayat");
	sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
	sr.sprite = Resources.Load("person"+SceneManager.sarpanch_index,Sprite) as Sprite;
	obj.layer = LayerMask.NameToLayer("selection_panel");
	rigid_body = obj.AddComponent("Rigidbody2D") as Rigidbody2D;
	rigid_body.mass = 0;
	rigid_body.drag = 0;
	rigid_body.angularDrag = 0;
	rigid_body.gravityScale = 0;
	rigid_body.fixedAngle = true;
	rigid_body.isKinematic = true;
	obj.AddComponent("BoxCollider2D");
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.89,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.63,0)).y;
	obj.transform.localScale = Vector3(2,2,2);
	
	obj = new GameObject("gram_sabha");
	sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
	sr.sprite = Resources.Load("person"+SceneManager.sevak_index,Sprite) as Sprite;
	obj.layer = LayerMask.NameToLayer("selection_panel");
	rigid_body = obj.AddComponent("Rigidbody2D") as Rigidbody2D;
	rigid_body.mass = 0;
	rigid_body.drag = 0;
	rigid_body.angularDrag = 0;
	rigid_body.gravityScale = 0;
	rigid_body.fixedAngle = true;
	rigid_body.isKinematic = true;
	obj.AddComponent("BoxCollider2D");
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.7,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.23,0)).y;
	obj.transform.localScale = Vector3(2,2,2);
	
/*	obj = new GameObject("gram_sabha");
    sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
	sr.sprite = Resources.Load("gram_sabha",Sprite) as Sprite;
	obj.layer = LayerMask.NameToLayer("selection_panel");
	rigid_body = obj.AddComponent("Rigidbody2D") as Rigidbody2D;
	rigid_body.mass = 0;
	rigid_body.drag = 0;
	rigid_body.angularDrag = 0;
	rigid_body.gravityScale = 0;
	rigid_body.fixedAngle = true;
	rigid_body.isKinematic = true;
	obj.AddComponent("BoxCollider2D");
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.89,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.23,0)).y;
	obj.transform.localScale = Vector3(2,2,2);		
	
	obj = new GameObject("gram_panchayat");
    sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
	sr.sprite = Resources.Load("gram_panchayat",Sprite) as Sprite;
	obj.layer = LayerMask.NameToLayer("selection_panel");
	rigid_body = obj.AddComponent("Rigidbody2D") as Rigidbody2D;
	rigid_body.mass = 0;
	rigid_body.drag = 0;
	rigid_body.angularDrag = 0;
	rigid_body.gravityScale = 0;
	rigid_body.fixedAngle = true;
	rigid_body.isKinematic = true;
	obj.AddComponent("BoxCollider2D");
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.89,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.23,0)).y;
	obj.transform.localScale = Vector3(2,2,2);		*/
	
	obj = GameObject.Find("shape1Text");
	obj.GetComponent(GUIText).text = "Monitor the\n functioning of\n the health center.	";
	obj.transform.position.x = Camera.main.ScreenToViewportPoint(new Vector3(sw*0.08,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToViewportPoint(new Vector3(0,sh*0.9,0)).y;
	obj.guiText.font = Resources.Load("LDFComicSansBold",Font);
	obj.guiText.fontSize = 14;
		
	obj = GameObject.Find("shape4Text");
	obj.GetComponent(GUIText).text = "Define the\n responsibilities of\n the health center";
	obj.transform.position.x = Camera.main.ScreenToViewportPoint(new Vector3(sw*0.28,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToViewportPoint(new Vector3(0,sh*0.9,0)).y;
	obj.guiText.font = Resources.Load("LDFComicSansBold",Font);
	obj.guiText.fontSize = 14;
	
	obj = GameObject.Find("shape2Text");
	obj.GetComponent(GUIText).text = "Get information about\n various\n governement schemes\n for establishing\n a health center.";
	obj.transform.position.x = Camera.main.ScreenToViewportPoint(new Vector3(sw*0.07,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToViewportPoint(new Vector3(0,sh*0.30,0)).y;
	obj.guiText.font = Resources.Load("LDFComicSansBold",Font);
	obj.guiText.fontSize = 14;
	
	obj = GameObject.Find("shape3Text");
	obj.GetComponent(GUIText).text = "Make funds available\n for quality\n functioning of the\n health center.";
	obj.transform.position.x = Camera.main.ScreenToViewportPoint(new Vector3(sw*0.30,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToViewportPoint(new Vector3(0,sh*0.30,0)).y;
	obj.guiText.font = Resources.Load("LDFComicSansBold",Font);
	obj.guiText.fontSize = 14;
	
	obj = GameObject.Find("shape5Text");
	obj.GetComponent(GUIText).text = "Share the idea with\n the villagers of\n having the health\n center in the village.";
	obj.transform.position.x = Camera.main.ScreenToViewportPoint(new Vector3(sw*0.18,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToViewportPoint(new Vector3(0,sh*0.60,0)).y;
	obj.guiText.font = Resources.Load("LDFComicSansBold",Font);
	obj.guiText.fontSize = 14;
	
}

function OnGUI()
{
	GUI.Box(new Rect(sw*0.63,sh*0.18,sw*0.12,sh*0.08),"Sevak");
	GUI.Box(new Rect(sw*0.8,sh*0.18,sw*0.19,sh*0.08),"Gram Sabha");
	GUI.Box(new Rect(sw*0.63,sh*0.58,sw*0.18,sh*0.08),"Gram Panchayat");
	GUI.Box(new Rect(sw*0.6,0,sw*0.15,sh*0.13),"Score\n"+score+"/5");
	if (score == 5)
	{
		if (GUI.Button(new Rect(sw*0.5,sh*0.5,sw*0.1,sw*0.1),"Next"))
		{
			Application.LoadLevel("MainMenu");
		}
	}
	if (b1)
	{
		GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
		GUILayout.Box("The next Gram Sabha is around the corner,  the gram panchayat strongly believes in  women empowerment. One of the agenda of  this Gram Sabha  will be to  discuss women's contribution in  source of income  in running their family.  The women in the village  are mostly involved in the household work . They are very good in making various types of pickles.  All the tourists  visiting the village like these pickles.  They always take a jar full of these pickles for  their  family and friends.  These pickles are in great demand  all around the world.  I want to start a  small business of these pickles.  Please help me to  reach the right officials so that I can setup my pickle factory.\n\nLook at the task. Approach the  appropriate members of Gram sabha. Drag and drop the right person  to earn the resource",fstyle);
		if (GUILayout.Button("Close"))
		{
			b1 = false;
			bc = true;
		}
		GUILayout.EndArea();
	}
}

function Update () {
	if (Input.touchCount == 1 && bc)
	{
		if (Input.GetTouch(0).phase == TouchPhase.Began)
		{
			hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position),
								-Vector2.up, 1f, 1 << LayerMask.NameToLayer("selection_panel"));
			if (hit.collider != null)
			{
				var obj = hit.collider.gameObject;
				if (obj.name.Substring(0,5) != "shape")
				{
					drag_object = Instantiate(obj);
					drag_object.layer = LayerMask.NameToLayer("drag_layer");
				}	
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
		else if (Input.GetTouch(0).phase == TouchPhase.Ended)
		{
			hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position),
								-Vector2.up, 1f, 1 << LayerMask.NameToLayer("roaming_list"));
			if (hit.collider != null)
			{
				var ob = hit.collider.gameObject;
				var index = ob.name.Substring(5,1);
				if (index == "1" && drag_object.name == "sevak(Clone)")
				{
					Destroy(GameObject.Find(ob.name+"Text"));
					Destroy(ob);
					score++;
					audio.clip = SceneManager.caudio;
					audio.Play();
				}
				else if (index == "2" && drag_object.name == "sevak(Clone)")
				{
					Destroy(GameObject.Find(ob.name+"Text"));
					Destroy(ob);
					score++;
					audio.clip = SceneManager.caudio;
					audio.Play();
				}
				else if (index == "3" && drag_object.name == "gram_panchayat(Clone)")
				{
					Destroy(GameObject.Find(ob.name+"Text"));
					Destroy(ob);
					score++;
					audio.clip = SceneManager.caudio;
					audio.Play();
				}
				else if (index == "4" && drag_object.name == "gram_panchayat(Clone)")
				{
					Destroy(GameObject.Find(ob.name+"Text"));
					Destroy(ob);
					score++;
					audio.clip = SceneManager.caudio;
				}
				else if (index == "5" && drag_object.name == "gram_sabha(Clone)")
				{
					Destroy(GameObject.Find(ob.name+"Text"));
					Destroy(ob);
					score++;
					audio.clip = SceneManager.caudio;
					audio.Play();
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