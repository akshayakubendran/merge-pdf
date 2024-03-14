document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const fileCount = document.getElementById('file-count');
    const mergeBtn = document.getElementById('merge-btn');

    let files = [];

    function highlightDropArea() {
        dropArea.classList.add('highlight');
    }

    function unhighlightDropArea() {
        dropArea.classList.remove('highlight');
    }

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        highlightDropArea();
    });

    dropArea.addEventListener('dragleave', (event) => {
        event.preventDefault();
        unhighlightDropArea();
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        unhighlightDropArea();
        handleFiles(event.dataTransfer.files);
    });

    fileInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });

    function handleFiles(fileList) {
        files = Array.from(fileList);
        updateFileCount();
    }

    function updateFileCount() {
        const fileCountText = files.length > 0 ? `Selected ${files.length} file(s)` : '';
        fileCount.textContent = fileCountText;
    }

    mergeBtn.addEventListener('click', () => {
        mergePDFs(files);
    });

    async function mergePDFs(files) {
        if (files.length < 2) {
            alert('Please select at least two PDF files to merge.');
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const response = await fetch('/merge-pdf', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert('Failed to merge PDF files. Please try again.');
        }
    }
});
