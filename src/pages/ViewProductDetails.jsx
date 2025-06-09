import React from "react";

// Dummy product data (replace with props or fetched data as needed)
const product = {
  image:
    "https://cdn.shopify.com/s/files/1/0264/0261/9831/products/gucci-brown-gg-supreme-women-s-sling-bag-636653_1_900x.jpg", // Use your own image or import
  brand: "Gucci",
  name: "Women Purse",
  code: "PU8746",
  subType: "women sling bag",
  description: `Lorem ipsum dolor sit amet consectetur. Et malesuada gravida eget a arcu senectus pharetra. 
Nisl elementum viverra non in velit sed. Gravida diam ut ante et vulputate vel est libero vulputate. 
Erat turpis lacus enim quisque augue viverra velit sed. Sit habitant semper tempus ultrices ut viverra. 
Nibh ipsum semper suspendisse pellentesque at. Ipsum id integer dignissim vel aliquet. 
Et vulputate ac mi lorem. Aenean nulla consectetur phasellus rutrum in. 
Nunc cras sapien volutpat et aliquet sit. Nisl elit tempus molestie aliquam aenean urna ipsum quam. 
In enim et consequat cras facilisi neque nibh quis tortor mi diam.`,
  size: "Free Size",
  quantityInPack: "01",
  price: "₹1243",
  availableQuantity: "64",
};

export default function ViewProductDetails() {
  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] p-4 font-sans mb-4 mt-14 relative">
      {/* Header */}
      <div className="text-center mt-4">
        <h1 className="text-xl md:text-2xl font-semibold text-[#e6517f]">
          View Product Details
        </h1>
        <div className="w-48 h-1 mx-auto mt-1 mb-4 bg-[#e6517f] rounded-full opacity-40" />
      </div>
      {/* Product Image */}
      <div className="flex justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-40 md:h-48 object-contain"
        />
      </div>
      {/* Product Info */}
      <div className="max-w-3xl mx-auto mt-6 space-y-6 text-[15px]">
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">Brand:</span>
          <span>{product.brand}</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">Product Name:</span>
          <span>{product.name}</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">Product Code:</span>
          <span>{product.code}</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">Product Sub Type:</span>
          <span>{product.subType}</span>
        </div>
        {/* Product Description */}
        <div>
          <span className="font-semibold block mb-2">Product Description:</span>
          <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
        </div>
        {/* Size */}
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">Size:</span>
          <span>{product.size}</span>
        </div>
        {/* Quantity In Each Pack */}
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">Quantity in Each Pack</span>
          <span>{product.quantityInPack}</span>
        </div>
        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">Price:</span>
          <span>{product.price}</span>
        </div>
        {/* Available Product Quantity */}
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">Available Product Quantity:</span>
          <span>{product.availableQuantity}</span>
        </div>
      </div>
    </div>
  );
}