// student favorite Api
export const studentfavoriteApi = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/students/favorite-books',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching favorite :', error.message);
    return { success: false, message: error.message };
  }
};
