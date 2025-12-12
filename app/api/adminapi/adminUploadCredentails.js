export const UploadCredentails = async (token, formData) => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/admin/upload-credentials',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    return await response.json();
  } catch (error) {
    console.log('Login Exception:', error);
    return { success: false, message: error.message };
  }
};
