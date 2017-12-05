/*
Author: Jaswanth
Changes needed: Screen width and height variable should directly be accessed from SceneManager.
Remove SceneManager.init();
Variable name s_line needs change.
DOCUMENTATION NEEDED.
*/

#pragma strict
var sw : int;
var sh : int;
var s_line : LineRenderer;

function Start () {
	SceneManager.init();		//BAD CODE. Needs Change
	
	sw = Screen.width;
	sh = Screen.height;
	s_line = GameObject.Find("Divider").GetComponent(LineRenderer);	
	s_line.SetColors(Color.red, Color.red);
	s_line.material = new Material (Shader.Find("Sprites/Default"));
	s_line.SetWidth(0.2,0.2);
	s_line.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(sw*0.37,0,10)));
	s_line.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(sw*0.37,sh,10)));
	s_line.SetVertexCount(2);
	
	s_line = new GameObject("L1").AddComponent(LineRenderer);	
	s_line.SetColors(Color.black, Color.black);
	s_line.material = new Material (Shader.Find("Sprites/Default"));
	s_line.SetWidth(0.05,0.05);
	s_line.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.3,10)));
	s_line.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(sw,sh*0.3,10)));
	s_line.SetVertexCount(2);
	
	s_line = new GameObject("L2").AddComponent(LineRenderer);	
	s_line.SetColors(Color.black, Color.black);
	s_line.material = new Material (Shader.Find("Sprites/Default"));
	s_line.SetWidth(0.05,0.05);
	s_line.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.47,10)));
	s_line.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(sw,sh*0.47,10)));
	s_line.SetVertexCount(2);
	
	s_line = new GameObject("L1").AddComponent(LineRenderer);	
	s_line.SetColors(Color.black, Color.black);
	s_line.material = new Material (Shader.Find("Sprites/Default"));
	s_line.SetWidth(0.05,0.05);
	s_line.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.60,10)));
	s_line.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(sw,sh*0.60,10)));
	s_line.SetVertexCount(2);

	s_line = new GameObject("L1").AddComponent(LineRenderer);	
	s_line.SetColors(Color.black, Color.black);
	s_line.material = new Material (Shader.Find("Sprites/Default"));
	s_line.SetWidth(0.05,0.05);
	s_line.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.73,10)));
	s_line.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(sw,sh*0.73,10)));
	s_line.SetVertexCount(2);

	s_line = new GameObject("L1").AddComponent(LineRenderer);	
	s_line.SetColors(Color.black, Color.black);
	s_line.material = new Material (Shader.Find("Sprites/Default"));
	s_line.SetWidth(0.05,0.05);
	s_line.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.86,10)));
	s_line.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(sw,sh*0.86,10)));
	s_line.SetVertexCount(2);

	s_line = new GameObject("L1").AddComponent(LineRenderer);	
	s_line.SetColors(Color.black, Color.black);
	s_line.material = new Material (Shader.Find("Sprites/Default"));
	s_line.SetWidth(0.05,0.05);
	s_line.SetPosition(0, Camera.main.ScreenToWorldPoint(new Vector3(0,sh*0.15,10)));
	s_line.SetPosition(1, Camera.main.ScreenToWorldPoint(new Vector3(sw,sh*0.15,10)));
	s_line.SetVertexCount(2);
	
	PlaceObjects(1,2,sw*0.01,sh*0.93,"e");
	PlaceObjects(1,2,sw*0.4,sh*0.93,"p");
	
	PlaceObjects(2,2,sw*0.01,sh*0.80,"e");
	PlaceObjects(2,4,sw*0.4,sh*0.80,"p");

	PlaceObjects(3,2,sw*0.01,sh*0.66,"e");
	PlaceObjects(3,2,sw*0.4,sh*0.66,"p");
	
	PlaceObjects(4,2,sw*0.01,sh*0.54,"e");
	PlaceObjects(4,2,sw*0.4,sh*0.54,"p");
	
	PlaceObjects(5,3,sw*0.01,sh*0.38,"e");
	PlaceObjects(5,3,sw*0.4,sh*0.38,"p");
	
	PlaceObjects(6,2,sw*0.01,sh*0.22,"e");
	PlaceObjects(6,3,sw*0.4,sh*0.22,"p");
	
	PlaceObjects(7,2,sw*0.01,sh*0.08,"e");
	PlaceObjects(7,3,sw*0.4,sh*0.08,"p");
}
function PlaceObjects(ward : int, max_i : int, start_x : int, start_y : int, d : String)
{
	var x : int;
	var obj : GameObject;
	var offset = sw*0.1;
	for (x=1;x<=max_i;x++)
	{
		obj = new GameObject("w"+ward+d+x);
		var sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
		
		var index = ((SceneManager.selected_people_wards[ward-1] as Array)[x-1] as PersonObject).id;
		
		sr.sprite = Resources.Load("person"+index,Sprite) as Sprite;
		var rigid_body = obj.AddComponent("Rigidbody2D") as Rigidbody2D;
		rigid_body.mass = 0;
		rigid_body.drag = 0;
		rigid_body.angularDrag = 0;
		rigid_body.gravityScale = 0;
		rigid_body.fixedAngle = true;
		rigid_body.isKinematic = true;
		obj.AddComponent("BoxCollider2D");
		if (d == "p")
		{
			obj.layer = LayerMask.NameToLayer("roaming_list");
			obj.AddComponent("ElectionLevel3RandomizationScript");	
		}
		else
		{
			obj.layer = LayerMask.NameToLayer("electoral_list");
			
			switch(ward)
			{
				case 1:
					SceneManager.selected_people_electoral_ward_1.push((SceneManager.selected_people_wards[ward-1] as Array)[x-1] as PersonObject);
					break;
				case 2:
					SceneManager.selected_people_electoral_ward_2.push((SceneManager.selected_people_wards[ward-1] as Array)[x-1] as PersonObject);
					break;
				case 3:
					SceneManager.selected_people_electoral_ward_3.push((SceneManager.selected_people_wards[ward-1] as Array)[x-1] as PersonObject);
					break;
				case 4:
					SceneManager.selected_people_electoral_ward_4.push((SceneManager.selected_people_wards[ward-1] as Array)[x-1] as PersonObject);
					break;
				case 5:
					SceneManager.selected_people_electoral_ward_5.push((SceneManager.selected_people_wards[ward-1] as Array)[x-1] as PersonObject);
					break;
				case 6:
					SceneManager.selected_people_electoral_ward_6.push((SceneManager.selected_people_wards[ward-1] as Array)[x-1] as PersonObject);
					break;
				case 7:
					SceneManager.selected_people_electoral_ward_7.push((SceneManager.selected_people_wards[ward-1] as Array)[x-1] as PersonObject);
					break;
			} 
		}
		//	obj = GameObject.Find("w"+ward+d+x);
		obj.transform.position.x = Camera.main.ScreenToWorldPoint(new Vector3(start_x+offset,0,0)).x;
		obj.transform.position.y = Camera.main.ScreenToWorldPoint(new Vector3(0,start_y,0)).y;
		offset += sw*0.1;
	}
}