'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput);

var sunGeometry = null; // this will be created after loading from a file
var pointLightGeometry = null;
var sunFGeometry = null;
var barrelGeometry = null;
var mecuryGeometry = null;
var venusGeometry = null;
var earthGeometry = null;
var earthCloudsGeometry = null;
var marsGeometry = null;
var jupiterGeometry = null;
var saturnGeometry = null;
var saturnRGeometry = null; //saturn ring
var uranusGeometry = null;
var neptuneGeometry = null;
var moonGeometry = null;
var spaceField = null, spaceField2 = null, spaceField3 = null, spaceField4 = null,
spaceField5 = null, spaceField6 = null,spaceField7 = null, spaceField8 = null,
spaceField7 = null, spaceField8 = null, spaceField9 = null, spaceField10 = null,
spaceField11 = null, spaceField12 = null, spaceField13 = null, spaceField14 = null,
spaceField15 = null, spaceField16 = null, spaceField17 = null, spaceField18 = null,
spaceField19 = null, spaceField20 = null,spaceField21 = null, spaceField22 = null, 
spaceField23 = null, spaceField24 = null,spaceField25 = null, spaceField26 = null,
spaceField27 = null, spaceField28 = null, spaceField29 = null, spaceField30 = null,
spaceField31 = null, spaceField32 = null,spaceField37 = null, spaceField38 = null, 
spaceField39 = null, spaceField40 = null, spaceField41 = null, spaceField42 = null;

/// more right wall
var spaceField33 = null, spaceField34 = null;
//more left wall
var spaceField35 = null, spaceField36 = null;


/*var fw =[spaceField,spaceField2,spaceField3,spaceField4,spaceField5,spaceField6]; //frontwall
var rw =[spaceField7,spaceField8,spaceField9,spaceField10] //rightwall
var lw =[spaceField11,spaceField12,spaceField13,spaceField14] //leftwall
var backw =[spaceField15,spaceField16,spaceField17,spaceField18,spaceField19,spaceField20];
var bottomW =[spaceField21,spaceField22,spaceField23,spaceField24,spaceField25,spaceField26];
var topW =[spaceField27,spaceField28,spaceField29,spaceField30,spaceField31,spaceField32];*/

var star1 = null;
var star2 = null;
var star3 = null;
var star4 = null;
var star5 = null;
var star6 = null;
var star7 = null;
var star8 = null;
var star9 = null;
var star10 = null;
var star11 = null;
var star12 = null;
var projectionMatrix = new Matrix4();
var lightPosition = new Vector3();


// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var phongShaderProgram;
var transparencyProgram;
var emmissiveShaderProgram; //for emmissive objects

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    phongTextVS: null, phongTextFS: null,
    vertexColorVS: null, vertexColorFS: null,
    sphereJSON: null,
    sunImage: null,
    starImage: null,
    barrelJSON: null,
    barrelImage: null,
    emmisiveTextFS: null,
    mecuryImage: null,
    venusImage:null,
    earthImage:null,
    earthCloudImage:null,
    transparencyTextFS:null,
    moonImage:null,
    sunFlareImage:null,
    marsImage:null,
    spaceFieldImage: null,
    jupiterImage: null,
    saturnImage: null,
    saturnRingImage: null,
    uranusImage: null,
    neptuneImage: null,
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();

        updateAndRender();
    });
}

// -------------------------------------------------------------------------
function initGL(canvas) {
    var canvas = document.getElementById("webgl-canvas");

    try {
        gl = canvas.getContext("webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/phong.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/phong.pointlit.fs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/flat.color.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/flat.color.fs.glsl').then((response) => { return response.text(); }),
        fetch('./data/sphere.json').then((response) => { return response.json(); }),
        loadImage('./data/Sun.jpg'),
        loadImage('./data/star.jpg'),//star
        fetch('./data/barrel.json').then((response) => { return response.json(); }),
        loadImage('./data/barrel.png'),
        fetch('./shaders/phong.emmisive.fs.glsl').then((response) => { return response.text(); }),
        loadImage('./data/mecury.jpg'),
        loadImage('./data/Venus.jpg'),
        loadImage('./data/earth.jpg'),
        loadImage('./data/earthClouds.jpg'),
        fetch('./shaders/phong.transparancy.fs.glsl').then((response) => { return response.text(); }),
        loadImage('./data/Moon.jpg'),
        loadImage('./data/solarFlare.jpg'),
        loadImage('./data/mars.jpg'),
        loadImage('./data/spacefield.png'),
        loadImage('./data/jupiter.jpg'),
        loadImage('./data/saturn.jpg'),
        loadImage('./data/saturn_ring.png'),
        loadImage('./data/uranus.jpg'),
        loadImage('./data/neptune.jpg'),
    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.phongTextVS = values[0];
        loadedAssets.phongTextFS = values[1];
        loadedAssets.vertexColorVS = values[2];
        loadedAssets.vertexColorFS = values[3];
        loadedAssets.sphereJSON = values[4];
        loadedAssets.sunImage = values[5];
        loadedAssets.starImage = values[6];
        loadedAssets.barrelJSON = values[7];
        loadedAssets.barrelImage = values[8];
        loadedAssets.emmisiveTextFS = values[9];
        loadedAssets.mecuryImage = values[10];
        loadedAssets.venusImage = values[11];
        loadedAssets.earthImage = values[12];
        loadedAssets.earthCloudImage= values[13];
        loadedAssets.transparencyTextFS = values[14];
        loadedAssets.moonImage = values[15];
        loadedAssets.sunFlareImage = values[16];
        loadedAssets.marsImage = values[17];
        loadedAssets.spaceFieldImage = values[18];
        loadedAssets.jupiterImage = values[19];
        loadedAssets.saturnImage = values[20];
        loadedAssets.saturnRingImage = values[21];
        loadedAssets.uranusImage = values[22];
        loadedAssets.neptuneImage = values[23];


    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    phongShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.phongTextFS);

    phongShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(phongShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(phongShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(phongShaderProgram, "aTexcoords")
    };

    phongShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(phongShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(phongShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(phongShaderProgram, "uTexture"),
    };

    
    emmissiveShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.emmisiveTextFS);
    
    emmissiveShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(emmissiveShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(emmissiveShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(emmissiveShaderProgram, "aTexcoords")
    };

    emmissiveShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(emmissiveShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(emmissiveShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(emmissiveShaderProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(emmissiveShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(emmissiveShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(emmissiveShaderProgram, "uTexture"),
        twinkelUniform: gl.getUniformLocation(emmissiveShaderProgram, "twinkleVal"),


    };
    transparencyProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.transparencyTextFS);
    
    transparencyProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(transparencyProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(transparencyProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(transparencyProgram, "aTexcoords")
    };

    transparencyProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(transparencyProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(transparencyProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(transparencyProgram, "uProjectionMatrix"),
        lightPositionUniform: gl.getUniformLocation(transparencyProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(transparencyProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(transparencyProgram, "uTexture"),
        transparencyVal: gl.getUniformLocation(transparencyProgram,"transparency"),
    };

}
function createStarBox(mLeft, mRight, mUp, mDown, mBack, mFoward,scale ){
    var starGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    starGeometry.create(loadedAssets.starImage);

    var starGClone2 = new WebGLGeometryQuad(gl, phongShaderProgram);
    starGClone2.create(loadedAssets.starImage);

    var starGClone3 = new WebGLGeometryQuad(gl, phongShaderProgram);
    starGClone3.create();

    var starGClone4 = new WebGLGeometryQuad(gl, phongShaderProgram);
    starGClone4.create();

    var starGClone5 = new WebGLGeometryQuad(gl, phongShaderProgram);//up of cube
    starGClone5.create();

    var starGClone6 = new WebGLGeometryQuad(gl, phongShaderProgram);//button of cube
    starGClone6.create();

    var starBox = null;
    var mL = mLeft;
   var mR= mRight;
   var mU = mUp;
   var mD = mDown;
   var mB = mBack;
   
   var mF = mFoward;
   var sc = scale;
   var scale2 = new Matrix4().makeScale(sc, sc, sc);
   var corr = -(5-sc); // tells you what to do

   if(corr != 0){
    var starT = new Matrix4().makeTranslation(0 -mL+mR, 5 +mU-mD, -5 +mF-mB -corr);
    var starR = new Matrix4().makeRotationZ(180);
    var starR12 = new Matrix4().makeRotationX(180);
    var starT2 = new Matrix4().makeTranslation(0 -mL+mR, 5 +mU-mD, 5 +mF-mB +corr);
    var starT3 = new Matrix4().makeTranslation(-5 -mL+mR-corr, 5 +mU-mD, 0 +mF-mB);
    var starR3 = new Matrix4().makeRotationY(-90);
    var starT4 = new Matrix4().makeTranslation(5 -mL+mR +corr, 5 +mU-mD, 0 +mF-mB);
    var starR4 = new Matrix4().makeRotationY(90);
    var starT5 = new Matrix4().makeTranslation(0 -mL+mR, 10 +mU-mD+corr, 0 +mF-mB);
    var starR5 = new Matrix4().makeRotationX(-90);
    var starR52 = new Matrix4().makeRotationY(0);
    var starT6 = new Matrix4().makeTranslation(0 -mL+mR, 0 +mU-mD-corr, 0 +mF-mB);
    var starR6 = new Matrix4().makeRotationX(90);
    var starR62 = new Matrix4().makeRotationY(180);
   }
   else{
    
        var starT = new Matrix4().makeTranslation(0 -mL+mR, 5 +mU-mD, -5 +mF-mB -corr);
    var starR = new Matrix4().makeRotationZ(180);
    var starR12 = new Matrix4().makeRotationX(180);
    var starT2 = new Matrix4().makeTranslation(0 -mL+mR, 5 +mU-mD, 5 +mF-mB);
    var starT3 = new Matrix4().makeTranslation(-5 -mL+mR, 5 +mU-mD, 0 +mF-mB);
    var starR3 = new Matrix4().makeRotationY(-90);
    var starT4 = new Matrix4().makeTranslation(5 -mL+mR, 5 +mU-mD, 0 +mF-mB);
    var starR4 = new Matrix4().makeRotationY(90);
    var starT5 = new Matrix4().makeTranslation(0 -mL+mR, 10 +mU-mD, 0 +mF-mB);
    var starR5 = new Matrix4().makeRotationX(-90);
    var starR52 = new Matrix4().makeRotationY(0);
    var starT6 = new Matrix4().makeTranslation(0 -mL+mR, 0 +mU-mD, 0 +mF-mB);
    var starR6 = new Matrix4().makeRotationX(90);
    var starR62 = new Matrix4().makeRotationY(180);
   }
   

    //starGeometry.worldMatrix.makeIdentity();
    

    starGeometry.worldMatrix.multiply(starT).multiply(starR12).multiply(starR).multiply(scale2.clone());
    starGClone2.worldMatrix.multiply(starT2).multiply(scale2.clone());
    starGClone3.worldMatrix.multiply(starT3).multiply(starR3).multiply(scale2.clone());
    starGClone4.worldMatrix.multiply(starT4).multiply(starR4).multiply(scale2.clone());
    starGClone5.worldMatrix.multiply(starT5).multiply(starR52).multiply(starR5).multiply(scale2.clone());
    starGClone6.worldMatrix.multiply(starT6).multiply(starR62).multiply(starR6).multiply(scale2.clone());

    starBox=[starGeometry, starGClone2, starGClone3, starGClone4, starGClone5, starGClone6];
    return starBox;
    
}

// -------------------------------------------------------------------------
function createScene() {

    var scale = new Matrix4().makeScale(5.0, 5.0, 5.0);///

    // compensate for the model being flipped on its side
    //Making star Geometry 
   // var rotation = new Matrix4().makeRotationX(-90);
   
    sunGeometry = new WebGLGeometryJSON(gl, emmissiveShaderProgram);// sun
    sunGeometry.create(loadedAssets.sphereJSON, loadedAssets.sunImage);

    sunFGeometry = new WebGLGeometryJSON(gl, transparencyProgram);// sunFlare
    sunFGeometry.create(loadedAssets.sphereJSON, loadedAssets.sunFlareImage);


    




    // Scaled it down so that the diameter is 3
    var scale = new Matrix4().makeScale(0.06, 0.06, 0.06);// sun scale

    // raise it by the radius to make it sit on the ground
    var translation = new Matrix4().makeTranslation(0, 1.5, 0);

    sunGeometry.worldMatrix.makeIdentity();
    sunGeometry.worldMatrix.multiply(scale);

    scale = new Matrix4().makeScale(0.065, 0.065, 0.065)
    sunFGeometry.worldMatrix.multiply(scale);

    //Making mecuryGeometry
    translation = new Matrix4().makeTranslation(4, 0, 0);
    scale = new Matrix4().makeScale(0.009, 0.009, 0.009);

    mecuryGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    mecuryGeometry.create(loadedAssets.sphereJSON, loadedAssets.mecuryImage);
    mecuryGeometry.worldMatrix.makeIdentity();
    mecuryGeometry.worldMatrix.multiply(translation).multiply(scale);
    //////////////////////////////////////////////////////////////////

    ////Making venusGeometry
    translation = new Matrix4().makeTranslation(6, 0, 0);
    scale = new Matrix4().makeScale(0.01, 0.01, 0.01);

    venusGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    venusGeometry.create(loadedAssets.sphereJSON, loadedAssets.venusImage);
    venusGeometry.worldMatrix.makeIdentity();
    venusGeometry.worldMatrix.multiply(translation).multiply(scale);
    //venusGeometry.worldMatrix.multiply(scale);
    //////////////////////////////////////////////////////////////////

    ////Making earthGeometry
    translation = new Matrix4().makeTranslation(8, 1.5, 0);
    scale = new Matrix4().makeScale(0.019, 0.019, 0.019);

    earthGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    earthGeometry.create(loadedAssets.sphereJSON, loadedAssets.earthImage);
    earthGeometry.worldMatrix.multiply(scale);
    
    //////////////////////////////////////////////////////////////////
    ////Making earthcloud
    translation = new Matrix4().makeTranslation(8, 1.5, 0);
    scale = new Matrix4().makeScale(0.020, 0.020, 0.020);

    earthCloudsGeometry = new WebGLGeometryJSON(gl, transparencyProgram);
    earthCloudsGeometry.create(loadedAssets.sphereJSON, loadedAssets.earthCloudImage);
    earthCloudsGeometry.worldMatrix.multiply(scale);
    //////////////////////////////////////////////////////////////////

    ////Making moonGeometry
    translation = new Matrix4().makeTranslation(0, 1.5, 0);
    scale = new Matrix4().makeScale(0.00688, 0.00688, 0.00688);

    moonGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    moonGeometry.create(loadedAssets.sphereJSON, loadedAssets.moonImage);
   // moonGeometry.worldMatrix.multiply(scale);
    //////////////////////////////////////////////////////////////////

    pointLightGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    pointLightGeometry.create(loadedAssets.sphereJSON);

    // make the sphere representing the light smallish
    //var pointlightScaleMatrix = new Matrix4().makeScale(0.005, 0.005, 0.005);
    //pointLightGeometry.worldMatrix.makeIdentity().multiply(pointlightScaleMatrix);

    barrelGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    barrelGeometry.create(loadedAssets.barrelJSON, loadedAssets.barrelImage);

    var barrelScale = new Matrix4().makeScale(0.3, 0.3, 0.3);
    var barrelTranslation = new Matrix4().makeTranslation(-5, 2, -5);

    barrelGeometry.worldMatrix.makeIdentity();
    barrelGeometry.worldMatrix.multiply(barrelTranslation).multiply(barrelScale);

    ///////////Making Mars
    translation = new Matrix4().makeTranslation(10, 0, 0);
    scale = new Matrix4().makeScale(0.018, 0.018, 0.018);

    marsGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    marsGeometry.create(loadedAssets.sphereJSON, loadedAssets.marsImage);
    marsGeometry.worldMatrix.multiply(translation).multiply(scale);

    /////////////////////////////////////////////////////////////////////
    ///making jupiter 
    translation = new Matrix4().makeTranslation(13, 0, 0);
    scale = new Matrix4().makeScale(0.03, 0.03, 0.03);
    

    jupiterGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    jupiterGeometry.create(loadedAssets.sphereJSON, loadedAssets.jupiterImage);
    jupiterGeometry.worldMatrix.multiply(translation).multiply(scale);

    /////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////
    ///making saturn 
    translation = new Matrix4().makeTranslation(17, 0, 0);
    
    scale = new Matrix4().makeScale(0.023, 0.023, 0.023);

    saturnGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    saturnGeometry.create(loadedAssets.sphereJSON, loadedAssets.saturnImage);
    saturnGeometry.worldMatrix.multiply(translation).multiply(scale);

    /////////////////////////////////////////////////////////////////////

    ///making saturn ring
    var rotation = new Matrix4().makeRotationZ(-30);
    translation = new Matrix4().makeTranslation(17, 0, 0);
    scale = new Matrix4().makeScale(0.002, 0.04, 0.04);

    saturnRGeometry = new WebGLGeometryJSON(gl, transparencyProgram);
    saturnRGeometry.create(loadedAssets.sphereJSON, loadedAssets.saturnRingImage);
    saturnRGeometry.worldMatrix.multiply(translation).multiply(rotation).multiply(scale);

    /////////////////////////////////////////////////////////////////////

    ///making uranus Geometry 
    translation = new Matrix4().makeTranslation(20, 0, 0);
    scale = new Matrix4().makeScale(0.019, 0.019, 0.019);

    uranusGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    uranusGeometry.create(loadedAssets.sphereJSON, loadedAssets.uranusImage);
    uranusGeometry.worldMatrix.multiply(translation).multiply(scale);

    /////////////////////////////////////////////////////////////////////

    ///making uranus neptune Geometry 
    translation = new Matrix4().makeTranslation(24, 0, 0);
    scale = new Matrix4().makeScale(0.019, 0.019, 0.019);

    neptuneGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    neptuneGeometry.create(loadedAssets.sphereJSON, loadedAssets.neptuneImage);
    neptuneGeometry.worldMatrix.multiply(translation).multiply(scale);

    /////////////////////////////////////////////////////////////////////
    ////stars Geometries/////////////////////////////////////

    let random1 =Math.floor((Math.random() * 60)-30);
    let random2 =Math.floor((Math.random() * 60)-30);
    let random3 =Math.floor((Math.random() * 100)-100);
    let random4 =Math.floor((Math.random() * 100) -100);
    let random5 =Math.floor((Math.random() * 100)-100);
    let random6 =Math.floor((Math.random() * 100)-100);
    let random7 =Math.floor((Math.random() * 1.5)+ 1);

    star1 = createStarBox(random1,0,0,40,50,0,1.5);
    star2 = createStarBox(0,random2,10,0,50,0,1.5);
    star3 = createStarBox(0,0,0,0,50,0,1.5);

    star4 = createStarBox(random1,random2,random3,random4,random5,random6,1.5);
    star5 = createStarBox(random3,random4,random1,random2,random5,random6,1.5);
    star6 = createStarBox(random1,random4,random5,random2,random3,random6,1.5);
    random1 =Math.floor((Math.random() * 100)-100);
    random2 =Math.floor((Math.random() * 100)-100);
    random3 =Math.floor((Math.random() * 100)-100);
    random4 =Math.floor((Math.random() * 100) -100);
    random5 =Math.floor((Math.random() * 100)-100);
    random6 =Math.floor((Math.random() * 100)-100);

    star7 = createStarBox(random1,random2,random3,random5,random6,random4,random7);
    star8 = createStarBox(random3,random4,random5,random6,random1,random2,1.5);
    star9 = createStarBox(random3,random1,random2,random5,random4,random6,random7);
    random7 =Math.floor((Math.random() * 2)+ 1);

    star10 = createStarBox(random1,random2,random3,random4,random5,random6,1.5);
    star11 = createStarBox(random3,random4,random1,random2,random5,random6,random7);
    star12= createStarBox(random1,random4,random5,random2,random3,random6,1.5);
    ///////////////////////////////////////////////////////


    ///// space field /////
    
    spaceField = createStarBox(0,0,0,30,70,0,20);
    spaceField[1].create(loadedAssets.spaceFieldImage);
    spaceField[0].create(loadedAssets.spaceFieldImage);

    spaceField2 = createStarBox(40,0,0,30,70,0,20);
    spaceField2[1].create(loadedAssets.spaceFieldImage);
    spaceField2[0].create(loadedAssets.spaceFieldImage);

    spaceField3 = createStarBox(-40,0,0,30,70,0,20);
    spaceField3[1].create(loadedAssets.spaceFieldImage);
    spaceField3[0].create(loadedAssets.spaceFieldImage);
    
    spaceField4 = createStarBox(0,0,40,30,70,0,20);
    spaceField4[1].create(loadedAssets.spaceFieldImage);
    spaceField4[0].create(loadedAssets.spaceFieldImage);

    spaceField5 = createStarBox(40,0,40,30,70,0,20);
    spaceField5[1].create(loadedAssets.spaceFieldImage);
    spaceField5[0].create(loadedAssets.spaceFieldImage);

    spaceField6 = createStarBox(-40,0,40,30,70,0,20);
    spaceField6[1].create(loadedAssets.spaceFieldImage);
    spaceField6[0].create(loadedAssets.spaceFieldImage);

/////right wall
    spaceField7 = createStarBox(0,80,40,30,70,40,20);
    spaceField7[2].create(loadedAssets.spaceFieldImage);

    spaceField8 = createStarBox(0,80,40,30,70,80,20);
    spaceField8[2].create(loadedAssets.spaceFieldImage);

    spaceField9 = createStarBox(0,80,40,70,70,40,20);
    spaceField9[2].create(loadedAssets.spaceFieldImage);

    spaceField10 = createStarBox(0,80,40,70,70,80,20);
    spaceField10[2].create(loadedAssets.spaceFieldImage);

    spaceField33 = createStarBox(0,80,40,30,70,120,20);
    spaceField33[2].create(loadedAssets.spaceFieldImage);

    spaceField34 = createStarBox(0,80,40,70,70,120,20);
    spaceField34[2].create(loadedAssets.spaceFieldImage);

    //// left wall 
    spaceField11 = createStarBox(80,0,40,30,70,40,20);
    spaceField11[3].create(loadedAssets.spaceFieldImage);

    spaceField12 = createStarBox(80,0,40,30,70,80,20);
    spaceField12[3].create(loadedAssets.spaceFieldImage);

    spaceField13 = createStarBox(80,0,40,70,70,40,20);
    spaceField13[3].create(loadedAssets.spaceFieldImage);

    spaceField14 = createStarBox(80,0,40,70,70,80,20);
    spaceField14[3].create(loadedAssets.spaceFieldImage);

    spaceField35 = createStarBox(80,0,40,30,70,120,20);
    spaceField35[3].create(loadedAssets.spaceFieldImage);

    spaceField36 = createStarBox(80,0,40,70,70,120,20);
    spaceField36[3].create(loadedAssets.spaceFieldImage);
    //// back wall
    spaceField15 = createStarBox(0,0,0,30,-80,0,20);
    spaceField15[1].create(loadedAssets.spaceFieldImage);
    spaceField15[0].create(loadedAssets.spaceFieldImage);

    spaceField16 = createStarBox(40,0,0,30,-80,0,20);
    spaceField16[1].create(loadedAssets.spaceFieldImage);
    spaceField16[0].create(loadedAssets.spaceFieldImage);

    spaceField17 = createStarBox(-40,0,0,30,-80,0,20);
    spaceField17[1].create(loadedAssets.spaceFieldImage);
    spaceField17[0].create(loadedAssets.spaceFieldImage);
    
    spaceField18 = createStarBox(0,0,40,30,-80,0,20);
    spaceField18[1].create(loadedAssets.spaceFieldImage);
    spaceField18[0].create(loadedAssets.spaceFieldImage);

    spaceField19 = createStarBox(40,0,40,30,-80,0,20);
    spaceField19[1].create(loadedAssets.spaceFieldImage);
    spaceField19[0].create(loadedAssets.spaceFieldImage);

    spaceField20 = createStarBox(-40,0,40,30,-80,0,20);
    spaceField20[1].create(loadedAssets.spaceFieldImage);
    spaceField20[0].create(loadedAssets.spaceFieldImage);

    //// top wall
    spaceField21 = createStarBox(40,80,80,30,70,40,20);
    spaceField21[5].create(loadedAssets.spaceFieldImage);

    spaceField22 = createStarBox(80,80,80,30,70,40,20);
    spaceField22[5].create(loadedAssets.spaceFieldImage);

    spaceField23 = createStarBox(120,80,80,30,70,40,20);
    spaceField23[5].create(loadedAssets.spaceFieldImage);

    spaceField24 = createStarBox(40,80,80,30,70,80,20);
    spaceField24[5].create(loadedAssets.spaceFieldImage);

    spaceField25 = createStarBox(80,80,80,30,70,80,20);
    spaceField25[5].create(loadedAssets.spaceFieldImage);

    spaceField26 = createStarBox(120,80,80,30,70,80,20);
    spaceField26[5].create(loadedAssets.spaceFieldImage);
    
    spaceField27 = createStarBox(40,80,80,30,70,120,20);
    spaceField27[5].create(loadedAssets.spaceFieldImage);

    spaceField28 = createStarBox(80,80,80,30,70,120,20);
    spaceField28[5].create(loadedAssets.spaceFieldImage);
    

    spaceField29 = createStarBox(120,80,80,30,70,120,20);
    spaceField29[5].create(loadedAssets.spaceFieldImage);

    //buttom wall

    spaceField30 = createStarBox(40,80,0,70,70,40,20);
    spaceField30[4].create(loadedAssets.spaceFieldImage);

    spaceField31 = createStarBox(80,80,0,70,70,40,20);
    spaceField31[4].create(loadedAssets.spaceFieldImage);

    spaceField32 = createStarBox(120,80,0,70,70,40,20);
    spaceField32[4].create(loadedAssets.spaceFieldImage);

    spaceField37 = createStarBox(40,80,0,70,70,80,20);
    spaceField37[4].create(loadedAssets.spaceFieldImage);

    spaceField38 = createStarBox(80,80,0,70,70,80,20);
    spaceField38[4].create(loadedAssets.spaceFieldImage);

    spaceField39 = createStarBox(120,80,0,70,70,80,20);
    spaceField39[4].create(loadedAssets.spaceFieldImage);
    
    spaceField40 = createStarBox(40,80,0,70,70,120,20);
    spaceField40[4].create(loadedAssets.spaceFieldImage);

    spaceField41 = createStarBox(80,80,0,70,70,120,20);
    spaceField41[4].create(loadedAssets.spaceFieldImage);
    

    spaceField42 = createStarBox(120,80,0,70,70,120,20);
    spaceField42[4].create(loadedAssets.spaceFieldImage);





    ////////////////////////////////////////////////

}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);
    time.update();
    camera.update(time.deltaTime);
    let random1 = Math.floor((Math.random() * 10) * time.deltaTime);

    var temp = new Matrix4();
    var aspectRatio = gl.canvasWidth / gl.canvasHeight;
    let moonTM = new Matrix4().makeTranslation(1.2, 0, 0);
    let moonScale = new Matrix4().makeScale(0.005, 0.005, 0.005);
    let moonRM = new Matrix4().makeRotationY(50* time.secondsElapsedSinceStart);
    let moonRMS = new Matrix4().makeRotationY(60* time.secondsElapsedSinceStart);
    let earthScale = new Matrix4().makeScale(0.015, 0.015, 0.015);
    let earthT = new Matrix4().makeTranslation(7.5, 0, 0);
    let earthRS = new Matrix4().makeRotationY(30* time.secondsElapsedSinceStart);
    let earthR = new Matrix4().makeRotationY(15* time.secondsElapsedSinceStart);
    let cloudS = new Matrix4().makeScale(0.016, 0.016, 0.016);// cloud scale
    let cloudR = new Matrix4().makeRotationZ(-9.5* time.secondsElapsedSinceStart);
    let x =0;
    

    // special case rotation where the vector is along the x-axis (4, 0)


    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    //gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clearColor(0, 0, 0, 1.0); // make canvas balck
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(emmissiveShaderProgram);// rendering sun
    var uniforms = emmissiveShaderProgram.uniforms;
    var uniformse = emmissiveShaderProgram.uniforms;
    
    //rotate sun
    temp = temp.makeRotationY(5 * time.deltaTime);
    sunGeometry.worldMatrix.multiply(temp);
    temp = temp.makeRotationX(5 * time.deltaTime);
    sunFGeometry.worldMatrix.multiply(temp);
    /////////////////////////////////////////
    moonGeometry.worldMatrix.makeIdentity();
    earthGeometry.worldMatrix.makeIdentity();
    earthCloudsGeometry.worldMatrix.makeIdentity();

    // using this info for the cloud and earth
    temp = temp.multiply(earthR.clone()).multiply(earthT.clone()); 

    earthGeometry.worldMatrix.multiply(temp.clone()).multiply(earthRS).multiply(earthScale);
    earthCloudsGeometry.worldMatrix.multiply(temp.clone()).multiply(cloudR).multiply(cloudS)
    
    
    moonGeometry.worldMatrix.multiply(earthR).multiply(earthT).multiply(moonRM).multiply(moonTM.clone()).multiply(moonRMS).multiply(moonScale);


    var cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);

    gl.uniform1f(uniformse.twinkelUniform, Math.sin(time.secondsElapsedSinceStart * 5)+ 1.5) // makes the stars twinkel
//////all stars///////////////////////////////////////////
    for(x=0; x < star1.length; x++){
        star1[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }
    gl.uniform1f(uniformse.twinkelUniform, Math.sin(time.secondsElapsedSinceStart * 5 - random1 + 1)+ 1.5)
    for(x=0; x < star1.length; x++){
        star2[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }

    random1 = Math.floor((Math.random() * 10) * time.deltaTime);
    gl.uniform1f(uniformse.twinkelUniform, Math.sin(time.secondsElapsedSinceStart * 5 - random1 + 1)+ 1.5)
    for(x=0; x < star1.length; x++){
        star3[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }

    for(x=0; x < star1.length; x++){
        star4[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }
    for(x=0; x < star1.length; x++){
        star5[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }
    for(x=0; x < star1.length; x++){
        star6[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }

    for(x=0; x < star1.length; x++){
        star7[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }
    gl.uniform1f(uniformse.twinkelUniform, Math.sin(time.secondsElapsedSinceStart * 5 - random1 + 1)+ 1.5)
    for(x=0; x < star1.length; x++){
        star8[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }

    random1 = Math.floor((Math.random() * 10) * time.deltaTime);
    gl.uniform1f(uniformse.twinkelUniform, Math.sin(time.secondsElapsedSinceStart * 5 - random1 + 1)+ 1.5)
    for(x=0; x < star1.length; x++){
        star9[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }

    for(x=0; x < star1.length; x++){
        star10[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }
    for(x=0; x < star1.length; x++){
        star11[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }
    for(x=0; x < star1.length; x++){
        star12[x].render(camera, projectionMatrix, emmissiveShaderProgram);
    }
    /////////////////////////////////////////////////////
    
    ////starField rendering 
    gl.uniform1f(uniformse.twinkelUniform, (Math.sin(time.secondsElapsedSinceStart * 5)/3.9+ 3)/6)
    for(x=0; x < spaceField.length; x++){
        spaceField[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField2[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField3[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField4[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField5[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField6[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField7[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField8[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField9[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField10[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField11[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField12[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField13[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField14[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField15[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField16[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField17[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField18[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField19[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField20[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField21[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField22[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField23[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField24[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField25[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField26[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField27[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField28[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField29[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField30[x].render(camera, projectionMatrix, emmissiveShaderProgram);

        spaceField31[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField32[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField37[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField38[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField39[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField40[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField41[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField42[x].render(camera, projectionMatrix, emmissiveShaderProgram);


        spaceField33[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField34[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField35[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        spaceField36[x].render(camera, projectionMatrix, emmissiveShaderProgram);
        
        
    }
    /////////////////////////////////////////////////////
        
    gl.uniform1f(uniformse.twinkelUniform, (Math.sin(time.secondsElapsedSinceStart * 5 - random1 + 1)+ 13)/20)
    sunGeometry.render(camera, projectionMatrix, emmissiveShaderProgram);

    gl.useProgram(phongShaderProgram);// rendering other planets
    uniforms = phongShaderProgram.uniforms;
    cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    
    mecuryGeometry.render(camera, projectionMatrix, phongShaderProgram);
    venusGeometry.render(camera, projectionMatrix, phongShaderProgram);
    earthGeometry.render(camera, projectionMatrix, phongShaderProgram);
    moonGeometry.render(camera, projectionMatrix, phongShaderProgram);
    marsGeometry.render(camera, projectionMatrix, phongShaderProgram);
    jupiterGeometry.render(camera, projectionMatrix, phongShaderProgram);
    saturnGeometry.render(camera, projectionMatrix, phongShaderProgram);
    uranusGeometry.render(camera, projectionMatrix, phongShaderProgram);
    neptuneGeometry.render(camera, projectionMatrix, phongShaderProgram);







//rendering of the earth cloud
    gl.useProgram(transparencyProgram);
    uniforms = transparencyProgram.uniforms;
    cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);
    gl.uniform1f(uniforms.transparencyVal, 0.5);
    

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    sunFGeometry.render(camera, projectionMatrix, transparencyProgram);
    earthCloudsGeometry.render(camera, projectionMatrix, transparencyProgram);
    gl.uniform1f(uniforms.transparencyVal, 0.8);
    saturnRGeometry.render(camera, projectionMatrix, transparencyProgram);

    /*gl.useProgram(basicColorProgram);
    gl.uniform4f(basicColorProgram.uniforms.colorUniform, 1.0, 1.0, 1.0, 1.0);
    pointLightGeometry.render(camera, projectionMatrix, basicColorProgram);*/

}
