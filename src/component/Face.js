import React, { useState } from "react";
import TopList from "../component/TopList";
import "../css/Face.css";

const Face = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 한 페이지당 5개 항목

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 샘플 데이터 (페이지네이션 테스트를 위해 더 많은 데이터 추가)
  const [data, setData] = useState([
    { id: "#2233", person: "Ki-jae", date: "24-08-22", part: "Sleeping" },
    { id: "#3826", person: "Unknown", date: "24-08-26", part: "Thief" },
    { id: "#1103", person: "Dust_kim", date: "24-09-01", part: "Drunk" },
    { id: "#4362", person: "Jang-dragon", date: "24-09-06", part: "Phone" },
    { id: "#5555", person: "Test1", date: "24-09-10", part: "Walking" },
    { id: "#6666", person: "Test2", date: "24-09-15", part: "Running" },
    { id: "#7777", person: "Test3", date: "24-09-20", part: "Eating" },
  ]);

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setData(data.filter((item) => item.id !== selectedId));
    setShowModal(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="face-container">
      <TopList activeItem="Face" />
      <div className="face-content">
        <table className="face-table">
          <thead>
            <tr>
              <th>id</th>
              <th>person</th>
              <th>date</th>
              <th>part</th>
              <th>setting</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.person}</td>
                <td>{item.date}</td>
                <td>{item.part}</td>
                <td>
                  <button onClick={() => handleDelete(item.id)}>delete</button>
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

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>데이터를 삭제하시겠습니까?</p>
            <button onClick={confirmDelete}>확인</button>
            <button onClick={() => setShowModal(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Face;
