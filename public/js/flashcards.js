var index_of_list = 0;

function check() {
    var question = document.getElementById("questionInput").value; 
    var answer = document.getElementById("answerInput").value;
    if ((question === '') || (answer === '')) {
        alert("Please enter both a question and answer.");
        return false
    } else if ((question.length < 3) || (answer.length < 3)) {
        alert("Invalid length for question or answer");
        return false
    }
};

function flip(){
    var que = document.getElementById("questionDisplay");
    var ans = document.getElementById("answerDisplay");
    if (ans.style.display == "none") {
        ans.style.display = "block";
        que.style.display = "none";
        document.getElementById("currentDisplay").innerHTML = "Answer";
    } else if(que.style.display == "none") {
        ans.style.display = "none";
        que.style.display = "block";
        document.getElementById("currentDisplay").innerHTML = "Question";
    }
}

function next(){
    document.getElementById("questionDisplay").style.display = "block";
    document.getElementById("answerDisplay").style.display = "none";
    document.getElementById("questionDisplay").innerHTML = "";
    document.getElementById("answerDisplay").innerHTML = "";
    index_of_list = index_of_list + 1

    var qHandle = "{{list.cards.[" + index_of_list + "].question}}";
    var aHandle = "{{list.cards.[" + index_of_list + "].answer}}";

    document.getElementById("questionDisplay").innerHTML = qhandle;
    document.getElementById("answerDisplay").innerHTML = aHandle;

}

function previous(){
    document.getElementById("questionDisplay").style.display = "block";
    document.getElementById("answerDisplay").style.display = "none";
    document.getElementById("questionDisplay").innerHTML = "";
    document.getElementById("answerDisplay").innerHTML = "";

    index_of_list = index_of_list - 1

    var qHandle = "{{list.cards.[" + index_of_list + "].question}}";
    var aHandle = "{{list.cards.[" + index_of_list + "].answer}}";

    document.getElementById("questionDisplay").innerHTML = qhandle;
    document.getElementById("answerDisplay").innerHTML = aHandle;
}

function wipe(){
    document.getElementById("questionDisplay").style.display = "block";
    document.getElementById("answerDisplay").style.display = "none";
    document.getElementById("questionDisplay").innerHTML = "";
    document.getElementById("answerDisplay").innerHTML = "";
    document.getElementById("currentDisplay").innerHTML = "Question";
}


document.getElementById("flipCard").addEventListener("click", function() {
    flip();
});

document.getElementById("nextCard").addEventListener("click", function() {
    next();
});

document.getElementById("previousCard").addEventListener("click", function() {
    previous();
});

document.getElementById("saveButton").addEventListener("click", function() {
    check();
});

document.getElementById("deleteButton").addEventListener("click", function() {
    wipe();
});
