FROM reactnativecommunity/react-native-android:latest

COPY . /app
WORKDIR /app

RUN apt-get update
RUN apt install -y dos2unix
RUN cd android && dos2unix ./gradlew && cd ..
RUN npm i
RUN npm run build:android

CMD ["mv", "android/app/build/outputs/apk/release/app-release.apk", "/public/"]