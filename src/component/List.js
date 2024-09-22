import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "./DataContext";
import TopList from "./TopList";
import DetailModal from "./DetailModal";
import "../css/List.css";

const List = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 한 페이지당 5개 항목

  const { setListData } = useContext(DataContext);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    // console.log(token);
    const formdata = { token: token };
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/find_list", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formdata),
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // 샘플 데이터 (페이지네이션 테스트를 위해 더 많은 데이터 추가)
  const [data, setData] = useState([]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setData(data.filter((item) => item.id !== itemToDelete));
    setShowDeleteModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="list-container">
      <TopList activeItem="List" />
      <div className="list-content">
        <table className="list-table">
          <thead>
            <tr>
              <th>id</th>
              <th>person</th>
              <th>date</th>
              <th>shape</th>
              <th>setting</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr
                key={`${item.userid}-${index}`}
                onClick={() => handleItemClick(item)}
              >
                <td>{item.userid}</td>
                <td>{item.person}</td>
                <td>{item.date}</td>
                <td>{item.shape}</td>
                <td>
                  <button onClick={(e) => handleDeleteClick(item.id, e)}>
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map(
            (number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={currentPage === number + 1 ? "active" : ""}
              >
                {number + 1}
              </button>
            )
          )}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
          >
            &gt;
          </button>
        </div>
      </div>

      {showDetailModal && selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>데이터를 삭제하시겠습니까?</p>
            <button onClick={confirmDelete}>확인</button>
            <button onClick={() => setShowDeleteModal(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
