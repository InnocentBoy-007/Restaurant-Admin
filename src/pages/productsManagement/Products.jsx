import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import productController from "../../components/ProductController";
import { isTokenExpired } from "../../components/IsTokenExpired";
import { RefreshToken } from "../../components/RefreshToken";
import fetchDetails from "../../components/FetchDetails";

export default function Products() {
  const navigate = useNavigate();
  let [token, setToken] = useState(Cookies.get("adminToken"));
  const refreshToken = Cookies.get("adminRefreshToken");

  const [productDetails, setProductDetails] = useState([]);
  const [noProductsMessage, setNoProductsMessage] = useState("");
  const [fetchProductLoading, setFetchProductLoading] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");

  const [productDeleteFlag, setProductDeleteFlag] = useState(false);
  const [productEditFlag, setProductEditFlag] = useState(false);
  const [addNewProductFlag, setAddNewProductFlag] = useState(false);
  const [addNewProductLoading, setAddNewProductLoading] = useState(false);
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const [editProductLoading, setEditProductLoading] = useState(false);

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");

  useEffect(() => {
    if (!Cookies.get("adminToken")) {
      navigate("/");
      console.log("You need to login or sign up first!");
    }
  }, []);

  const clearUpInputFields = () => {
    setProductName("");
    setProductPrice("");
    setProductQuantity("");
  };

  // function to check if the token has already expired or not
  // if the token is expired, fetch a new generated token from the backend
  const checkToken = async () => {
    if (refreshToken && isTokenExpired(token)) {
      const newToken = await RefreshToken(refreshToken);
      setToken(newToken.token);
      Cookies.set("adminToken", newToken.token);
    }
  };

  const fetchProducts = async () => {
    setFetchProductLoading(true);
    await checkToken();
    if (token) {
      const response = await fetchDetails.FetchProductDetails();
      if (response.success) {
        setProductDetails(response.productDetails);
        setFetchProductLoading(false);
      } else {
        setNoProductsMessage(response.errorMessage);
      }
    }
  };

  const addNewproducts = async (e) => {
    e.preventDefault();
    setAddNewProductLoading(true);
    const body = {
      productDetails: {
        productName,
        productPrice: parseInt(productPrice),
        productQuantity: parseInt(productQuantity),
      },
    };

    try {
      await checkToken();
      if (token) {
        const response = await productController.addProduct(body, token);
        if (response.success) {
          clearUpInputFields();
          await fetchProducts(); // update the frontend after successfully adding a new product
          setAddNewProductLoading(false);
          setAddNewProductFlag(false);
        }
      }
    } catch (error) {
      clearUpInputFields();
      setAddNewProductLoading(false);
    }
  };

  const deleteProduct = async (e, productId) => {
    e.preventDefault();
    setDeleteProductLoading(true);

    try {
      await checkToken();
      if (token) {
        const response = await productController.deleteProduct(
          productId,
          token
        );
        if (response.success) {
          setProductId("");
          await fetchProducts();
          setDeleteProductLoading(false);
          setProductDeleteFlag(false);
        }
      }
    } catch (error) {
      setProductId("");
      setDeleteProductLoading(false);
    }
  };

  const editProduct = async (e) => {
    e.preventDefault();
    setEditProductLoading(true);
    const data = {
      newDetails: {
        productName,
        productPrice: parseInt(productPrice),
        productQuantity: parseInt(productQuantity),
      },
    };

    try {
      await checkToken();
      if (token) {
        const response = await productController.updateProduct(
          productId,
          data,
          token
        );
        if (response.success) {
          fetchProducts();
          setProductEditFlag(false);
        }
      }
    } finally {
      clearUpInputFields();
      setEditProductLoading(false);
    }
  };

  const formSubmit = (e) => {
    e.preventDefault();
    if (productEditFlag) {
      return editProduct(e);
    } else {
      return addNewproducts(e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token, refreshToken]);

  return (
    <>
      <div
        className="w-full text-center p-4 bg-blue-300 cursor-pointer"
        onClick={() => navigate("/admin/orders")}
      >
        Back
      </div>
      {addNewProductFlag || productEditFlag ? (
        <div className="w-full text-center mt-5">
          {addNewProductFlag ? (
            <>
              <h1>Add new product flag activated</h1>
            </>
          ) : (
            <>
              <h1>Edit product flag activated</h1>
            </>
          )}

          <div className="flex justify-center gap-2 mt-2">
            <form onSubmit={formSubmit}>
              <div className="mb-4 mt-5">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="productname"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="productname"
                  placeholder="e.g. 'Apple'"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="productprice"
                >
                  Product Price (₹)
                </label>
                <input
                  type="text"
                  id="productprice"
                  placeholder="e.g. '200'"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="productquantity"
                >
                  Product Quantity
                </label>
                <input
                  type="text"
                  id="productquantity"
                  placeholder="e.g. '10'"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2 justify-center">
                {addNewProductLoading ? (
                  "Adding..."
                ) : (
                  <>
                    {editProductLoading ? (
                      "Updating..."
                    ) : (
                      <>
                        <button
                          className="border border-green-300 p-1"
                          type="submit"
                        >
                          {addNewProductFlag ? "Add" : "Update"}
                        </button>
                        <button
                          onClick={() => {
                            setAddNewProductFlag(false);
                            setProductEditFlag(false);
                          }}
                          className="border border-red-300 p-1"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </form>
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
                          <th>Updated By</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productDetails.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>{index + 1}</td>
                            <td>{item._id}</td>
                            <td>{item.productName}</td>
                            <td>{item.productQuantity}</td>
                            <td>{item.productPrice}</td>
                            <td>{item.productAddedBy}</td>
                            <td>{item.productAddedOn}</td>
                            <td>
                              {!item.productUpdatedOn
                                ? "null"
                                : `${item.productUpdatedOn}`}
                            </td>
                            <td>
                              {!item.productUpdatedBy
                                ? "null"
                                : `${item.productUpdatedBy}`}
                            </td>
                            <td>
                              <div className="flex gap-2 justify-center">
                                <button
                                  className="border border-blue-300 p-1"
                                  onClick={() => {
                                    setProductEditFlag(true);
                                    setProductId(item._id);
                                    setProductName(item.productName);
                                    setProductPrice(item.productPrice);
                                    setProductQuantity(item.productQuantity);
                                  }}
                                >
                                  Edit
                                </button>
                                {!productDeleteFlag && (
                                  <button
                                    className="border border-red-300 p-1"
                                    onClick={() => {
                                      setProductDeleteFlag(true);
                                      setSelectedProductName(item.productName);
                                      setProductId(item._id);
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
          {productDeleteFlag && (
            <div className="w-full text-center mt-5">
              <h1>Are you sure you want to delete {selectedProductName}?</h1>
              <div className="flex justify-center gap-2">
                {deleteProductLoading ? (
                  "Deleting..."
                ) : (
                  <>
                    <button
                      className="border border-red-300 p-1"
                      onClick={(e) => deleteProduct(e, productId)}
                    >
                      Yes
                    </button>
                    <button
                      className="border border-blue-300 p-1"
                      onClick={() => setProductDeleteFlag(false)}
                    >
                      No
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
