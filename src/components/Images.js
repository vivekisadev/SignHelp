import React, { useState } from "react";
import "../App.css";
import Modal from "./Modal";

import sign1 from "../assets/Bathroom.png";
import sign2 from "../assets/Friend.png";
import sign3 from "../assets/Hello.png";
import sign4 from "../assets/No.png";
import sign5 from "../assets/Ok.png";
import sign6 from "../assets/Please.png";
import sign7 from "../assets/Thank You.png";
import sign8 from "../assets/Yes.png";
import sign9 from "../assets/Taijutsu.png";

const images = [
  { src: sign1, alt: "Bathroom-Sign" },
  { src: sign2, alt: "Friend-Sign" },
  { src: sign3, alt: "Hello-Sign" },
  { src: sign4, alt: "No-Sign" },
  { src: sign5, alt: "Ok-Sign" },
  { src: sign6, alt: "Please-Sign" },
  { src: sign7, alt: "Thank You-Sign" },
  { src: sign8, alt: "Yes-Sign" },
  { src: sign9, alt: "Special-Sign" },
];

const Images = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="overflow-y-hidden bottom-5 left-0 xScroll overflow-x-scroll">
        <div className=" flex signContainer">
          {images.map((image, index) => (
            <div
              className="flex-shrink-0 p-1"
              key={index}
              onClick={() => openModal(image)}
            >
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <Modal
          src={selectedImage.src}
          alt={selectedImage.alt}
          caption={selectedImage.alt}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default Images;