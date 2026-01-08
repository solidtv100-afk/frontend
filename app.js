const BACKEND_URL = 'https://YOUR-BACKEND-URL/convert';

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const errorText = document.getElementById('errorText');

// Click upload
dropZone.addEventListener('click', () => {
  fileInput.click();
});

// Drag events
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('border-blue-500');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('border-blue-500');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('border-blue-500');
  handleFile(e.dataTransfer.files[0]);
});

// File input
fileInput.addEventListener('change', () => {
  handleFile(fileInput.files[0]);
});

function handleFile(file) {
  resetUI();

  if (!file) return;

  if (file.type !== 'image/jpeg') {
    showError();
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    showError();
    return;
  }

  uploadFile(file);
}

function uploadFile(file) {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  formData.append('file', file);

  progressContainer.classList.remove('hidden');

  xhr.open('POST', BACKEND_URL, true);
  xhr.responseType = 'blob';

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = percent + '%';
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      autoDownload(xhr.response);
    } else {
      showError();
    }
    resetProgress();
  };

  xhr.onerror = () => {
    showError();
    resetProgress();
  };

  xhr.send(formData);
}

function autoDownload(blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

function showError() {
  errorText.classList.remove('hidden');
}

function resetProgress() {
  progressBar.style.width = '0%';
  progressContainer.classList.add('hidden');
}

function resetUI() {
  errorText.classList.add('hidden');
    }
