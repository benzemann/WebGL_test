//************************
//* Plane Class
//************************

function Plane(pos, size, rot, col)
{
	
	this.setProperties(pos, size, rot, col);
	
}
Plane.prototype = new Object();

// Creates a unit plane vao and veao
Plane.prototype.createVAO = function()
{
    // create vertex and index buffer
    var vertexCount = 4;
    this.vertex_size = 3 + 3 + 2; // pos, color, uv
    var vertices = new Float32Array(vertexCount * this.vertex_size); 
	this.indices_size = 6;
    //creates the vertices of unit quad with center in 0,0,0
    //the order should be top-left, top-right, bottom-left, bottom-right
    var vertexData = [
        -1.0, 1.0, 0,
        1.0, 1.0, 0,
        -1.0, -1.0, 0,
        1.0, -1.0, 0
    ];
	
	var uvData = [
        0, 1,
        1, 1,
        0, 0,
        1, 0
    ];

    //creates the colors
    var colorData = [
        this.color[0], this.color[1], this.color[2],
        this.color[0], this.color[1], this.color[2],
        this.color[0], this.color[1], this.color[2],
        this.color[0], this.color[1], this.color[2]
    ];

    //indices
    var indices = [
        0, 1, 2,
        1, 2, 3
    ];

    //interleave vertex data
    for (var i = 0; i < vertexCount; i++)
    {
        vertices[i * this.vertex_size    ] = vertexData[i * 3    ];
        vertices[i * this.vertex_size + 1] = vertexData[i * 3 + 1];
        vertices[i * this.vertex_size + 2] = vertexData[i * 3 + 2];
        vertices[i * this.vertex_size + 3] = colorData[i * 3];
        vertices[i * this.vertex_size + 4] = colorData[i * 3 + 1];
		vertices[i * this.vertex_size + 5] = colorData[i * 3 + 2];
		vertices[i * this.vertex_size + 6] = uvData[i * 2];
		vertices[i * this.vertex_size + 7] = uvData[i * 2 + 1];
    }

    //create and bind vertex buffer and upload vertices data
    vao = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vao);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //create and bind index buffer and upload indices data
    veao = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, veao);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

//************************
//* Object Class
//************************

function Object(pos, size, rot, col)
{
	
	this.vao;
	this.veao;
	this.vertex_size;
	this.indices_size;
	this.texture;
	
	Object.prototype.setProperties = function(pos, size, rot, col)
	{
		// Object attributes
		this.position = pos;
		this.scale = size;
		this.rotation = rot;
		this.color = col;
	
	}
}

Object.prototype.setTexture = function(tex)
{
	
	this.texture = tex;
	
}

Object.prototype.draw = function()
{
	gl.useProgram(color_shader);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vao);
    this.bindAttributes();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, veao);
	
	gl.drawElements(gl.TRIANGLES, this.indices_size, gl.UNSIGNED_SHORT, 0);
	
}

Object.prototype.bindAttributes = function()
{
    var sizeOfFloat = 4;
    var vertexLength = this.vertex_size * sizeOfFloat;
	
	var model = mult(translate(this.position), mult(scale(this.scale[0],this.scale[1],this.scale[2]), rotate(this.rotation, vec3(0.0,0.0,1.0))));
	var model_view = mult(view, model);
	var model_view_projection = mult(projection, model_view)

    var vertexLocation = gl.getAttribLocation(color_shader, "position");
    gl.enableVertexAttribArray(vertexLocation);
    gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, vertexLength, 0);

    var colorLocation = gl.getAttribLocation(color_shader, "color");
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, vertexLength, 3 * sizeOfFloat);
	
	var uvLocation = gl.getAttribLocation(color_shader, "uv");
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, vertexLength, 6 * sizeOfFloat);
	
	gl.uniformMatrix4fv(gl.getUniformLocation(color_shader, "M"), false, flatten(model));
	gl.uniformMatrix4fv(gl.getUniformLocation(color_shader, "V"), false, flatten(view));
	gl.uniformMatrix4fv(gl.getUniformLocation(color_shader, "P"), false, flatten(projection));
	gl.uniformMatrix4fv(gl.getUniformLocation(color_shader, "MV"), false, flatten(model_view));
	gl.uniformMatrix4fv(gl.getUniformLocation(color_shader, "MVP"), false, flatten(model_view_projection));
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(gl.getUniformLocation(color_shader, "texture"), 0);
	
}