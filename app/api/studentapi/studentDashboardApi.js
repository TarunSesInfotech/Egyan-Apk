export const currentUserApi = async () => {
  try {
    const response = await fetch('https://e-gyan-9tky.onrender.com/auth/me', {
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
    console.error('Error fetching CurrentUser:', error.message);

    return { success: false, message: error.message };
  }
};
// student metrices Api
export const studentMetrices = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/students/metrices',
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
    console.error('Error fetching metrices:', error.message);
    return { success: false, message: error.message };
  }
};
// student announcements Api
export const announcementsApi = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/students/announcements',
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
    console.error('Error fetching announcements:', error.message);
    return { success: false, message: error.message };
  }
};
