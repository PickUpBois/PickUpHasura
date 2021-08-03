FROM node:12

RUN apt-get update && apt install default-jdk -y

RUN npm install -g firebase-tools

WORKDIR /app

CMD [ "firebase", "--project=pickup-774f9", "emulators:start", "--import=./data", "--export-on-exit"]