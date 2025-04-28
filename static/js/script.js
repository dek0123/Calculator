document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const historyList = document.getElementById('history-list');

    // Store calculation history
    let calculationHistory = [];

    // Function to update history display
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        calculationHistory.slice(-5).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.innerHTML = `
                <span class="history-expression">${item.expression}</span>
                <span class="history-result">${item.result}</span>
            `;
            historyItem.addEventListener('click', function() {
                display.value = item.result;
            });
            historyList.prepend(historyItem);
        });
    }

    // Safe evaluation function to avoid security issues with eval()
    function safeEval(expression) {
        // Basic validation to prevent malicious code
        if (/[^0-9+\-*/.()% ]/.test(expression)) {
            throw new Error("Invalid expression");
        }

        // Use Function constructor which is slightly safer than direct eval
        try {
            return Function('"use strict";return (' + expression + ')')();
        } catch (error) {
            throw new Error("Calculation error");
        }
    }

    // Add event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.value;

            if (value === '=') {
                try {
                    const expression = display.value;
                    const result = safeEval(expression);

                    // Add to history
                    calculationHistory.push({
                        expression: expression,
                        result: result
                    });

                    // Update display
                    display.value = result;
                    updateHistoryDisplay();
                } catch (error) {
                    display.value = 'Error';
                }
            } else if (value === 'AC') {
                display.value = '';
            } else {
                display.value += value;
            }
        });
    });

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        const key = e.key;

        // Numbers, operators and other supported keys
        if (/[\d+\-*/.%()]/.test(key)) {
            display.value += key;
            e.preventDefault();
        } else if (key === 'Enter') {
            // Handle Enter key as equals
            try {
                const expression = display.value;
                const result = safeEval(expression);

                // Add to history
                calculationHistory.push({
                    expression: expression,
                    result: result
                });

                // Update display
                display.value = result;
                updateHistoryDisplay();
            } catch (error) {
                display.value = 'Error';
            }
            e.preventDefault();
        } else if (key === 'Escape') {
            // Clear display on Escape
            display.value = '';
            e.preventDefault();
        } else if (key === 'Backspace') {
            // Remove last character
            display.value = display.value.slice(0, -1);
            e.preventDefault();
        }
    });
});