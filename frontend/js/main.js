
function showError(input, errorElement, message){
    input.classList.add("error");
    errorElement.textContent = message;
}

function clearError(input, errorElement){
    input.classList.remove("error");
    errorElement.textContent = "";
}

