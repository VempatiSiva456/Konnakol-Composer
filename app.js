
function initializeTalam() {
    let talam = [];
    let isPlaying = false;
    let count = 0;
    let currentSignature = "4/4";
    let currentSpeed = "1";
    let timeoutId;

    function setControlsEnabled(enabled) {
        document.getElementById("playButton").disabled = !enabled;
        document.getElementById("stopButton").disabled = !enabled;
        document.getElementById("restartButton").disabled = !enabled;
        document.getElementById("timeSignature").disabled = !enabled;
        document.getElementById("speed").disabled = !enabled;
    }
    
    function updateTalamArray() {
    let userInput = document.getElementById("userTalam").value.trim().split(/\s+/);
    if (userInput.length !== 8) {
        alert("Please enter exactly 8 syllables.");
        setControlsEnabled(false);
        return false;
    }

  
    switch (currentSpeed) {
        case '1/2':
            talam = userInput.map(syllable => `(${syllable})`);
            break;
        case '1':
            talam = userInput;
            break;
        case '2':
            talam = userInput.map((syllable, index) => {
                return index % 2 === 0 && index + 1 < userInput.length ? userInput[index] + userInput[index + 1] : '';
            }).filter(syllable => syllable !== '');
            break;
        case '3':
            talam = userInput.map((syllable, index) => {
                return index % 3 === 0 && index + 3 < userInput.length ? userInput[index] + userInput[index + 1] + userInput[index + 2] + userInput[index + 3] : '';
            }).filter(syllable => syllable !== '');
            break;
        default:
            talam = userInput;
    }
    setControlsEnabled(true); 
    return true;
}


    function calculateDelay(x) {
        let factor = {
            '4/4': 1000,
            '8/8': 500,
            '16/16': 250,
            '4/8': 500,
            '8/4': 1000,
            '3/4': 1000,
            '9/8': 500
        };
        return (factor[currentSignature] || 1000) * x;
    }

    function playTalam() {
        let x = 1;
        if (isPlaying) {
            if (currentSpeed === "1/2") {
                x = 2;
            }
            let syllable = talam[count % talam.length];
            document.getElementById("output").innerHTML += syllable + " ";
            count++;
            if (count % (parseInt(currentSignature.split('/')[0]) / x) === 0) {
                document.getElementById("output").innerHTML += "| ";
            }
            timeoutId = setTimeout(playTalam, calculateDelay(x));
        }
    }
    
    document.getElementById("proceedButton").onclick = function() {
        if(updateTalamArray()) { 
            setControlsEnabled(true);
        } else {
            setControlsEnabled(false);
        }
    };

    document.getElementById("timeSignature").addEventListener('change', function() {
        currentSignature = this.value;
        if (isPlaying) {
            clearTimeout(timeoutId);
            playTalam();
        }
    });
    
    document.getElementById("speed").addEventListener('change', function() {
        currentSpeed = this.value;
        updateTalamArray();
        if (isPlaying) {
            clearTimeout(timeoutId);
            playTalam();
        }
    });
    
    document.getElementById("userTalam").addEventListener('change', updateTalamArray);

    document.getElementById("playButton").onclick = function() {
        if (!isPlaying) {
            isPlaying = true;
            playTalam();
        }
    };

    document.getElementById("stopButton").onclick = function() {
        isPlaying = false;
        clearTimeout(timeoutId);
        document.getElementById("output").innerHTML += "Stopped. ";
    };
    
    document.getElementById("restartButton").onclick = function() {
        document.getElementById("output").innerHTML = "";
        clearTimeout(timeoutId);
        count = 0;
        if (isPlaying) {
            playTalam();
        }
    };

    updateTalamArray(); 
}

function initializeRhythmVariations() {
    let isPlaying = false;
    let rhythmTimeoutId;

    function setRhythmControlsEnabled(enabled) {
        document.getElementById("playRhythmButton").disabled = !enabled;
        document.getElementById("stopRhythmButton").disabled = !enabled;
        document.getElementById("restartRhythmButton").disabled = !enabled;
        document.getElementById("rhythmPattern").disabled = !enabled;
    }

    function updateRhythmArray() {
        let userInput = document.getElementById("rhythmInput").value.trim().split(/\s+/);
        if (userInput.length !== 8) {
            alert("Please enter exactly 8 syllables.");
            setRhythmControlsEnabled(false);
            return false;
        }
        setRhythmControlsEnabled(true);
        return true;
    }

    function playRhythmVariations() {
        if (!isPlaying) return;
        let userInput = document.getElementById("rhythmInput").value.trim().split(/\s+/);
        let pattern = document.getElementById("rhythmPattern").value.split('+').map(Number);
        let rhythmOutput = document.getElementById("rhythmOutput");
        let syllableIndex = 0;
    
        let newOutput = "";
        pattern.forEach((count) => {
            let part = [];
            for (let i = 0; i < count && syllableIndex < userInput.length; i++) {
                part.push(userInput[syllableIndex++]);
            }
            newOutput += part.join('') + ' ';
        });
        newOutput += '| '; 
        rhythmOutput.innerHTML += newOutput;
    
        
        rhythmTimeoutId = setTimeout(playRhythmVariations, 500); 
    }
    
    
    document.getElementById("proceedRhythmButton").addEventListener('click', function() {
        if (updateRhythmArray()) {
            setRhythmControlsEnabled(true);
        } else {
            setRhythmControlsEnabled(false);
        }
    });
    
    

    document.getElementById("playRhythmButton").addEventListener('click', function() {
        if (!isPlaying) {
            isPlaying = true;
            playRhythmVariations(); 
        }
    });
    
    document.getElementById("stopRhythmButton").addEventListener('click', function() {
        isPlaying = false;
        clearTimeout(rhythmTimeoutId);
        rhythmOutput.innerHTML += "Stopped. "; 
    });
    
    document.getElementById("restartRhythmButton").addEventListener('click', function() {
        document.getElementById("rhythmOutput").innerHTML = ""; 
        if (isPlaying) {
            playRhythmVariations();
        }
    });
    
    

    updateRhythmArray();
}

window.addEventListener('load', function() {
    initializeTalam();
    initializeRhythmVariations();
});