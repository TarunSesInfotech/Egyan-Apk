// upload book by admin api
export const adminBookuploadapi = async (formData) => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/books/upload',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching upload book:', error.message);
    return { success: false, message: error.message };
  }
};

// https://e-gyan-9tky.onrender.com/books/324
// Request Method
// DELETE
