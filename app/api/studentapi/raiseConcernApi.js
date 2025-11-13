// student raiseConcer Api
export const raiseConcernApi = async () => {
  try {
    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/students/previous-concerns',
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
    console.error('Error fetching raise-Concern :', error.message);
    return { success: false, message: error.message };
  }
};

// student raiseConcer Api
export const raiseConcernPostApi = async (concernData, attachment) => {
  try {
    const formData = new FormData();
    formData.append('subject', concernData.subject);
    formData.append('issueType', concernData.issueType);
    formData.append('priority', concernData.priority);
    formData.append('message', concernData.message);
    if (attachment) {
      formData.append('file', {
        uri: attachment.uri,
        name: attachment.name || 'upload',
        type: attachment.mimeType || 'application/octet-stream',
      });
    }

    const response = await fetch(
      'https://e-gyan-9tky.onrender.com/students/concerns',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error posting raise-Concern:', error.message);
    return { success: false, message: error.message };
  }
};
