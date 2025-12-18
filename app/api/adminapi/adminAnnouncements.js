export const Adminannoucements = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/annoucements',
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
    console.error('Error fetching annoucements:', error.message);
    return { success: false, message: error.message };
  }
};

export const addAnnoucements = async ({ text, token }) => {
  if (!token) {
    return { success: false, message: 'Access token missing!' };
  }
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/annoucements',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to add announcement',
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error('❌ Add announcement Error:', err);
    return { success: false, message: err.message };
  }
};

export const DeleteAnnouncement = async (announcementId, token) => {
  try {
    const response = await fetch(
      `https://e-gyan-9tky.onrender.com/annoucements/${announcementId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return { success: true, data: await response.json() };
  } catch (e) {
    return { success: false, message: e.message };
  }
};
export const UpdateAnnouncement = async (announcementId, token, text) => {
  try {
    const response = await fetch(
      `https://e-gyan-9tky.onrender.com/annoucements/${announcementId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return { success: true, data: await response.json() };
  } catch (e) {
    return { success: false, message: e.message };
  }
};
