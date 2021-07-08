window.addEventListener('DOMContentLoaded', startgame);

//Global Variables
    var r = 0;
    var l = 0;
    var x = 10;
    var down = -300;
    var loop = -10;
    canPlay = true;
    contPlacarX = 0;
    contPlacarO = 0;

// Main function     
function startgame(){
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    engine.runRenderLoop(()=>{
        scene.render();   
        // Lock the camera 
        camera.beta = 0.75;
    }); 
}

//Create all in the scene
function createScene(){
    // Create Scene
        scene = new BABYLON.Scene(engine);

    // X start
        turn = true;
    //Illumination - The HemisphericLight can't cast shadows. <- LOCAL
        const light = new BABYLON.HemisphericLight('light',  new BABYLON.Vector3(0.1,2,0),scene);
        light.intensity = .8;

    //Camera
        camera = new BABYLON.ArcRotateCamera('camera',0, 0, 56, new BABYLON.Vector3(0,0,0), scene);
        camera.attachControl(canvas, true);   
        scene.activeCamera = camera;

    //#Materials
        const groundBoardMaterial = new BABYLON.StandardMaterial('groundBoardMaterial', scene);
        groundBoardMaterial.reflectionTexture = new BABYLON.CubeTexture("img/board/salameBoard", scene);
        groundBoardMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        groundBoardMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

        const groundBoardMaterial2 = new BABYLON.StandardMaterial('groundBoardMaterial2', scene);
        groundBoardMaterial2.diffuseTexture = new BABYLON.Texture('img/board/salame.jpg', scene);
        
        const textureSalame = new BABYLON.StandardMaterial('textureSalame', scene);
        textureSalame.diffuseTexture = new BABYLON.Texture('img/board/textura_salame.jpg', scene);
        
        const zeroScoreBoard = new BABYLON.StandardMaterial('zeroScoreBoard', scene);
        zeroScoreBoard.diffuseTexture = new BABYLON.Texture('img/scoreboard/number_0_digital.jpg');

        const oneScoreBoard = new BABYLON.StandardMaterial('oneScoreBoard', scene);
        oneScoreBoard.diffuseTexture = new BABYLON.Texture('img/scoreboard/number_1_digital.jpg');

        const twoScoreBoard = new BABYLON.StandardMaterial('twoScoreBoard', scene);
        twoScoreBoard.diffuseTexture = new BABYLON.Texture('img/scoreboard/number_2_digital.jpg');

        const threeScoreBoard = new BABYLON.StandardMaterial('threeScoreBoard', scene);
        threeScoreBoard.diffuseTexture = new BABYLON.Texture('img/scoreboard/number_3_digital.jpg');

    //ScoreBoard X & O
        // X
        var placarX = new BABYLON.Mesh.CreateBox("placarX", 13, scene);
        placarX.position = new BABYLON.Vector3(0, 0, -28);
        if(contPlacarX == 0){
            placarX.material = zeroScoreBoard;
        }else if(contPlacarX == 1){
                placarX.material = oneScoreBoard;
        }else if(contPlacarX == 2){
                placarX.material = twoScoreBoard;
        }
        
        // O
        var placarO = new BABYLON.Mesh.CreateBox("placarO", 13, scene);
        placarO.position = new BABYLON.Vector3(0, 0, 28);
        if(contPlacarO == 0){
            placarO.material = zeroScoreBoard;
        }else if(contPlacarO == 1){
                placarO.material = oneScoreBoard;
        }else if(contPlacarO == 2){
                placarO.material = twoScoreBoard;
        }

        // Scoreboard Animation
        scene.registerAfterRender(function() {
            if (contPlacarX == 3){placarX.position.y = r;placarO.position.y = l;}
            if (contPlacarO== 3){placarO.position.y = r;placarX.position.y = l} 
            placarX.rotate(BABYLON.Axis.Y, -Math.PI/64, BABYLON.Space.WORLD); 
            placarO.rotate(BABYLON.Axis.Y, Math.PI/64, BABYLON.Space.WORLD); 

            l = (l + 1) % (down-1);
            r = (r + 1) % (loop-1);
        });

    // Create Meshes    
        // Board
        const groundBoard = new BABYLON.Mesh.CreateBox('ground', 35, scene);
        groundBoard.scaling.y = 0.2;
        groundBoard.position = new BABYLON.Vector3(0, 1, 0);
        groundBoard.material = groundBoardMaterial;

        // Grid Meshes
        const cross1 = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 34, diameterY: 0.4, diameterZ: 0.7}, scene);
        cross1.position = new BABYLON.Vector3(-5.3, 5, 0);
        cross1.rotation = new BABYLON.Vector3(0, 7.85, 0);

        const cross2 = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 34, diameterY: 0.4, diameterZ: 0.7}, scene);
        cross2.position = new BABYLON.Vector3(5.3, 5, 0);
        cross2.rotation = new BABYLON.Vector3(0, 7.85, 0);
        
        const cross3 = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 34, diameterY: 0.4, diameterZ: 0.7}, scene);
        cross3.position = new BABYLON.Vector3(0, 5, 5.3);
        
        const cross4 = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 34, diameterY: 0.4, diameterZ: 0.7}, scene);
        cross4.position = new BABYLON.Vector3(0, 5, -5.3);
        
        const cross = BABYLON.Mesh.MergeMeshes([cross1, cross2, cross3, cross4]);
        cross.material = textureSalame;

    // Create board positions    
        board = [
            {},{},{},
            {},{},{},
            {},{},{}
        ];

        for (i = 0; i < board.length; i++){
            board[i] = new BABYLON.Mesh.CreateBox(`box${i}`, 6.5, scene);
            if(i<3){
                board[i].position.x += (i * -10) + x;
                board[i].position.y += 1.8;
                board[i].position.z = -11.3;
            }else if(i >= 3 && i < 6){
                board[i].position.x +=(i * -10) + 40;
                board[i].position.y += 1.8;
            }else{
                board[i].position.x += (i * -10) + 70;
                board[i].position.y += 1.8;
                board[i].position.z = 11.3;
            }
            board[i].value = null;
            board[i].material = textureSalame;
            board[i].freezeWorldMatrix();
            board[i].actionManager = new BABYLON.ActionManager(scene);
            board[i].actionManager.registerAction(clickEvent());
            x=+10;
        
    }   
    // Create Event each null position double click
        function clickEvent(){ 
            const execCode =  new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnDoublePickTrigger, (event) => {
                    if(event.meshUnderPointer.value === null ){
                        console.log(board.indexOf(event.meshUnderPointer));
                        if(canPlay){    
                            if (turn){
                                event.meshUnderPointer.value = 'x';
                                makeX(event.meshUnderPointer);                        
                                win();
                            }else{
                                event.meshUnderPointer.value = 'o';
                                makeO(event.meshUnderPointer);
                                win();
                            }
                        }
                    }
            });
            return execCode;
        }
    
    // Create X    
        function makeX(meshPosition){
            meshX1 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 7, diameterY: 0.7, diameterZ: 0.7});
            meshX1.rotation.y = 3.9;
            meshX2 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 7, diameterY: 0.7, diameterZ: 0.7});
            meshX2.rotation.y = -3.9;
            const meshX = BABYLON.Mesh.MergeMeshes([meshX1, meshX2]);
            meshX.parent = meshPosition;
            meshX.value = turn;
            meshX.position.y = 4.3;
            meshX.material = textureSalame;
            meshPosition.material = groundBoardMaterial;
            turn = !turn;
        }

    // Create O    
        function makeO(meshPosition){
            meshO = new BABYLON.Mesh.CreateTorus('o',5, 1,50, scene);
            meshO.parent = meshPosition;
            meshPosition.material = groundBoardMaterial2;
            meshO.position.y = 4.3;
            meshO.material = textureSalame;
            meshO.value = turn;
            turn = !turn;
        }

    // Verify every move    
        function win(){
            if ((board[0].value == board[1].value) && (board[0].value == board[2].value) && (board[1].value!=null)){
                if(board[1].value == 'x'){
                    contPlacarX += 1;
                    if(contPlacarX == 3) {
                        placarX.material = threeScoreBoard;
                    }
                }else{
                    contPlacarO += 1;
                    if(contPlacarO == 3){
                        placarO.material = threeScoreBoard;
                    }
                }
                const winLine = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 30, diameterY: 0.4, diameterZ: 1}, scene);
                winLine.position = new BABYLON.Vector3(0, 6.5, -11.3);
                winLine.material = textureSalame;
                canPlay = !canPlay;
                resetGame();
            
            }else if((board[3].value == board[4].value) && (board[3].value== board[5].value) && (board[4].value!=null)){
                if(board[4].value == 'x'){
                    contPlacarX += 1;
                    if(contPlacarX == 3) {
                        placarX.material = threeScoreBoard;
                    }
                }else{
                    contPlacarO += 1;
                    if(contPlacarO == 3){
                        placarO.material = threeScoreBoard;
                    }
                }
                const winLine = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 30, diameterY: 0.4, diameterZ: 1}, scene);
                winLine.position = new BABYLON.Vector3(0, 6.5, 0);
                winLine.material = textureSalame;
                canPlay = !canPlay;
                resetGame();
                
            }else if((board[6].value == board[7].value) && (board[6].value == board[8].value) && (board[7].value!=null)){
                if(board[7].value == 'x'){
                    contPlacarX += 1;
                    if(contPlacarX == 3) {
                        placarX.material = threeScoreBoard;
                    }
                }else{
                    contPlacarO += 1;
                    if(contPlacarO == 3){
                        placarO.material = threeScoreBoard;
                    }
                }
                const winLine = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 30, diameterY: 0.4, diameterZ: 1}, scene);
                winLine.position = new BABYLON.Vector3(0, 6.5, 11.3);
                winLine.material = textureSalame;
                canPlay = !canPlay;
                resetGame();

            }else if((board[0].value == board[3].value) && (board[0].value == board[6].value) && (board[3].value!=null)){
                if(board[3].value == 'x'){
                    contPlacarX += 1;
                    if(contPlacarX == 3) {
                        placarX.material = threeScoreBoard;
                    }
                }else{
                    contPlacarO += 1;
                    if(contPlacarO == 3){
                        placarO.material = threeScoreBoard;
                    }
                }
                const winLine = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 30, diameterY: 0.4, diameterZ: 1}, scene);
                winLine.position = new BABYLON.Vector3(10, 6.5, 0);
                winLine.rotation = new BABYLON.Vector3(0, 7.85, 0);
                winLine.material = textureSalame;
                canPlay = !canPlay;
                resetGame();

            }else if((board[1].value == board[4].value) && (board[1].value == board[7].value) && (board[4].value!=null)){            
                if(board[4].value == 'x'){
                    contPlacarX += 1;
                    if(contPlacarX == 3) {
                        placarX.material = threeScoreBoard;
                    }
                }else{
                    contPlacarO += 1;
                    if(contPlacarO == 3){
                        placarO.material = threeScoreBoard;
                    }
                }
                const winLine = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 30, diameterY: 0.4, diameterZ: 1}, scene);
                winLine.position = new BABYLON.Vector3(0, 6.5, 0);
                winLine.rotation = new BABYLON.Vector3(0, 7.85, 0);
                winLine.material = textureSalame;
                canPlay = !canPlay;
                resetGame();
            
            }else if((board[2].value == board[5].value) && (board[2].value == board[8].value) && (board[5].value!=null)){
                if(board[5].value == 'x'){
                    contPlacarX += 1;
                    if(contPlacarX == 3) {
                        placarX.material = threeScoreBoard;
                    }
                }else{
                    contPlacarO += 1;
                    if(contPlacarO == 3){
                        placarO.material = threeScoreBoard;
                    }
                }
                const winLine = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 30, diameterY: 0.4, diameterZ: 1}, scene);
                winLine.position = new BABYLON.Vector3(-10, 6.5, 0);
                winLine.rotation = new BABYLON.Vector3(0, -7.85, 0);
                winLine.material = textureSalame;
                canPlay = !canPlay;
                resetGame();

            }else if((board[0].value == board[4].value) && (board[0].value == board[8].value) && (board[4].value!=null)){
                if(board[4].value == 'x'){
                    contPlacarX += 1;
                    if(contPlacarX == 3) {
                        placarX.material = threeScoreBoard;
                    }
                }else{
                    contPlacarO += 1;
                    if(contPlacarO == 3){
                        placarO.material = threeScoreBoard;
                    }
                }
                const winLine = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 45, diameterY: 0.4, diameterZ: 1}, scene);
                winLine.position = new BABYLON.Vector3(0, 6.5, 0);
                winLine.rotation = new BABYLON.Vector3(0, 4, 0);
                winLine.material = textureSalame;
                canPlay = !canPlay;
                resetGame();

            }else if((board[2].value == board[4].value) && (board[2].value == board[6].value) && (board[4].value!=null)){
                if(board[4].value == 'x'){
                    contPlacarX += 1;
                    if(contPlacarX == 3) {
                        placarX.material = threeScoreBoard;
                    }
                }else{
                    contPlacarO += 1;
                    if(contPlacarO == 3){
                        placarO.material = threeScoreBoard;
                    }
                }
                const winLine = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 45, diameterY: 0.4, diameterZ: 1}, scene);
                winLine.position = new BABYLON.Vector3(0, 6.5, 0);
                winLine.rotation = new BABYLON.Vector3(0, -4, 0);
                winLine.material = textureSalame;
                canPlay = !canPlay;
                resetGame();

            }else{
                if(!(board.some(haveNull))){
                    console.log("VELHA");
                    resetGame();
                }
            }
        }

    // Aux function to .some() JS function
        function haveNull(pos) {
            return pos.value == null;
        }

    // Restart all game or turn    
        function resetGame(){
            setTimeout(()=>{
                if(contPlacarX == 3 || contPlacarO == 3){
                    contPlacarO = 0;
                    contPlacarX = 0;
                }
                scene.dispose();
                createScene();
                canPlay = true;
            },4000)
        
        } 

    return scene;
}