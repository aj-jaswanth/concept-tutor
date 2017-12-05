#pragma 	strict

import System.IO;

public class FileParser extends MonoBehaviour
{
	static function read() : XMLNode
	{	
		var c = Resources.Load(SceneManager.file_to_load) as TextAsset;
		var parser = new XMLParser();
		var node = parser.Parse(c.text);
		return node;
	}
	
	static function read_village_components() : XMLNode
	{
		var c = Resources.Load(SceneManager.village_components_file) as TextAsset;
		var parser = new XMLParser();
		var node = parser.Parse(c.text);
		return node;
	}
}