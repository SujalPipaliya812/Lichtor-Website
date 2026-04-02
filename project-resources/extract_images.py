import fitz # PyMuPDF
import io
from PIL import Image
import os

pdf_file = "catalogue_new.pdf"
output_dir = "lichtor-web/public/assets/products"
os.makedirs(output_dir, exist_ok=True)

# List of catalogue pages and their corresponding names from the reset script
page_names = {
    2: "Ssk_Panel_Light",
    3: "Moon_Surface_Light",
    4: "Ecco_Deep_Down_Light",
    5: "Regular_Deep_Down_Light",
    6: "Ultra_Deep_Down_Light",
    7: "Mini_Junction_Light", # Mini/Big are on the same page, but let's grab one image for both or just use page numbers
    8: "COB_Junction_Light",
    9: "Rembow_Junction_Light",
    10: "Bulb_Light",
    11: "Tube_Light",
    12: "Oval_Bulkhead_Light",
    13: "Batan_Spot_Light",
    14: "PC_Sticker_Indoor_SMD_Surface_Light",
    15: "Water_Proof_Sticker_Outdoor_COB_Surface_Light", # wait, 15 is outdoor cob? Let's check OCR later.
    # We will just extract all large images and name them by page number first to be safe
}

pdf_document = fitz.open(pdf_file)

for page_num in range(len(pdf_document)):
    page = pdf_document.load_page(page_num)
    images = page.get_images(full=True)
    
    # We want the largest image on the page
    largest_img = None
    max_area = 0
    largest_img_index = 0
    img_ext = "png"
    
    if images:
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            ext = base_image["ext"]
            
            try:
                image = Image.open(io.BytesIO(image_bytes))
                area = image.width * image.height
                if area > max_area and area > 100000: # Filter small logos
                    max_area = area
                    largest_img = image
                    largest_img_index = xref
                    img_ext = ext
            except Exception as e:
                print(f"Error reading image {xref} on page {page_num+1}: {e}")
                
        if largest_img:
            # We save the image by page number to map them easily
            filename = os.path.join(output_dir, f"page_{page_num + 1}.{img_ext}")
            
            if largest_img.mode == "CMYK":
                largest_img = largest_img.convert("RGB")
                
            largest_img.save(filename)
            print(f"Saved {filename} (Size: {largest_img.width}x{largest_img.height})")
        else:
            print(f"No large images found on page {page_num+1}")
    else:
         print(f"No images on page {page_num+1}")

pdf_document.close()
