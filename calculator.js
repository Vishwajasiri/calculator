// script.js
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function handleKeyPress(event) {
    const { key } = event;

    if (key === 'Escape') {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (key === 'Backspace') {
        calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
        updateDisplay();
        return;
    }

    if (/\d/.test(key)) {
        inputDigit(key);
        updateDisplay();
        return;
    }

    if (key === '.') {
        inputDecimal(key);
        updateDisplay();
        return;
    }

    if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
        updateDisplay();
        return;
    }

    if (key === 'Enter' || key === '=') {
        handleOperator('=');
        updateDisplay();
        return;
    }
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    
    // Update display to show the operator
    if (nextOperator !== '=') {
        calculator.displayValue = nextOperator;
    }
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case 'all-clear':
            resetCalculator();
            break;
        case 'delete':
            calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
            break;
        case '=':
            handleOperator(value);
            break;
        case '%':
            handleOperator(value);
            break;
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        default:
            if (/\d/.test(value)) {
                inputDigit(value);
            }
    }

    updateDisplay();
});

document.addEventListener('keydown', handleKeyPress);

updateDisplay();
