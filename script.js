const display = document.querySelector('.display')
const buttons = document.querySelectorAll('button')

let currentInput = '0'
let previousInput = ''
let operation = null
let resetDisplay = false

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    handleInput(button.innerText.trim())
  })
})

window.addEventListener('keydown', (e) => {
  let key = e.key

  if (key === 'Escape' || key === 'c' || key === 'C') key = 'AC'
  if (key === 'Backspace') key = 'X'
  if (key === 'Enter' || key === '=') key = '='
  if (key === '*') key = '×'
  if (key === '/') key = '÷'

  const targetButton = Array.from(buttons).find(
    (btn) => btn.innerText.trim() === key
  )
  if (targetButton) {
    targetButton.focus()
    handleInput(key)
  }
})

function handleInput (value) {
  if (value === 'AC') {
    currentInput = '0'
    previousInput = ''
    operation = null
    updateDisplay()
    return
  }

  if (value === 'X') {
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1)
    } else {
      currentInput = '0'
    }
    updateDisplay()
    return
  }

  if (value === '+/-') {
    currentInput = stripError(parseFloat(currentInput) * -1).toString()
    updateDisplay()
    return
  }

  if (value === '%') {
    currentInput = stripError(parseFloat(currentInput) / 100).toString()
    updateDisplay()
    return
  }

  if (value === '.') {
    if (resetDisplay) {
      currentInput = '0.'
      resetDisplay = false
    } else if (!currentInput.includes('.')) {
      currentInput += '.'
    }
    updateDisplay()
    return
  }

  if (value === '=') {
    if (operation && previousInput !== '') {
      currentInput = calculate(previousInput, currentInput, operation)
      operation = null
      previousInput = ''
      resetDisplay = true
      updateDisplay()
    }
    return
  }

  if (['+', '-', '×', '÷'].includes(value)) {
    if (operation && previousInput !== '' && !resetDisplay) {
      currentInput = calculate(previousInput, currentInput, operation)
    }
    operation = value
    previousInput = currentInput
    resetDisplay = true
    updateDisplay()
    return
  }

  if (/^[0-9]$/.test(value)) {
    if (resetDisplay) {
      currentInput = value
      resetDisplay = false
    } else {
      currentInput = currentInput === '0' ? value : currentInput + value
    }
    updateDisplay()
  }
}

function updateDisplay () {
  display.innerText = currentInput
}

function stripError (num) {
  return parseFloat(Number(num).toFixed(10))
}

function calculate (num1, num2, op) {
  const n1 = parseFloat(num1)
  const n2 = parseFloat(num2)

  if (isNaN(n1) || isNaN(n2)) return '0'

  switch (op) {
    case '+':
      return stripError(n1 + n2).toString()
    case '-':
      return stripError(n1 - n2).toString()
    case '×':
      return stripError(n1 * n2).toString()
    case '÷':
      return n2 === 0 ? 'Error' : stripError(n1 / n2).toString()
    default:
      return '0'
  }
}
