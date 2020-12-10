FROM node:12.18

ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# TEST
# COPY .npmrc ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# TEST
# RUN rm -rf .npmrc

# Bundle app source
COPY . .

CMD [ "node", "server.js" ]