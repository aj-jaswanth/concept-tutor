#pragma strict
import System;
import System.IO;
import System.IO.Stream;
import System.Runtime.Serialization;
import System.Runtime.Serialization.Formatters.Binary;

public static class SceneManager
{
	//***************************************DIMENSIONS**************************************************
	var screen_width : int;					//Stores the value of the screen width
	var screen_height : int;				//Stores the value of the screen height
	var margin : int;						//Stores the value of the margin calculated. 
	var box_size : int;						//Standard box size followed in the game.
	var title_bar_height : int;				//Height of the top title bar.
	var intro_msg_box_width : int;			//Width of the introduction message box.
	var intro_msg_box_height : int;			//Height of the introduction message box.
	//***************************************************************************************************
	public var caudio = UnityEngine.Resources.Load("correct_answer",AudioClip);
	public var waudio = UnityEngine.Resources.Load("wrong_answer",AudioClip);	
	public var intro_scene_text : String = "Welcome text comes here.";
	public var create_village_scene1_text : String = "Place 2 houses.";
	
	public var village_game_objects = new Array();
	public var line_points = new Array();
	public var line : LineRenderer;
	public var line_id = new Array();
	public var colors = [Color.grey, Color.cyan];
	public var selected_people_election_1 = new Array();
	
	public var num_wards : int = 7;
	
	public var ward1_population : int = 203;
	public var ward2_population : int = 311;
	public var ward3_population : int = 147;
	public var ward4_population : int = 110;
	public var ward5_population : int = 239;
	public var ward6_population : int = 201;
	public var ward7_population : int = 196;
	
	public var selected_people_age_ward_1 = new Array();
	public var selected_people_age_ward_2 = new Array();
	public var selected_people_age_ward_3 = new Array();
	public var selected_people_age_ward_4 = new Array();
	public var selected_people_age_ward_5 = new Array();
	public var selected_people_age_ward_6 = new Array();
	public var selected_people_age_ward_7 = new Array();
	
	public var selected_people_electoral_ward_1 = new Array();
	public var selected_people_electoral_ward_2 = new Array();
	public var selected_people_electoral_ward_3 = new Array();
	public var selected_people_electoral_ward_4 = new Array();
	public var selected_people_electoral_ward_5 = new Array();
	public var selected_people_electoral_ward_6 = new Array();
	public var selected_people_electoral_ward_7 = new Array();
	
	public var selected_election_ward_1 : PersonObject;
	public var selected_election_ward_2 : PersonObject;
	public var selected_election_ward_3 : PersonObject;
	public var selected_election_ward_4 : PersonObject;
	public var selected_election_ward_5 : PersonObject;
	public var selected_election_ward_6 : PersonObject;
	public var selected_election_ward_7 : PersonObject;
	
	public var selected_count = 0;
	public var list = new Array();
	public var filledE = [false,false,false,false,false,false,false,false,false,false];
	public var posE = ["","","","","","","","","",""];
	public var posB = [false,false,false,false,false,false,false,false,false,false];
	public var water_intro_sarpanch_text = "Sarpanch text comes here.";
	public var file_to_load = "record_maintenance";
	public var selected_role : String;
	
	var node : XMLNode;							// XMLNode contains an array representation of all child nodes.
	public var village_components_file = "village_components";
	public var village_non_drag_components_list = new Array();
	public var village_drag_components_list = new Array();
	
	public var initial_create_village : boolean;
	public var village_component_unlocked : String = "";
	public var num_allowed_village_components : int;
	public var create_village_intro_msg_txt : String;
	public var create_village_intro_msg_1 : String= "Place 2 houses";
	public var create_village_intro_msg_2 : String= "Place 3 trees";
	public var create_village_intro_msg_3 : String= "Place 3 animals";
	public var create_village_intro_msg_4 : String= "Place 2 vehicles";
	public var create_village_intro_msg_5 : String= "Draw a road";
	public var create_village_scene_num : int;
	public var create_village_display_intro_msg : boolean;
	
	public var main_menu_item_objects_list = new Array();
	public var main_menu_item_object : MainMenuItemObject;
	public var matching_scene_name : String;

	public var votes = [1,2,1,3,0,0,0];
	public var priority = [3,3,3,3,3,3,3];
	public var ward : int = 1;		
	public var selected_election_ward_list = new Array();
	
	public var sarpanch_index : int;
	public var upsarpanch_index : int;
	public var panch_index : int;
	public var sevak_index = 9;
	//*******************************************BAD CODE******************************************************
	//Code by Jaswanth for election level 3. Needs changing.
	public var selected_people_wards = new Array();
	function init()
	{
		selected_people_wards.push(selected_people_age_ward_1);
		selected_people_wards.push(selected_people_age_ward_2);
		selected_people_wards.push(selected_people_age_ward_3);
		selected_people_wards.push(selected_people_age_ward_4);
		selected_people_wards.push(selected_people_age_ward_5);
		selected_people_wards.push(selected_people_age_ward_6);
		selected_people_wards.push(selected_people_age_ward_7);
	}
	//**********************************************************************************************************

	public function Initialize()
	{
		//CALCULATION OF VARIOUS DIMENSIONS
		screen_width = Screen.width;
		screen_height = Screen.height;
		margin = screen_height * 0.0125;	
		box_size = screen_height * 0.125;
		title_bar_height = screen_height * 0.0625;
		intro_msg_box_width = screen_width - 2 * margin;
		intro_msg_box_height = screen_height * 0.5;		
		
		//READING AND STORING VILLAGE COMPONENTS
		node = FileParser.read_village_components();
		var nodes_list : XMLNodeList;
		//Non drag to draw components
		nodes_list = node.GetNodeList("village_components>0>non_drag_to_draw>0>item");
		for(var cur_node : XMLNode in nodes_list)
		{
			var village_non_drag_component : VillageNonDragComponent = new VillageNonDragComponent();
			village_non_drag_component.name = cur_node.GetValue("name>0>_text");
			village_non_drag_component.image = cur_node.GetValue("image>0>_text");
			village_non_drag_component.icon = cur_node.GetValue("icon>0>_text");
			village_non_drag_components_list.push(village_non_drag_component);
		}
		
		//Drag to draw components
		nodes_list = node.GetNodeList("village_components>0>drag_to_draw>0>item");
		for(var cur_node : XMLNode in nodes_list)
		{
			var village_drag_component = new VillageDragComponent();
			village_drag_component.name = cur_node.GetValue("name>0>_text");
			village_drag_component.icon = cur_node.GetValue("icon>0>_text");
			village_drag_component.color = new Color32(
												short.Parse(cur_node.GetValue("color>0>r>0>_text")),
												short.Parse(cur_node.GetValue("color>0>g>0>_text")),
												short.Parse(cur_node.GetValue("color>0>b>0>_text")),
												short.Parse(cur_node.GetValue("color>0>a>0>_text"))
											);
			village_drag_component.width = float.Parse(cur_node.GetValue("width>0>_text"));
			village_drag_components_list.push(village_drag_component);
		}
		
		//SETTING PARAMETERS FOR FIRST CREATE THE VILLAGE SCENE
		village_component_unlocked = "House";
		num_allowed_village_components = 2;
		create_village_intro_msg_txt = create_village_intro_msg_1;
		create_village_display_intro_msg = true;
		create_village_scene_num = 1;
		initial_create_village = true;
		
		//ADDING NAMES OF FIRST SCENE OF EACH CASE STUDY
		//TODO: Get these values from XML file
		main_menu_item_object = new MainMenuItemObject();
		main_menu_item_object.name = "Water Management";
		main_menu_item_object.scene1_name = "WaterRoleScene";				
		main_menu_item_objects_list.push(main_menu_item_object);
		
		main_menu_item_object = new MainMenuItemObject();
		main_menu_item_object.name = "Record Maintenance";
		main_menu_item_object.is_matching_scene = "true";
		main_menu_item_object.scene1_name = "MatchingScene";
		main_menu_item_object.matching_scene_file = "record_maintenance";
		main_menu_item_objects_list.push(main_menu_item_object);
		
		main_menu_item_object = new MainMenuItemObject();
		main_menu_item_object.name = "Waste Management";
		main_menu_item_object.is_matching_scene = "true";
		main_menu_item_object.scene1_name = "MatchingScene";
		main_menu_item_object.matching_scene_file = "waste_management";
		main_menu_item_objects_list.push(main_menu_item_object);
		
		main_menu_item_object = new MainMenuItemObject();
		main_menu_item_object.name = "Environment Protection";
		main_menu_item_object.is_matching_scene = "true";
		main_menu_item_object.scene1_name = "MatchingScene";
		main_menu_item_object.matching_scene_file = "environment_protection";
		main_menu_item_objects_list.push(main_menu_item_object);
		
		main_menu_item_object = new MainMenuItemObject();
		main_menu_item_object.name = "Electricity";
		main_menu_item_object.scene1_name = "ElectricityIntroScene";				
		main_menu_item_objects_list.push(main_menu_item_object);
		
		main_menu_item_object = new MainMenuItemObject();
		main_menu_item_object.name = "Economy";
		main_menu_item_object.scene1_name = "FlippingEconomyScene";				
		main_menu_item_objects_list.push(main_menu_item_object);
		
		main_menu_item_object = new MainMenuItemObject();
		main_menu_item_object.name = "Education";
		main_menu_item_object.scene1_name = "FlippingEducationScene";				
		main_menu_item_objects_list.push(main_menu_item_object);
		
		main_menu_item_object = new MainMenuItemObject();
		main_menu_item_object.name = "Health";
		main_menu_item_object.scene1_name = "FlippingHealthScene";				
		main_menu_item_objects_list.push(main_menu_item_object);
		
		main_menu_item_object = new MainMenuItemObject();
		main_menu_item_object.name = "Bridge";
		main_menu_item_object.scene1_name = "BridgeRoleScene";				
		main_menu_item_objects_list.push(main_menu_item_object);
	}
	
	public function CreateVillageNextScene()
	{
		if(initial_create_village)
		{
			create_village_scene_num++;
			switch(create_village_scene_num)
			{
			case 2:
				village_component_unlocked = "Tree";
				num_allowed_village_components = 3;
				create_village_intro_msg_txt = create_village_intro_msg_2;
				create_village_display_intro_msg = true;
				break;
			case 3:
				village_component_unlocked = "Animal";
				num_allowed_village_components = 3;
				create_village_intro_msg_txt = create_village_intro_msg_3;
				create_village_display_intro_msg = true;
				break;
			case 4:
				village_component_unlocked = "Transport";
				num_allowed_village_components = 2;
				create_village_intro_msg_txt = create_village_intro_msg_4;
				create_village_display_intro_msg = true;
				break;
			/*case 5:
				village_component_unlocked = "Road";
				num_allowed_village_components = 1;
				create_village_intro_msg_txt = create_village_intro_msg_5;
				create_village_display_intro_msg = true;
				break;*/
			case 5:
				Application.LoadLevel("ElectionLevel1Scene");
				break;
			default:
				Application.LoadLevel("MainMenu");
				break;
			}
		}
		else
		{
			//Application.LoadLevel(create_village_next_scene);
			//create_viilage_next_scene will be saved by the scene that calls the create-the-village scene.
		}
	}
	/*public function SaveFile(filename:String, obj:Object):void {
        try 
        {
	        Debug.Log("Writing Stream to Disk.");
	        var fileStream:Stream = File.Open(Application.persistentDataPath+"/"+filename, FileMode.Create);
	        var formatter:BinaryFormatter = new BinaryFormatter();
	        formatter.Serialize(fileStream, obj);
	        fileStream.Close();
        } catch(e:Exception) 
        {
	        Debug.LogWarning("Save.SaveFile(): Failed to serialize object to a file " + filename + " (Reason: " + e.ToString() + ")");
		}	
     }

	public function LoadFile(filename:String):Object {
        try 
        {
	        Debug.Log("Reading Stream from Disk.");
	        var fileStream:Stream = File.Open(Application.persistentDataPath+"/"+filename, FileMode.Open, FileAccess.Read);
	        var formatter:BinaryFormatter = new BinaryFormatter();
	        var obj:Object= formatter.Deserialize(fileStream);
	        fileStream.Close();
	        return obj;
        } catch(e:Exception) 
        {
	        Debug.LogWarning("SaveLoad.LoadFile(): Failed to deserialize a file " + filename + " (Reason: " + e.ToString() + ")");
	        return null;
        }       
	}*/
}