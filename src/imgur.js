import axios from 'axios';
import { Platform } from 'react-native';

/**
const clientId = '7257a65eb92d0af'; // client id assigned to us via imgur API
const clientSecret = 'b540af9ad0a0f94e9af65afdec85c9755a766a04'; //same but for client secret, idk if we need lol
const redirectUri = 'http://localhost:3000/callback'; // one of the input fields for application, doubt we need gg
let accessToken = null; // apparently we need this
*/


//function for upload
const uploadToImgur = async (imageUri) => {
    const uri = imageUri;
  
    // check URL
    if (!uri) {
      console.error('Invalid URI:', uri);
      return;
    }
  
    //extract file name slay
    const filename = uri.substring(uri.lastIndexOf('/') + 1); 
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  
    try {
      //set up complicated stuff
      const response = await fetch(uploadUri);
      const blob = await response.blob();
  
      const formData = new FormData();
      formData.append('image', {
        uri: uploadUri,
        type: 'image/jpeg', // MIME type for the image
        name: filename,
      });
  
      // Imgur Client ID
      const imgurClientId = '7257a65eb92d0af'; // client id assigned to us via imgur API
  
      // this is the part for request
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
          link: result.data.data.link,  // returns image link
          deleteHash: result.data.data.deletehash,  // returns delete hash
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
  
      // delete request
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