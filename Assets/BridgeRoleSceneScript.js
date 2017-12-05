#pragma strict
var sw : int;
var sh : int;
var hit : RaycastHit2D;
var ray : Ray2D;
var object : GameObject;
var b1 : boolean;
var b2 : boolean;
var bc : boolean;
var fstyle : GUIStyle;
function Start () {
	b1 = true;
	b2 = false;
	bc = false;
	sw = Screen.width;
	sh = Screen.height;
	var obj = GameObject.FindGameObjectWithTag("sarpanch");
	(obj.GetComponent("SpriteRenderer") as SpriteRenderer).sprite = Resources.Load("person"+SceneManager.sarpanch_index+"_large",Sprite);
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.2,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.4,0)).y;
	
	obj = GameObject.FindGameObjectWithTag("panch");
	(obj.GetComponent("SpriteRenderer") as SpriteRenderer).sprite = Resources.Load("person"+SceneManager.panch_index+"_large",Sprite);
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.5,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.4,0)).y;
	
	obj = GameObject.FindGameObjectWithTag("sevak");
	(obj.GetComponent("SpriteRenderer") as SpriteRenderer).sprite = Resources.Load("person"+SceneManager.sevak_index+"_large",Sprite);
	obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.9,0,0)).x;
	obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.4,0)).y;
}

function Update () {
	if (Input.touchCount == 1 && bc)
	{
		if (Input.GetTouch(0).phase == TouchPhase.Began)
		{
			hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position),
								-Vector2.up, 1f, 1 << LayerMask.NameToLayer("Default"));
			if (hit.collider != null)
			{
				audio.clip = SceneManager.caudio;
				audio.Play();
				object = hit.collider.gameObject;
				SceneManager.selected_role = object.tag;
				if (object.tag == "sarpanch")
					SceneManager.file_to_load = "bridge_sarpanch";
				else if (object.tag == "panch")
					SceneManager.file_to_load = "bridge_panch";
				else if (object.tag == "sevak")
					SceneManager.file_to_load = "bridge_sevak";
				Application.LoadLevel("BridgeMCQScene");
			}
		}
	}
}

function OnGUI()
{
	GUI.Label(new Rect(sw*0.15,sh*0.3,sw*0.1,sh*0.1),"Sarpanch");
	GUI.Label(new Rect(sw*0.48,sh*0.3,sw*0.1,sh*0.1),"Panch");
	GUI.Label(new Rect(sw*0.88,sh*0.3,sw*0.1,sh*0.1),"Sevak");
	GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
	if (b1)
	{
		GUILayout.Box("You can address to the issue by acquiring any one of the three  roles  and behave as they would do, to  earn  a water resource for their village.\n\nClick on the character to select the role. ",fstyle);	
		if (GUILayout.Button("Close"))
		{
			b1 = false;
			b2 = true;
		}
	}
	if (b2)
	{
		GUILayout.Box("As a Surpanch, you have the right to take the final decisions. You will be the head of all the  village meetings. The village meetings are referred to as Gram Sabha.",fstyle);
		GUILayout.Box("As a Panch and members of Gram Panchayat,  you will be involved in the decision makings in all the   Gram Sabha -the  village meetings. Along with your ward  you  will also address to the  entire village problems. ",fstyle);
		GUILayout.Box("As a gram Sevak you work as a secretary to the Gram Panchayat. You are an important link between the Government and the villagers. You maintain all the records for the village.  One of your task is also to educate the village about the various government schemes. ",fstyle);
		if (GUILayout.Button("Close"))
		{
			b2 = false;
			bc = true;
		}
	}
	GUILayout.EndArea();
}