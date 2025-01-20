import React from "react";

const ProductInfo = ({
  product,
  isEditing,
  editedProduct,
  setEditedProduct,
}) => {
  const handleInputChange = (field, value) => {
    setEditedProduct({ ...editedProduct, [field]: value });
  };

  const { name, basePrice, description, stockAvailable, shippingCost } =
    isEditing ? editedProduct : product;

  return (
    <div className="w-full mt-6 bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">
          Product Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Name
                  </span>
                  <span className="mt-1 block text-sm text-gray-900">
                    {name}
                  </span>
                </div>
              )}
            </div>

            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Base Price
                  </label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) =>
                      handleInputChange("basePrice", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Base Price
                  </span>
                  <span className="mt-1 block text-sm text-gray-900">
                    {basePrice}
                  </span>
                </div>
              )}
            </div>

            <div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="stockAvailable"
                    checked={stockAvailable}
                    onChange={(e) =>
                      handleInputChange("stockAvailable", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="stockAvailable"
                    className="text-sm font-medium text-gray-700"
                  >
                    Stock Available
                  </label>
                </div>
              ) : (
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Stock Available
                  </span>
                  <span className="mt-1 block text-sm text-gray-900">
                    {stockAvailable ? "Yes" : "No"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Shipping Cost
                  </label>
                  <input
                    type="number"
                    value={shippingCost}
                    onChange={(e) =>
                      handleInputChange("shippingCost", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Shipping Cost
                  </span>
                  <span className="mt-1 block text-sm text-gray-900">
                    {shippingCost}
                  </span>
                </div>
              )}
            </div>

            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Description
                  </span>
                  <div
                    className="mt-1 text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
