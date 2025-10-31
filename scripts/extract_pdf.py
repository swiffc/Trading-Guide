import PyPDF2
import sys

def extract_pdf_text(pdf_path):
    try:
        # Open the PDF file
        with open(pdf_path, 'rb') as file:
            # Create PDF reader object
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Get number of pages
            num_pages = len(pdf_reader.pages)
            print(f"📄 Found {num_pages} pages in the PDF\n")
            print("="*80)
            
            # Extract text from each page
            full_text = ""
            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                
                print(f"\n--- PAGE {page_num + 1} ---\n")
                print(text)
                print("\n" + "="*80)
                
                full_text += f"\n\n--- PAGE {page_num + 1} ---\n\n{text}"
            
            # Save to text file
            output_file = pdf_path.replace('.pdf', '_extracted.txt')
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(full_text)
            
            print(f"\n✅ Text extracted successfully!")
            print(f"📁 Saved to: {output_file}")
            
            return full_text
            
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    pdf_path = r"C:\Users\DCornealius\CascadeProjects\Trading Guide\The Quarters Theory The Revolutionary New Foreign Currencies Trading Method.pdf"
    extract_pdf_text(pdf_path)

