const resultOutput = document.querySelector('#result p');

function submitData() {
    const inputValue = document.getElementById('textInput').value;

    fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: inputValue })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === undefined) {
                resultOutput.textContent = 'Invalid link!';
                setTimeout(() => { resultOutput.textContent = '' }, 3000);
            } else {
                resultOutput.textContent = `Your short link is: ${window.location.href}${data.message}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

resultOutput.addEventListener('click', () => {
    const text = resultOutput.textContent;
    const colonIndex = text.indexOf(':');
    if (colonIndex !== -1) {
        navigator.clipboard.writeText(text.substring(colonIndex + 1).trim());
        resultOutput.textContent = 'Link copied to clipboard!';
        setTimeout(() => { resultOutput.textContent = text }, 3000);
    }
});