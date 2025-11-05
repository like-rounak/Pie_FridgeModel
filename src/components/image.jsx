import React from "react";

export const Image = ({ title, largeImage, smallImage }) => {
  const handleClick = (e) => {
    e.preventDefault();
    // Simple modal: open image in new tab or window
    window.open(largeImage, '_blank');
  };

  return (
    <div className="portfolio-item">
      <div className="hover-bg">
        {" "}
        <a href={largeImage} title={title} onClick={handleClick}>
          <div className="hover-text">
            <h4>{title}</h4>
          </div>
          <img src={smallImage} className="img-responsive" alt={title} />{" "}
        </a>{" "}
      </div>
    </div>
  );
};
