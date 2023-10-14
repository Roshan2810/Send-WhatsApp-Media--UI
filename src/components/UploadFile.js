import React, { useState, useRef } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";

function FileUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const imageInputRef = useRef(null);
  const canvasRef = useRef(null);

  const [whatsappAttributes, setWhatsappAttribute] = useState({
    caption: "",
    reciepient: "",
    imagePath: "",
  });


  const handleInputChange = (value, prop) => {
    setWhatsappAttribute((prev) => ({ ...prev, [prop]: value }));
  };

  const handleUploadClick = async() => {
    const { reciepient, caption, imagePath } = whatsappAttributes;
    if (reciepient === "" || imagePath === "") return;
    var formdata = new FormData();
    formdata.append("recipient_phone_number", reciepient);
    formdata.append("caption", caption);
    formdata.append("image_path", imagePath);
    formdata.append("header", headerText);
    formdata.append("footer", footerText);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:5000/send_image", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
    // setWhatsappAttribute((prev) => {
    //   return { ...prev, caption: "", imagePath: "" };
    // });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography variant="h5">Upload Image on Whatsapp</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <input
          ref={imageInputRef}
          accept="image/*" // You can specify the accepted file types
          style={{ display: "none" }}
          id="file-input"
          type="file"
          onChange={(e) => handleInputChange(e.target.files[0], "imagePath")}
        />
        <label htmlFor="file-input">
          <Button variant="contained" component="span">
            Upload File
          </Button>
        </label>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        {whatsappAttributes.imagePath?.name && (
          <div>
            <p>Selected File: {whatsappAttributes.imagePath.name}</p>
            {/* Display other file details as needed */}
          </div>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField
          variant="outlined"
          onChange={(e) => handleInputChange(e.target.value, "reciepient")}
          value={whatsappAttributes.reciepient}
          placeholder="Reciepient Mobile Number"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField
          variant="outlined"
          onChange={(e) => handleInputChange(e.target.value, "caption")}
          placeholder="Captions"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField
          variant="outlined"
          onChange={(e) => setHeaderText(e.target.value)}
          placeholder="Header Text"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField
          variant="outlined"
          onChange={(e) => setFooterText(e.target.value)}
          placeholder="Footer Text"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Button variant="outlined" color="primary" onClick={handleUploadClick}>
          Upload
        </Button>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        {selectedImage && (
          <img src={selectedImage} alt="Uploaded" width="300" />
        )}
      </Grid>
    </Grid>
  );
}

export default FileUpload;
