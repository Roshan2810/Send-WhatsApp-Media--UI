import * as React from "react";
import "./App.css";
import BulkFileList from "./components/BulkFileList";
import { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";

function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const [itemData, setItemData] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState({
    selected: false,
    index: null,
    path: null,
    url: null,
  });
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");

  React.useEffect(() => {
    setHeaderText("");
    setFooterText("");
  }, [selectedImage.index]);

  const handleClick = (event) => {
    setAnchorEl(() => event.currentTarget);
  };

  const handleTextFieldChange = (e) => {
    setFolderName(e.target.value);
  };

  const fetchImages = async (e, page = 1, per_page = 9) => {
    const url = `http://localhost:5000/load_image_gallery?folder_path=${folderName}&page=${page}&per_page=${per_page}`;  // Your actual host
    const resp = await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (resp.ok) {
      const images = await resp.json();
      setItemData(images);
      setAnchorEl(null)
    }
  };

  const handleImageClick = (e, index, path, url) => {
    handleClick(e);
    const updatedItemList = Object.assign(
      JSON.parse(JSON.stringify(itemData)),
      []
    );
    updatedItemList.imageList.forEach((item, i) => {
      if (i !== index) {
        setSelectedImage((prev) => ({ ...prev, index, path }));
        item.style = "none";
      } else item.style = "2px solid green";
    });
    setItemData(() => updatedItemList);
    setSelectedImage(() => ({
      selected: true,
      index,
      path,
      url,

    }));
  };

  const sendImage = (imageSrc, path) => {
    const formdata = new FormData();
    formdata.append("recipient_phone_number", "1234567890"); // enter your mobile number here
    formdata.append("caption", "");
    formdata.append("image_path", path);
    formdata.append("header", headerText);
    formdata.append("footer", footerText);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:5000/send_image", requestOptions)  // Your actual host
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
      setAnchorEl(null);
  };

  const deleteImage = async (path) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      path,
    });

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const resp = await fetch(
      "http://localhost:5000/delete_image", // Your actual host
      requestOptions
    );
    if (resp.ok) {
      await fetchImages("", currentPage, 9);
      setAnchorEl(null)
    }
  };

  return (
    <div className="App">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            value={folderName}
            onChange={handleTextFieldChange}
            placeholder="Folder Name"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button variant="contained" onClick={fetchImages}>
            Get Images
          </Button>
        </Grid>
        {itemData?.imageList?.length ? (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Pagination
              count={parseInt(itemData.count / 9)}
              color="primary"
              variant="contained"
              page={currentPage}
              onChange={(e, page) => {
                setAnchorEl(null);
                setCurrentPage(page);
                fetchImages(null, page, 9);
              }}
            />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
      <BulkFileList
        itemData={itemData.imageList || []}
        handleOnClick={handleImageClick}
      />
      {anchorEl ? (
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Box sx={{ p: 1, bgcolor: "background.paper", width: "200px" }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  value={headerText}
                  placeholder="Header"
                  onChange={(e) => setHeaderText(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  value={footerText}
                  placeholder="Footer"
                  onChange={(e) => setFooterText(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() =>
                    sendImage(selectedImage.url, selectedImage.path)
                  }
                >
                  Send
                </Button>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => deleteImage(selectedImage.path)}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Popper>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
