import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

export default function StandardImageList({ itemData, handleOnClick }) {
  return (
    <ImageList cols={3}>
      {itemData.map((item, index) => {
        const { url, path, style } = item;
        const imagePath = path.replace(/\\\\/g, "\\");
        return (
          <ImageListItem key={imagePath}>
            <img
              style={{ border: style, margin: "5px", width: "90%" }}
              onClick={(e) => {
                handleOnClick(e, index, path, url);
              }}
              srcSet={`${url}`}
              src={`${url}`}
              alt={imagePath}
              loading="lazy"
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}
