FROM node:16 as builder
COPY package.json /package.json
COPY package-lock.json /package-lock.json
RUN npm install
RUN npm run build

FROM node:16 as runner
COPY --from=builder /package.json /package.json
COPY --from=builder /package-lock.json /package-lock.json
COPY --from=builder /dist /dist
RUN npm ci
CMD ["npm", "start"]