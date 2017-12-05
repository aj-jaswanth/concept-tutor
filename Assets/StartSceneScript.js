#pragma strict

function OnGUI()
{
	if(GUI.Button(
		new Rect(
			(SceneManager.screen_width - SceneManager.box_size) / 2, 
			(SceneManager.screen_height - SceneManager.box_size) / 2, 
			SceneManager.box_size, 
			SceneManager.box_size
		),
		Resources.Load("play_icon")
	))
	{
		Application.LoadLevel("IntroScene");
		//Application.LoadLevel("MainMenu");
	}
}

function Start()
{
	SceneManager.Initialize();
}