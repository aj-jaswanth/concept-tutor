#pragma strict
var sw : int;
var sh : int;
var hit : RaycastHit2D;
var ray : Ray2D;
var object : GameObject;
var obj1 : GameObject;
var obj2 : GameObject;
var obj3 : GameObject;
var spriterenderer : SpriteRenderer;
var b1 : boolean;
var b2 : boolean;
var bc : boolean;
var fstyle : GUIStyle;
function Start () {
	sw = Screen.width;
	sh = Screen.height;
	b1 = true;
	b2 = false;
	bc = false;
	obj1 = new GameObject("sar");
	spriterenderer = obj1.AddComponent("SpriteRenderer");
	spriterenderer.sprite = Resources.Load("person"+SceneManager.sarpanch_index+"_large", Sprite);				//NEEDS CHANGE
	obj1.AddComponent("Rigidbody2D");
	obj1.rigidbody2D.gravityScale = 0;
	obj1.rigidbody2D.fixedAngle = true;
	obj1.rigidbody2D.mass = 0;
	obj1.rigidbody2D.angularDrag = 0;
	obj1.AddComponent("BoxCollider2D");
	obj1.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.2,0,0)).x;
	obj1.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.4,0)).y;
	obj1.transform.position.z = 0;
	
	obj2 = new GameObject("pan");
	spriterenderer = obj2.AddComponent("SpriteRenderer");
	spriterenderer.sprite = Resources.Load("person"+SceneManager.panch_index+"_large", Sprite);				//NEEDS CHANGE
	obj2.AddComponent("Rigidbody2D");
	obj2.rigidbody2D.gravityScale = 0;
	obj2.rigidbody2D.fixedAngle = true;
	obj2.rigidbody2D.mass = 0;
	obj2.rigidbody2D.angularDrag = 0;
	obj2.AddComponent("BoxCollider2D");
	obj2.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.5,0,0)).x;
	obj2.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.4,0)).y;
	obj2.transform.position.z = 0;
	
	obj3 = new GameObject("gs");
	spriterenderer = obj3.AddComponent("SpriteRenderer");
	spriterenderer.sprite = Resources.Load("person"+SceneManager.sevak_index+"_large", Sprite);					//NEEDS CHANGE
	obj3.AddComponent("Rigidbody2D");
	obj3.rigidbody2D.gravityScale = 0;
	obj3.rigidbody2D.fixedAngle = true;
	obj3.rigidbody2D.mass = 0;
	obj3.rigidbody2D.angularDrag = 0;
	obj3.AddComponent("BoxCollider2D");
	obj3.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.9,0,0)).x;
	obj3.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.4,0)).y;
	obj3.transform.position.z = 0;
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
				if (object.name == "sar")
					SceneManager.file_to_load = "electricity_sarpanch";
				else if (object.name == "pan")
					SceneManager.file_to_load = "electricity_panch";
				else if (object.name == "gs")
					SceneManager.file_to_load = "electricity_sevak";
				Application.LoadLevel("ElectricityJumbleScene");
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
		GUILayout.Box("You can address to the issue by acquiring any one of the three  roles  and behave as they would do, to  earn  a water resource for their village.\n\nClick on the character to select the role.",fstyle);
		if (GUILayout.Button("Close"))
		{
			b1 = false;
			b2 = true;
		}
	}
	if (b2)
	{
		GUILayout.Box("As a Surpanch, you have the right to take the final decisions. You will be the head of all the  village meetings. The village meetings are referred to as Gram Sabha. ",fstyle);
		GUILayout.Box("As a Panch and members of Gram Panchayat,  you will be involved in the decision makings in all the   Gram Sabha -the  village meetings. Along with your ward  you  will also address to the  entire village problems.",fstyle);
		GUILayout.Box("As a gram Sevak you work as a secretary to the Gram Panchayat. You are an important link between the Government and the villagers. You maintain all the records for the village.  One of your task is also to educate the village about the various government schemes.",fstyle);
		if (GUILayout.Button("Close"))
		{
			bc = true;
			b2 = false;	
		}
	}
	GUILayout.EndArea();
}