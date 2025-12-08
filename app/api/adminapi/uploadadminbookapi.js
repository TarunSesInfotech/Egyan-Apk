// upload book by admin api
export const adminBookuploadapi = async (formData, token) => {
  try {
    if (!token) throw new Error('Access token missing!');

    const res = await fetch(`https://e-gyan-9tky.onrender.com/books/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Upload failed');
    return { success: true, result };
  } catch (error) {
    console.error('Error uploading book:', error);
    throw error;
  }
};

// upload admin Chapter api
export const adminChapteruploadapi = async (formData, token, bookId) => {
  try {
    if (!token) throw new Error('Access token missing!');

    const res = await fetch(
      `https://e-gyan-9tky.onrender.com/books/${bookId}/chapters`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Upload failed');
    return { success: true, result };
  } catch (error) {
    console.error('Error uploading book:', error);
    throw error;
  }
};

// admin get chapter api
export const getChapterApi = async (bookId) => {
  try {
    const response = await fetch(
      `https://e-gyan-9tky.onrender.com/books/${bookId}/chapters`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching chapters:', error.message);
    return { success: false, message: error.message };
  }
};

//admin delete api
export const getChapterDeleteApi = async (bookId) => {
  try {
    const response = await fetch(
      ` https://e-gyan-9tky.onrender.com/books/${bookId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching chapters:', error.message);
    return { success: false, message: error.message };
  }
};
