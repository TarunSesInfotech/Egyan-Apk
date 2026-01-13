// student Progress Api
export const studentProgressApi = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/students/progress',
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
    console.error('Error fetching progress:', error.message);
    return { success: false, message: error.message };
  }
};

// student simulations Api
export const studentSimulationsApi = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/books/simulations',
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
    console.error('Error fetching progress:', error.message);
    return { success: false, message: error.message };
  }
};

// student Current-Affairs Api
export const studentCurrentAffairsApi = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/current-affairs',
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
    console.error('Error fetching progress:', error.message);
    return { success: false, message: error.message };
  }
};
// student Current-Affairs Api
// export const studentCurrentAffairsDetails = async ({ id }) => {
//   try {
//     const response = await fetch(
//       `https://e-gyan-9tky.onrender.com/current-affairs/${id}`,
//       {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error fetching progress:', error.message);
//     return { success: false, message: error.message };
//   }
// };
