// student Progress Api
export const studentStudyMaterialApi = async () => {
  try {
    const response = await fetch('https://e-gyan-9tky.onrender.com/books', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching study-material:', error.message);
    return { success: false, message: error.message };
  }
};

export const StudentToggleFavorite = async (bookId) => {
  try {
    const response = await fetch(
      `https://e-gyan-9tky.onrender.com/students/toggle-favorite/${bookId}`,
      {
        method: 'PATCH',
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
    console.error('Error fetching study-material:', error.message);
    return { success: false, message: error.message };
  }
};

export const StudentBookApi = async (bookId) => {
  try {
    const response = await fetch(
      `https://e-gyan-9tky.onrender.com/books/${bookId}/chapters/meta`,
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
