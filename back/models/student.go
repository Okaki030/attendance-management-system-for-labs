package models

import "mime/multipart"

type Student struct {
	Id      int8           `ison:id`
	Name    string         `json:name`
	Pic     string         `json:pic`
	Grade   int8           `json:grade`
	Status  int8           `json:status`
	PicFile multipart.File `json:picFile`
}
