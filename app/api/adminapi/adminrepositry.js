//Repository overview
export const fetchRepositoryByType = async (type, category) => {
  try {
    let url = `https://e-gyan-9tky.onrender.com/repository?type=${type}`;

    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching repositoryOverview:", error.message);
    return { success: false, message: error.message };
  }
};

export const fetchSubjectsByClass = async (selectedClass) => {
  try {
    const url = `https://e-gyan-9tky.onrender.com/books/subject?class=${encodeURIComponent(selectedClass)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching subjects:", error.message);
    return { success: false, message: error.message };
  }
};

export const addRepository = async ({ type, text, token }) => {
  if (!token) {
    return { success: false, message: "Access token missing!" };
  }
  try {
    const bodyData = { type, text };
    const response = await fetch(
      "https://e-gyan-9tky.onrender.com/repository",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      },
    );
    if (!response.ok) {
      // eslint-disable-next-line no-undef
      return { success: false, message: raw };
    }
    return { success: true, data: await response.json() };
  } catch (err) {
    console.error("❌ Add Repository Error:", err);
    return { success: false, message: err.message };
  }
};

export const UpdateRepository = async ({ updateId, value, token }) => {
  if (!token) {
    return { success: false, message: "Access token missing!" };
  }
  try {
    const bodyData = { value };
    const response = await fetch(
      `https://e-gyan-9tky.onrender.com/repository/${updateId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      },
    );
    if (!response.ok) {
      return { success: false, message: await response.text() };
    }
    return { success: true, data: await response.json() };
  } catch (err) {
    console.error("❌ Add Repository Error:", err);
    return { success: false, message: err.message };
  }
};

// Delete repositry
export const DeleteRepository = async (repoId, token) => {
  try {
    const response = await fetch(
      `https://e-gyan-9tky.onrender.com/repository/${repoId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
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
