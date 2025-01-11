import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScaledSize } from 'react-native';

export default function Calculator() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevNum, setPrevNum] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  // Handle screen dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Dynamic styles based on screen size
  const getDynamicStyles = (window: ScaledSize) => {
    const isPortrait = window.height > window.width;
    const baseWidth = isPortrait ? window.width : window.height * 0.9;
    const calculatorWidth = Math.min(baseWidth * 0.95, 500);
    
    return StyleSheet.create({
      dynamicCalculator: {
        width: calculatorWidth,
        padding: calculatorWidth * 0.04,
      },
      dynamicDisplay: {
        padding: calculatorWidth * 0.05,
        marginBottom: calculatorWidth * 0.04,
      },
      dynamicEquationText: {
        fontSize: calculatorWidth * 0.045,
      },
      dynamicDisplayText: {
        fontSize: calculatorWidth * 0.12,
      },
      dynamicButton: {
        margin: calculatorWidth * 0.01,
        borderRadius: calculatorWidth * 0.04,
        padding: calculatorWidth * 0.03,
      },
      dynamicButtonText: {
        fontSize: calculatorWidth * 0.06,
      },
      dynamicBrandText: {
        fontSize: calculatorWidth * 0.035,
      },
    });
  };

  const handleNumber = (num: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else if (display.length < 12) {
      setDisplay(display + num);
    }
    setEquation(equation + num);
  };

  const handleOperation = (op: string) => {
    if (prevNum === null) {
      setPrevNum(parseFloat(display));
    } else if (!shouldResetDisplay) {
      const result = calculate();
      setPrevNum(result);
      setDisplay(result.toString());
    }
    setOperation(op);
    setShouldResetDisplay(true);
    setEquation(equation + ` ${op} `);
  };

  const calculate = () => {
    const current = parseFloat(display);
    let result = 0;
    switch (operation) {
      case '+': result = (prevNum ?? 0) + current; break;
      case '-': result = (prevNum ?? 0) - current; break;
      case '×': result = (prevNum ?? 0) * current; break;
      case '÷': result = current !== 0 ? (prevNum ?? 0) / current : 0; break;
      default: return current;
    }
    return Number(result.toFixed(8));
  };

  const handleEqual = () => {
    if (!operation || shouldResetDisplay) return;
    const result = calculate();
    setDisplay(result.toString());
    setEquation('');
    setPrevNum(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setPrevNum(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setEquation(equation + '0.');
      setShouldResetDisplay(false);
    } else if (!display.includes('.') && display.length < 11) {
      setDisplay(display + '.');
      setEquation(equation + '.');
    }
  };

  const dynamicStyles = getDynamicStyles(dimensions);

  const CalcButton = ({ value, onPress, style, textStyle }: any) => (
    <TouchableOpacity 
      onPress={() => onPress(value)} 
      style={[styles.button, dynamicStyles.dynamicButton, style]}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.buttonText, 
        dynamicStyles.dynamicButtonText, 
        textStyle
      ]}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.calculatorContainer, 
      dynamicStyles.dynamicCalculator
    ]}>
      <View style={[
        styles.displayContainer, 
        dynamicStyles.dynamicDisplay
      ]}>
        <Text style={[
          styles.equationText, 
          dynamicStyles.dynamicEquationText
        ]}>{equation}</Text>
        <Text style={[
          styles.displayText, 
          dynamicStyles.dynamicDisplayText
        ]}>{display}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <CalcButton 
            value="C" 
            onPress={handleClear} 
            style={styles.clearButton}
          />
          <CalcButton 
            value="÷" 
            onPress={() => handleOperation('÷')} 
            style={styles.operationButton}
          />
          <CalcButton 
            value="×" 
            onPress={() => handleOperation('×')} 
            style={styles.operationButton}
          />
          <CalcButton 
            value="-" 
            onPress={() => handleOperation('-')} 
            style={styles.operationButton}
          />
        </View>

        {[['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3']].map((row, idx) => (
          <View key={idx} style={styles.row}>
            {row.map((num) => (
              <CalcButton 
                key={num} 
                value={num} 
                onPress={handleNumber} 
                style={styles.numberButton}
              />
            ))}
            {idx === 0 && (
              <CalcButton 
                value="+" 
                onPress={() => handleOperation('+')} 
                style={styles.operationButton}
              />
            )}
          </View>
        ))}

        <View style={styles.row}>
          <CalcButton 
            value="0" 
            onPress={handleNumber} 
            style={[styles.numberButton, { flex: 2 }]} 
          />
          <CalcButton 
            value="." 
            onPress={handleDecimal} 
            style={styles.numberButton} 
          />
          <CalcButton 
            value="=" 
            onPress={handleEqual} 
            style={styles.equalButton}
          />
        </View>

        <View style={styles.brandContainer}>
  <Text style={[
    styles.brandText,
    dynamicStyles.dynamicBrandText,
    { fontWeight: 'bold' }  
  ]}>
    Calc by Imadoddin
  </Text>
</View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calculatorContainer: {
    backgroundColor: '#808080',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
    alignSelf: 'center',
    marginVertical: 20,
  },
  displayContainer: {
    backgroundColor: '#000000aa',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ffffff22',
  },
  equationText: {
    color: '#999',
    textAlign: 'right',
    fontFamily: 'System',
  },
  displayText: {
    color: '#fff',
    textAlign: 'right',
    fontFamily: 'System',
    fontWeight: '300',
  },
  buttonsContainer: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButton: {
    backgroundColor: '#2c3e50',
  },
  operationButton: {
    backgroundColor: '#2980b9',
  },
  clearButton: {
    backgroundColor: '#c0392b',
  },
  equalButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  brandContainer: {
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ffffff22',
  },
  brandText: {
    color: '#000000',
    
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: 1,
  },
});