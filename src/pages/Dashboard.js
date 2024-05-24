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
    const response = await axios.get(`${config.url}/lib`, {
      headers: {
        Authorization: `Bearer ${storedData}`,
      },
    });
    setResults(response.data);
    console.log(response);
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
      if (verifyHMAC(response.data.file, response.data.key)) {
        downloadPDF(response.data.file, response.data.title);
      } else {
        console.log(":: tampered data");
      }
      // setResults(response.data);
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
  // const downloadPDF = (pdfData, title) => {
  //   // Create a blob from the base64 string
  //   console.log(":: blob start");
  //   const blob = new Blob([Buffer.from(pdfData, "base64")], {
  //     type: "application/pdf",
  //   });

  //   // Create a URL for the blob
  //   const url = window.URL.createObjectURL(blob);

  //   // Create a link element
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = title;

  //   // Dispatch a click event on the link
  //   document.body.appendChild(link);
  //   link.click();

  //   // Remove the link from the DOM
  //   document.body.removeChild(link);
  // };

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("token");
    console.log(storedData);
    // Update state with the retrieved data
    if (storedData) {
      setToken(storedData);
      getBooks(storedData);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
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
        <div>{results[0]}</div>
      ) : (
        <div>
          {results?.map((book) => (
            <div className={"book-block"}>
              <img src={`data:image/jpeg;base64,${book.image}`} alt='Fetched' />
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ width: "calc(100% - 50px)" }}>
                    <span className='title'>{book.title}</span>
                    <span className='year'>({book.publishedOn})</span>
                  </div>
                  <img
                    className='download'
                    onClick={() => handleDownload(book.id)}
                    src={download}
                    alt='Fetched'
                  />
                </div>
                <div className='desc'>{book.description.slice(0, 110)}...</div>
                <div className='author'> - {book.author}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;
