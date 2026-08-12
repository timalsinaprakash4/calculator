import { useState, useEffect } from 'react'

const Calculator = () => {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  useEffect(() => {
    // Auto-resize display to fit content
    const resizeDisplay = () => {}
    window.addEventListener('resize', resizeDisplay)
    return () => window.removeEventListener('resize', resizeDisplay)
  }, [])

  const handleNumberClick = (number) => {
    if (waitingForNewValue) {
      setDisplay(number.toString())
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? number.toString() : display + number.toString())
    }
  }

  const handleOperatorClick = (op) => {
    if (operator && !waitingForNewValue) {
      // Calculate result with existing operator before changing it
      calculateResult(op)
    } else {
      setPreviousValue(parseFloat(display))
      setWaitingForNewValue(true)
      setOperator(op)
    }
  }

  const handleEqualsClick = () => {
    if (operator && previousValue !== null) {
      calculateResult(operator)
      setDisplay('0')
      setPreviousValue(null)
      setOperator(null)
      setWaitingForNewValue(true)
    }
  }

  const handleClearClick = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForNewValue(false)
  }

  const calculateResult = (op) => {
    const currentValue = parseFloat(display)
    let result
    
    switch(op) {
      case '+':
        result = previousValue + currentValue
        break
      case '-':
        result = previousValue - currentValue
        break
      case '×':
        result = previousValue * currentValue
        break
      case '÷':
        result = previousValue / currentValue
        break
      default:
        return
    }

    // Handle floating point precision issues
    const formattedResult = Math.round(result * 10000) / 10000
    
    setDisplay(formattedResult.toString())
    
    if (op === '÷' && currentValue === 0) {
      setDisplay('Error')
    } else {
      setPreviousValue(formattedResult)
      setWaitingForNewValue(true)
      setOperator(null)
    }
  }

  const handlePercentageClick = () => {
    if (display !== '0' && display !== 'Error') {
      const value = parseFloat(display) / 100
      setDisplay(value.toString())
    }
  }

  const handleSignChange = () => {
    if (display !== '0' && display !== 'Error') {
      const newValue = -parseFloat(display)
      setDisplay(newValue.toString())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Display */}
        <div className="bg-gray-50 px-6 py-8 text-right border-b border-gray-100">
          <div className="text-gray-400 text-lg h-6 mb-1">{operator && !waitingForNewValue ? `${previousValue} ${operator}` : ''}</div>
          <div 
            id="display"
            onClick={handleClearClick}
            className={`font-light tracking-tight transition-all duration-200 cursor-pointer hover:bg-gray-100 rounded-lg px-2 py-1 -ml-4`}
            style={{ fontSize: display.length > 9 ? '2rem' : display.length > 6 ? '3.5rem' : '4rem', color: '#1f2937' }}
          >
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4">
          {/* Top row - AC, +/- , %, ÷ */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <button 
              onClick={handleClearClick}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            >
              AC
            </button>
            <button 
              onClick={handleSignChange}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            >
              +/-
            </button>
            <button 
              onClick={handlePercentageClick}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            >
              %
            </button>
            <button 
              onClick={() => handleOperatorClick('÷')}
              className={`${operator === '÷' && !waitingForNewValue ? 'bg-orange-400 text-white' : 'bg-gray-200 hover:bg-gray-300'} font-semibold rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm ${operator === '÷' && !waitingForNewValue ? '' : 'text-orange-600'}`}
            >
              ÷
            </button>
          </div>

          {/* Numbers 7,8,9 and × */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <button onClick={() => handleNumberClick(7)} className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200">
              7
            </button>
            <button onClick={() => handleNumberClick(8)} className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200">
              8
            </button>
            <button onClick={() => handleNumberClick(9)} className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200">
              9
            </button>
            <button 
              onClick={() => handleOperatorClick('×')}
              className={`${operator === '×' && !waitingForNewValue ? 'bg-orange-400 text-white' : 'bg-gray-100 hover:bg-gray-200'} font-semibold rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm ${operator === '×' && !waitingForNewValue ? '' : 'text-orange-600 border border-gray-300'}`}
            >
              ×
            </button>
          </div>

          {/* Numbers 4,5,6 and - */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <button onClick={() => handleNumberClick(4)} className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200">
              4
            </button>
            <button onClick={() => handleNumberClick(5)} className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200">
              5
            </button>
            <button onClick={() => handleNumberClick(6)} className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200">
              6
            </button>
            <button 
              onClick={() => handleOperatorClick('-')}
              className={`${operator === '-' && !waitingForNewValue ? 'bg-orange-400 text-white' : 'bg-gray-100 hover:bg-gray-200'} font-semibold rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm ${operator === '-' && !waitingForNewValue ? '' : 'text-orange-600 border border-gray-300'}`}
            >
              -
            </button>
          </div>

          {/* Numbers 1,2,3 and + */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <button onClick={() => handleNumberClick(1)} className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200">
              1
            </button>
            <button onClick={() => handleNumberClick(2)} className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200">
              2
            </button>
            <button onClick={() => handleNumberClick(3)} className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200">
              3
            </button>
            <button 
              onClick={() => handleOperatorClick('+')}
              className={`${operator === '+' && !waitingForNewValue ? 'bg-orange-400 text-white' : 'bg-gray-100 hover:bg-gray-200'} font-semibold rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm ${operator === '+' && !waitingForNewValue ? '' : 'text-orange-600 border border-gray-300'}`}
            >
              +
            </button>
          </div>

          {/* 0, . and = */}
          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={() => handleNumberClick(0)}
              className={`col-span-2 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-start pl-7 transition-all duration-200 active:scale-95 shadow-sm border border-gray-200`}
            >
              0
            </button>
            <button 
              onClick={() => handleNumberClick('.')}
              className="bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-gray-200"
            >
              .
            </button>
            <button 
              onClick={handleEqualsClick}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-full h-16 w-16 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            >
              =
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">Calculator App</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        
        button:focus-visible, 
        div[role="button"]:focus-visible {
          outline: none;
          ring: 2px solid #3b82f6;
          ring-offset: 4px;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        /* Number button active state */
        .number-btn-active {
          background-color: #f3f4f6 !important;
          transform: scale(0.98) !important;
        }
      `}</style>
      
      <Calculator />
    </>
  )
}

export default App
