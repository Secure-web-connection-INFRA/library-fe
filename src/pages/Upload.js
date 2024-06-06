import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../upload.css";
import { config } from "../constant";

const BookUploadForm = () => {
  const [pdfBase64, setPdfBase64] = useState("");
  const [coverImageBase64, setCoverImageBase64] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishedOn, setPublishedOn] = useState("");
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate form fields
    const newErrors = {};
    if (!pdfBase64) newErrors.pdfBase64 = "PDF file is required";
    if (!coverImageBase64)
      newErrors.coverImageBase64 = "Cover image is required";
    if (!author) newErrors.author = "Author is required";
    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!publishedOn) newErrors.publishedOn = "Published date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        `${config.url}/lib/upload`,
        {
          pdfBase64,
          coverImageBase64,
          author,
          title,
          description,
          publishedOn,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      // Reset form fields
      setPdfBase64("");
      setCoverImageBase64("");
      setAuthor("");
      setTitle("");
      setDescription("");
      setPublishedOn("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("token") ?? false;
    const role = localStorage.getItem("role") ?? false;
    if (storedData && role === "ADMIN") {
      setToken(storedData);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <form className='form-container' onSubmit={handleSubmit}>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 20,
        }}
      >
        <div
          style={{
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </div>
      </div>
      <div>
        <label htmlFor='pdfBase64'>PDF File</label>
        <input
          type='file'
          id='pdfBase64'
          accept='application/pdf'
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
              setPdfBase64(reader.result.split(",")[1]);
            };
            reader.readAsDataURL(file);
          }}
        />
        {errors.pdfBase64 && (
          <span className='error-message'>{errors.pdfBase64}</span>
        )}
      </div>

      <div>
        <label htmlFor='coverImageBase64'>Cover Image</label>
        <input
          type='file'
          id='coverImageBase64'
          accept='image/jpeg'
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
              setCoverImageBase64(reader.result.split(",")[1]);
            };
            reader.readAsDataURL(file);
          }}
        />
        {errors.coverImageBase64 && (
          <span className='error-message'>{errors.coverImageBase64}</span>
        )}
      </div>

      <div>
        <label htmlFor='author'>Author</label>
        <input
          type='text'
          id='author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        {errors.author && (
          <span className='error-message'>{errors.author}</span>
        )}
      </div>

      <div>
        <label htmlFor='title'>Title</label>
        <input
          type='text'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span className='error-message'>{errors.title}</span>}
      </div>

      <div>
        <label htmlFor='description'>Description</label>
        <textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <span className='error-message'>{errors.description}</span>
        )}
      </div>

      <div>
        <label htmlFor='publishedOn'>Published On</label>
        <input
          type='date'
          id='publishedOn'
          value={publishedOn}
          onChange={(e) => setPublishedOn(e.target.value)}
        />
        {errors.publishedOn && (
          <span className='error-message'>{errors.publishedOn}</span>
        )}
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export default BookUploadForm;
