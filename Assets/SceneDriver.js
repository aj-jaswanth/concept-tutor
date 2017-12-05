#pragma strict
var valid : boolean;
var sw : int;
var sh : int;
var s_line : LineRenderer;
var content : GUIContent;					
var next_button_image : Texture2D;			// Background image of button Next
var index : int;
var gui_ques_style : GUIStyle;
var drag_object : GameObject;
var hit : RaycastHit2D;
var ray : Ray2D;
var score : int;
var placed : boolean;
var node : XMLNode;
var tnoq : int;
var question : String;
var answer : String;
var gameOver : boolean;
var role1 : String;
var role2 : String;
var role3 : String;
var role4 : String;
var fstyle : GUIStyle;
var b1 : boolean;
var bc : boolean;
var text : String;
function get_id(role : String)
{
	switch(role)
	{
	case "sarpanch":
		return SceneManager.sarpanch_index;
		break;
	case "up-sarpanch":
		return SceneManager.upsarpanch_index;
		break;
	case "panch":
		return SceneManager.panch_index;
		break;
	case "sevak":
		return SceneManager.sevak_index;
		break;
	case "gram_panchayat":
		return 100;
		break;
	case "gram_sabha":
		return 101;
		break;
	case "volunteers":
		return 102;
		break;
	}
}
function Start () {
	bc = false;
	b1 = true;
	var c = Resources.Load(SceneManager.file_to_load) as TextAsset;
	var parser = new XMLParser();
	node = parser.Parse(c.text);
	tnoq = int.Parse(node.GetValue("questions>0>tnoq>0>_text"))-1;
	question = node.GetValue("questions>0>question>"+index+">q>0>_text");
	answer = node.GetValue("questions>0>question>"+index+">ans>0>_text");
	valid = true;
	placed = false;
	score = 0;
	drag_object = null;
	index = 0;
	sw = Screen.width;
	sh = Screen.height;
	next_button_image = Resources.Load("NextButton") as Texture2D;
	content.image = next_button_image;
	s_line = GameObject.Find("Divider").GetComponent(LineRenderer);	
	s_line.SetColors(Color.green, Color.green);
	s_line.material = new Material (Shader.Find("Sprites/Default"));
	s_line.SetWidth(0.3,0.3);
	s_line.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(sw*0.55,0,10)));
	s_line.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(sw*0.55,sh,10)));
	s_line.SetVertexCount(2); 
	
	role1 = "person"+get_id(node.GetValue("questions>0>roles>0>role>0>_text"))+"_large";
	role2 = "person"+get_id(node.GetValue("questions>0>roles>0>role>1>_text"))+"_large";
	role3 = "person"+get_id(node.GetValue("questions>0>roles>0>role>2>_text"))+"_large";
	role4 = "person"+get_id(node.GetValue("questions>0>roles>0>role>3>_text"))+"_large";
	
	var obj = new GameObject(node.GetValue("questions>0>roles>0>role>0>_text"));
	var sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
	sr.sprite = Resources.Load(role1,Sprite) as Sprite;
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
	obj.transform.localScale = Vector3(0.5,0.5,0.5);

	obj = new GameObject(node.GetValue("questions>0>roles>0>role>1>_text"));
	sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
	sr.sprite = Resources.Load(role2,Sprite) as Sprite;
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
	obj.transform.localScale = Vector3(0.5,0.5,0.5);
	
	obj = new GameObject(node.GetValue("questions>0>roles>0>role>2>_text"));
	sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
	obj.transform.localScale = new Vector3(0.1,0.1,0.1);
	sr.sprite = Resources.Load(role3,Sprite) as Sprite;
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
	obj.transform.localScale = Vector3(0.5,0.5,0.5);
	
	obj = new GameObject(node.GetValue("questions>0>roles>0>role>3>_text"));
    sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
    obj.transform.localScale = new Vector3(0.1,0.1,0.1);
	sr.sprite = Resources.Load(role4,Sprite) as Sprite;
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
	obj.transform.localScale = Vector3(0.5,0.5,0.5);
		
	obj = GameObject.Find("empty");
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.25,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.4,0)).y;
	obj.transform.localScale = Vector3(2,2,2);
	switch(SceneManager.file_to_load)
	{
		case "record_maintenance":
			text = "The  new gram panchayat is being formed. The last census of village was done   around 6 years  back. The new panchayat  has new budget, new vision and new mission. In order to reallocate the existing resources and also to generate new resources, they need the economic background of the villagers. Let us help the Gram panchayat in creating the record of the individuals of  BPL list. We should assign the right task to the right people to  complete our task.  \n\nLook at the task. Approach the  appropriate members of Gram sabha. Drag and drop the right person in the white box";
		break;
		case "waste_management":
			text = "Most of the villagers use wood from the forest as cooking fuel.  Wood when burns, released harmful gases which affect our health adversely. The gram Panchayat is promoting the villagers to setup a biogas plant which is a renewal source of energy  and is used for cooking purposes. The biogas plant  is based on cattle dung and other household organic wastes. The gas generated  mainly caters cooking and the byproduct ,bio-fertilizer, can be used in the farms for better quality of crop production. Please help the villagers  to set up the biogas plant in their farms by pointing there questions to the right person.\n\nLook at the task. Approach the  appropriate members of Gram sabha. Drag and drop the right person in the white box";
		break;
		case "environment_protection":
			text = "Most of the villagers use wood from the forest as cooking fuel.  Wood when burns, released harmful gases which affect our health adversely. The gram Panchayat is promoting the villagers to setup a biogas plant which is a renewal source of energy  and is used for cooking purposes. The biogas plant  is based on cattle dung and other household organic wastes. The gas generated  mainly caters cooking and the byproduct ,bio-fertilizer, can be used in the farms for better quality of crop production. Please help the villagers  to set up the biogas plant in their farms by pointing there questions to the right person.\n\nLook at the task. Approach the  appropriate members of Gram sabha. Drag and drop the right person in the white box";
		break;
	}
}

function OnGUI()
{
	GUI.Box(new Rect(sw*0.63,sh*0.18,sw*0.12,sh*0.08),node.GetValue("questions>0>roles>0>role>0>_text"));
	GUI.Box(new Rect(sw*0.8,sh*0.18,sw*0.19,sh*0.08),node.GetValue("questions>0>roles>0>role>1>_text"));
	GUI.Box(new Rect(sw*0.63,sh*0.58,sw*0.12,sh*0.08),node.GetValue("questions>0>roles>0>role>2>_text"));
	GUI.Box(new Rect(sw*0.8,sh*0.58,sw*0.16,sh*0.08),node.GetValue("questions>0>roles>0>role>3>_text"));
	GUI.Box(new Rect(sw*0.6,0,sw*0.15,sh*0.13),"Score\n"+score+"/"+(tnoq+1));
	if (bc && !gameOver && GUI.Button(new Rect(sw*0.84,0,sw*0.15,sh*0.10),content))
	{
		placed = false;
		index++;
		Debug.Log(index);
		if (drag_object != null)
			Destroy(drag_object);
		if (index > tnoq)
		{
			gameOver = true;
		}
		else
		{
			question = node.GetValue("questions>0>question>"+index+">q>0>_text");
			answer = node.GetValue("questions>0>question>"+index+">ans>0>_text");
			GameObject.Find("empty").GetComponent(SpriteRenderer).renderer.enabled = true;
			Destroy(drag_object);
		}
	}
	if (gameOver)
	{
		if (drag_object != null)
			Destroy(drag_object);
		if(GUI.Button(new Rect(sw*0.1,sh*0.5,sw*0.4,sh*0.08),"Game Over!"))
		{
			Application.LoadLevel("MainMenu");
		}
	}
	GUI.Label(new Rect(sw*0.05,sh*0.2,sw*0.45,sh*0.3),question,gui_ques_style);
	if (b1)
	{
		GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
		GUILayout.Box(text,fstyle);
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
				drag_object = Instantiate(hit.collider.gameObject);
				drag_object.layer = LayerMask.NameToLayer("drag_layer");
			}
		}
		else if (Input.GetTouch(0).phase == TouchPhase.Moved)
		{
			if (drag_object != null && !placed)
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
								-Vector2.up, 1f, 1 << LayerMask.NameToLayer("blank_layer"));
			if (hit.collider != null)
			{
				if (drag_object.name == answer +"(Clone)")
				{
					audio.clip = SceneManager.caudio;
					audio.Play();
					hit.collider.gameObject.GetComponent(SpriteRenderer).renderer.enabled = false;
					drag_object.transform.position = hit.collider.gameObject.transform.position;
					drag_object.GetComponent(SpriteRenderer).color = Color.green;
					score++;
					placed = true;
				}
				else
					{
					audio.clip = SceneManager.waudio;
					audio.Play();
					}
			}
			if (drag_object != null && !placed)
				Destroy(drag_object);
		}
	}	
}