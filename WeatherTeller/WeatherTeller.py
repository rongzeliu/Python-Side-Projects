import requests
import os 
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv("WEATHER_API_KEY")

def get_weather(city_name, api_key):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={api_key}&units=metric"

    try:
        response = requests.get(url)
        response.raise_for_status
        if response.status_code == 404:
            print("City not found please check your spelling and try again")

        data = response.json()
        print(data)

        temperature = data['main']['temp']
        condition = data['weather']['description']
        humidity = data['main']['humidity']

        print(f"The temperature in {city_name} is {temperature}")
        print(f"It is currently {condition}")
        print(f"The humdity is {humidity}")

    except requests.exceptions.HTTPError as err:
        print(f"HTTPError error occured: {err}")
    except Exception as err:
        print(f"An error occured: {err}")

if __name__ == '__main__':
    city = input("Enter in a city name: ")
    get_weather(city, API_KEY)
