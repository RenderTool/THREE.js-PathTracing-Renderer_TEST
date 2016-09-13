/*
Original author: Aaron Boman (frenchtoast747 on GitHub)
https://github.com/frenchtoast747/webgl-obj-loader

Edited by: Erich Loftis (erichlof on GitHub)
https://github.com/erichlof/THREE.js-PathTracing-Renderer
*/

var OBJ = {};

 
OBJ.Mesh = function (objectData) {
    
        var uniqueVertexList = [], vertNormals = [], textures = [], unpacked = {};
        // unpacking stuff
        ///unpacked.vertices = [];
        unpacked.norms = [];
        unpacked.textures = [];
        unpacked.hashfaceIndices = {};
        unpacked.faceIndices = [];
        unpacked.index = 0;
        // array of lines separated by the newline
        var lines = objectData.split('\n');

        var VERTEX_RE = /^v\s/;
        var NORMAL_RE = /^vn\s/;
        var TEXTURE_RE = /^vt\s/;
        var FACE_RE = /^f\s/;
        var WHITESPACE_RE = /\s+/;

        for (var i = 0; i < lines.length; i++) {
                
                var line = lines[i].trim();
                var elements = line.split(WHITESPACE_RE);
                elements.shift();

                if (VERTEX_RE.test(line)) {
                        // if this is a vertex
                        uniqueVertexList.push.apply(uniqueVertexList, elements);
                } else if (NORMAL_RE.test(line)) {
                        // if this is a vertex normal
                        vertNormals.push.apply(vertNormals, elements);
                } else if (TEXTURE_RE.test(line)) {
                        // if this is a texture
                        textures.push.apply(textures, elements);
                } else if (FACE_RE.test(line)) {
                        // if this is a face
                        for (var j = 0, eleLen = elements.length; j < eleLen; j++) {
                                
                                var currentValues = elements[ j ].split( '/' );

                                // vertex position
                                ///unpacked.vertices.push( uniqueVertexList[(currentValues[0] - 1) * 3 + 0] );
                                ///unpacked.vertices.push( uniqueVertexList[(currentValues[0] - 1) * 3 + 1] );
                                ///unpacked.vertices.push( uniqueVertexList[(currentValues[0] - 1) * 3 + 2] );
                                
                                // vertex textures
                                if (textures.length) {
                                        unpacked.textures.push(textures[(currentValues[1] - 1) * 2 + 0]);
                                        unpacked.textures.push(textures[(currentValues[1] - 1) * 2 + 1]);
                                }
                                
                                // vertex normals
                                unpacked.norms.push(vertNormals[(currentValues[2] - 1) * 3 + 0]);
                                unpacked.norms.push(vertNormals[(currentValues[2] - 1) * 3 + 1]);
                                unpacked.norms.push(vertNormals[(currentValues[2] - 1) * 3 + 2]);
                                
                                // add the newly created vertex to the list of faceIndices
                                unpacked.faceIndices.push(currentValues[0]-1);
                                
                        } // end for j = 0
                        
                }// end else if (FACE_RE.test(line)) {  
                
        } // end for i = 0
        
        this.uniqueVertexList = uniqueVertexList;
        ///this.vertices = unpacked.vertices;
        this.vertexNormals = unpacked.norms;
        this.textures = unpacked.textures;
        this.faceIndices = unpacked.faceIndices;
        
}; // end OBJ.Mesh



var Ajax = function() {
        // this is just a helper class to ease ajax calls
        var _this = this;
        this.xmlhttp = new XMLHttpRequest();

        this.get = function(url, callback) {
                
                _this.xmlhttp.onreadystatechange = function() {
                        
                        if (_this.xmlhttp.readyState === 4) {
                                callback(_this.xmlhttp.responseText, _this.xmlhttp.status);
                        }
                        
                };
                
                _this.xmlhttp.open('GET', url, true);
                _this.xmlhttp.send();
        };
        
};

  
OBJ.downloadMeshes = function (nameAndURLs, completionCallback, meshes) {
        // the total number of meshes. this is used to implement "blocking"
        var semaphore = Object.keys(nameAndURLs).length;
        // if error is true, an alert will given
        var error = false;
        // this is used to check if all meshes have been downloaded
        // if meshes is supplied, then it will be populated, otherwise
        // a new object is created. this will be passed into the completionCallback
        if (meshes === undefined) meshes = {};
        // loop over the mesh_name,url key,value pairs
        for (var mesh_name in nameAndURLs) {
                if (nameAndURLs.hasOwnProperty(mesh_name)) {
                        new Ajax().get(nameAndURLs[mesh_name], (function(name) {
                                return function (data, status) {
                                        if (status === 200) {
                                                meshes[name] = new OBJ.Mesh(data);
                                        }
                                        else {
                                                error = true;
                                                console.error('An error has occurred and the mesh "' +
                                                        name + '" could not be downloaded.');
                                        }
                                        // the request has finished, decrement the counter
                                        semaphore--;
                                        if (semaphore === 0) {
                                                if (error) {
                                                // if an error has occurred, the user is notified here and the
                                                // callback is not called
                                                        console.error('An error has occurred and one or meshes has not been ' +
                                                                'downloaded. The execution of the script has terminated.');
                                                        throw '';
                                                }
                                                // there haven't been any errors in retrieving the meshes
                                                // call the callback
                                                completionCallback(meshes);
                                        }
                                }
                        })(mesh_name));
                }
        }
        
};

  

