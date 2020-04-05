FROM golang:1.12.6
LABEL maintainer "Hideki Okawa"
WORKDIR /go/src/back
COPY . .
ENV GO111MODULE=on

RUN go get github.com/pilu/fresh
CMD ["fresh"]