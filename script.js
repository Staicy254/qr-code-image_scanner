document.getElementById('file').addEventListener('change', function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        // Prepare form data
        var formData = new FormData();
        formData.append('file', file);

        // Call fetchRequest function
        fetchRequest(file, formData);
    }
    reader.readAsDataURL(file);
});

function uploadAgain() {
    location.reload();
}

function copyText() {
    var textarea = document.getElementById('result-text');
    textarea.select();
    document.execCommand('copy');
    alert('Text copied to clipboard');
}

function fetchRequest(file, formData) {
    // Displaying information text while scanning QR code
    var imageData = event.target.result;
    document.getElementById('qr-code').src = imageData;
    var infoText = document.getElementById('infoText');
    infoText.innerText = "Scanning QR Code...";

    // Making a POST request to the QR code scanning API
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST',
        body: formData
    })
    .then(res => res.json()) // Parsing the JSON response
    .then(result => {
        // Extracting the scanned data from the response
        result = result[0].symbol[0].data;

        // Updating the information text based on whether QR code was scanned successfully
        infoText.innerText = result ? "Upload QR Code to Scan" : "Couldn't scan QR Code";

        // If no result, return
        if (!result) return;

        // Displaying the scanned data in the textarea
        document.querySelector('.input-container').style.display = 'none';
        document.querySelector('.result-container').style.display = 'flex';
        document.getElementById('result-text').value = result;
    })
    .catch(() => {
        // Handling errors if QR code couldn't be scanned
        infoText.innerText = "Couldn't scan QR Code";
    });
}