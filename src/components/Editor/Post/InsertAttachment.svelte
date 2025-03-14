<script lang="ts">
    export let content: string;
    
    // Function to handle the file upload process
    async function handleFileUpload() {
      // Create a file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      
      // Set up the file input change event
      fileInput.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (file) {
          try {
            // Create FormData object to send the file
            const formData = new FormData();
            formData.append('image', file);
            
            // Send POST request to your upload endpoint
            const response = await fetch('/api/post/attachment', {
              method: 'POST',
              body: formData
            });
            
            if (!response.ok) {
              throw new Error('Upload failed');
            }
            
            // Get the CDN link from the response
            const result = await response.json();
            const imageUrl = result.url;
            
            // Add the image link to the content
            content = content + `\n!["${file.name}" {width: 200}](${imageUrl})`;
          } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
          }
        }
      };
      
      // Trigger the file input click
      fileInput.click();
    }
  </script>
  
  <button on:click={handleFileUpload} type="button">Insert Attachment</button>