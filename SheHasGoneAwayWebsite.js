function setup() {
  var testi = [
    "She's gone, she's gone, she's gone away.",
    "Dear world, I can hardly recognise you anymore.",
    "And yet I remain certain there is an answer in you.",
    "Maybe that was somebody else. Maybe, I was somebody else.",
    "And no he won't just be a man who's sometimes,he won't just be a man who's sometimes.",
    "You dig in places till your fingers bleed.",
    "Spread the infection, where you spill your seed.",
    "If I start to tell you anything, please don't pay attention.",
    "That's not really me in there, I would never do that.",
    "Just go back to the idea of me. Go back to that idea. Can you even hear me over here?",
    "I am forgiven, I am free. I am a field on fire. I am forgiven, I am free. I am a field on fire.",
    "I'm locked inside here. Have to stay with people who aren't here.",
    "All the way. Pictures and faces nn display with people who aren't here.",
    "I'm goin' back. Of course I am. As if I ever had a choice.",
    "Back to what I always knew I was on the inside. Back to what I really am.",
  ];

  // for every element of the array create a div
  // and place it in a random x, y position
  for (var i = 0; i < testi.length; i += 1) {
    var x = random(0, windowWidth - 715); // avoid breaking lines
    var y = random(0, windowHeight - 20);
    var myDiv = createDiv(testi[i]);
    myDiv.class("white-rectangle");
    myDiv.position(x, y);
  }

  // create the input file button to upload the image
  var fileInput = createFileInput(onFileUpload);
  fileInput.id("file-upload");
  // hide the input file button in css
  // use a label to style the button as the other white rectangles
  // reference: https://stackoverflow.com/questions/572768/styling-an-input-type-file-button/25825731#25825731
  var labelX = random(0, windowWidth - 280);
  var labelY = random(0, windowHeight - 20);
  var label = createElement("label", "The owls are not what they seem.");
  label.attribute("for", "file-upload");
  label.class("white-rectangle");
  label.position(labelX, labelY);
}


// call the onFileUpload funciotn after the user has selected a file
function onFileUpload(secretFile) {
  // start the decode function if the file is an image
  if (secretFile.type === 'image') {
    loadImage(secretFile.data, decode);
  }
}

// take an image and extract an audio file
function decode(img) {
  // create a new array that will contain the bytes composing the audio
  var audio = [];
  img.loadPixels();
  
  // for each group of three pixels (3 pixels contain 1 audio byte)
  // multiply 3*4 because the 4 values of a color (R, G, B, Alpha) are 4 distinct elements in the array 
  for (var i = 0; i < img.pixels.length; i += 3 * 4) { 
    // create an empty string which will contain the binary sequence of an audio byte
    var binaryAudioByte = "";

    // get the first pixel of the group and its RGB values
    var pixelRed = img.pixels[i];
    var pixelGreen = img.pixels[i + 1];
    var pixelBlue = img.pixels[i + 2];

    // convert Red to a binary sequence
    var binaryRed = binary(pixelRed, 8);
    // get the last bit of the Red binary sequence
    // and add it to the binary sequence of the audio byte
    binaryAudioByte = binaryAudioByte + binaryRed.charAt(7);

    // repeat the process for the other colors
    var binaryGreen = binary(pixelGreen, 8);
    binaryAudioByte = binaryAudioByte + binaryGreen.charAt(7);

    var binaryBlue = binary(pixelBlue, 8);
    binaryAudioByte = binaryAudioByte + binaryBlue.charAt(7);

    // get the second pixel of the group 
    // repeat the process done for the first pixel
    pixelRed = img.pixels[i + 4]; // +4 (not +3) to skip Alpha Channel
    pixelGreen = img.pixels[i + 5];
    pixelBlue = img.pixels[i + 6];

    binaryRed = binary(pixelRed, 8);
    binaryAudioByte = binaryAudioByte + binaryRed.charAt(7);

    binaryGreen = binary(pixelGreen, 8);
    binaryAudioByte = binaryAudioByte + binaryGreen.charAt(7);

    binaryBlue = binary(pixelBlue, 8);
    binaryAudioByte = binaryAudioByte + binaryBlue.charAt(7);

    // get the third pixel of the group
    // repeat the process done for the two pixels before
    pixelRed = img.pixels[i + 8];
    pixelGreen = img.pixels[i + 9];
    pixelBlue = img.pixels[i + 10];

    binaryRed = binary(pixelRed, 8);
    binaryAudioByte = binaryAudioByte + binaryRed.charAt(7);

    binaryGreen = binary(pixelGreen, 8);
    binaryAudioByte = binaryAudioByte + binaryGreen.charAt(7);

    // convert the 8 bits of the audio byte to its decimal value
    var audioByte = unbinary(binaryAudioByte);
    // add the audio byte to the audio array
    audio.push(audioByte);

    // use Blue of the third pixel to check if the audio is finished
    // 0 = continue
    // 1 = finished
    binaryBlue = binary(pixelBlue, 8);
    if (binaryBlue.charAt(7) == '1') {
      break; // stop immediately the for cycle
    }
  }

  // create an array of 8 bit integers
  // (by default intergers are 32 bit)
  var audioBytes = new Uint8Array(audio.length);
  // copy all the bytes from the audio array to the new one
  for (i = 0; i < audio.length; i += 1) {
    audioBytes[i] = audio[i];
  }
  // create a file with all the bytes and make it downloadable
  writeFile([audioBytes], "a-bit-of-NIN", "mp3");
}

// implement the binary / unbinary function of Java Processing
// (not avaible in p5.js)
function binary(num, bitNum) {
  // convert a number to a string representing the number in binary
  var binaryString = num.toString(2);
  // add zeros if the binary sequence has not the "bitNum" number of bit
  if (binaryString.length < bitNum) {
    var padding = "";
    for (var i = 0; i < bitNum - binaryString.length; i += 1) {
      padding = padding + "0";
    }
    return padding + binaryString;
  } else {
    return binaryString;
  }
}

function unbinary(binaryString) {
  return parseInt(binaryString, 2);
}
