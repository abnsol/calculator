const displayResult = document.querySelector("#displayResult");
const displayInfo = document.querySelector("#displayInfo");

//operations
const add = (a,b) => a + b;
const sub = (a,b) => a - b;
const mul = (a,b) => a * b;
const div = (a,b) => b == 0 ? NaN : a/b;
const mod = (a,b) => a % b;

let operand1 = "";
let operand2 = '';
let operator = '';
let result = '';
let afterOperand = false; // where to insert the clicked digit
let afterEquality = false; // to continue operation or to start from zero

function operate(operand1,operand2,operator){
    const operations = {
        "+":add(operand1,operand2),
        "-":sub(operand1,operand2),
        "x":mul(operand1,operand2),
        "/":div(operand1,operand2),
        "%":mod(operand1,operand2),
        }
    return operations[operator];
}

function concatElements(element){

    if(!afterOperand){
        if(operand1.length == 9){
            displayInfo.textContent = "9 digits max";
        }else{
            if (!(operand1.includes('.') && (element == '.'))) operand1 = operand1.concat(element);
        }
        display(operand1);
        
    }else{
        if(operand2.length == 9){
            displayInfo.textContent = "9 digits max";
        }else{
            if (!afterEquality){
                if (!(operand2.includes('.') && (element == '.'))) operand2 = operand2.concat(element);
            }else{
                operand1 = result;
                operand2 = element;
                afterEquality = false;
            }
        }display(operand2);
    }
} 

function returnOperator(key){
    displayInfo.textContent = '';
    if (!afterOperand){ 
        afterOperand = true;
    }else{
        if(operand2 != ''){
            evaluate(operand1,operand2,operator);
            operand1 = result;
            operand2 = '';
        }
    }operator = key;
}

function evaluate(){
    displayInfo.textContent = '';
    result = operate(parseFloat(operand1),parseFloat(operand2),operator)

    // Don't return NaN
    if (Number.isNaN(result)){
        displayResult.textContent = "invalid Operation";
        displayResult.style.fontSize = "30px";
        displayInfo.textContent = 'press AC';
        return;
    }

    if (!Number.isInteger(result)){
        if (result != undefined){
            display(String(result.toFixed(2)));}
    }else{
        display(String(result));
    }
    afterEquality = true;
}

const clear = () => { 
    displayResult.textContent = 0;
    displayInfo.textContent = '';
    displayResult.style.fontSize = '60px';
    operand1 = '';
    operand2 = '';
    result = '';
    afterOperand = false;
    afterEquality = false;
}

const display = (result) => {
    let len = result.length;

    // don't return NaN
    if (Number.isNaN(result)){
        displayResult.textContent = "invalid Operation";
        displayResult.style.fontSize = "30px";
        displayInfo.textContent = 'press AC';
        return;
    }
    // change the fontsize if result > 9 digits
    if (len <= 9){
        displayResult.style.fontSize = '60px';
    }else if(len <= 13){
        displayResult.style.fontSize = '3em';
    }else if(len <= 18){
        displayResult.style.fontSize = '2em';
    }else{
        displayInfo.textContent = "large number";
        return;
    }
    displayResult.textContent = result;
}
    
const reverseSign = () => {
    if (!afterOperand){
        if (operand1.length < 9){
            operand1 = String(0 - parseFloat(operand1));
            display(operand1)
        }else{
            displayInfo.textContent = "9 digits max"; // prevent digit overflow in display
        }   
    }else{
        if(!afterEquality){ //after operand before equal sign
            if (operand2.length < 9){
                operand2 = String(0 - parseFloat(operand2));
                display(operand2)
            }else{
                displayInfo.textContent = "9 digits max";
            }
        }else{
            result = 0 - parseFloat(result); // reverse sign of operand1 = prev result for multiple operation 
            operand1 = String(result);
            display(operand1);
        }
    }
}

function backSpace(){
    //remove by using the substring method
    if (!afterOperand){
        operand1 = operand1.substring(0,operand1.length - 1);
        display(operand1);
    }else{
        if(!afterEquality){
            operand2 = operand2.substring(0,operand2.length - 1);
            display(operand2);
        }else{
            //handles multiple calculations
            str = String(result)
            operand1 = str.substring(0,str.length - 1);
            result = parseFloat(operand1);
            display(operand1);
        }
    }

    if (result.length < 9){
        displayInfo.textContent = '';
    }  
}



function addGlobalEventListener(type,selector,callback){
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) callback(e);
    })
}


// Event handlers
addGlobalEventListener('click','#equals',evaluate);
addGlobalEventListener('click','#AC',clear);
addGlobalEventListener('click','#neg',reverseSign);
addGlobalEventListener('click',"#backspace",backSpace);
addGlobalEventListener('click','.digit',(e) => {
    let element = e.target.textContent;
    concatElements(element);
});
addGlobalEventListener('click','.operand',(e) => {
    let key = e.target.textContent;
    returnOperator(key);
});

