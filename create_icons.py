
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Create a new image with a green background
    img = Image.new('RGB', (size, size), '#28a745')
    draw = ImageDraw.Draw(img)
    
    # Try to use a default font, fallback to basic if not available
    try:
        font_size = size // 4
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("arial.ttf", size // 4)
        except:
            font = ImageFont.load_default()
    
    # Draw a simple tractor emoji or F for Farmington
    text = "🚜"
    
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center the text
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    # Draw the text
    draw.text((x, y), text, fill='white', font=font)
    
    # Save the image
    img.save(f'static/images/{filename}')
    print(f"Created {filename} ({size}x{size})")

# Create the required icon sizes
create_icon(192, 'icon-192.png')
create_icon(512, 'icon-512.png')

print("Icons created successfully!")
