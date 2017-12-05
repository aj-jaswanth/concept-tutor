using UnityEngine;
using System.Collections;

public class ScreenShot : MonoBehaviour {
	public int resWidth = 2550;
	public int resHeight = 3300;
	public int margin;
	public int screen_width;
	public int screen_height;
	public int takeHiResShot = 0;
	public int box_size;

	public static string ScreenShotName(int width, int height) {
		return string.Format("{0}/screen_{1}x{2}_{3}.png",
		                     Application.persistentDataPath,
		                     width, height,
		                     System.DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss"));
	}
	
	public void TakeHiResShot() {
		takeHiResShot = 1;
	}
	
	void LateUpdate() {
		if (takeHiResShot == 1) {
			RenderTexture rt = new RenderTexture(screen_width, screen_height, 24);
			camera.targetTexture = rt;
			Texture2D screenShot = new Texture2D(screen_width, screen_height, TextureFormat.RGB24, false);
			camera.Render();
			RenderTexture.active = rt;
			screenShot.ReadPixels(new Rect(0, 0, screen_width, screen_height), 0, 0);
			camera.targetTexture = null;
			RenderTexture.active = null; // JC: added to avoid errors
			Destroy(rt);
			byte[] bytes = screenShot.EncodeToPNG();
			string filename = ScreenShotName(screen_width, screen_height);
			System.IO.File.WriteAllBytes(filename, bytes);
			Debug.Log(string.Format("Took screenshot to: {0}", filename));
			takeHiResShot = 0;
		}
	}

	public void OnGUI()
	{
		if(GUI.Button (new Rect (margin, margin, box_size, box_size), "Capture"))
		{
			TakeHiResShot();
		}
	}

	public void Start()
	{
		screen_width = Screen.width;
		screen_height = Screen.height;
		margin = (int)(screen_height * 0.0125);
		box_size = (int)(screen_height * 0.125);
	}
}
