export const notificationsRequests = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/user/requests',
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
    console.error('Error fetching repositoryOverview:', error.message);
    return { success: false, message: error.message };
  }
};
export const notificationsConcerns = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/admin/concerns',
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
    console.error('Error fetching repositoryOverview:', error.message);
    return { success: false, message: error.message };
  }
};
