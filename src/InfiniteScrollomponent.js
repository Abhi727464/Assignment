import axios from "axios";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScrollComponent = () => {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(2);
  const [loading, setLoading] = useState(false);
  const [newProductTitle, setNewProductTitle] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://api.escuelajs.co/api/v1/products?offset=0&limit=12")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const fetchMoreData = () => {
    setLoading(true);
    axios
      .get(
        `https://api.escuelajs.co/api/v1/products?offset=${index * 10}&limit=12`
      )
      .then((res) => {
        setItems((prevItems) => [...prevItems, ...res.data]);
        setLoading(false);
        if (res.data.length === 0) {
          setHasMore(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    setIndex((prevIndex) => prevIndex + 1);
  };

  const addNewProduct = () => {
    if (newProductTitle.trim() === "") {
      alert("Please enter a product name.");
      return;
    }

    const newItem = {
      id: items.length + 1,
      title: newProductTitle,
    };

    setItems((prevItems) => [newItem, ...prevItems]);
    setNewProductTitle("");
  };

  return (
    <div className="infinite-scroll-container">
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter product title"
          value={newProductTitle}
          onChange={(e) => setNewProductTitle(e.target.value)}
          className="input-field"
        />
        <button className="add-button" onClick={addNewProduct}>
          Add New Product
        </button>
      </div>

      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div className="loading">Loading more data...</div>}
      >
        <div className="flex-container">
          {items.map((item) => (
            <div key={item.id} className="product-card">
              <h2>{item?.title}</h2>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScrollComponent;
