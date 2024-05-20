async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    document.getElementById("uploadMessage").innerText =
      "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    document.getElementById("uploadMessage").innerText = result.message;
  } catch (error) {
    document.getElementById("uploadMessage").innerText =
      "Error uploading file.";
  }
}

async function listBlobs() {
  try {
    const response = await fetch("/list-blobs");
    const blobs = await response.json();

    const blobList = document.getElementById("blobList");
    blobList.innerHTML = "";
    blobs.forEach((blob) => {
      const li = document.createElement("li");
      li.innerText = blob;
      blobList.appendChild(li);
    });
  } catch (error) {
    document.getElementById("blobList").innerText = "Error listing blobs.";
  }
}
