import React, { useState } from "react";

const ProductImages = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col items-center">
      {/* Main Image */}
      <div className="mb-4 w-full max-w-lg">
        <img
          src={selectedImage}
          alt="Selected Product"
          className="w-full h-auto rounded-lg border border-gray-200 shadow-md"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-2 justify-center">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`cursor-pointer border rounded-lg overflow-hidden ${
              selectedImage === image ? "border-yellow-500" : "border-gray-200"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-20 h-20 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
