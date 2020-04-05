/*DBの選択*/
USE attendance_db;

/*テーブルの作成*/
CREATE TABLE `student` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_name` varchar(30) NOT NULL,
  `grade` int(11) DEFAULT NULL,
  `pic` varchar(100) NOT NULL,
  `attendance_status` tinyint(1) NOT NULL DEFAULT '0',
  `enrollment_status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;

CREATE TABLE `record` (
  `attendance_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `stay_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`attendance_id`),
  KEY `fk_student_id` (`student_id`),
  CONSTRAINT `fk_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;


/*テストデータ*/
-- INSERT INTO student VALUE
--     (1,"小坂菜緒",1,"./**",false,true),
--     (2,"宮田愛萌",2,"./**",true,false),
--     (3,"河田陽菜",3,"./**",true,true);
    
-- INSERT INTO record VALUE
--     (1,1,"2019-08-08 10:00","2019-08-08 15:00"),
--     (2,1,"2019-08-09 11:00","2019-08-08 18:00"),
--     (3,2,"2019-08-09 09:00","2019-08-08 18:00"),
--     (4,2,"2019-08-09 10:00","2019-08-08 14:00"),
--     (5,3,"2019-08-09 07:00","2019-08-08 15:00"),
--     (6,3,"2019-08-09 10:00","2019-08-08 19:00");
