#pragma strict
var sw : int;
var sh : int;
var next_button_image : Texture2D;			// Background image of button Next
var content : GUIContent;					
var question : int;							// The present question number
var custom_question_style : GUIStyle;		// Customized gui controls
var custom_option_style : GUIStyle;
var custom_option_style2 : GUIStyle;
var custom_gui_skin : GUISkin; 				// GUISkin for toggle
var answers : Array;						// Answers of each question
var node : XMLNode;							// XMLNode contains an array representation of all child nodes.
var index : int;											// See XMLParser.js or http://dev.grumpyferret.com/unity/
var z : int;
var showNextButton : boolean;
var actual_answers : Array;
var tnoq : int;								// Total number of questions in a quiz
var score = 0;
var valid : boolean;						// Determines whether to create bulb objects or not
var gameOver = false;
var sprite_ord : Sprite; 					// Ordinary bulb image
var sprite_glow : Sprite;					// Glowing bulb image
var sprite_red : Sprite;
var sprite_green : Sprite;
var selected_obj : GameObject;				// Selected option (bulb)
var hit : RaycastHit2D;
var ray : Ray2D;
var total_option_num : int;					// Total number of options in a question
var x : int;
function Start()
{
	valid = true;
	selected_obj = null;
	sprite_ord = Resources.Load("White-Bulb",Sprite) as Sprite;
	sprite_glow = Resources.Load("Yellow-Bulb",Sprite) as Sprite;
	sprite_green = Resources.Load("Green-Bulb",Sprite) as Sprite;
	sprite_red = Resources.Load("Red-Bulb",Sprite) as Sprite;
	actual_answers = new Array();
	answers = new Array();
	showNextButton = true;
	question = 1;
	sw = Screen.width;
	sh = Screen.height;
	next_button_image = Resources.Load("NextButton");
	content.image = next_button_image;
	node = FileParser.read();
	tnoq = int.Parse(node.GetValue("questions>0>tnoq>0>_text")); // Fetch the number of questions in the quiz
}

function OnGUI () {	
	if(showNextButton && GUI.Button(Rect(sw*0.85,0,sw*0.15,sh*0.1),content) && selected_obj != null)
	{
		if (question == tnoq)
			gameOver = true;
		for (x=0;x<total_option_num;x++)
			Destroy(GameObject.Find("Bulb_"+(x+1))); 
		valid = true;
		z = question;
		actual_answers.push(int.Parse(node.GetValue("questions>0>question>"+(z-1)+">ans>0>_text")));
   		answers.push(int.Parse(selected_obj.name.Split("_"[0])[1]));
		if (answers[z-1] == actual_answers[z-1])
			{
			score++;
			selected_obj.GetComponent(SpriteRenderer).sprite = sprite_green;
			audio.clip = SceneManager.caudio;
			audio.Play();
			}
		else
			{
			selected_obj.GetComponent(SpriteRenderer).sprite = sprite_red;
			audio.clip = SceneManager.waudio;
			audio.Play();
			}
		var seconds = 1;
	/*	do{
		seconds -= 1 * Time.deltaTime;
		}while(seconds <= 0); */
		question++;
	}
	GUI.Box(new Rect(sw*0.5,sh*0.05,sw*0.2,sh*0.1),"Sore Board\n  "+score+" / "+tnoq); // Draw the score box
	GUILayout.BeginArea(new Rect(sw*0.1,sh*0.2,sw*0.9,sh*0.9));
	if (gameOver)				// If all questions are completed
	{
		showNextButton = false;
		GUILayout.Box("Game Over!");
		if (GUILayout.Button("Ok"))
		{
			Application.LoadLevel("MainMenu");
		}	
	}
	else
	{
		GUILayout.Label(question+". "+node.GetValue("questions>0>question>"+z+">q>0>_text"),custom_question_style); // Display Question
		total_option_num = int.Parse(node.GetValue("questions>0>question>"+z+">tnopt>0>_text"));
		GUILayout.BeginHorizontal();
		var factor = 0;
		for (var x=0;x<total_option_num;x++)	// Generate given options
		{
			if (valid)
			{
				var obj = new GameObject("Bulb_"+(x+1));
				obj.layer = LayerMask.NameToLayer("Bulb Layer");
			//	obj.transform.localScale = new Vector3(2,2,2);
				var sr = obj.AddComponent("SpriteRenderer") as SpriteRenderer;
				sr.sprite = sprite_ord;
				obj.transform.position = Camera.main.ScreenToWorldPoint(new Vector3(sw*0.2+factor,sh*0.4,10));
				var rigid_body = obj.AddComponent("Rigidbody2D") as Rigidbody2D;
				rigid_body.mass = 0;
				rigid_body.drag = 0;
				rigid_body.angularDrag = 0;
				rigid_body.gravityScale = 0;
				rigid_body.fixedAngle = true;
				rigid_body.isKinematic = true;
				obj.AddComponent("BoxCollider2D");
				if (x == total_option_num-1)
					valid = false;
			}
			GUI.Box(new Rect(factor+sw*0.06,sh*0.27,sw*0.11,sh*0.4),node.GetValue("questions>0>question>"+z+">opt>"+x+">_text"),custom_option_style2);
			factor += 0.22*sw;
		}
		GUILayout.EndHorizontal();
	}
	GUILayout.EndArea();
}

function Update()
{
	if (Input.touchCount == 1)
	{
		if (Input.GetTouch(0).phase == TouchPhase.Began)
		{
			hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position),
								-Vector2.up, 1f, 1 << LayerMask.NameToLayer("Bulb Layer"));
			if (hit.collider != null)
			{
				var obj = hit.collider.gameObject;
				obj.GetComponent(SpriteRenderer).sprite = sprite_glow;
			//	obj.transform.localScale = Vector3(2,2,2);
				if (selected_obj != null && selected_obj != obj)
					selected_obj.GetComponent(SpriteRenderer).sprite = sprite_ord;
				selected_obj = obj;
			}
		}	
	}
}