document.getElementById("save").addEventListener("click", getQA);

function getQA() {

	var question = document.getElementById("question").value; 
	var answer = document.getElementById("answer").value;

    if ((question === null) || (answer === null)) {
        alert("There must be both a question and answer.");
        return false
    } else if ((question.length < 3) || (answer.length < 3)) {
        alert('Invalid length for question or answer')
    } else {
    		localStorage.setItem("question", question);
			localStorage.setItem("answer", answer);
    }

    var qA = [localStorage.getItem("question"), localStorage.getItem("answer")];
	return qA;
};

document.getElementById("save").addEventListener("click", function() {
    getQA();
});