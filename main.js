
//**************************
//* WebGL
//**************************
var gl;
var canvas;
var input_handler;
//**************************
//* Buffers, Shaders
//**************************
var quad_vertex_buffer;
var quad_vertex_element_array_buffer;
var color_shader;
//**************************
//* Matrices
//**************************
var projection;
var view;
//**************************
//* Objects
//**************************
var plane;
//**************************
//* Assets
//**************************
var plane_image;
var tmp;
var no_of_assets = 0;
var no_of_completed_assets = 0;

window.onload = function init()
{
	console.log("Loading assets.")
	// Load all assets here PROGRAM DOESNT INITIALIZE WITHOUT!
    plane_image = loadImage("test.png", plane_image);
	
}
// Initialization
function initialize(){
	
	//Get Canvas
    canvas = document.getElementById("gl-canvas");

    //Get WebGL Context
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl)
    {
        alert("Failed to get context!");
        return;
    }
	var obj = new Object();
    //Setup viewport and clear color
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
	
	//setup view and projection matrices
    projection = ortho(0, canvas.width, 0, canvas.height, -1, 2); //left, right, bottom, top, near, far
    view = lookAt(vec3(0, 0, 1), vec3(0, 0, 0), vec3(0, 1, 0));
	
	//Load, compile and link the shaders
	color_shader = initShaders(gl, "color-vert", "color-frag");
	
	input_handler = new inputHandler();
	
	plane = new Plane(vec3(500.0,500.0,0.0), vec3(100.0,100.0,0.0), 0.0 ,vec3(1.0,0.0,0.0)); // pos, size, rotation, color
	
	var t = createTexture(plane_image);
	
	plane.setTexture(t);
	
	plane.createVAO();
	
    //Draw stuff
    render();
	
}
// Render the window
function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	plane.draw();
}


function createTexture(image)
{	
	//create texture id, activate and bind
	var texID = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texID);

	//set texture data
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	//set texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	
    return texID;
}

function loadImage(path, image){
	no_of_assets++;
	// loads image
	image = new Image();
	
	image.crossOrigin = '';
	image.src = "http://localhost:8000/" + path;
	
	image.onload = function ()
    {
		checkCompletedAsset();
	}
	
	return image;
}

function inputHandler(){
	
	var mouse_is_down = false;
	
	document.onmousemove = function(e)
    {
        if(mouse_is_down)
			console.log(e.clientX +" " + e.clientY);
    };
	
	document.onmousedown = function(event)
	{
		mouse_is_down = true;
	};
	
	document.onmouseup = function(event)
	{
		mouse_is_down = false;	
	};
	
}


function checkCompletedAsset(){
	
	no_of_completed_assets++;
	var percentage_done = (no_of_completed_assets / no_of_assets)*100;
	console.log(percentage_done + "% Completed");
	if(no_of_completed_assets >= no_of_assets){
		console.log("All assets loaded.")
		initialize();
		
	}
	
}