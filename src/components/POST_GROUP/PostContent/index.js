import React, { useState, useEffect } from "react";
import ImageModal from "components/Modal/ImageModal";
import Linkify from "react-linkify";
import "./style.scss";

const PostContent = ({ dataContent }) => {
  const { post } = dataContent;
  const [contentHeight, setContentHeight] = useState("auto");
  const [openImage, setOpenImage] = useState(false);

  useEffect(() => {
    const length = post.content.length;
    if (length > 120) {
      setContentHeight("50px");
    }
  }, [post]);

  const onChangeHeight = () => {
    contentHeight === "auto"
      ? setContentHeight("50px")
      : setContentHeight("auto");
  };

  const content = {
    openmodal: openImage,
    setOpenmodal: setOpenImage,
    image: post.image,
  };

  return (
    <div className="post-content">
      <div className="text" style={{ height: contentHeight }}>
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a
              target="blank"
              href={decoratedHref}
              key={key}
              className="linkify-text"
            >
              {decoratedText}
            </a>
          )}
        >
          {post.content}
        </Linkify>
      </div>
      {contentHeight === "50px" && (
        <span className={`show-more`} onClick={() => onChangeHeight()}>
          show more
        </span>
      )}
      {post.image && (
        <div className="image-area" onClick={() => setOpenImage(true)}>
          <img src={post.image} alt="content-img" />
        </div>
      )}

      {openImage && <ImageModal data={{ ...content }} />}
    </div>
  );
};

export default PostContent;
