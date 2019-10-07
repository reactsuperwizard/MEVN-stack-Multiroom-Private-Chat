-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2019 at 06:07 PM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs_chat`
--
CREATE DATABASE IF NOT EXISTS `nodejs_chat` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE `nodejs_chat`;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--
-- Creation: Oct 06, 2019 at 07:33 PM
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(1028) COLLATE utf8mb4_bin NOT NULL,
  `room` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=625 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `content`, `room`, `user`, `admin`, `createdAt`, `updatedAt`) VALUES
(604, '1user joined 1user\'s room', 24, NULL, 1, '2019-10-07 15:23:21', '2019-10-07 15:23:21'),
(605, '2user joined 1user\'s room', 24, NULL, 1, '2019-10-07 15:23:22', '2019-10-07 15:23:22'),
(606, '1user joined 1user\'s room', 24, NULL, 1, '2019-10-07 15:24:55', '2019-10-07 15:24:55'),
(607, '2user joined 1user\'s room', 24, NULL, 1, '2019-10-07 15:25:00', '2019-10-07 15:25:00'),
(608, 'Hi there😌', 24, 57, 0, '2019-10-07 15:25:10', '2019-10-07 15:25:10'),
(609, 'I can see.🤑', 24, 58, 0, '2019-10-07 15:27:13', '2019-10-07 15:27:13'),
(612, '1user joined 1user\'s room', 24, NULL, 1, '2019-10-07 15:29:59', '2019-10-07 15:29:59'),
(613, '1user joined 1user\'s room', 24, NULL, 1, '2019-10-07 16:02:13', '2019-10-07 16:02:13'),
(614, '1user left 1user\'s room', 24, NULL, 1, '2019-10-07 16:02:40', '2019-10-07 16:02:40'),
(615, '1user joined 1user\'s second room', 25, NULL, 1, '2019-10-07 16:03:38', '2019-10-07 16:03:38'),
(616, 'haha😛', 25, 57, 0, '2019-10-07 16:03:44', '2019-10-07 16:03:44'),
(617, '2user left 1user\'s room', 24, NULL, 1, '2019-10-07 16:03:51', '2019-10-07 16:03:51'),
(618, '2user joined 1user\'s room', 24, NULL, 1, '2019-10-07 16:03:55', '2019-10-07 16:03:55'),
(619, '2user left 1user\'s room', 24, NULL, 1, '2019-10-07 16:03:56', '2019-10-07 16:03:56'),
(620, '2user joined 1user\'s second room', 25, NULL, 1, '2019-10-07 16:03:59', '2019-10-07 16:03:59'),
(621, '2user joined 1user\'s second room', 25, NULL, 1, '2019-10-07 16:04:11', '2019-10-07 16:04:11'),
(622, 'qqq🤡', 25, 58, 0, '2019-10-07 16:04:17', '2019-10-07 16:04:17'),
(623, '2user left 1user\'s second room', 25, NULL, 1, '2019-10-07 16:04:22', '2019-10-07 16:04:22'),
(624, '1user left 1user\'s second room', 25, NULL, 1, '2019-10-07 16:04:26', '2019-10-07 16:04:26');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--
-- Creation: Sep 30, 2019 at 02:24 PM
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `user` varchar(11) DEFAULT NULL,
  `password` varchar(50) DEFAULT '',
  `access` tinyint(1) NOT NULL DEFAULT '1',
  `accessIds` varchar(250) DEFAULT NULL,
  `users` varchar(250) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `user`, `password`, `access`, `accessIds`, `users`, `createdAt`, `updatedAt`) VALUES
(24, '1user\'s room', '57', NULL, 1, NULL, NULL, '2019-10-07 15:23:18', '2019-10-07 15:23:18'),
(25, '1user\'s second room', '57', NULL, 1, NULL, NULL, '2019-10-07 16:02:52', '2019-10-07 16:02:52');

-- --------------------------------------------------------

--
-- Table structure for table `user_infos`
--
-- Creation: Oct 03, 2019 at 02:38 AM
--

DROP TABLE IF EXISTS `user_infos`;
CREATE TABLE IF NOT EXISTS `user_infos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `socketid` char(255) DEFAULT NULL,
  `username` varchar(20) NOT NULL,
  `handle` varchar(50) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(255) NOT NULL,
  `create_time` text,
  `delete_time` text,
  `image` varchar(250) DEFAULT NULL,
  `age` int(2) DEFAULT NULL,
  `sex` varchar(50) DEFAULT NULL,
  `location` varchar(50) DEFAULT '',
  `bio` varchar(240) DEFAULT '',
  `status_active` int(11) NOT NULL DEFAULT '0',
  `status_participate` int(11) NOT NULL DEFAULT '0',
  `room_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_infos`
--

INSERT INTO `user_infos` (`id`, `socketid`, `username`, `handle`, `email`, `password`, `create_time`, `delete_time`, `image`, `age`, `sex`, `location`, `bio`, `status_active`, `status_participate`, `room_id`, `createdAt`, `updatedAt`) VALUES
(57, 'U7PgBL6N9an9kY18AAAC', '1user', '1user', '1user@email.com', '$2a$10$kWepNTGXCRJOnyUR7BiQKOm7PGHUnjrjSlPc0OUDgUTJVmS.FqiRS', '2019-10-07 15:21:35', NULL, 'db1afb1c-509a-435b-8a53-1f25d7af101c.jpg', 19, 'female', 'I am a girl.', 'I am a 19 years old girl.', 0, 0, 0, '2019-10-07 16:04:26', '2019-10-07 16:04:26'),
(58, 'O0xXiLdHkZinNKe8AAAD', '2user', '2user', '2user@email.com', '$2a$10$i3eEEiWCWQ3OpiZTnmIBd.31JQDg4O8F4Y7MrYU7YlhMJD9PT03Ti', '2019-10-07 15:21:41', NULL, '3ca17dba-78c4-464b-9858-1c4c9948744c.jpg', 22, 'male', 'I am a man.', 'I am a man.\nI am 22 years old.', 0, 0, 0, '2019-10-07 16:04:22', '2019-10-07 16:04:22');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
