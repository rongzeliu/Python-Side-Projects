import pyttsx3
import PyPDF2
from tkinter.filedialog import *

book = askopenfilename()
pdfReader = PyPDF2.PdfReader(book)
pages = len(pdfReader.pages)



for num in range(0, pages):
    page = pdfReader.pages[num]
    text = page.extract_text()
    speaker = pyttsx3.init()
    speaker.say(text)
    speaker.runAndWait()
       
