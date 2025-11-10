import React from "react";
//import image14 from "./image-14.png";
import postImage from "./post-image.png";
import * as classes from "./PostContainer.module.css";

export const PostContainer = ({ className }) => {
  return (
    <div className={`${classes.container} ${className || ""}`}>
      <img className={classes.postImage} alt="Post image" src={postImage} />

      <div className={classes.title}>TituloTitulo</div>

      <p className={classes.description}>
        Lorem ipsum dolor sit amet consectetur, adipiscing elit non dictumst,
        sapien mattis quam neque. Rutrum parturient quam proin praesent rhoncus
        diam pharetra inceptos, turpis lacus ligula primis aenean dis orci
        fringilla, vitae non vel nostra viverra porta dui. Conubia est faucibus
        per curabitur hac sagittis ultricies neque, proin phasellus libero
        torquent nullam lectus porta, molestie dignissim suscipit tincidunt
        quisque metus leo.
      </p>

      <div className={classes.publishedDate}>Publicado hace: #x</div>

      <div className={classes.locationContainer}>
      {/* <img className={classes.locationImage} alt="Image" src={image14} /> */}

        <div className={classes.locationText}>#location</div>
      </div>
    </div>
  );
};
