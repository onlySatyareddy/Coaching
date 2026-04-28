// Cloudinary Image Upload Service
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dy5j2h8qj/image/upload'
const CLOUDINARY_UPLOAD_PRESET = 'faculty_upload'

export const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
    
    const data = await response.json()
    return {
      secure_url: data.secure_url,
      public_id: data.public_id
    }
  } catch (error) {
    console.error('Image upload error:', error)
    throw error
  }
}

export const deleteImage = async (publicId) => {
  try {
    // Note: This requires server-side implementation for security
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete image')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Image delete error:', error)
    throw error
  }
}
