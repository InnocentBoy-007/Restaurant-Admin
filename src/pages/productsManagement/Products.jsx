import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const [productDetails, setProductDetails] = useState([]);
  const [noProductsMessage, setNoProductsMessage] = useState("");
  const [fetchProductLoading, setFetchProductLoading] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");

  const [deleteFlag, setDeleteFlag] = useState(false);
  const [addNewProductFlag, setAddNewProductFlag] = useState(false);

  const fetchProducts = async () => {
    setFetchProductLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/products`);
      setProductDetails(response.data.products);
    } catch (error) {
      if (error.response) {
        setNoProductsMessage(error.response.data.message);
      }
    } finally {
      setFetchProductLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div
        className="w-full text-center p-4 bg-blue-300 cursor-pointer"
        onClick={() => navigate("/admin/orders")}
      >
        Back
      </div>
      {addNewProductFlag ? (
        <div className="w-full text-center mt-5">
          <h1>Add new product flag activated</h1>
          <div className="flex justify-center gap-2 mt-2">
            <button className="border border-green-300 p-1">Add</button>
            <button
              onClick={() => setAddNewProductFlag(false)}
              className="border border-red-300 p-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full p-2">
          <h1 className="text-center">Products</h1>
          <div className="w-full mt-4">
            {fetchProductLoading ? (
              <>
                <h1>Fetching products...</h1>
              </>
            ) : (
              <>
                {productDetails.length === 0 ? (
                  <>
                    <h1>{noProductsMessage}</h1>
                  </>
                ) : (
                  <>
                    <table className="w-full border border-red-300 text-center">
                      <thead>
                        <tr>
                          <th>Sl no.</th>
                          <th>Product ID</th>
                          <th>Product Name</th>
                          <th>Product Quantity</th>
                          <th>Product Price</th>
                          <th>Product Added By</th>
                          <th>Added Time</th>
                          <th>Updated Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productDetails.map((item, index) => (
                          <tr key={item.id || index}>
                            {/* Use a unique identifier for the key */}
                            <td>{index + 1}</td>
                            <td>{item._id}</td>
                            <td>{item.productName}</td>
                            <td>{item.productQuantity}</td>
                            <td>{item.productPrice}</td>
                            <td>{item.productAddedBy}</td>
                            <td>{item.productAddedOn}</td>
                            <td>
                              {!item.productupdatedOn
                                ? "not yet updated"
                                : `${item.productupdatedOn}`}
                            </td>
                            <td>
                              <div className="flex gap-2 justify-center">
                                <button className="border border-blue-300 p-1">
                                  Edit
                                </button>
                                {!deleteFlag && (
                                  <button
                                    className="border border-red-300 p-1"
                                    onClick={() => {
                                      setDeleteFlag(true);
                                      setSelectedProductName(item.productName);
                                    }}
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </>
            )}
          </div>
          <button
            className="mt-2 p-2 bg-blue-300"
            onClick={() => setAddNewProductFlag(true)}
          >
            Add new products
          </button>
          {deleteFlag && (
            <div className="w-full text-center mt-5">
              <h1>Are you sure you want to delete {selectedProductName}?</h1>
              <div className="flex justify-center gap-2">
                <button className="border border-red-300 p-1">Yes</button>
                <button
                  className="border border-blue-300 p-1"
                  onClick={() => setDeleteFlag(false)}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
