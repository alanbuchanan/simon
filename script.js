$(function(){

    var counter = 0;
    var cpuArray = [];
    var cpuSlice = [];
    var numArray = [];
    var userArray = [];
    var num = 1;
    var wins = 0;
    var losses = 0;
    var cpuLoop = false;
    var timeoutsArray = [];
    var milisecs = 600;

    // Initialise the game
    function init(){
        $('#roundNumber').html('1');
        counter = 0;
        cpuArray = [];
        numArray = [];
        userArray = [];
        cpuLoop = false;
        milisecs = 600;
        $('#whoseTurn').html('CPU\'s turn...');
        num = 1;

        // Create cpuArray
        function generateRandomNum(min, max){
            return Math.floor(Math.random() * (max - min) + min);
        }

        for(var i = 1; i <= 20; i++){
            numArray.push(generateRandomNum(0, 4));
        }

        for(var i = 0; i < numArray.length; i++){
            switch(numArray[i]){
                case 0:
                    cpuArray.push('a');
                    break;
                case 1:
                    cpuArray.push('b');
                    break;
                case 2:
                    cpuArray.push('c');
                    break;
                case 3:
                    cpuArray.push('d');
                    break;
            }
        }
        console.log('cpuArray: ' + cpuArray);
        cpuSlice = cpuArray.slice(0, num);
        goUpToPoint(cpuSlice);
    }

    init();

    var looperA, looperB, looperC, looperD;

    // Cpu plays sounds and lights up depending on cpuArray
    function cpuPlayList(input, time){
        timeoutsArray.push(setTimeout(function(){
            console.log("testing");
            if(input === 'a'){
                timeoutsArray.push(setTimeout(function(){
                    aSoundCpu.play();
                    $('#a').fadeOut(1).fadeIn(200);
                }, time * milisecs));
            } else if(input === 'b'){
                timeoutsArray.push(setTimeout(function(){
                    bSoundCpu.play();
                    $('#b').fadeOut(1).fadeIn(200);
                }, time * milisecs));
            } else if(input === 'c'){
                timeoutsArray.push(setTimeout(function(){
                    cSoundCpu.play();
                    $('#c').fadeOut(1).fadeIn(200);
                }, time * milisecs));
            } else if(input === 'd'){
                timeoutsArray.push(setTimeout(function(){
                    dSoundCpu.play();
                    $('#d').fadeOut(1).fadeIn(200);
                }, time * milisecs));
            }
        }, 1750));
    };

    // CPU takes its turn
    function goUpToPoint(arr){
        cpuLoop = true;
        $('#whoseTurn').html('CPU\'s turn...');
        console.log('cpuLoop: ' + cpuLoop);
        for(var i = 0; i < arr.length; i++){
            cpuPlayList(arr[i], i);
        }
        //cpuLoop = false;
        setTimeout(function() {
            cpuLoop = false;
            $('#whoseTurn').html('Your turn!');
            console.log(cpuLoop);
        }, arr.length * 500 + 1750);

        console.log('cpuLoop: ' + cpuLoop);
    }

    // User presses restart button
    $('.btn-warning').click(function(){
        console.log("user reset button");
        for(var i = 0; i < timeoutsArray.length; i++) {
            clearTimeout(timeoutsArray[i]);
        }
        timeoutsArray = [];
        init();
    });

    // Array comparison helper
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }

    // User presses one of the four main buttons
    function buttonPress(val){

        console.log('strict?: ' + $('#strict').prop('checked'));
        console.log('cpuSlice: ' + cpuSlice);
        userArray.push(val);
        console.log('userArray: ' + userArray);

        // If the user selected an incorrect option
        if(val !== cpuSlice[counter])
        //Strict mode off
            if(!$('#strict').prop('checked')){
                // Strict mode off
                alert('Wrong move! I\'ll show you again...');
                userArray = [];
                console.log('cpuSlice: ' + cpuSlice);
                goUpToPoint(cpuSlice);
                counter = 0;
            } else {
                //Strict mode on
                losses++;
                $('#lossCount').html(losses);
                ui_alert('You lose! New Game?');
                return;
            } else {
            // User guessed correctly

            if(val === 'a'){ aSoundCpu.play(); }
            if(val === 'b'){ bSoundCpu.play(); }
            if(val === 'c'){ cSoundCpu.play(); }
            if(val === 'd'){ dSoundCpu.play(); }
            counter++;
        }
        if(counter === cpuSlice.length){
            $('#roundNumber').html(counter + 1);
        }
        // If user has made it to the end
        if(counter === 20){
            ui_alert('YOU WIN!');
            $('#winCount').html(++wins);
            return;
        }

        // Getting faster the further you go
        if(counter === 5){ milisecs = 500; }
        if(counter === 9){ milisecs = 450; }
        if(counter === 13){ milisecs = 400; }

        console.log('counter: ' + counter);
        if(counter === cpuSlice.length){
            console.log('num: ' + num);
            cpuSlice = cpuArray.slice(0, ++num);
            console.log('userArray:' + userArray);
            userArray = [];
            console.log('cpuSlice: ' + cpuSlice);
            goUpToPoint(cpuSlice);
            counter = 0;
        }
    }

    // Button presses
    $('#a').mousedown(function(){
        if(!cpuLoop){
            buttonPress('a');
        }
    });
    $('#b').mousedown(function(){
        if(!cpuLoop) {
            buttonPress('b');
        }
    });
    $('#c').mousedown(function(){
        if(!cpuLoop){
            buttonPress('c');
        }
    });
    $('#d').mousedown(function(){
        if(!cpuLoop){
            buttonPress('d');
        }
    });

    // jQuery-UI alert for when the user has either won or lost
    function ui_alert(output_msg) {

        $("<div></div>").html(output_msg).dialog({
            height: 150,
            width: 240,
            resizable: false,
            modal: true,
            position: { my: "top", at: "center", of: window },
            buttons: [
                {
                    text: "Ok",
                    click: function () {
                        $(this).dialog("close");
                        init();
                    }
                }
            ]
        });
    }

    function ui_alert(output_msg){
        $("<div></div>").html(output_msg).dialog({
            height: 150,
            width: 240,
            resizable: false,
            modal: true,
            position: { my: "top", at: "center", of: window },
            buttons: [
                {
                    text: "Ok",
                    click: function () {
                        $(this).dialog("close");
                        init();
                    }
                }
            ]
        });
    }

    // Sound links
    var aSoundCpu = new Howl({
        urls: ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'],
        loop: false
    });
    var bSoundCpu = new Howl({
        urls: ['https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'],
        loop: false
    });
    var cSoundCpu = new Howl({
        urls: ['https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'],
        loop: false
    });
    var dSoundCpu = new Howl({
        urls: ['https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'],
        loop: false
    });
});