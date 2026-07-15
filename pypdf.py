import pyttsx3
import PyPDF2
from tkinter.filedialog import *

# initialize speaker 
speaker = pyttsx3.init()
# opens pdf
book = askopenfilename()
pdfReader = PyPDF2.PdfReader(book)
pages = len(pdfReader.pages)
starting_page = int(input("Start reading on which page?" ))

print("Reading started. Press CTRL + C at any time to stop")

try:
    for num in range(starting_page, pages):
        page = pdfReader.pages[num]
        text = page.extract_text()

        # Split text into sentences to make the loop more responsive
        sentences = text.replace('?', '.').replace('!', '.').split('. ')
        
        for sentence in sentences:
            speaker.say(sentence)
            speaker.runAndWait()
except KeyboardInterrupt:
    print("\n Reading stopped by the user.", flush = True)
    speaker.stop()
    

       
