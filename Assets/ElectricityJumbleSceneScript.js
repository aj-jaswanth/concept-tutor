#pragma strict

var sw : int;
var sh :int;
var hit : RaycastHit2D;
var hit1 : RaycastHit2D;
var ray : Ray2D;
var obj1 : GameObject;
var obj2 : GameObject;
var alpha_count : int;
var cur_alpha : GameObject;
var cur_alpha_list : Array;
var str : String;
var spriterenderer : SpriteRenderer;
var margin : int;
var box_size : int;
var i : int;
var k : int;
var x : int;
var y : int;
var randomNumbers : Array;
var cur_blank : GameObject;
var cur_blank_list : Array;
var electricity_letters_attribute : ElectricityLettersAttribute; 
var electricity_blank_attribute : ElectricityBlankAttribute;
static var r : int;
static var tmp : int;
var layer : int;
var count : int;
var pos1 : Vector3;
var pos2 : Vector3;
var scr : int;
var showGUI : boolean;
var show_wrong : boolean;
static var j : int;
var ar : Array;
var arnum : Array;
var ques : Array;
var ans : Array;
var val : boolean;
var score : int = 0;
var noq : int;
var style : GUIStyle;
var node : XMLNode;
var b1 : boolean;
var fstyle : GUIStyle;
var success : int;
var village_non_drag_component : VillageNonDragComponent;
var flag : int;

function Start () {
success = 0;
b1 = true;
sh = Screen.height;
sw = Screen.width;
margin = sh * 0.015;
box_size = sw/20f;
count = 0;

showGUI = false;
show_wrong = false;

var c = Resources.Load(SceneManager.file_to_load) as TextAsset;
var parser = new XMLParser();
node = parser.Parse(c.text);
noq = int.Parse(node.GetValue("questions>0>no.>0>_text"));
val = true;
k = 0;
}

function Update () {

if( val == true && !b1)
{
str = node.GetValue("questions>0>question>"+k+">ans>0>_text");
x = (sw - ((box_size * str.Length + margin * (str.Length - 1))))/2f + box_size*0.75;
y = sh/8f;
Debug.Log(str);
Debug.Log(str.Length);

cur_alpha_list = new Array();
for( i = 0; i<str.Length ; i++)
{
	var ch = str[i];
	Debug.Log(ch);
	cur_alpha = new GameObject(ch+"");
	cur_alpha_list.push(cur_alpha);
	electricity_letters_attribute = cur_alpha.AddComponent("ElectricityLettersAttribute");
	electricity_letters_attribute.num = ch;
	spriterenderer = cur_alpha.AddComponent("SpriteRenderer");
	spriterenderer.sprite = Resources.Load("image"+ch, Sprite);
	cur_alpha.AddComponent("Rigidbody2D");
	cur_alpha.rigidbody2D.gravityScale = 0;
	cur_alpha.rigidbody2D.fixedAngle = true;
	cur_alpha.rigidbody2D.mass = 0;
	cur_alpha.rigidbody2D.angularDrag = 0;
	cur_alpha.rigidbody2D.isKinematic = true;
	cur_alpha.AddComponent("BoxCollider2D");
	cur_alpha.layer = LayerMask.NameToLayer("unused_alpha_layer");
}

randomNumbers = new Array();
	for ( i = 0; i < str.Length; i++)
	{	
		randomNumbers[i] = i;
	}	
RandomizeArray(randomNumbers);
RandomizeArray(randomNumbers);
RandomizeArray(randomNumbers);

for ( i = 0; i < str.Length; i++)
{	
	(cur_alpha_list[randomNumbers[i]] as GameObject).transform.position = Camera.main.ScreenToWorldPoint(Vector3( x + i*(box_size+margin), y, 0)); 
	(cur_alpha_list[randomNumbers[i]] as GameObject).transform.position.z = 0;
}

cur_blank_list = new Array();
for( i = 0; i<str.Length ; i++)
{
	cur_blank = new GameObject();
	electricity_blank_attribute = cur_blank.AddComponent("ElectricityBlankAttribute");
	electricity_blank_attribute.pos = str[i];
	cur_blank.layer = LayerMask.NameToLayer("blank_unlocked_layer");
	cur_blank_list.push(cur_blank);
	spriterenderer = cur_blank.AddComponent("SpriteRenderer");
	spriterenderer.sprite = Resources.Load("image", Sprite);
	cur_blank.AddComponent("Rigidbody2D");
	cur_blank.rigidbody2D.gravityScale = 0;
	cur_blank.rigidbody2D.fixedAngle = true;
	cur_blank.rigidbody2D.mass = 0;
	cur_blank.rigidbody2D.angularDrag = 0;
	cur_blank.rigidbody2D.isKinematic = true;
	cur_blank.AddComponent("BoxCollider2D");
	(cur_blank_list[i] as GameObject).transform.position = Camera.main.ScreenToWorldPoint(Vector3(x + i * (margin+box_size), 3*y, 0));
	(cur_blank_list[i] as GameObject).transform.position.z = 0;
}
val = false;
}

if(Input.touchCount == 1 && !b1)
{
	if(Input.GetTouch(0).tapCount == 1)
	{
		switch(Input.GetTouch(0).phase)
		{
		case TouchPhase.Began:
			//obj1 = null;
			show_wrong = false;
			hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position), -Vector2.up, 1f,1 << LayerMask.NameToLayer("unused_alpha_layer"));
			if(hit.collider != null)
			{
				obj1 = hit.collider.gameObject;
				electricity_letters_attribute = obj1.GetComponent("ElectricityLettersAttribute");
				/*if(electricity_letters_attribute.is_positioned == 1)
				{
					break;
				}*/
				pos1.y = obj1.transform.position.y; 
				pos1.x = obj1.transform.position.x; 
				pos1.z = 0;
			}
			break;
								
		case TouchPhase.Moved:
			if (obj1 != null)
			{
				/*if(electricity_letters_attribute.is_positioned == 1)
					break;*/
				var pos : Vector3;
				pos.x = Input.GetTouch(0).position.x;
				pos.y = Input.GetTouch(0).position.y;
				pos.z  = 0;
				obj1.transform.position = Camera.main.ScreenToWorldPoint(pos);
				obj1.transform.position.z = 0;
			}
			break;
				
		case TouchPhase.Ended:
			//if (obj1 == null) return;
			if(obj1 != null)
			{
				hit = Physics2D.Raycast(Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position), -Vector2.up, 1f,1 <<  LayerMask.NameToLayer("blank_unlocked_layer"));
				if(hit.collider != null /*&& hit1.collider == null*/)
				{
					obj2 = hit.collider.gameObject;
					electricity_letters_attribute = obj1.GetComponent("ElectricityLettersAttribute");
					electricity_blank_attribute = obj2.GetComponent("ElectricityBlankAttribute");
					pos2.y = obj2.transform.position.y; 
					pos2.x = obj2.transform.position.x; 
					pos2.z = 0;
					//if(electricity_blank_attribute.is_occupied == 0)
					//{ 
						if(electricity_letters_attribute.num == electricity_blank_attribute.pos)
						{
							audio.clip = SceneManager.caudio;
							audio.Play();
							scr++;
							count++;
							//electricity_letters_attribute.is_positioned = 1;
							//electricity_blank_attribute.is_occupied = 1;
							obj2.layer = LayerMask.NameToLayer("blank_locked_layer");
							obj1.layer = LayerMask.NameToLayer("used_alpha_layer");
							obj1.transform.position = pos2;
						}
						else
						{
							audio.clip = SceneManager.waudio;
							audio.Play();
							//scr--;
							show_wrong = true;
							obj1.transform.position = pos1;
						}
					//}
					//else if(electricity_blank_attribute.is_occupied == 1)
					//	obj1.transform.position = pos1;
										
					if(count == str.Length)
					{
						showGUI = true;
					}	
				}
				else
					obj1.transform.position = pos1;
				obj1 = null;
			}
		}
	}
}
}

static function RandomizeArray(arr : Array)
{
for(j = arr.length - 1; j > 0; j--)
{
	r = Random.Range(0,j);
    tmp = arr[j];
    arr[j] = arr[r];
    arr[r] = tmp;
}
}

function OnGUI()
{
if (b1)
{
	GUILayout.BeginArea(new Rect(sw*0.1,sh*0.1,sw*0.8,sh*0.8));
	GUILayout.Box("Unscramble the word to get the correct response. And move ahead to earn the resource. .",fstyle);
	if (GUILayout.Button("Close"))
	{
		b1 = false;
	}
	GUILayout.EndArea();
}
if(show_wrong)
{
	GUI.Box(Rect ((sw-150)/2f,(sh-25)/2f,100,25), "wrong attempt");
}
if(showGUI)
{
	GUI.Box(Rect ((sw-150)/2f,(sh-25)/2f,100,25), "correct answer");
}

if(GUI.Button(Rect(sw-100,0,100,40), "Next"))
{
showGUI = false;
if(scr == str.Length)
{
	success++;
}
++k;
score+=scr;
scr = 0;
count = 0;
	if(k<noq)
		val = true;
	
	for(i=0;i<str.Length;i++)
	{
		Destroy(cur_alpha_list[i] as GameObject);
		Destroy(cur_blank_list[i] as GameObject);
	}
}

if(k<noq)
{
	GUI.Box(Rect(sw/2f-50,0,100,40), "score:"+success+"/5");
	GUILayout.BeginArea(new Rect(sw*0.05,sh*0.2,sw*0.9,3*sh/8f));
	GUILayout.Label((k+1)+". "+node.GetValue("questions>0>question>"+k+">ques>0>_text"),style);
	GUILayout.EndArea();
}

if(k >= noq)
{
	GUI.Box(Rect(sw/2f-50,sh/2f-45,100,45), "final score:"+score);
	if(GUI.Button(Rect(sw/2f-50,sh*0.8,60,40), "ok"))
	{
		//Application.LoadLevel("MainMenu");
		if(success != 5)
				Application.LoadLevel("MainMenu");
		else
		{
			
			flag = 0;
			for(i=0;i<SceneManager.village_non_drag_components_list.length;i++)
			{
				village_non_drag_component = SceneManager.village_non_drag_components_list[i];
				if(village_non_drag_component.name == "wind_farm")
				{
					flag = 1;
					break;
				}
			}
			if(flag==0)
			{
				village_non_drag_component = new VillageNonDragComponent();
				village_non_drag_component.name = "wind_farm";
				village_non_drag_component.image = "wind_farm";
				village_non_drag_component.icon = "wind_farm_icon";
				SceneManager.village_non_drag_components_list.push(village_non_drag_component);
				SceneManager.village_component_unlocked = "wind_farm";
				SceneManager.num_allowed_village_components = 1;
				Application.LoadLevel("CreateVillageScene1");
			}
			else
			{
				Application.LoadLevel("MainMenu");
			}
		}
	}
}
}
