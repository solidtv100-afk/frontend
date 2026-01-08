/* =====================================================
   CONFIG — CHANGE ONLY THIS IF BACKEND URL CHANGES
===================================================== */

const BACKEND_URL = 'https://jpg-to-pdf.onrender.com/convert';

/* =====================================================
   DOM ELEMENTS
===================================================== */

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const errorText = document.getElementById('errorText');

/* =====================================================
   CLICK TO UPLOAD
===================================================== */

dropZone.addEventListener('click', () => {
  fileInput.click();
});

/* =====================================================
   DRAG & DROP SUPPORT
===================================================== */

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

  if (e.dataTransfer.files.length !== 1) {
    showError();
    return;
  }

  handleFile(e.dataTransfer.files[0]);
});

/* =====================================================
   FILE INPUT
===================================================== */

fileInput.addEventListener('change', () => {
  if (fileInput.files.length !== 1) {
    showError();
    return;
  }

  handleFile(fileInput.files[0]);
});

/* =====================================================
   FILE VALIDATION (FRONTEND ONLY)
===================================================== */

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

/* =====================================================
   UPLOAD + BACKEND CONNECTION
===================================================== */

function uploadFile(file) {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  formData.append('file', file);

  progressContainer.classList.remove('hidden');
  progressBar.style.width = '0%';

  xhr.open('POST', BACKEND_URL, true);
  xhr.responseType = 'blob';

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressBar.style.width = percent + '%';
    }
  };

  xhr.onload = () => {
    resetProgress();

    if (xhr.status === 200 && xhr.response) {
      autoDownload(xhr.response);
    } else {
      showError();
    }
  };

  xhr.onerror = () => {
    resetProgress();
    showError();
  };

  xhr.send(formData);
}

/* =====================================================
   MOBILE-SAFE PDF OPEN / DOWNLOAD
===================================================== */

function autoDownload(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.target = '_blank';   // REQUIRED for Android / iOS
  a.rel = 'noopener';

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

/* =====================================================
   UI HELPERS
===================================================== */

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
