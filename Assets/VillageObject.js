/*
This class is used to store information about game objects that is used to virtually store the objects and later retrieve them.
Objects are retrieved by recreating them using their stored information.
Author: Vishesh Kandhari
*/
#pragma strict

public class VillageObject
{
	var position : Vector3;
	var sprite_id : int;
	var sprite : String;
}