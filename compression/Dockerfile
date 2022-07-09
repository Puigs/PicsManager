# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

# install dependencies
RUN apt update
RUN apt install -y libjpeg-dev zlib1g-dev gcc
RUN pip install --upgrade pip

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

ENV FLASK_APP=compression

COPY . .

CMD [ "python", "-m" , "flask", "run", "--host", "0.0.0.0"]