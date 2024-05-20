const express = require("express");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");
const path = require("path");

const blobServiceUrl =
  "XXXXXX";

const blobServiceClient = new BlobServiceClient(blobServiceUrl);
const containerName = "XXXXXX";
const containerClient = blobServiceClient.getContainerClient(containerName);

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const fileContent = fs.readFileSync(filePath);
    await blockBlobClient.upload(fileContent, fileContent.length);
    fs.unlinkSync(filePath); 
    res.status(200).send({ message: `${fileName} uploaded successfully` });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error uploading file", error: error.message });
  }
});

// API endpoint to list blobs
// app.get("/list-blobs", async (req, res) => {
//   try {
//     const blobs = [];
//     for await (const blob of containerClient.listBlobsFlat()) {
//       const blobUrl = `${blobServiceUrl}/${containerName}/${blob.name}`;
//       blobs.push(blobUrl);
//     }
//     res.status(200).send(blobs);
//   } catch (error) {
//     res
//       .status(500)
//       .send({ message: "Error listing blobs", error: error.message });
//   }
// });

app.get("/list-blobs", async (req, res) => {
  try {
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
      blobs.push(tempBlockBlobClient.url);
    }
    res.status(200).send(blobs);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error listing blobs", error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
