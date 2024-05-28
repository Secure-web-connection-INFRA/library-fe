import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import download from "../Assets/download.png";
import { config } from "../constant";
import cryptoJs from "crypto-js";

const Dashboard = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `${config.url}/lib/search?book=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults([response.data]);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const getBooks = async (storedData) => {
    try {
      const response = await axios.get(`${config.url}/lib/all`, {
        headers: {
          Authorization: `Bearer ${storedData}`,
        },
      });
      setResults(response.data.data);
      console.log(response);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/login");
    }
  };

  const verifyHMAC = (data, receivedHMAC) => {
    const secretKey = "9ikmnhyt5sdfghu87uyhb adsfrft34ewds";
    const calculatedHMAC = cryptoJs
      .HmacSHA256(data, secretKey)
      .toString(cryptoJs.enc.Hex);

    return calculatedHMAC === receivedHMAC;
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(
        `${config.url}/lib/download?bookId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.file) {
        if (verifyHMAC(response.data.file, response.data.key)) {
          downloadPDF(response.data.file, response.data.title);
        } else {
          alert("Data has been tampered");
        }
      } else {
        alert("File not available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPDF = (pdfData, title) => {
    // Create a blob from the base64 string
    const byteCharacters = atob(pdfData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = title;

    // Dispatch a click event on the link
    document.body.appendChild(link);
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  useEffect(() => {
    const storedData = localStorage.getItem("token") ?? false;
    if (storedData) {
      setToken(storedData);
      getBooks(storedData);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "white",
          cursor: "pointer",
          fontWeight: 600,
        }}
        onClick={handleLogout}
      >
        Logout
      </div>
      <div className='search-container'>
        <form onSubmit={handleSearch} className='search-form'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search...'
            className='search-input'
          />
          <button
            type='button'
            className='search-button'
            onClick={handleSearch}
          >
            Book
          </button>
        </form>
      </div>
      {typeof results[0] === "string" ? (
        <div style={{ color: "white", fontWeight: "bolder" }}>{results[0]}</div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
          }}
        >
          {results?.map((book) => (
            <div key={book.id} className={"book-block"}>
              <img
                src={`data:image/jpeg;base64,${book.image}`}
                alt='Fetched'
                style={{ maxWidth: "100%", height: 200, overflow: "hidden" }}
              />
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ maxWidth: "calc(100% - 60px)" }}>
                    <span className='title'>{book.title}</span>
                    <span className='year'>({book.publishedOn})</span>
                  </div>
                  <img
                    className='download'
                    onClick={() => handleDownload(book.id)}
                    src={download}
                    alt='Fetched'
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className='desc' style={{ marginTop: "5px" }}>
                  {book.description.slice(0, 110)}...
                </div>
                <div className='author' style={{ marginTop: "5px" }}>
                  {" "}
                  - {book.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
