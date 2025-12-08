// AdminStats data overview
export const AdminStats = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/admin/stats',
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
    console.error('Error fetching AdminStats:', error.message);
    return { success: false, message: error.message };
  }
};

//school overview
export const schoolOverview = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/admin/school-overview',
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
    console.error('Error fetching SchoolOverview:', error.message);
    return { success: false, message: error.message };
  }
};

//Repository overview
export const repositoryOverview = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/repository',
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

export const addRepository = async ({ type, value, token }) => {
  if (!token) {
    return { success: false, message: 'Access token missing!' };
  }

  try {
    const bodyData = { type, value };

    console.log('📤 Sending to API:', bodyData);

    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/repository',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      }
    );

    const raw = await response.text();
    console.log('📩 RAW RESPONSE TEXT:', raw);

    if (!response.ok) {
      return { success: false, message: raw };
    }

    return { success: true, data: JSON.parse(raw) };
  } catch (err) {
    console.error('❌ Add Repository Error:', err);
    return { success: false, message: err.message };
  }
};

// Delete repositry
// export const DeleteRepository = async (repoId) => {
//   try {
//     const response = await fetch(
//       `https://e-gyan-9tky.onrender.com/repository${repoId}`,
//       {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP ${response.status}: ${errorText}`);
//     }

//     return { success: true, data: await response.json() };
//   } catch (e) {
//     return { success: false, message: e.message };
//   }
// };

// Role management Api
export const userRoleOverview = async () => {
  try {
    const response = await fetch('https://e-gyan-9tky.onrender.com/user', {
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
    console.error('Error fetching UserRole Overview:', error.message);
    return { success: false, message: error.message };
  }
};

// inner chapter delete api
export const getInnerChapterDeleteApi = async (bookId) => {
  try {
    const response = await fetch(
      `https://e-gyan-9tky.onrender.com/books/chapter/${bookId}`,
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

//

export const userStudentProgress = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/admin/student-progress',
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
    console.error('Error fetching UserRole Overview:', error.message);
    return { success: false, message: error.message };
  }
};
