//school overview
export const schoolOverview = async () => {
  try {
    const response = await fetch(
      "https://e-gyan-9tky.onrender.com/admin/school-overview",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching SchoolOverview:", error.message);
    return { success: false, message: error.message };
  }
};

//single school overview
export const singleSchoolOverview = async () => {
  try {
    const response = await fetch(
      "https://e-gyan-9tky.onrender.com/analytics/single-school",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching SchoolOverview:", error.message);
    return { success: false, message: error.message };
  }
};
