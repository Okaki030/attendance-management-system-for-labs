package utils

import (
	"back/models"
	"encoding/json"
	"net/http"
)

func SendError(w http.ResponseWriter, status int, err models.Error) {
	w.WriteHeader(status)
	w.Header().Set("Access-Control-Allow-Origin", "*") // cros
	// errをwの接続先に書き込む
	json.NewEncoder(w).Encode(err)
}

func SendSuccess(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // cros
	// dataをwの接続先に書き込む
	json.NewEncoder(w).Encode(data)
}
