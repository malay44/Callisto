var poll = document.getElementById("poll");
var pollBox = document.getElementById("poll-box");
var back = document.getElementById("back");
poll.onclick = function(){blur(true)};
back.onclick = function(){blur(false)};
// pollBox.style.display = "none";


function blur(toggle){
  if (toggle){
    console.log("yess")
    document.getElementById("article_container").style.filter = "blur(8px)";
    document.getElementById("article_container").style.pointerEvents = "none";
    pollBox.style.opacity = "1"
  }
  else{
    console.log("nooo");
    document.getElementById("article_container").style.filter = "blur(0px)";
    document.getElementById("article_container").style.pointerEvents = "auto";
    pollBox.style.opacity = "0"
  }
}