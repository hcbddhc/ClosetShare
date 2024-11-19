import axios from 'axios';
import { Platform } from 'react-native';

// Step 1: Declare necessary constants
const clientId = '7257a65eb92d0af'; // Your Client ID
const clientSecret = 'b540af9ad0a0f94e9af65afdec85c9755a766a04'; // Your Client Secret
const redirectUri = 'http://localhost:3000/callback'; // Your Redirect URI
let accessToken = null; // Access token will be assigned after successful OAuth

const uploadToImgur = async (imageUri) => {
    const uri = imageUri; // Get the URI of the image you want to upload
  
    // Ensure the URI is valid
    if (!uri) {
      console.error('Invalid URI:', uri);
      return;
    }
  
    const filename = uri.substring(uri.lastIndexOf('/') + 1); // Extract file name
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  
    try {
      // Fetch the image file as a blob
      const response = await fetch(uploadUri);
      const blob = await response.blob();
  
      // Prepare form data
      const formData = new FormData();
      formData.append('image', {
        uri: uploadUri,
        type: 'image/jpeg', // MIME type for the image
        name: filename,
      });
  
      // Imgur Client ID
      const imgurClientId = '7257a65eb92d0af';
  
      // Send the request to Imgur API to upload the image
      const result = await axios.post('https://api.imgur.com/3/image', formData, {
        headers: {
          'Authorization': `Client-ID ${imgurClientId}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (result.data.success) {
        console.log('Image uploaded successfully:', result.data.data.link);
        // Return both the link and delete hash in an object
        return {
          link: result.data.data.link,  // The direct image link
          deleteHash: result.data.data.deletehash,  // The delete hash for later use
        };
      } else {
        console.error('Imgur upload failed:', result.data.data.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  // Function to delete an image from Imgur using the delete hash
const deleteImageFromImgur = async (deleteHash) => {
    try {
      // Imgur Client ID
      const imgurClientId = '7257a65eb92d0af';
  
      // Send the DELETE request to Imgur API
      const result = await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
        headers: {
          'Authorization': `Client-ID ${imgurClientId}`,
        },
      });
  
      if (result.data.success) {
        console.log('Image deleted successfully');
      } else {
        console.error('Imgur delete failed:', result.data.data.error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };
  
  export { uploadToImgur, deleteImageFromImgur };